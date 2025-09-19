"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog"
import { Button } from "./ui/Button"
import { Badge } from "./ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Star, Heart, ShoppingCart, Minus, Plus, Shield, Truck, RotateCcw, Award } from "lucide-react"
import { useCart } from "../context/CartContext";
import { useToast } from "../components/ui/useToast";

const API_URL = process.env.REACT_APP_API_URL;

export function ProductDetailDialog({ product, open, onOpenChange }) {
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const { addToCart } = useCart();
    const { toast } = useToast();

    if (!product) return null

    const handleAddToCart = async () => {
        try {
            await addToCart(product.id, quantity, product.name);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-4xl max-h-[85vh] overflow-hidden p-0"
                aria-describedby=""
            >
                <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-[40%] p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-r">
                        <div className="h-full flex flex-col space-y-4">
                            <div className="flex-1 min-h-0">
                                <div className="relative w-full h-full max-h-72 lg:max-h-full overflow-hidden rounded-xl bg-white shadow-lg">
                                    <img
                                        src={`${API_URL}${product.image_url}` || "/placeholder.svg"}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4"
                                    />
                                    {product.discount && (
                                        <Badge className="absolute top-4 right-4 bg-red-600 text-white font-semibold">
                                            -{product.discount}%
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-[60%] flex flex-col max-h-[85vh] overflow-y-auto">
                        <div className="p-6 border-b bg-white">
                            <DialogHeader className="space-y-2">
                                <DialogTitle className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                                    {product.name}
                                </DialogTitle>

                                <div className="flex items-center gap-1">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                        <span className="font-semibold text-gray-900 ml-2">{product.rating}</span>
                                    </div>
                                    <span className="text-gray-500">({product.reviews})</span>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-xl lg:text-2xl font-bold text-primary">
                                            {product.price.toLocaleString("ru-RU")} р.
                                        </span>
                                        {product.original_price && (
                                            <span className="text-md text-gray-400 line-through">
                                                {product.original_price.toLocaleString("ru-RU")} р.
                                            </span>
                                        )}
                                    </div>
                                    {product.discount && product.original_price && (
                                        <p className="text-green-600 font-semibold">
                                            Экономия: {(product.original_price - product.price).toLocaleString("ru-RU")} р.
                                        </p>
                                    )}
                                </div>
                            </DialogHeader>
                        </div>

                        <div className="p-6 border-b bg-gray-50">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700 min-w-fit">Количество:</span>
                                    <div className="flex items-center border border-gray-300 rounded-md bg-white">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                            className="flex items-center justify-center w-7 h-7 text-gray-700 hover:bg-gray-100 disabled:opacity-50 rounded-l-md transition"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="px-3 text-center font-semibold">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="flex items-center justify-center w-7 h-7 text-gray-700 hover:bg-gray-100 rounded-r-md transition"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>


                                <div className="flex gap-3">
                                    <Button onClick={handleAddToCart} className="flex-1 h-12 font-semibold bg-gradient-to-r from-purple-800 to-purple-950 hover:from-purple-700 hover:to-purple-900 text-base text-primary-foreground transition-colors">
                                        <ShoppingCart className="h-5 w-5 mr-2" />В корзину
                                    </Button>
                                </div>

                                <div className="grid grid-cols-3 gap-1 p-2 bg-white rounded-lg border">
                                    <div className="text-center">
                                        <Truck className="h-6 w-6 text-purple-800 mx-auto mb-1" />
                                        <p className="text-sm font-medium text-gray-900">Доставка</p>
                                        <p className="text-xs text-gray-500">1-2 дня</p>
                                    </div>
                                    <div className="text-center">
                                        <Shield className="h-6 w-6 text-purple-800 mx-auto mb-1" />
                                        <p className="text-sm font-medium text-gray-900">Гарантия</p>
                                        <p className="text-xs text-gray-500">2 года</p>
                                    </div>
                                    <div className="text-center">
                                        <RotateCcw className="h-6 w-6 text-purple-800 mx-auto mb-1" />
                                        <p className="text-sm font-medium text-gray-900">Возврат</p>
                                        <p className="text-xs text-gray-500">30 дней</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 overflow-y-auto max-h-60">
                            <h2 className="text-lg font-bold text-gray-900 mb-2">Описание</h2>
                            <p className="text-gray-600 leading-relaxed text-base">{product.description}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
