import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ProductPage from "./pages/ProductPage"
import CheckoutPage from "./pages/CheckoutPage"
import SellerPage from "./pages/SellerPage"
import AdminPage from "./pages/AdminPage"
import ReviewPage from "./pages/ReviewPage"
import "./styles/globals.css"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/seller" element={<SellerPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
