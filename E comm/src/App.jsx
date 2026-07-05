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
import ProtectedRoute from "./Components/ProtectRoutes";
import PublicRoute from "./Components/PublicRoutes";
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

  <Route path="/" element={<Landing />} />

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
      <ProtectedRoute>
        <Mainpage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/collections"
    element={
      <ProtectedRoute>
        <Collections />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Men"
    element={
      <ProtectedRoute>
        <Men />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Women"
    element={
      <ProtectedRoute>
        <Women />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Kids"
    element={
      <ProtectedRoute>
        <Kids />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Trending"
    element={
      <ProtectedRoute>
        <Trendings />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Outlet"
    element={
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Cart"
    element={
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Wishlist"
    element={
      <ProtectedRoute>
        <Wishlist />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />

  <Route
    path="/Order"
    element={
      <ProtectedRoute>
        <Order />
      </ProtectedRoute>
    }
  />

  <Route
    path="/checkout"
    element={
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    }
  />

  <Route
    path="/success"
    element={
      <ProtectedRoute>
        <Success />
      </ProtectedRoute>
    }
  />

  <Route
    path="/search"
    element={
      <ProtectedRoute>
        <Searchpage />
      </ProtectedRoute>
    }
  />

  <Route
    path="*"
    element={<Navigate to="/login" replace />}
  />

</Routes>
    </BrowserRouter>
  )
}
export default App