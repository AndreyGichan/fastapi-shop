"use client"

import React, { useEffect } from "react"
import { ProductEditForm } from "./ProductEditForm"
import { X } from "lucide-react"
import { Button } from "../ui/Button"

export function ProductEditDialog({ product, open, onOpenChange, onSave, readOnly = false }) {
  const handleSave = (updatedProduct) => {
    onSave(updatedProduct)
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

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-6xl max-h-[95vh] mx-4 bg-background rounded-xl shadow-2xl overflow-hidden border border-border/50">
        <div className="gradient-header p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {product ? "Редактировать товар" : "Добавить новый товар"}
              </h2>
              <p className="text-white/80 mt-1">
                {product
                  ? `Изменение: ${product.name}`
                  : "Создание нового продукта для каталога"}
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

        <div className="overflow-y-auto max-h-[calc(95vh-120px)] bg-gradient-to-br from-background to-muted/30">
          <ProductEditForm
            product={product}
            onSave={handleSave}
            onCancel={handleCancel}
            readOnly={readOnly}
          />
        </div>
      </div>
    </div>
  )
}
