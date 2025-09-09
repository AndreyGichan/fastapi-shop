import { createContext, useContext, useState, useEffect } from "react";
import { getCart } from "../lib/api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
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
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, cartCount, reloadCart: loadCart, loading }}>
      {children}
    </CartContext.Provider>
  );
}
