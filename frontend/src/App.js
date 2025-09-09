import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from "./pages/ProfilePage"

import ProductPage from "./pages/ProductPage"
import CheckoutPage from "./pages/CheckoutPage"
import SellerPage from "./pages/SellerPage"
import AdminPage from "./pages/AdminPage"
import ReviewPage from "./pages/ReviewPage"
import "./styles/globals.css"
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/seller" element={<SellerPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/review" element={<ReviewPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  )
}

export default App
