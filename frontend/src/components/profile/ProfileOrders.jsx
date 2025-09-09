import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Package, Eye, RotateCcw } from "lucide-react";

const orders = [
  {
    id: "#12345",
    date: "15 декабря 2024",
    status: "Доставлен",
    total: 3350,
    items: ["Ноутбук ASUS ExpertBook", "Клавиатура Royal Kludge"],
  },
  {
    id: "#12344",
    date: "10 декабря 2024",
    status: "В пути",
    total: 850,
    items: ["Игровой монитор Xiaomi"],
  },
  {
    id: "#12343",
    date: "5 декабря 2024",
    status: "Обработка",
    total: 4890,
    items: ["MacBook Pro 14", "AirPods Pro"],
  },
];

export function ProfileOrders() {
  const getStatusColor = (status) => {
    switch (status) {
      case "Доставлен":
        return "bg-green-100 text-green-800";
      case "В пути":
        return "bg-blue-100 text-blue-800";
      case "Обработка":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          История заказов
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{order.id}</span>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">{order.date}</span>
              </div>

              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-1">Товары:</p>
                <p className="text-sm">{order.items.join(", ")}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold">{order.total} ₽</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Eye className="h-4 w-4" />
                    Подробнее
                  </Button>
                  {order.status === "Доставлен" && (
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <RotateCcw className="h-4 w-4" />
                      Повторить
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}