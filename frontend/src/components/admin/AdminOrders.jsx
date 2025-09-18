import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { Search, Package, Eye, Edit, RotateCcw } from "lucide-react";
import { getOrdersForAdmin } from "../../lib/api";
import { useToast } from "../ui/useToast";
import { OrderStatusDialog } from "./OrderStatusDialog";

const statusColors = {
    processing: "bg-yellow-100 text-yellow-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
    processing: "Обрабатывается",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменен",
};

function normalizeStatus(status) {
    switch (status.toLowerCase()) {
        case "обрабатывается":
            return "processing";
        case "отправлен":
            return "shipped";
        case "доставлен":
            return "delivered";
        case "отменен":
            return "cancelled";
        default:
            return "processing";
    }
}

export function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingOrder, setEditingOrder] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { toast } = useToast();
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [sortDesc, setSortDesc] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await getOrdersForAdmin();
                const ordersData = data || [];
                sortOrders(ordersData, sortDesc);
            } catch (err) {
                console.error(err);
                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить заказы",
                    variant: "destructive",
                });
            }
        }
        fetchOrders();
    }, [toast, sortDesc]);

    const sortOrders = (ordersList, desc) => {
        const sorted = [...ordersList].sort((a, b) =>
            desc
                ? new Date(b.created_at) - new Date(a.created_at)
                : new Date(a.created_at) - new Date(b.created_at)
        );
        setOrders(sorted);
    };

    const toggleSort = () => {
        setSortDesc(prev => {
            const newValue = !prev;
            sortOrders(orders, newValue);
            return newValue;
        });
    };


    const filteredOrders = orders.filter((order) =>
        String(order.id).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const handleViewOrder = (order) => {
        setEditingOrder(order);
        setIsEditDialogOpen(true);
        setIsReadOnly(true);
    };

    const handleEditOrder = (order) => {
        setEditingOrder(order);
        setIsEditDialogOpen(true);
        setIsReadOnly(false);
    };


    const handleSaveOrder = (updatedOrder) => {
        setOrders((prevOrders) =>
            prevOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        );
        setIsEditDialogOpen(false);
        setEditingOrder(null);
    };


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold px-8">Управление заказами</h2>
                {orders.length > 0 && (
                    <Button
                        onClick={toggleSort}
                        variant="outline"
                        size="sm"
                        className="gap-2 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-md"
                    >
                        <RotateCcw className="h-4 w-4" />
                        {sortDesc ? "Старые сверху" : "Новые сверху"}
                    </Button>
                )}
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Поиск заказов..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>


            <div className="space-y-4">
                {filteredOrders.length === 0 && (
                    <p className="text-center text-muted-foreground">Нет заказов</p>
                )}
                {filteredOrders.map((order) => (
                    <Card key={order.id} className="bg-background">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Package className="h-6 w-6 text-primary" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold">№{order.id}</h3>
                                        <Badge className={statusColors[normalizeStatus(order.status)]}>
                                            {statusLabels[normalizeStatus(order.status)]}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        ID клиента: {order.user_id}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span>Товаров: {order.items?.length ?? 0}</span>
                                        <span className="font-medium">{(order.total_price ?? 0).toLocaleString()} р.</span>
                                        <span className="text-muted-foreground">{formatDate(order.created_at)}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{order.address}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-md" onClick={() => handleViewOrder(order)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" className="border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-md" onClick={() => handleEditOrder(order)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <OrderStatusDialog
                order={editingOrder}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onSave={handleSaveOrder}
                readOnly={isReadOnly}
            />
        </div>
    );
}
