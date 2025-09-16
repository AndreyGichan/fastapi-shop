import { useState } from "react"
import { Header } from "../components/Header"
import { CheckoutForm } from "../components/checkout/CheckoutForm"
import { CheckoutSummary } from "../components/checkout/CheckoutSummary"
import { useCart } from "../context/CartContext"

export default function CheckoutPage() {
    const { cartItems, loading, reloadCart } = useCart()
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center">Загрузка...</div>
    }
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <main className="container mx-auto px-20 py-8">
                <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
                    <a href="/" className="hover:text-foreground">
                        Главная
                    </a>
                    <span>/</span>
                    <a href="/cart" className="hover:text-foreground">
                        Корзина
                    </a>
                    <span>/</span>
                    <span className="text-foreground">Оформление заказа</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <CheckoutForm
                            address={address}
                            setAddress={setAddress}
                            phone={phone}
                            setPhone={setPhone}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <CheckoutSummary
                            items={cartItems}
                            address={address}
                            phone={phone}
                            reloadCart={reloadCart}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}
