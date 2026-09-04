
const API = "http://localhost:8081/chat";

export const sendMessage = async (messagesHistory) => {
  const token = localStorage.getItem("token");

  const payload =
    typeof messagesHistory === "string"
      ? { message: messagesHistory }
      : { messages: messagesHistory };

  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || `Chat API error: ${response.status}`
    );
  }

  const data = await response.json();

  return (
    data.reply ||
    (typeof data === "string"
      ? data
      : JSON.stringify(data))
  );
};

