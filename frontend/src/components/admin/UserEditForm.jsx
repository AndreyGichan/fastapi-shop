"use client"

import React, { useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Textarea } from "../ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Alert, AlertDescription } from "../ui/Alert"
import { AlertCircle, User, Mail, Phone, Shield, Info, Calendar, ShoppingBag, DollarSign } from "lucide-react"
import { updateUserByAdmin } from "../../lib/api";

export function UserEditForm({ user, onSave, onCancel, readOnly = false }) {
    const [formData, setFormData] = useState({
        id: user?.id || 0,
        username: user?.username || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        role: user?.role || "user"
    })

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState("details")

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.username.trim()) newErrors.username = "Имя обязательно"
        if (!formData.email.trim()) newErrors.email = "Email обязателен"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Некорректный email"
        if (!formData.role.trim()) newErrors.role = "Роль обязательна"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return
        setIsSubmitting(true)
        try {
            await updateUserByAdmin(formData.id, formData);
            onSave?.(formData);
        } catch (error) {
            console.error(error);
            if (error.status === 400) {
                setErrors(error.fields || { form: error.message });
            } else {
                setErrors({ form: error.message });
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const tabs = [
        { id: "details", label: "Детали", icon: Info },
        { id: "activity", label: "Активность", icon: ShoppingBag },
        ...(!readOnly ? [{ id: "settings", label: "Настройки", icon: Shield }] : []),
    ]

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

                {/* Details */}
                {activeTab === "details" && (
                    <Card className="border-0 shadow-lg bg-gradient-card">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center space-x-2 text-xl">
                                <Info className="h-5 w-5 text-primary" />
                                <span>Основная информация</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Полное имя *</Label>
                                    <Input
                                        id="name"
                                        value={formData.username}
                                        onChange={(e) => handleInputChange("username", e.target.value)}
                                        placeholder="Введите имя"
                                        className={errors.username ? "border-destructive" : ""}
                                        required
                                        disabled={readOnly}
                                    />
                                    {errors.username && (
                                        <p className="text-sm text-destructive flex items-center space-x-1">
                                            <AlertCircle className="h-3 w-3" />
                                            <span>{errors.username}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Фамилия</Label>
                                    <Input
                                        id="last_name"
                                        value={formData.last_name}
                                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                                        placeholder="Введите фамилию"
                                        disabled={readOnly}
                                    />
                                </div>


                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        placeholder="Введите email"
                                        className={errors.email ? "border-destructive" : ""}
                                        required
                                        disabled={readOnly}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive flex items-center space-x-1">
                                            <AlertCircle className="h-3 w-3" />
                                            <span>{errors.email}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Роль *</Label>
                                    <select
                                        id="role"
                                        value={formData.role}
                                        onChange={(e) => handleInputChange("role", e.target.value)}
                                        className={errors.role ? "border-destructive" : ""}
                                        required
                                        disabled={readOnly}
                                    >
                                        <option value="user">пользователь</option>
                                        <option value="admin">админ</option>
                                    </select>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                )}

                {/* Activity */}
                {activeTab === "activity" && (
                    <Card className="border-0 shadow-lg bg-gradient-card">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-xl">
                                <ShoppingBag className="h-5 w-5 text-primary" />
                                <span>Активность пользователя</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-600">Всего заказов</p>
                                <p className="text-xl font-bold text-green-700">{user.orders || 0}</p>
                            </div>
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-600">Потрачено</p>
                                <p className="text-xl font-bold text-blue-700">
                                    {(user.totalSpent || 0).toLocaleString()} р.
                                </p>
                            </div>
                            {/* <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                <p className="text-sm text-purple-600">Дата регистрации</p>
                                <p className="text-xl font-bold text-purple-700">{user.joinDate || "-"}</p>
                            </div> */}
                        </CardContent>
                    </Card>
                )}

                {/* Settings */}
                {!readOnly && activeTab === "settings" && (
                    <Card className="border-0 shadow-lg bg-gradient-card">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-xl">
                                <Shield className="h-5 w-5 text-primary" />
                                <span>Управление доступом</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button type="button" variant="outline" className="w-full justify-start">
                                Отправить ссылку для сброса пароля
                            </Button>
                            <Button type="button" variant="outline" className="w-full justify-start">
                                Отправить уведомление пользователю
                            </Button>
                        </CardContent>
                    </Card>
                )}


                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4">
                    {!readOnly && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Отмена
                        </Button>
                    )}
                    {!readOnly && (
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary hover:bg-[var(--accent)] text-white px-8 py-2 h-11 shadow-lg hover:shadow-xl transition-all"
                        >
                            {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    )
}
