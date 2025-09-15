import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { User, Mail, Edit, Key } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser, updateCurrentUser } from "../../lib/api";
import { ProfileEditDialog } from "./ProfileEditDialog"

export function ProfileInfo() {
  const [user, setUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    getCurrentUser()
      .then((data) => setUser(data))
      .catch((err) => console.error("Ошибка загрузки профиля:", err))
  }, [])

  const handleSaveProfile = async (newData) => {
    try {
      const updatedUser = {
        username: newData.firstName,
        last_name: newData.lastName,
        email: newData.email,
      }

      const savedUser = await updateCurrentUser(updatedUser)
      setUser(savedUser)
      setIsEditDialogOpen(false)
      console.log("Данные профиля обновлены:", newData)
    } catch (err) {
      console.error("Ошибка при сохранении:", err)
    }
  }

  if (!user) return <div>Загрузка...</div>;

  return (
    <>
      <Card className="bg-background p-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            Личная информация
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2 bg-primary text-white hover:bg-[var(--accent)]" onClick={() => setIsEditDialogOpen(true)}>
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
              <h3 className="font-semibold text-lg flex gap-2">
                {user.username}
                {user.last_name && <span className="text-foreground">{user.last_name}</span>}
              </h3>
              <Badge variant="secondary" className="mt-1">
                {user.role === "admin" ? "Администратор" : "Клиент"}
              </Badge>
            </div>
          </div>

          {/* <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <Input value={user.email || ""} className="border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-md" readOnly />
            </div>

          </div> */}
          <div className="flex w-full gap-4">
            <div className="flex flex-col w-1/2 space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <Input
                value={user.email || ""}
                className="border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-md"
                readOnly
              />
            </div>
            <div className="flex items-center w-1/2 text-sm text-muted-foreground justify-end mt-6">
              <p className="text-xs text-muted-foreground whitespace-nowrap"> Чтобы изменить пароль, перейдите в <span className="font-medium">Настройки безопасности</span>. </p>
            </div>
          </div>




        </CardContent>
      </Card>

      <ProfileEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        userData={{
          firstName: user.username,
          lastName: user.last_name,
          email: user.email,
        }}
        onSave={handleSaveProfile}
      />

    </>
  );
}