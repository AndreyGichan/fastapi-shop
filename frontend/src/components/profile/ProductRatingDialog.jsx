'use client'

import { useState, useEffect } from "react"
import { Button } from "../ui/Button"
import { Textarea } from "../ui/Textarea"
import { Label } from "../ui/Label"
import { Star, Package } from "lucide-react"
import { submitProductRating } from "../../lib/api";
import { useToast } from "../ui/useToast";

const API_URL = process.env.REACT_APP_API_URL || "";

export function ProductRatingDialog({ isOpen, onClose, product, onSubmitRating }) {
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [review, setReview] = useState("")
    const { toast } = useToast();

    useEffect(() => {
        if (!isOpen) {
            setRating(0);
            setHoveredRating(0);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating > 0 && product) {
            try {
                await submitProductRating(product.id, rating);
                if (onSubmitRating) onSubmitRating({ productId: product.id, rating });
                onClose();
                toast({ title: "Спасибо!", description: "Ваша оценка отправлена", variant: "success" });
            } catch (error) {
                console.error("Ошибка при отправке оценки:", error);

                const message =
                    error?.response?.data?.detail || 
                    error?.message ||                
                    "Не удалось отправить оценку";

                toast({
                    title: "Ошибка",
                    description: message,
                    variant: "destructive"
                });
            }
        }
    };

    const handleClose = () => {
        setRating(0)
        setReview("")
        onClose()
    }

    if (!isOpen || !product) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={handleClose}
            />

            {/* Modal content */}
            <div className="relative z-10 max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold">Оценить товар</h3>
                    <button
                        className="ml-auto text-gray-400 hover:text-gray-600"
                        onClick={handleClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Product info */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 mb-6">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden border">
                        <img
                            src={product.image_url ? `${API_URL}${product.image_url}` : "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.price.toLocaleString()} р.</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star rating */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Ваша оценка</Label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="p-1 transition-transform hover:scale-110"
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        className={`h-8 w-8 transition-colors ${star <= (hoveredRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-600">
                            {rating === 0 && "Выберите оценку"}
                            {rating === 1 && "Очень плохо"}
                            {rating === 2 && "Плохо"}
                            {rating === 3 && "Нормально"}
                            {rating === 4 && "Хорошо"}
                            {rating === 5 && "Отлично"}
                        </p>
                    </div>

                    {/* <div className="space-y-2">
                        <Label htmlFor="review" className="text-sm font-medium">
                            Отзыв (необязательно)
                        </Label>
                        <Textarea
                            id="review"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Поделитесь своим мнением о товаре..."
                            rows={4}
                            className="resize-none"
                        />
                    </div> */}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={handleClose} className="border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-md">
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            disabled={rating === 0}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                        >
                            Оценить товар
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
