"use client"

import React, { useState, useEffect } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { X, User, Mail } from "lucide-react"

export function ProfileEditDialog({ isOpen, onClose, userData, onSave }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    useEffect(() => {
        setFormData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
        })
    }, [userData, isOpen])

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
        onClose()
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="relative bg-gradient-to-r from-purple-800 to-purple-950 p-6 text-white">
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Редактировать профиль</h2>
                                <p className="text-purple-200">Обновите свою личную информацию</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 rounded-xl">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>


                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="flex items-center gap-2 text-sm font-medium">
                                <User className="h-4 w-4 text-purple-800" />
                                Имя
                            </Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                placeholder="Введите имя"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium">
                                <User className="h-4 w-4 text-purple-800" />
                                Фамилия
                            </Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                placeholder="Введите фамилию"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                                <Mail className="h-4 w-4 text-purple-800" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                placeholder="Введите email"
                            />
                        </div>
                    </form>
                </div>

                <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="px-6 bg-transparent border-gray-200 hover:bg-gradient-to-r hover:from-purple-400 hover:to-purple-600 hover:text-white">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="px-6 bg-gradient-to-r from-purple-800 to-purple-950 hover:from-purple-700 hover:to-purple-900 text-white"
                    >
                        Сохранить изменения
                    </Button>
                </div>
            </div>
        </div>
    )
}
