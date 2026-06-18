import { BrowserRouter, Routes, Route } from "react-router-dom"
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
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
          <Route path="/collections" element={<Collections />} />
       <Route path="/login" element={<Login />} />
       <Route path="/main" element={<Mainpage />} />
       <Route path="/Men" element={<Men />} />
       <Route path="/search" element={<Searchpage />} />
        <Route path="/Women" element={<Women />} />
       <Route path="/Kids" element={<Kids />} />
      <Route path="/Trending" element={<Trendings />} />
      <Route path="/Outlet" element={<Outlet />} />
        <Route path="/Cart" element={<Cart />} />
       {<Route path="/Profile" element={<Profile />} /> }
       <Route path="/Order" element={<Order />} />
       <Route path="/Wishlist" element={<Wishlist />} />
  
      </Routes>
    </BrowserRouter>
  )
}
export default App