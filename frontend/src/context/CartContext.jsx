import { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart as apiAddToCart } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/useToast";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();


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

  const addToCart = async (productId, quantity = 1, productName) => {
    try {
      const newItem = await apiAddToCart(productId, quantity);
      setCartItems(prev => {
        const existing = prev.find(i => i.id === newItem.id);
        if (existing) {
          return prev.map(i => i.id === newItem.id ? newItem : i);
        }
        return [...prev, newItem];
      });

      toast({
        title: "Добавлено в корзину",
        description: `${productName} (${quantity} шт.) добавлен в корзину`,
        variant: "success",
      });

    } catch (err) {
      console.error("Ошибка добавления в корзину:", err);

      if (err.message === "Unauthorized" || err.status === 401) {
        toast({
          title: "Войдите в аккаунт",
          description: "Чтобы добавить товар в корзину, нужно войти в аккаунт",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось добавить товар в корзину",
          variant: "destructive",
        });
      }
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, cartCount, reloadCart: loadCart, loading, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}
