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
import { useToast } from "../components/ui/useToast";


export default function CartPage() {
    const { cartItems, setCartItems } = useCart()
    const isEmpty = cartItems.length === 0
    const { isAuthenticated } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (!cartItems.length) {
            setCartItems([])
        }
    }, [])

    const handleClearCart = async () => {
        try {
            await clearCart();
            setCartItems([]);
            toast({
                title: "Корзина очищена",
                description: "Все товары были успешно удалены из корзины",
                variant: "success"
            });
        } catch (err) {
            console.error("Ошибка при очистке корзины:", err);
            toast({
                title: "Ошибка",
                description: "Не удалось очистить корзину. Попробуйте позже.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-2 mb-8">
                        <Link to="/">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-muted-foreground"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Вернуться к покупкам
                            </Button>
                        </Link>

                        {!isEmpty && (
                            <Button
                                variant="destructive"
                                size="sm"
                                className="ml-auto flex items-center gap-2 hover:bg-red-600/80 transition-colors"
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

                            {isAuthenticated && !isEmpty && (
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <CartItem key={item.id} item={item} setItems={setCartItems} />
                                    ))}
                                </div>
                            )}
                        </div>


                        {isAuthenticated && !isEmpty && (
                            <div className="lg:col-span-1">
                                <CartSummary items={cartItems} />
                            </div>
                        )}
                    </div>

                    {!isAuthenticated && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-800 to-purple-950 bg-clip-text text-transparent">
                                Войдите, чтобы продолжить
                            </h2>
                            <p className="text-muted-foreground mb-8 max-w-md text-lg">
                                Чтобы просматривать корзину и оформлять заказы, необходимо авторизоваться в системе
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <Link to="/login">
                                    <Button
                                        size="lg"
                                        className="gap-2 bg-gradient-to-r from-purple-800 to-purple-950 hover:from-purple-700 hover:to-purple-900"
                                    >
                                        Войти в аккаунт
                                    </Button>
                                </Link>
                            </div>
                        </div>

                    )}

                    {isAuthenticated && isEmpty && (
                        <div className="justify-center px-20">
                            <CartEmpty />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
