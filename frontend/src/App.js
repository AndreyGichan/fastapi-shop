import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from "./pages/ProfilePage"
import CheckoutPage from "./pages/CheckoutPage"
import AdminPage from "./pages/AdminPage"
import "./styles/globals.css"

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProviderWithHook } from "./components/ui/useToast"
import { AdminRoute } from "./components/routes/AdminRoute";
import { PrivateRoute } from "./components/routes/PrivateRoute";
import { NoAdminRoute } from "./components/routes/NoAdminRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProviderWithHook>
          <CartProvider>
            <div className="App">
              <Routes>
                <Route
                  path="/"
                  element={
                    <NoAdminRoute>
                      <HomePage />
                    </NoAdminRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <NoAdminRoute>
                      <CartPage />
                    </NoAdminRoute>
                  }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />
              </Routes>
            </div>
          </CartProvider>
        </ToastProviderWithHook>
      </AuthProvider >
    </Router>
  )
}

export default App
