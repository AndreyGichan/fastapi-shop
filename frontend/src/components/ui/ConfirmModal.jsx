import { useState } from "react";
import { Button } from "../components/ui/Button";

export function ConfirmModal({ isOpen, onConfirm, onCancel, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
                <p className="text-lg mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={onCancel}>Отмена</Button>
                    <Button variant="destructive" onClick={onConfirm}>Очистить</Button>
                </div>
            </div>
        </div>
    );
}
