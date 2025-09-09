import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Separator } from "../ui/Separator";
import { Settings, Bell, Shield, CreditCard, LogOut, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProfileSettings() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Очистка данных авторизации
        localStorage.removeItem("token"); // или ключ, где хранится информация о пользователе
        // Можно очистить все: localStorage.clear();

        // Перенаправление на страницу входа
        navigate("/login");
    };
    return (
        <div className="space-y-6">
            {/* Account Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Статистика</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Всего заказов</span>
                        <span className="font-semibold">24</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Потрачено</span>
                        <span className="font-semibold">89 450 ₽</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Бонусы</span>
                        <span className="font-semibold text-primary">1 247 ₽</span>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        Настройки
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-3">
                        <Bell className="h-4 w-4" />
                        Уведомления
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                        <Shield className="h-4 w-4" />
                        Безопасность
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                        <CreditCard className="h-4 w-4" />
                        Способы оплаты
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                        <Gift className="h-4 w-4" />
                        Бонусная программа
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
    );
}