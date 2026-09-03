import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom"
import { useEffect } from "react"
import Landing from "./Pages/Landing"
import Login from "./Pages/Login"
import Mainpage from "./Pages/Mainpage"
import Men from "./Pages/Men"
import Women from "./Pages/Women"
import Kids from "./Pages/Kids"
import Trendings from "./Pages/Trending"
import Outlet from "./Pages/Outlet"
import Cart from "./Pages/Cart"
import Order from "./Pages/Order"
import Profile from "./Pages/Profile"
import Wishlist from "./Pages/Wishlist"
import Searchpage from "./Components/Searchpage"
import Collections from "./Pages/Collections"
import Checkout from "./Pages/Checkout"
import Success from "./Pages/Success"
import ProtectedRoute from "./Components/ProtectedRoutes";
import PublicRoute from "./Components/PublicRoutes";
import MerchantProfile from "./Pages/MerchantProfile"
import MerchantDashboard from "./Pages/MerchantDashboard";
import MerchantOrders from "./Pages/MerchantOrders";
import MerchantProducts from "./Pages/MerchantProducts";
import MerchantPending from "./Pages/MerchantPending";
import MerchantDeliveries from "./Pages/MerchantDeliveries";
function ScrollToTop(){
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
     <Routes>

  {/* Public Routes */}

  <Route
    path="/"
    element={
      <PublicRoute>
        <Landing />
      </PublicRoute>
    }
  />

  <Route
    path="/login"
    element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    }
  />

  {/* Protected Routes */}

  <Route
    path="/main"
    element={
      <ProtectedRoute allowedRoles={["USER"]}>
        <Mainpage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/collections"
    element={
      <ProtectedRoute allowedRoles={["USER"]}>
        <Collections />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Men"
    element={
      <ProtectedRoute allowedRoles={["USER"]}>
        <Men />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Women"
    element={
      <ProtectedRoute allowedRoles={["USER"]}>
        <Women />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Kids"
    element={
      <ProtectedRoute allowedRoles={["USER"]}>
        <Kids />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Trending"
    element={
      <ProtectedRoute allowedRoles={["USER"]}>
        <Trendings />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Outlet"
    element={
      <ProtectedRoute allowedRoles={["USER"]}>
        <Outlet />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Cart"
    element={
      <ProtectedRoute allowedRoles={["USER"]}>
        <Cart />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Wishlist"
    element={
      <ProtectedRoute allowedRoles={["USER"]}>
        <Wishlist />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Profile"
    element={
      <ProtectedRoute allowedRoles={["USER"]}>
        <Profile />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Order"
    element={
      <ProtectedRoute allowedRoles={["USER"]}>
        <Order />
      </ProtectedRoute>
    }
  />

  <Route
    path="/checkout"
    element={
      <ProtectedRoute allowedRoles={["USER"]}>
        <Checkout />
      </ProtectedRoute>
    }
  />

  <Route
    path="/success"
    element={
      <ProtectedRoute allowedRoles={["USER"]}>
        <Success />
      </ProtectedRoute>
    }
  />

  <Route
    path="/search"
    element={
      <ProtectedRoute allowedRoles={["USER"]}>
        <Searchpage />
      </ProtectedRoute>
    }
  />


  <Route
    path="*"
    element={<Navigate to="/login" replace />}
  />
  <Route
    path="/merchant/dashboard"
    element={
        <ProtectedRoute allowedRoles={["MERCHANT"]}>
            <MerchantDashboard />
        </ProtectedRoute>
    }
/>

<Route
  path="/merchant/orders"
  element={
    <ProtectedRoute allowedRoles={["MERCHANT"]}>
      <MerchantOrders />
    </ProtectedRoute>
  }
/>


<Route
  path="/merchant/profile"
  element={
      <ProtectedRoute allowedRoles={["MERCHANT"]}>
      <MerchantProfile />
    </ProtectedRoute>
  }
/>
<Route
  path="/merchant/products"
  element={
    <ProtectedRoute allowedRoles={["MERCHANT"]}>
      <MerchantProducts />
    </ProtectedRoute>
  }
/>
<Route
  path="/merchant/pending"
  element={
    <ProtectedRoute allowedRoles={["MERCHANT"]}>
      <MerchantPending />
    </ProtectedRoute>
  }
/>
<Route
  path="/merchant/deliveries"
  element={
    <ProtectedRoute allowedRoles={["MERCHANT"]}>
      <MerchantDeliveries />
    </ProtectedRoute>
  }
/>


</Routes>
    </BrowserRouter>
  )
}
export default App