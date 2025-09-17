"use client"

import React, { useState, useEffect } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Textarea } from "../ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Alert, AlertDescription } from "../ui/Alert"
import { AlertCircle, Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react"
import { updateOrderStatus } from "../../lib/api";

export function OrderStatusForm({ order, onSave, onCancel, readOnly = false }) {
    const statusOptions = [
        {
            value: "в обработке",
            label: "В обработке",
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
        },
        {
            value: "отправлен",
            label: "Отправлен",
            icon: Truck,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
        },
        {
            value: "доставлен",
            label: "Доставлен",
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
        },
        {
            value: "отменен",
            label: "Отменен",
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
        },
    ]


    const [formData, setFormData] = useState({
        status: order?.status || "",
    })

    useEffect(() => {
        if (order && order.status) {
            setFormData({ status: order.status })
        }
    }, [order])


    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState("details")

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    const validateForm = () => {
        const newErrors = {}
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return
        setIsSubmitting(true)
        try {
            await updateOrderStatus(order.id, formData);

            // Обновляем локальный объект заказа с новым статусом
            const updatedOrder = { ...order, status: formData.status };

            // Передаем обновленный объект дальше
            onSave(updatedOrder);
        } catch (error) {
            console.error("Ошибка сохранения заказа:", error)
            setErrors({ submit: "Не удалось обновить заказ. Попробуйте снова." });
        } finally {
            setIsSubmitting(false)
        }
    }

    const tabs = [
        { id: "details", label: "Детали заказа", icon: Package },
        { id: "status", label: "Статус", icon: Clock },
    ]

    const currentStatus = statusOptions.find((s) => s.value === formData.status)

    return (
        <div className="p-6 space-y-6">
            {/* Tabs */}
            <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg">
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
                {/* Errors */}
                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Пожалуйста, исправьте ошибки перед сохранением.</AlertDescription>
                    </Alert>
                )}

                {activeTab === "details" && (
                    <Card className="border-0 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center space-x-2 text-xl">
                                <Package className="h-5 w-5 text-primary" />
                                <span>Информация о заказе</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>ID клиента</Label>
                                    <Input
                                        value={order.user_id || "—"}
                                        className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Адрес доставки</Label>
                                    <Input
                                        value={order.address || "—"}
                                        className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Дата заказа</Label>
                                    <Input
                                        value={order.created_at ? new Date(order.created_at).toLocaleDateString("ru-RU") : "—"}
                                        className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Общая сумма (р.)</Label>
                                    <Input
                                        value={order.total_price != null ? `${Number(order.total_price).toLocaleString()}` : "—"}
                                        className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Телефон</Label>
                                    <Input
                                        value={order.phone || "—"}
                                        className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        disabled
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Status Tab */}
                {activeTab === "status" && (
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center space-x-2 text-xl">
                                <Clock className="h-5 w-5 text-primary" />
                                <span>Статус заказа</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Current Status */}
                            {currentStatus && (
                                <div
                                    className={`flex items-center gap-2 p-3 rounded-lg border ${currentStatus.borderColor} ${currentStatus.bgColor} mb-4`}
                                >
                                    <currentStatus.icon className={`w-5 h-5 ${currentStatus.color}`} />
                                    <span className={`font-medium ${currentStatus.color}`}>{currentStatus.label}</span>
                                </div>
                            )}

                            {/* Status Selection */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

                                {statusOptions.map((status) => {
                                    const Icon = status.icon
                                    const isSelected = formData.status === status.value
                                    return (
                                        <label
                                            key={status.value}
                                            className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                                ? `${status.borderColor} ${status.bgColor} ring-2 ring-offset-2 ring-blue-500`
                                                : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="status"
                                                value={status.value}
                                                checked={isSelected}
                                                onChange={(e) => handleInputChange("status", e.target.value)}
                                                className="sr-only"
                                                disabled={readOnly}
                                            />
                                            <div className="flex items-center gap-3 w-full">
                                                <div
                                                    className={`p-2 rounded-lg ${isSelected ? status.bgColor : "bg-gray-100"
                                                        }`}
                                                >
                                                    <Icon
                                                        className={`w-5 h-5 ${isSelected ? status.color : "text-gray-500"
                                                            }`}
                                                    />
                                                </div>
                                                <span
                                                    className={`font-medium ${isSelected ? status.color : "text-gray-700"
                                                        }`}
                                                >
                                                    {status.label}
                                                </span>
                                            </div>
                                        </label>
                                    )
                                })}
                            </div>



                            {/* Notes */}
                            {/* <div className="space-y-2 mt-4">
                                <Label htmlFor="notes">Комментарий</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange("notes", e.target.value)}
                                    rows={3}
                                />
                            </div> */}
                        </CardContent>
                    </Card>
                )}

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-border/50">
                    {!readOnly && (
                        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                            Отмена
                        </Button>
                    )}
                    {!readOnly && (
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Сохранение..." : "Обновить заказ"}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    )
}
