import { useState } from "react"
import { Button } from "../ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Separator } from "../ui/Separator"
import { ShoppingBag, Shield, Truck, CreditCard } from "lucide-react"
import { apiFetch, clearCart } from "../../lib/api"
import { useCart } from "../../context/CartContext"
import { useToast } from "../ui/useToast"

export function CheckoutSummary({ items, address, phone }) {
    const { reloadCart } = useCart()
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal > 1000 ? 0 : 20
    const total = subtotal + shipping

    const handleConfirmOrder = async () => {
        if (!items.length) {
            toast({
                title: "Корзина пуста",
                description: "Добавьте товары перед оформлением заказа",
                variant: "destructive",
            })
            return
        }
        if (!address || !phone) {
            toast({
                title: "Заполните адрес и телефон",
                description: "Эти данные обязательны для оформления заказа",
                variant: "destructive",
            })
            return
        }

        setLoading(true)
        try {
            const order = await apiFetch("/orders/", {
                method: "POST",
                body: { address, phone }
            })
            toast({
                title: "✅ Заказ успешно создан!",
                description: `Номер заказа: ${order.id}`,
                variant: "success",
            })

            await clearCart()
            await reloadCart()

            window.location.href = "/profile"
        } catch (err) {
            console.error("Ошибка при создании заказа:", err)
            toast({
                title: "Ошибка при создании заказа",
                description: err.message || "Попробуйте позже",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card className="bg-background">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Ваш заказ
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                                <img src={item.image_url || "/placeholder.svg"} alt={item.name} className="w-full h-full object-contain rounded" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{item.name}</div>
                                <div className="text-xs text-muted-foreground">Количество: {item.quantity}</div>
                            </div>
                            <div className="text-sm font-medium">{(item.price * item.quantity).toLocaleString()} р.</div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="sticky top-24 bg-background">
                <CardHeader>
                    <CardTitle>Итого к оплате</CardTitle>
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

                    {shipping === 0 && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                            🎉 Бесплатная доставка при заказе от 1000 р.
                        </p>
                    )}

                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleConfirmOrder}
                        disabled={loading || !items.length}
                    >
                        {loading ? "Оформляем..." : "Подтвердить заказ"}
                    </Button>

                    <div className="text-xs text-muted-foreground space-y-2">
                        <div className="flex items-center gap-2">
                            <Truck className="h-3 w-3" />
                            <span>Молниеносная доставка</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="h-3 w-3" />
                            <span>Расширенная гарантия</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-3 w-3" />
                            <span>Безопасная оплата</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
