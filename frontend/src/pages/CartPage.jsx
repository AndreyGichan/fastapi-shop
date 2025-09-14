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
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
    const { cartItems, setCartItems } = useCart()
    const isEmpty = cartItems.length === 0
    const { isAuthenticated } = useAuth();

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
            setCartItems([])
        } catch (err) {
            console.error("Ошибка при очистке корзины:", err)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
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

                    <h1 className="text-3xl font-bold mb-6 w-full px-6">Корзина</h1>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">

                            {/* Неавторизованный пользователь */}
                            {!isAuthenticated && (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                        Войдите, чтобы продолжить
                                    </h2>
                                    <p className="text-muted-foreground mb-8 max-w-md text-lg">
                                        Чтобы просматривать корзину и оформлять заказы, необходимо авторизоваться в системе
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                        <Link to="/login">
                                            <Button
                                                size="lg"
                                                className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                                            >
                                                Войти в аккаунт
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                            )}

                            {/* Пустая корзина у авторизованного пользователя */}
                            {isAuthenticated && isEmpty && <CartEmpty />}

                            {/* Содержимое корзины */}
                            {isAuthenticated && !isEmpty && (
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <CartItem key={item.id} item={item} setItems={setCartItems} />
                                    ))}
                                </div>
                            )}
                            {/* {cartItems.length === 0 ? (
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
                            )} */}
                        </div>

                        {isAuthenticated && !isEmpty && (
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
