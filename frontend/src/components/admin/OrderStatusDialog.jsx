"use client"

import React, { useEffect } from "react"
import { OrderStatusForm } from "./OrderStatusForm"
import { X } from "lucide-react"
import { Button } from "../ui/Button"

export function OrderStatusDialog({ order, open, onOpenChange, onSave, readOnly = false }) {
    const handleSave = (updatedOrder) => {
        onSave(updatedOrder)
        onOpenChange(false)
    }

    const handleCancel = () => {
        onOpenChange(false)
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onOpenChange(false)
        }
    }

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onOpenChange(false)
            }
        }

        if (open) {
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = "unset"
        }
    }, [open, onOpenChange])

    if (!open || !order) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-background rounded-xl shadow-2xl overflow-hidden border border-border/50">
                <div className="gradient-header p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Статус заказа</h2>
                            <p className="text-white/80 mt-1">
                                {`Заказ #${order.id}`}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="h-10 w-10 p-0 text-white hover:bg-white/20 rounded-full"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-120px)] bg-gradient-to-br from-background to-muted/30">
                    <OrderStatusForm
                        order={order}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        readOnly={readOnly}
                    />
                </div>
            </div>
        </div>
    )
}
