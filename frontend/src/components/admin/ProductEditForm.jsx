"use client"

import React, { useState, useEffect } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Textarea } from "../ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Upload, X, AlertCircle, Package, DollarSign, ImageIcon, BarChart3, Info } from "lucide-react"
import { Alert, AlertDescription } from "../ui/Alert"
import { createProduct, updateProduct } from "../../lib/api"

const API_URL = process.env.REACT_APP_API_URL || ""

export function ProductEditForm({ product, onSave, onCancel, readOnly = false }) {
    const [formData, setFormData] = useState({
        id: product?.id || 0,
        name: product?.name || "",
        category: product?.category || "",
        price: product?.price || 0,
        quantity: product?.quantity || 0,
        description: product?.description || "",
        originalPrice: product?.original_price || undefined,
        discount: product?.discount || undefined,
        image: null,
    })

    const [imagePreview, setImagePreview] = useState(
        product?.image_url ? product.image_url : ""
    )
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState("details")
    const [categories, setCategories] = useState([])
    const [isNewCategory, setIsNewCategory] = useState(false)

    useEffect(() => {
        setFormData({
            id: product?.id || 0,
            name: product?.name || "",
            category: product?.category || "",
            price: product?.price || 0,
            quantity: product?.quantity || 0,
            description: product?.description || "",
            originalPrice: product?.original_price || undefined,
            discount: product?.discount || undefined,
            image: null,
        })
        setImagePreview(product?.image_url || "")
        setErrors({})
        setIsNewCategory(!product || !product?.category)
    }, [product])

    useEffect(() => {
        fetch(`${API_URL}/products/categories/`)
            .then(res => res.json())
            .then(data => {
                const normalized = data.map(cat => typeof cat === "string" ? cat : cat.name)
                setCategories(normalized)
            })
            .catch(err => console.error("Ошибка при загрузке категорий:", err))
    }, [])

    const clearError = (field) => {
        setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
        })
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))

        if (errors[field]) {
            clearError(field)
        }
    }

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            setErrors((prev) => ({ ...prev, image: "Допустимы только форматы: JPG, PNG, GIF, WEBP" }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, image: "Размер файла не должен превышать 5MB" }));
            return;
        }

        setFormData(prev => ({ ...prev, image: file }))
        clearError("image")

        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleImageUrlChange = (shortUrl) => {
        const fullUrl = shortUrl ? `/static/images/${shortUrl}` : ""
        setFormData((prev) => ({ ...prev, image_url: fullUrl, image: null }))
        setImagePreview(fullUrl)
        if (errors.image) setErrors((prev) => ({ ...prev, image: undefined }))
    }

    useEffect(() => {
        const { price, originalPrice } = formData
        if (originalPrice && price && originalPrice > price) {
            const calculatedDiscount = Math.round(((originalPrice - price) / originalPrice) * 100)
            setFormData(prev => ({ ...prev, discount: calculatedDiscount }))
        } else if (!formData.discount) {
            setFormData(prev => ({ ...prev, discount: undefined }))
        }
    }, [formData.price, formData.originalPrice])


    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Название товара обязательно";
        else if (formData.name.length < 3) newErrors.name = "Название должно содержать минимум 3 символа";

        if (!formData.category) newErrors.category = "Категория обязательна";

        if (formData.price <= 0) newErrors.price = "Цена должна быть больше 0";

        if (formData.quantity < 0) newErrors.quantity = "Количество не может быть отрицательным";

        if (formData.originalPrice && formData.originalPrice <= formData.price)
            newErrors.originalPrice = "Старая цена должна быть больше текущей цены";

        if (formData.discount && (formData.discount < 0 || formData.discount > 100))
            newErrors.discount = "Скидка должна быть от 0 до 100%";

        if (formData.originalPrice && formData.price && !formData.discount) {
            const calculatedDiscount = Math.round(
                ((formData.originalPrice - formData.price) / formData.originalPrice) * 100
            );
            setFormData(prev => ({ ...prev, discount: calculatedDiscount }));
        }

        if (!formData.image && !product?.image_url)
            newErrors.image = "Необходимо загрузить изображение или указать ссылку";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const dataToSend = new FormData();
            dataToSend.append("name", formData.name);
            dataToSend.append("category", formData.category);
            dataToSend.append("price", formData.price);
            dataToSend.append("quantity", formData.quantity);
            dataToSend.append("description", formData.description || "");

            if (formData.originalPrice != null) {
                dataToSend.append("original_price", formData.originalPrice);
            }
            if (formData.discount != null) {
                dataToSend.append("discount", formData.discount);
            }

            if (formData.image) dataToSend.append("image", formData.image)
            console.log("=== Sending FormData ===");
            for (let pair of dataToSend.entries()) {
                console.log(pair[0], ":", pair[1]);
            }

            let savedProduct;
            if (formData.id && formData.id > 0) {
                savedProduct = await updateProduct(formData.id, dataToSend);
            } else {
                savedProduct = await createProduct(dataToSend);
            }

            onSave(savedProduct);
        } catch (error) {
            console.error("Ошибка при сохранении товара:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleCancel = () => {
        setFormData({
            id: product?.id || 0,
            name: product?.name || "",
            category: product?.category || "",
            price: product?.price || 0,
            quantity: product?.quantity || 0,
            description: product?.description || "",
            originalPrice: product?.originalPrice || undefined,
            discount: product?.discount || undefined,
            image: null,
        });
        setImagePreview(product?.image_url ? `${API_URL}${product.image_url}` : "")
        setErrors({});
        onCancel?.();
    };

    const tabs = [
        { id: "details", label: "Детали", icon: Info },
        { id: "pricing", label: "Цены", icon: DollarSign },
        { id: "images", label: "Изображения", icon: ImageIcon },
        { id: "inventory", label: "Склад", icon: Package },
    ]

    return (
        <div className="p-6 space-y-6">
            <div className="flex space-x-1 p-1 rounded-lg">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{tab.label}</span>
                        </button>
                    )
                })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Пожалуйста, исправьте ошибки в форме перед сохранением.</AlertDescription>
                    </Alert>
                )}

                {activeTab === "details" && (
                    <Card className="border-0 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center space-x-2 text-xl">
                                <Info className="h-5 w-5 text-primary" />
                                <span>Основная информация</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Название товара *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        placeholder="Введите название товара"
                                        className={`border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? "border-destructive" : ""
                                            }`}
                                        required
                                        disabled={readOnly}

                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive flex items-center space-x-1">
                                            <AlertCircle className="h-3 w-3" />
                                            <span>{errors.name}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Категория *</Label>
                                    <select
                                        id="category"
                                        value={isNewCategory ? "__new__" : (formData.category || (categories.length ? categories[0] : ""))}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            if (value === "__new__") {
                                                setIsNewCategory(true)
                                                handleInputChange("category", "")
                                            } else {
                                                setIsNewCategory(false)
                                                handleInputChange("category", value)
                                            }
                                        }}
                                        className={`border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${errors.category ? "border-destructive" : "w-full"
                                            }`}
                                        required
                                        disabled={readOnly}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                                            </option>
                                        ))}
                                        <option value="__new__">Новая категория...</option>
                                    </select>

                                    {isNewCategory && (
                                        <Input
                                            type="text"
                                            placeholder="Введите новую категорию"
                                            value={formData.category}
                                            onChange={(e) => handleInputChange("category", e.target.value)}
                                            className={`border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${errors.category ? "border-destructive mt-2" : "mt-2"
                                                }`}
                                            disabled={readOnly}
                                        />
                                    )}

                                    {errors.category && (
                                        <p className="text-sm text-destructive flex items-center space-x-1">
                                            <AlertCircle className="h-3 w-3" />
                                            <span>{errors.category}</span>
                                        </p>
                                    )}
                                </div>


                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Описание</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder="Введите подробное описание товара"
                                    rows={4}
                                    className="bg-background border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    disabled={readOnly}
                                />
                            </div>

                        </CardContent>
                    </Card>
                )}

                {activeTab === "pricing" && (
                    <Card className="border-0 shadow-[0_0_10px_rgba(0,0,0,0.2)] ">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center space-x-2 text-xl">
                                <DollarSign className="h-5 w-5 text-primary" />
                                <span>Цены и скидки</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Цена (р.) *</Label>
                                    <Input
                                        id="price"
                                        type="text"
                                        value={formData.price ?? ""}
                                        onChange={(e) => {
                                            // const value = e.target.value === "" ? undefined : Number(e.target.value)

                                            let value = e.target.value.replace(/[^0-9.,]/g, "");

                                            value = value.replace(",", ".");

                                            const parts = value.split(".");
                                            if (parts.length > 2) {
                                                value = parts[0] + "." + parts.slice(1).join("");
                                            }
                                            if (parts[1]?.length > 2) {
                                                value = parts[0] + "." + parts[1].slice(0, 2);
                                            }
                                            handleInputChange("price", value)
                                        }}
                                        className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="0"
                                        min="0"
                                        disabled={readOnly}
                                    />
                                    {errors.price && (
                                        <p className="text-sm text-destructive flex items-center space-x-1">
                                            <AlertCircle className="h-3 w-3" />
                                            <span>{errors.price}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="originalPrice">Старая цена (р.)</Label>
                                    <Input
                                        id="originalPrice"
                                        type="text"
                                        value={formData.originalPrice ?? ""}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/[^0-9.,]/g, "");
                                            value = value.replace(",", ".");
                                            const parts = value.split(".");
                                            if (parts.length > 2) value = parts[0] + "." + parts.slice(1).join("");
                                            if (parts[1]?.length > 2) value = parts[0] + "." + parts[1].slice(0, 2);
                                            handleInputChange("originalPrice", value)
                                        }}
                                        className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Не обязательно"
                                        min="0"
                                        disabled={readOnly}

                                    />
                                    {errors.originalPrice && (
                                        <p className="text-sm text-destructive flex items-center space-x-1">
                                            <AlertCircle className="h-3 w-3" />
                                            <span>{errors.originalPrice}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="discount">Скидка (%)</Label>
                                    <Input
                                        id="discount"
                                        type="text"
                                        value={formData.discount ?? ""}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/[^0-9]/g, "");
                                            if (value) {
                                                let num = Math.min(Math.max(Number(value), 0), 100);
                                                value = num.toString();
                                            }
                                            handleInputChange("discount", value)
                                        }}
                                        className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Авто-расчет"
                                        min="0"
                                        disabled={readOnly}
                                    />

                                    {errors.discount && (
                                        <p className="text-sm text-destructive flex items-center space-x-1">
                                            <AlertCircle className="h-3 w-3" />
                                            <span>{errors.discount}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "images" && (
                    <Card className="border-0 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center space-x-2 text-xl">
                                <ImageIcon className="h-5 w-5 text-primary" />
                                <span>Изображение</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-start md:space-x-6 space-y-4 md:space-y-0">
                                {/* Preview */}
                                <div className={`w-40 h-40 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0
    ${imagePreview ? "border border-gray-300" : "border-2 border-dashed border-muted/50 bg-muted/20"}`}
                                >
                                    {imagePreview ? (
                                        <img
                                            src={formData.image instanceof File ? imagePreview : imagePreview}
                                            alt="preview"
                                            className="w-full h-full object-contain bg-white rounded"
                                        />
                                    ) : (
                                        <Upload className="w-8 h-8 text-muted-foreground" />
                                    )}
                                </div>


                                {!readOnly && (
                                    <div className="flex-1 space-y-2">
                                        <label className="flex flex-col gap-1">
                                            Загрузить изображение
                                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                                        </label>

                                        {errors.image && (
                                            <p className="text-sm text-destructive flex items-center space-x-1">
                                                <AlertCircle className="h-3 w-3" />
                                                <span>{errors.image}</span>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}



                {activeTab === "inventory" && (
                    <Card className="border-0 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center space-x-2 text-xl">
                                <Package className="h-5 w-5 text-primary" />
                                <span>Склад и статус</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Количество на складе *</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => {
                                            handleInputChange("quantity", e.target.value);
                                        }}
                                        onBlur={(e) => {
                                            // При уходе убираем ведущие нули
                                            let num = Number(e.target.value);
                                            if (isNaN(num) || num < 0) num = 0;
                                            handleInputChange("quantity", num);
                                        }}
                                        className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="0"
                                        min="0"
                                    />

                                    {errors.quantity && (
                                        <p className="text-sm text-destructive flex items-center space-x-1">
                                            <AlertCircle className="h-3 w-3" />
                                            <span>{errors.quantity}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="flex justify-end gap-4 pt-6 border-t border-border/50">
                    {!readOnly && (
                        <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting} className="px-8 py-2 h-11 bg-transparent border border-gray-200">
                            Отмена
                        </Button>
                    )}
                    {!readOnly && (
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-[var(--accent)] text-white px-8 py-2 h-11 shadow-lg hover:shadow-xl transition-all"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Сохранение..." : product ? "Сохранить изменения" : "Создать товар"}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    )
}
