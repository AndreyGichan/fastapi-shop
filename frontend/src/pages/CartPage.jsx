import { useEffect } from "react"
import { Header } from "../components/Header"
import { CartItem } from "../components/cart/CartItem"
import { CartSummary } from "../components/cart/CartSummary"
import { CartEmpty } from "../components/cart/CartEmpty"
import { Button } from "../components/ui/Button"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { clearCart } from "../lib/api"
import { useCart } from "../context/CartContext"

export default function CartPage() {
    const { cartItems, setCartItems } = useCart() // берём корзину из контекста
    const isEmpty = cartItems.length === 0

    useEffect(() => {
        // Здесь можно при необходимости подгружать корзину с сервера,
        // если она не была загружена ранее в контексте
        if (!cartItems.length) {
            setCartItems([]) // можно вызвать загрузку через reloadCart, если добавим
        }
    }, [])

    const handleClearCart = async () => {
        if (!window.confirm("Вы действительно хотите очистить корзину?")) return

        try {
            await clearCart()
            setCartItems([]) // обновляем состояние корзины в контексте
        } catch (err) {
            console.error("Ошибка при очистке корзины:", err)
        }
    }
    console.log(cartItems)

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 mb-8">
                        <Link to="/">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-muted-foreground hover:text-foreground"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Вернуться к покупкам
                            </Button>
                        </Link>

                        {!isEmpty && (
                            <Button
                                variant="destructive"
                                size="sm"
                                className="ml-auto flex items-center gap-2"
                                onClick={handleClearCart}
                            >
                                <Trash2 className="h-4 w-4" />
                                Очистить корзину
                            </Button>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold mb-6 w-full">Корзина</h1>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {cartItems.length === 0 ? (
                                <CartEmpty />
                            ) : (
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <CartItem
                                            key={item.id}  // используем уникальный id из CartItem
                                            item={item}
                                            setItems={setCartItems}
                                        />
                                    ))}

                                </div>
                            )}
                        </div>

                        {!isEmpty && (
                            <div className="lg:col-span-1">
                                <CartSummary items={cartItems} />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
