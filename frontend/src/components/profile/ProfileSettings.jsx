import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Separator } from "../ui/Separator";
import { Settings, Bell, Shield, CreditCard, LogOut, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserOrders } from "../../lib/api";
import { SecurityDialog } from "./SecurityDialog"

export function ProfileSettings() {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();

    const [totalOrders, setTotalOrders] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [isSecurityDialogOpen, setIsSecurityDialogOpen] = useState(false)

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const orders = await getUserOrders();
            setTotalOrders(orders.length);

            const spent = orders
                .filter(order => order.status === "доставлен")
                .reduce((acc, order) => acc + (order.total_price || 0), 0);
            setTotalSpent(spent);
        } catch (err) {
            console.error("Ошибка при загрузке статистики:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsAuthenticated(false);
        navigate("/login");
    };
    return (
        <>
            <div className="space-y-6">
                <Card className="bg-background">
                    <CardHeader>
                        <CardTitle className="text-lg">Статистика</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Всего заказов</span>
                            <span className="font-semibold">{totalOrders}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Потрачено</span>
                            <span className="font-semibold">{totalSpent.toLocaleString("ru-RU")} р.</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-background">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-primary" />
                            Настройки
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => setIsSecurityDialogOpen(true)}>
                            <Shield className="h-4 w-4" />
                            Безопасность
                        </Button>

                        <Separator className="my-4" />

                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            Выйти из аккаунта
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <SecurityDialog isOpen={isSecurityDialogOpen} onClose={() => setIsSecurityDialogOpen(false)} />
        </>
    );
}