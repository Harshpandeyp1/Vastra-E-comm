import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const API_BASE = import.meta.env?.VITE_API_URL ?? "http://localhost:8081";
const REFRESH_MS = 30_000;
const PAGE_SIZE = 10;
const BUCKETS = 12;
const REPEATED_FAILURE_THRESHOLD = 3;

const RANGES = [
    { value: 1, label: "Last hour" },
    { value: 6, label: "Last 6 hours" },
    { value: 12, label: "Last 12 hours" },
    { value: 24, label: "Last 24 hours" },
];

const STATUS_FILTERS = [
    { value: "ALL", label: "All" },
    { value: "SUCCESS", label: "Successful" },
    { value: "FAILED", label: "Failed" },
];

const clearSession = () => {
    ["token", "isLoggedIn", "user"].forEach((key) => localStorage.removeItem(key));
};

const formatTime = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Unknown time" : date.toLocaleString();
};

const timeAgo = (date) => {
    if (!date) return "";
    const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.round(seconds / 60)}m ago`;
};

const AdminDashboard = () => {
    const [activityData, setActivityData] = useState(null);
    const [hours, setHours] = useState(6);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [, forceTick] = useState(0);

    const requestId = useRef(0);

    const logout = useCallback(() => {
        clearSession();
        window.location.href = "/";
    }, []);

    const fetchLoginActivity = useCallback(
        async (selectedHours, { silent = false } = {}) => {
            const currentRequest = ++requestId.current;
            const controller = new AbortController();

            try {
                if (!silent) setRefreshing(true);
                setError("");

                const token = localStorage.getItem("token");
                if (!token) {
                    logout();
                    return;
                }

                const response = await fetch(
                    `${API_BASE}/api/admin/login-activity?hours=${selectedHours}`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                        signal: controller.signal,
                    }
                );

                if (response.status === 401 || response.status === 403) {
                    clearSession();
                    throw new Error(
                        "Your session has expired or you don't have admin access. Log in again."
                    );
                }

                if (!response.ok) {
                    throw new Error(
                        `Couldn't load login activity (server returned ${response.status}).`
                    );
                }

                const data = await response.json();

                // Ignore responses that were superseded by a newer request
                if (currentRequest !== requestId.current) return;

                setActivityData(data);
                setLastUpdated(new Date());
            } catch (err) {
                if (err.name === "AbortError" || currentRequest !== requestId.current) return;
                console.error("Admin login activity error:", err);
                setError(err.message || "Something went wrong while loading activity.");
            } finally {
                if (currentRequest === requestId.current) {
                    setInitialLoading(false);
                    setRefreshing(false);
                }
            }
        },
        [logout]
    );

    // Load on mount and whenever the range changes
    useEffect(() => {
        fetchLoginActivity(hours);
    }, [hours, fetchLoginActivity]);

    // Auto-refresh, paused while the tab is hidden
    useEffect(() => {
        if (!autoRefresh) return undefined;

        const id = setInterval(() => {
            if (document.visibilityState === "visible") {
                fetchLoginActivity(hours, { silent: true });
            }
        }, REFRESH_MS);

        return () => clearInterval(id);
    }, [autoRefresh, hours, fetchLoginActivity]);

    // Keep the "updated x ago" label fresh
    useEffect(() => {
        const id = setInterval(() => forceTick((n) => n + 1), 10_000);
        return () => clearInterval(id);
    }, []);

    const handleTimeRangeChange = (event) => {
        setHours(Number(event.target.value));
        setPage(1);
    };

    const activities = useMemo(() => activityData?.activities ?? [], [activityData]);

    const total = activityData?.totalAttempts ?? 0;
    const successful = activityData?.successfulAttempts ?? 0;
    const failed = activityData?.failedAttempts ?? 0;
    const successRate = total > 0 ? Math.round((successful / total) * 100) : null;

    // Emails with several failed attempts in the selected range
    const repeatedFailures = useMemo(() => {
        const counts = new Map();
        activities.forEach((a) => {
            if (a.status !== "SUCCESS" && a.email) {
                counts.set(a.email, (counts.get(a.email) ?? 0) + 1);
            }
        });
        return [...counts.entries()]
            .filter(([, count]) => count >= REPEATED_FAILURE_THRESHOLD)
            .sort((a, b) => b[1] - a[1]);
    }, [activities]);

    const flaggedEmails = useMemo(
        () => new Set(repeatedFailures.map(([email]) => email)),
        [repeatedFailures]
    );

    // Login traffic split into equal time slices
    const buckets = useMemo(() => {
        const end = Date.now();
        const span = hours * 60 * 60 * 1000;
        const start = end - span;
        const size = span / BUCKETS;

        const slices = Array.from({ length: BUCKETS }, (_, i) => ({
            start: start + i * size,
            success: 0,
            failed: 0,
        }));

        activities.forEach((a) => {
            const time = new Date(a.timestamp).getTime();
            if (Number.isNaN(time) || time < start) return;
            const index = Math.min(BUCKETS - 1, Math.floor((time - start) / size));
            if (a.status === "SUCCESS") slices[index].success += 1;
            else slices[index].failed += 1;
        });

        return slices;
    }, [activities, hours]);

    const maxBucket = Math.max(1, ...buckets.map((b) => b.success + b.failed));

    const filteredActivities = useMemo(() => {
        const needle = query.trim().toLowerCase();

        return activities
            .filter((a) => {
                if (statusFilter === "SUCCESS" && a.status !== "SUCCESS") return false;
                if (statusFilter === "FAILED" && a.status === "SUCCESS") return false;
                if (!needle) return true;
                return (
                    (a.email ?? "").toLowerCase().includes(needle) ||
                    String(a.userId ?? "").includes(needle)
                );
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }, [activities, statusFilter, query]);

    const pageCount = Math.max(1, Math.ceil(filteredActivities.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    const visibleActivities = filteredActivities.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const exportCsv = () => {
        const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
        const rows = [
            ["Email", "User ID", "Status", "Timestamp"],
            ...filteredActivities.map((a) => [
                a.email,
                a.userId ?? "Unknown",
                a.status,
                new Date(a.timestamp).toISOString(),
            ]),
        ];
        const csv = rows.map((row) => row.map(escape).join(",")).join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `login-activity-last-${hours}h.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const filtersActive = statusFilter !== "ALL" || query.trim() !== "";

    if (initialLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <header className="flex flex-wrap justify-between items-center gap-4 mb-10">
                    <div>
                        <p className="text-purple-400 text-xs tracking-[0.3em] uppercase">
                            Vastra
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-light mt-2">Admin dashboard</h1>
                        <p className="text-gray-500 mt-2">Platform login activity</p>
                    </div>

                    <button
                        onClick={logout}
                        className="px-5 py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-purple-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-400 transition"
                    >
                        Log out
                    </button>
                </header>

                {/* ERROR */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4"
                    >
                        <span>{error}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchLoginActivity(hours)}
                                className="px-3 py-1.5 bg-red-500/20 rounded-lg text-sm hover:bg-red-500/30 transition"
                            >
                                Try again
                            </button>
                            {!localStorage.getItem("token") && (
                                <button
                                    onClick={logout}
                                    className="px-3 py-1.5 bg-white text-black rounded-lg text-sm font-semibold"
                                >
                                    Go to login
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {activityData && (
                    <>
                        {/* TIME RANGE + CONTROLS */}
                        <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
                            <div>
                                <p className="text-gray-500 text-sm">Activity range</p>
                                <p className="text-lg mt-1">
                                    Last {hours} {hours === 1 ? "hour" : "hours"}
                                </p>
                                <p className="text-gray-600 text-xs mt-1" aria-live="polite">
                                    {refreshing
                                        ? "Updating…"
                                        : lastUpdated
                                        ? `Updated ${timeAgo(lastUpdated)}`
                                        : ""}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={autoRefresh}
                                        onChange={(e) => setAutoRefresh(e.target.checked)}
                                        className="accent-purple-500"
                                    />
                                    Auto-refresh every 30s
                                </label>

                                <label className="sr-only" htmlFor="range">
                                    Time range
                                </label>
                                <select
                                    id="range"
                                    value={hours}
                                    onChange={handleTimeRangeChange}
                                    className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus-visible:border-purple-400"
                                >
                                    {RANGES.map((range) => (
                                        <option key={range.value} value={range.value} className="text-black">
                                            {range.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* STAT CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <StatCard label="Total login attempts" value={total} />
                            <StatCard label="Successful logins" value={successful} tone="text-green-400" />
                            <StatCard label="Failed logins" value={failed} tone="text-red-400" />
                            <StatCard
                                label="Success rate"
                                value={successRate === null ? "–" : `${successRate}%`}
                                tone={
                                    successRate === null
                                        ? "text-gray-500"
                                        : successRate >= 80
                                        ? "text-green-400"
                                        : successRate >= 50
                                        ? "text-yellow-400"
                                        : "text-red-400"
                                }
                            />
                        </div>

                        {/* REPEATED FAILURES */}
                        {repeatedFailures.length > 0 && (
                            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5">
                                <p className="text-yellow-300 font-medium">
                                    {repeatedFailures.length === 1
                                        ? "1 account has repeated failed logins"
                                        : `${repeatedFailures.length} accounts have repeated failed logins`}
                                </p>
                                <ul className="mt-3 flex flex-wrap gap-2">
                                    {repeatedFailures.map(([email, count]) => (
                                        <li key={email}>
                                            <button
                                                onClick={() => {
                                                    setQuery(email);
                                                    setStatusFilter("FAILED");
                                                    setPage(1);
                                                }}
                                                className="px-3 py-1.5 bg-black/30 border border-yellow-500/20 rounded-full text-sm text-yellow-200 hover:bg-black/50 transition"
                                            >
                                                {email} · {count} failures
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* TRAFFIC CHART */}
                        <section className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
                            <div className="flex flex-wrap justify-between items-start gap-3 mb-6">
                                <div>
                                    <p className="text-gray-500 text-sm">Traffic over time</p>
                                    <h2 className="text-2xl mt-1">Login attempts</h2>
                                </div>
                                <div className="flex gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-sm bg-green-400" /> Successful
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-sm bg-red-400" /> Failed
                                    </span>
                                </div>
                            </div>

                            <div
                                className="flex items-end gap-2 h-40"
                                role="img"
                                aria-label={`Login attempts over the last ${hours} hours, split into ${BUCKETS} intervals`}
                            >
                                {buckets.map((bucket) => {
                                    const count = bucket.success + bucket.failed;
                                    const label = `${new Date(bucket.start).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}: ${bucket.success} successful, ${bucket.failed} failed`;

                                    return (
                                        <div
                                            key={bucket.start}
                                            title={label}
                                            className="flex-1 h-full flex flex-col justify-end"
                                        >
                                            <div
                                                className="w-full flex flex-col justify-end rounded-t-md overflow-hidden bg-white/5"
                                                style={{
                                                    height: count === 0 ? "4px" : `${(count / maxBucket) * 100}%`,
                                                }}
                                            >
                                                {bucket.failed > 0 && (
                                                    <div
                                                        className="bg-red-400"
                                                        style={{ height: `${(bucket.failed / count) * 100}%` }}
                                                    />
                                                )}
                                                {bucket.success > 0 && (
                                                    <div
                                                        className="bg-green-400"
                                                        style={{ height: `${(bucket.success / count) * 100}%` }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-between mt-2 text-xs text-gray-600">
                                <span>
                                    {new Date(buckets[0].start).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                                <span>Now</span>
                            </div>
                        </section>

                        {/* RECENT ACTIVITY */}
                        <section className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
                            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                                <div>
                                    <p className="text-gray-500 text-sm">Recent activity</p>
                                    <h2 className="text-2xl mt-1">Login traffic</h2>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={exportCsv}
                                        disabled={filteredActivities.length === 0}
                                        className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        Export CSV
                                    </button>
                                    <button
                                        onClick={() => fetchLoginActivity(hours)}
                                        disabled={refreshing}
                                        className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 disabled:opacity-40 transition"
                                    >
                                        {refreshing ? "Refreshing…" : "Refresh"}
                                    </button>
                                </div>
                            </div>

                            {/* FILTERS */}
                            <div className="flex flex-wrap items-center gap-3 mb-5">
                                <label className="sr-only" htmlFor="search">
                                    Search by email or user ID
                                </label>
                                <input
                                    id="search"
                                    type="search"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setPage(1);
                                    }}
                                    placeholder="Search by email or user ID"
                                    className="flex-1 min-w-[220px] bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-600 outline-none focus-visible:border-purple-400"
                                />

                                <div
                                    className="flex bg-black/30 border border-white/10 rounded-xl p-1"
                                    role="group"
                                    aria-label="Filter by status"
                                >
                                    {STATUS_FILTERS.map((filter) => (
                                        <button
                                            key={filter.value}
                                            onClick={() => {
                                                setStatusFilter(filter.value);
                                                setPage(1);
                                            }}
                                            aria-pressed={statusFilter === filter.value}
                                            className={`px-3 py-1.5 rounded-lg text-sm transition ${
                                                statusFilter === filter.value
                                                    ? "bg-purple-500 text-white"
                                                    : "text-gray-400 hover:text-white"
                                            }`}
                                        >
                                            {filter.label}
                                        </button>
                                    ))}
                                </div>

                                {filtersActive && (
                                    <button
                                        onClick={() => {
                                            setQuery("");
                                            setStatusFilter("ALL");
                                            setPage(1);
                                        }}
                                        className="text-sm text-purple-400 hover:text-purple-300"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>

                            {activities.length === 0 ? (
                                <div className="text-gray-500 py-10 text-center">
                                    No login activity in the last {hours}{" "}
                                    {hours === 1 ? "hour" : "hours"}. Try a longer range.
                                </div>
                            ) : filteredActivities.length === 0 ? (
                                <div className="text-gray-500 py-10 text-center">
                                    No activity matches your filters.
                                </div>
                            ) : (
                                <>
                                    <ul className="space-y-3">
                                        {visibleActivities.map((activity) => {
                                            const success = activity.status === "SUCCESS";
                                            const flagged = !success && flaggedEmails.has(activity.email);

                                            return (
                                                <li
                                                    key={activity.id}
                                                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-black/30 border border-white/5 rounded-xl p-4"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="text-white truncate">
                                                            {activity.email}
                                                        </p>
                                                        <p className="text-gray-500 text-sm mt-1">
                                                            User ID: {activity.userId ?? "Unknown"}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3 md:gap-6">
                                                        <p className="text-gray-500 text-sm">
                                                            {formatTime(activity.timestamp)}
                                                        </p>

                                                        {flagged && (
                                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-300">
                                                                Repeated failures
                                                            </span>
                                                        )}

                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                success
                                                                    ? "bg-green-500/10 text-green-400"
                                                                    : "bg-red-500/10 text-red-400"
                                                            }`}
                                                        >
                                                            {success ? "Success" : "Failed"}
                                                        </span>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {/* PAGINATION */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 mt-6 text-sm text-gray-500">
                                        <p>
                                            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                                            {Math.min(currentPage * PAGE_SIZE, filteredActivities.length)} of{" "}
                                            {filteredActivities.length}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1.5 bg-white/10 rounded-lg text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                            >
                                                Previous
                                            </button>
                                            <span>
                                                Page {currentPage} of {pageCount}
                                            </span>
                                            <button
                                                onClick={() => setPage(currentPage + 1)}
                                                disabled={currentPage === pageCount}
                                                className="px-3 py-1.5 bg-white/10 rounded-lg text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ label, value, tone = "text-white" }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <p className="text-gray-500 text-sm">{label}</p>
        <h2 className={`text-4xl mt-3 ${tone}`}>{value}</h2>
    </div>
);

const DashboardSkeleton = () => (
    <div
        className="min-h-screen bg-black text-white p-4 sm:p-8"
        role="status"
        aria-label="Loading admin dashboard"
    >
        <div className="max-w-7xl mx-auto animate-pulse">
            <div className="h-4 w-20 bg-white/10 rounded mb-4" />
            <div className="h-10 w-72 bg-white/10 rounded mb-3" />
            <div className="h-4 w-48 bg-white/5 rounded mb-12" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-28 bg-white/5 border border-white/10 rounded-2xl" />
                ))}
            </div>

            <div className="h-56 mt-8 bg-white/5 border border-white/10 rounded-2xl" />
            <div className="h-72 mt-8 bg-white/5 border border-white/10 rounded-2xl" />
        </div>
    </div>
);

export default AdminDashboard;