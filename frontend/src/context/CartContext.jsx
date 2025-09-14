import { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart as apiAddToCart } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const items = await getCart();
      setCartItems(items || []);
    } catch (err) {
      console.error("Ошибка загрузки корзины:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const newItem = await apiAddToCart(productId, quantity);
      setCartItems(prev => {
        const existing = prev.find(i => i.id === newItem.id);
        if (existing) {
          return prev.map(i => i.id === newItem.id ? newItem : i);
        }
        return [...prev, newItem];
      });
    } catch (err) {
      console.error("Ошибка добавления в корзину:", err);
      throw err;
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, cartCount, reloadCart: loadCart, loading, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}
