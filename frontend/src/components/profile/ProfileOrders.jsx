import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Package, Eye, RotateCcw } from "lucide-react";
import { getUserOrders } from "../../lib/api";

// const orders = [
//   {
//     id: "#12345",
//     date: "15 декабря 2024",
//     status: "Доставлен",
//     total: 3350,
//     items: ["Ноутбук ASUS ExpertBook", "Клавиатура Royal Kludge"],
//   },
//   {
//     id: "#12344",
//     date: "10 декабря 2024",
//     status: "В пути",
//     total: 850,
//     items: ["Игровой монитор Xiaomi"],
//   },
//   {
//     id: "#12343",
//     date: "5 декабря 2024",
//     status: "Обработка",
//     total: 4890,
//     items: ["MacBook Pro 14", "AirPods Pro"],
//   },
// ];

export function ProfileOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await getUserOrders();
      setOrders(userOrders);
    } catch (err) {
      console.error("Ошибка при получении заказов:", err);
      setError("Не удалось загрузить историю заказов");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "доставлен":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "отправлен":
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "обрабатывается":
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "отменен":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }


  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          История заказов
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">№{order.id}</span>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">{formatDate(order.created_at)}</span>
              </div>

              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-1">Товары:</p>
                <p className="text-sm">
                  {order.items.map((item) => item.name).join(", ")}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold">{order.total_price} р.</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-md">
                    <Eye className="h-4 w-4" />
                    Подробнее
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}