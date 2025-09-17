import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { TrendingUp, Users, Package, ShoppingCart } from "lucide-react"
import { getUsers, getOrdersForAdmin, getProductsForAdmin } from "../../lib/api";

export function AdminStats() {
  const [sales, setSales] = useState(0);
  const [orders, setOrders] = useState(0);
  const [products, setProducts] = useState(0);
  const [users, setUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);

        const usersData = await getUsers();
        setUsers(Array.isArray(usersData) ? usersData.length : 0);

        const ordersData = await getOrdersForAdmin();

        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        const last30DaysOrders = ordersData.filter(order => {
          const createdAt = new Date(order.created_at);
          return createdAt >= thirtyDaysAgo;
        });

        const deliveredOrders = last30DaysOrders.filter(order => order.status === "доставлен");
        setOrders(deliveredOrders.length);

        const totalSales = deliveredOrders.reduce((sum, order) => sum + (order.total_price || 0), 0);
        setSales(totalSales);

        const productsData = await getProductsForAdmin();
        setProducts(productsData.length || 0);

      } catch (err) {
        console.error("Ошибка при получении статистики:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) return <div>Загрузка статистики...</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Статистика</h3>

      <div className="space-y-4">
        <Card className="bg-background">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Продажи
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.toLocaleString()} р.</div>
            <p className="text-xs text-muted-foreground">за 30 дней</p>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              Заказы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders}</div>
            <p className="text-xs text-muted-foreground">За 30 дней</p>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Товары
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products}</div>
            <p className="text-xs text-muted-foreground">В каталоге</p>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Пользователи
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users}</div>
            <p className="text-xs text-muted-foreground">Зарегистрировано</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
