import { Button } from "../ui/Button"
import { Card, CardContent } from "../ui/Card"
import { ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"

export function CartEmpty() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>

        <h2 className="text-2xl font-semibold mb-2">Корзина пуста</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Добавьте товары в корзину, чтобы оформить заказ. У нас есть много интересных предложений!
        </p>

        <Link to="/">
          <Button size="lg" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Перейти к покупкам
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
