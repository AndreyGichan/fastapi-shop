import { Button } from "../ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Separator } from "../ui/Separator"
import { useNavigate } from "react-router-dom"

export function CartSummary({ items }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 1000 ? 0 : 20
  const total = subtotal + shipping
  const navigate = useNavigate()

  const handleCheckout = () => {
    navigate("/checkout")
  }

  return (
    <Card className="sticky top-24 bg-background">
      <CardHeader>
        <CardTitle>Итого</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Товары ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
            <span>{subtotal.toLocaleString()} р.</span>
          </div>
          <div className="flex justify-between">
            <span>Доставка</span>
            <span className={shipping === 0 ? "text-green-600" : ""}>
              {shipping === 0 ? "Бесплатно" : `${shipping} р.`}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>К оплате</span>
          <span>{total.toLocaleString()} р.</span>
        </div>

        {shipping === 0 && <p className="text-sm text-green-600">🎉 Бесплатная доставка при заказе от 1000 р.</p>}

        <Button className="w-full" size="lg" onClick={handleCheckout}>
          Оформить заказ
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>✓ Молниеносная доставка</p>
          <p>✓ Расширенная гарантия</p>
          <p>✓ Безопасная оплата</p>
        </div>
      </CardContent>
    </Card>
  )
}
