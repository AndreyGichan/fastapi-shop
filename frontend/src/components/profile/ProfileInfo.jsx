import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { User, Mail, Phone, MapPin, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../lib/api";

export function ProfileInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch((err) => console.error("Ошибка загрузки профиля:", err));
  }, []);
  if (!user) return <div>Загрузка...</div>;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Личная информация
        </CardTitle>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Edit className="h-4 w-4" />
          Редактировать
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{user.username}</h3>
            <Badge variant="secondary" className="mt-1">
              {user.role === "admin" ? "Администратор" : "Клиент"}
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <Input value={user.email || ""} readOnly />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Телефон
            </label>
            <Input value={user.phone || "Не указан"} readOnly />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Адрес доставки
          </label>
          <Input value={user.address || "Не указан"} readOnly />
        </div>
      </CardContent>
    </Card>
  );
}