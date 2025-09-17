import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { Button } from "./ui/Button"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { apiFetch } from "../lib/api"
import { useCart } from "../context/CartContext"
import { ProductDetailDialog } from "./ProductDetailDialog"

const API_URL = process.env.REACT_APP_API_URL;

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const renderStars = (ratingValue) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(ratingValue) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  return (
    <>
      <Card
        className="group overflow-hidden border border-border shadow-[0_0_07px_rgba(0,0,0,0.2)] hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-background cursor-pointer flex flex-col h-full"
        onClick={() => handleProductClick(product)}
      >
        <CardContent className="p-5 flex flex-col">
          <div className="relative">
            <img
              src={`${API_URL}${product.image_url}` || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-48 object-contain rounded-md"
            />
            {product.discount && (
              <Badge className="absolute top-0 right-0 bg-red-600 text-white font-semibold border-0">
                -{product.discount}%
              </Badge>
            )}
          </div>

          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors mt-3 mb-3">
            {product.name}
          </h3>

          <div className="mt-auto flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <div className="flex items-center">{renderStars(product.average_rating || 0)}</div>
              <span className="flex-shrink-0 text-sm text-gray-600">({product.reviews_count})</span>
            </div>


            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">{product.price} р.</span>
              {product.original_price && (
                <span className="text-sm text-gray-500 line-through">{product.original_price} р.</span>
              )}
            </div>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product.id, 1, product.name);
              }}
              className="w-full bg-gradient-to-r from-purple-800 to-purple-950 hover:from-purple-500 hover:to-purple-800 transition-colors">
              <ShoppingCart className="h-4 w-4 mr-2" />В корзину
            </Button>
          </div>
        </CardContent>
      </Card>

      <ProductDetailDialog product={selectedProduct} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>

  )
}

export default ProductCard
