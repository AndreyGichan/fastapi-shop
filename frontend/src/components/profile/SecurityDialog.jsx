"use client"

import React, { useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { X, Shield, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { changePassword } from "../../lib/api";
import { useToast } from "../ui/useToast"


export function SecurityDialog({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    })

    const [errors, setErrors] = useState({})
    const { toast } = useToast();

    if (!isOpen) return null

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }))
    }

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
    }

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, text: "", color: "" }
        if (password.length < 6) return { strength: 1, text: "Слабый", color: "text-red-500" }
        if (password.length < 8) return { strength: 2, text: "Средний", color: "text-yellow-500" }
        if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return { strength: 4, text: "Очень сильный", color: "text-green-500" }
        }
        return { strength: 3, text: "Сильный", color: "text-blue-500" }
    }

    const passwordStrength = getPasswordStrength(formData.newPassword)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.currentPassword) newErrors.currentPassword = "Введите текущий пароль";
        if (!formData.newPassword) newErrors.newPassword = "Введите новый пароль";
        else if (formData.newPassword.length < 8) newErrors.newPassword = "Пароль должен содержать минимум 8 символов";
        if (!formData.confirmPassword) newErrors.confirmPassword = "Подтвердите новый пароль";
        else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Пароли не совпадают";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            await changePassword(formData.currentPassword, formData.newPassword);

            toast({
                title: "Пароль успешно изменен",
                description: "Ваш новый пароль сохранен.",
                variant: "success"
            });

            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            onClose();
        } catch (err) {
            console.error(err);
            toast({
                title: "Ошибка при смене пароля",
                description: err.message || "Попробуйте снова",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
                <div className="relative bg-gradient-to-r from-red-500 to-orange-600 p-6 text-white">
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Смена пароля</h2>
                                <p className="text-red-100">Обновите пароль для безопасности</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 rounded-xl">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="flex items-center gap-2 text-sm font-medium">
                                <Lock className="h-4 w-4 text-red-600" /> Текущий пароль
                            </Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showPasswords.current ? "text" : "password"}
                                    value={formData.currentPassword}
                                    onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                                    className={`pr-10 ${errors.currentPassword ? "border-red-500" : "border-gray-200"}`}
                                    placeholder="Введите текущий пароль"
                                />
                                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => togglePasswordVisibility("current")}>
                                    {showPasswords.current ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                </Button>
                            </div>
                            {errors.currentPassword && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.currentPassword}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="flex items-center gap-2 text-sm font-medium">
                                <Lock className="h-4 w-4 text-red-600" /> Новый пароль
                            </Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showPasswords.new ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                                    className={`pr-10 ${errors.newPassword ? "border-red-500" : "border-gray-200"}`}
                                    placeholder="Минимум 8 символов"
                                />
                                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => togglePasswordVisibility("new")}>
                                    {showPasswords.new ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                </Button>
                            </div>
                            {formData.newPassword && (
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.strength === 1
                                                ? "bg-red-500 w-1/4"
                                                : passwordStrength.strength === 2
                                                    ? "bg-yellow-500 w-2/4"
                                                    : passwordStrength.strength === 3
                                                        ? "bg-blue-500 w-3/4"
                                                        : passwordStrength.strength === 4
                                                            ? "bg-green-500 w-full"
                                                            : "w-0"
                                                }`}
                                        />
                                    </div>
                                    <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.text}</span>
                                </div>
                            )}
                            {errors.newPassword && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.newPassword}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium">
                                <CheckCircle className="h-4 w-4 text-red-600" /> Подтвердите новый пароль
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showPasswords.confirm ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                    className={`pr-10 ${errors.confirmPassword ? "border-red-500" : "border-gray-200"}`}
                                    placeholder="Повторите новый пароль"
                                />
                                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => togglePasswordVisibility("confirm")}>
                                    {showPasswords.confirm ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                </Button>
                            </div>
                            {errors.confirmPassword && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.confirmPassword}</p>}
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-xs text-orange-700">
                            <p className="font-medium mb-1">Рекомендации для безопасного пароля:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Минимум 8 символов</li>
                                <li>Используйте заглавные и строчные буквы</li>
                                <li>Добавьте цифры и специальные символы</li>
                                <li>Не используйте личную информацию</li>
                            </ul>
                        </div>
                    </form>
                </div>

                <div className="border bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="px-6 border-gray-200 bg-transparent
             hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white
             focus:outline-none focus:ring-0 transition-all">
                        Отмена
                    </Button>
                    <Button onClick={handleSubmit} className="px-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white flex items-center">
                        <Shield className="h-4 w-4 mr-2" /> Изменить пароль
                    </Button>
                </div>
            </div>
        </div>
    )
}
