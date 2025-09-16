import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { Search, Mail, Phone, Edit, Eye, Trash2 } from "lucide-react";
import { getUsersForAdmin, getUsersStats } from "../../lib/api";
import { useToast } from "../ui/useToast";
import { UserEditDialog } from "./UserEditDialog";

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersWithStats = await getUsersStats();
        setUsers(usersWithStats);
      } catch (err) {
        console.error("Ошибка загрузки пользователей:", err);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список пользователей",
          variant: "destructive",
        });
      }
    }
    fetchUsers();
  }, [toast]);

  const filteredUsers = users.filter((user) =>
    (user?.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
    setIsReadOnly(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
    setIsReadOnly(false);
  };

  const handleSaveUser = (updatedUser) => {
    if (selectedUser) {
      setUsers(users.map((u) =>
        u.id === updatedUser.id ? { ...u, ...updatedUser } : u
      ));
    } else {
      // добавляем нового (если нужно)
      const newUser = {
        ...updatedUser,
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        orders: 0,
        totalSpent: 0,
      };
      setUsers([...users, newUser]);
    }
    setEditDialogOpen(false);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold px-8">Управление пользователями</h2>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Поиск пользователей..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length === 0 && (
          <p className="text-center text-muted-foreground">Нет пользователей</p>
        )}

        {filteredUsers.map((user) => {
          const initials = (user?.username || "")
            .split(" ")
            .map((n) => n[0].toUpperCase())
            .join("");

          return (
            <Card key={user?.id} className="bg-background">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Аватар */}
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {initials}
                    </span>
                  </div>

                  {/* Инфо */}
                  <div className="flex-1">
                    <h3 className="font-semibold">{user?.username || "Без имени"} {user?.last_name || ""}</h3>
                    <p className="text-sm text-muted-foreground">ID: {user?.id}</p>


                    {/* Контакты */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user?.email || "-"}
                      </div>
                      {user?.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      )}
                    </div>

                    {/* Статистика */}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm">Заказов: {user?.orders ?? 0}</span>
                      <span className="text-sm">
                        Потрачено: {(user?.totalSpent ?? 0).toLocaleString()} р.
                      </span>
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-md" onClick={() => handleViewUser(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-md"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-md" onClick={() => handleDeleteUser(user.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User Edit Dialog */}
      <UserEditDialog
        user={selectedUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveUser}
        readOnly={isReadOnly}
      />
    </div>
  );
}
