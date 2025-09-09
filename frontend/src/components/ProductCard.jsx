import { Card, CardContent } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { Button } from "./ui/Button"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { apiFetch } from "../lib/api"
import { useCart } from "../context/CartContext"

const API_URL = process.env.REACT_APP_API_URL;

const ProductCard = ({ product }) => {
  const { cartItems, setCartItems } = useCart()
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const addToCart = async () => {
    try {
      const payload = { product_id: product.id, quantity: 1 }

      const updatedItem = await apiFetch(`/products/cart`, {
        method: 'POST',
        body: payload
      })

      // Обновляем глобальное состояние корзины
      const existingItem = cartItems.find(i => i.id === updatedItem.id)
      if (existingItem) {
        // обновляем количество
        setCartItems(prev =>
          prev.map(i => i.id === updatedItem.id ? updatedItem : i)
        )
      } else {
        // добавляем новый элемент
        setCartItems(prev => [...prev, updatedItem])
      }
    } catch (err) {
      console.error("Ошибка добавления в корзину:", err)
      alert(err.message || "Не удалось добавить в корзину")
    }
  }

  return (
    <Card className="group border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-background cursor-pointer flex flex-col h-full">
      <CardContent className="p-4 flex flex-col flex-1">
        {/* Верхняя часть: картинка */}
        <div className="relative">
          <img
            src={`${API_URL}${product.image_url}` || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-contain rounded-md"
          />
          {product.originalPrice && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              Скидка {(product.originalPrice - product.price).toFixed(2)} р.
            </Badge>
          )}
        </div>

        {/* Название */}
        <h3 className="font-semibold text-base mt-2">
          {product.name}
        </h3>

        {/* Нижняя часть карточки */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center">
            <div className="flex items-center">{renderStars(product.rating)}</div>
            <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{product.price} р.</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">{product.originalPrice} р.</span>
            )}
          </div>

          <Button onClick={addToCart} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors">
            <ShoppingCart className="h-4 w-4 mr-2" />В корзину
          </Button>
        </div>
      </CardContent>
    </Card>

  )
}

export default ProductCard
