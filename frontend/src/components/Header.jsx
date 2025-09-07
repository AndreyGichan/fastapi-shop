"use client"
import Button from "./ui/Button"
import Input from "./ui/Input"
import { Search, ShoppingCart, User, Menu, Star, Shield } from "lucide-react"


const Header = ({ sidebarOpen, setSidebarOpen, search, setSearch }) => {
    return (
        <header className="bg-gradient-to-r from-violet-900 via-purple-700 to-pink-600 text-white sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden text-white"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                        <div className="text-xl font-bold">TechStore</div>
                    </div>

                    <div className="flex-1 max-w-2xl mx-4">
                        <div className="relative">
                            <Input
                                placeholder="Поиск товаров..."
                                className="w-full pl-4 pr-12 py-2 rounded-md text-black placeholder-gray-400"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-white">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="ml-1 hidden sm:inline">Корзина</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white">
                            <User className="w-5 h-5" />
                            <span className="ml-1 hidden sm:inline">Профиль</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
