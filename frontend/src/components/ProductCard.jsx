import { Card, CardContent } from "./ui/Card"
import Badge from "./ui/Badge"
import Button from "./ui/Button"

const API_URL = process.env.REACT_APP_API_URL;

const ProductCard = ({ product }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="relative mb-3">
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

        {/* Заголовок */}
        <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>

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

          <Button className="w-full bg-violet-700 hover:bg-sky-800 text-black">
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard
