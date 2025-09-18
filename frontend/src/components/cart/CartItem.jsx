import { useState, useEffect } from "react"
import { Button } from "../ui/Button"
import { Card, CardContent } from "../ui/Card"
import { Minus, Plus, Trash2 } from "lucide-react"
import { deleteCartItem, updateCartItem } from "../../lib/api";

const API_URL = process.env.REACT_APP_API_URL || ""

export function CartItem({ item, setItems }) {
  const [quantity, setQuantity] = useState(item.quantity)

  useEffect(() => {
    setQuantity(item.quantity) // синхронизируем при изменении item
  }, [item.quantity])

  const handleQuantityChange = async (newQty) => {
    try {
      if (newQty <= 0) {
        await deleteCartItem(item.id);
        setItems(prev => prev.filter(i => i.id !== item.id));
      } else {
        const updated = await updateCartItem(item.id, newQty);
        setQuantity(updated.quantity)
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: updated.quantity } : i));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCartItem(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Card className="overflow-hidden bg-background">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={`${API_URL}${item.image_url}` || "/placeholder.svg"}
              alt={item.name}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.name}</h3>
            <p className="text-xl font-bold mb-3">{item.price.toLocaleString()} р.</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="h-8 w-8 border border-gray-200 bg-transparent" onClick={() => handleQuantityChange(item.quantity - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8 border border-gray-200 bg-transparent" onClick={() => handleQuantityChange(item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive-10"
                onClick={handleDelete}
              >
                <Trash2 className="h-5 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}