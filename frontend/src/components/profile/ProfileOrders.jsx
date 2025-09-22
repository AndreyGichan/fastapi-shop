import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Package, RotateCcw, Star, ShoppingBag } from "lucide-react";
import { getUserOrders, getProductRating, ChevronDown, ChevronUp } from "../../lib/api";
import { ProductRatingDialog } from "./ProductRatingDialog";

export function ProfileOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortDesc, setSortDesc] = useState(true);
  const [ratingProduct, setRatingProduct] = useState(null);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await getUserOrders();
      sortOrders(userOrders, sortDesc);
    } catch (err) {
      console.error("Ошибка при получении заказов:", err);
      setError("Не удалось загрузить историю заказов");
    } finally {
      setLoading(false);
    }
  };

  const sortOrders = (ordersList, desc) => {
    const sorted = [...ordersList].sort((a, b) =>
      desc
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );
    setOrders(sorted);
  };

  const toggleSort = () => {
    setSortDesc((prev) => {
      const newValue = !prev;
      sortOrders(orders, newValue);
      return newValue;
    });
  };

  const toggleOrderExpanded = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, expanded: !order.expanded } : order
      )
    );
  };

  const handleRateProduct = (item) => {
    setRatingProduct({
      ...item,
      productId: item.product_id,
    });
    setIsRatingDialogOpen(true);
  };

  const handleSubmitRating = ({ productId, rating }) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => ({
        ...order,
        items: order.items.map((item) =>
          item.product_id === productId
            ? { ...item, product: { ...item.product, rating } }
            : item
        ),
      }))
    );

    setIsRatingDialogOpen(false);
    setRatingProduct(null);
  };

  const handleCloseRatingDialog = () => {
    setIsRatingDialogOpen(false);
    setRatingProduct(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "доставлен":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "отправлен":
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "в обработке":
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
    const date = new Date(isoDate);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const productAlreadyRated = (productId) => {
    for (const order of orders) {
      const item = order.items.find(
        (i) => i.product_id === productId && i.product?.rating > 0
      );
      if (item) return true;
    }
    return false;
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Card className="bg-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              История заказов
            </CardTitle>
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
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-6 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-lg">№{order.id}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {capitalize(order.status)}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(order.created_at)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Товары в заказе ({order.items.length})
                    </span>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 bg-background rounded-lg"
                      >
                        <img
                          src={
                            item.image_url
                              || "/placeholder.svg"
                          }
                          alt={item.name}
                          className="w-20 h-20 object-contain rounded-md bg-white"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-lg text-gray-800">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-4 text-base text-gray-600">
                            <span>Количество: {item.quantity}</span>
                            <span className="font-medium">
                              {item.price.toLocaleString()} р.
                            </span>
                          </div>
                        </div>

                        {order.status?.toLowerCase() === "доставлен" &&
                          !productAlreadyRated(item.product_id) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleRateProduct({
                                  ...item,
                                  id: item.product_id,
                                })
                              }
                              className="gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:from-yellow-100 hover:to-orange-100 text-black hover:text-black"
                            >
                              <Star className="h-4 w-4 text-yellow-500" />
                              Оценить
                            </Button>
                          )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="font-semibold text-lg">
                    {order.total_price.toLocaleString()} р.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ProductRatingDialog
        isOpen={isRatingDialogOpen}
        onClose={handleCloseRatingDialog}
        product={ratingProduct}
        onSubmitRating={handleSubmitRating}
      />
    </>
  );
}
