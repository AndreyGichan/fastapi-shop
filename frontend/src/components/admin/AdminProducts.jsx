'use client'

import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { Label } from "../ui/Label"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { getProductsForAdmin } from "../../lib/api";
import { useToast } from "../ui/useToast";
import { ProductEditDialog } from "./ProductEditDialog"



const API_URL = process.env.REACT_APP_API_URL || "";

export function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();


    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [isReadOnly, setIsReadOnly] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const data = await getProductsForAdmin();
                setProducts(data);
            } catch (err) {
                console.error("Ошибка загрузки товаров:", err);
                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить список товаров",
                    variant: "destructive",
                });
            }
        }
        fetchProducts();
    }, [toast]);

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setIsReadOnly(true);
        setEditDialogOpen(true);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product)
        setEditDialogOpen(true)
        setIsReadOnly(false);
    }

    const handleAddProduct = () => {
        setSelectedProduct(null)
        setEditDialogOpen(true)
        setIsReadOnly(false)
    }

    const handleSaveProduct = (updatedProduct) => {
        if (selectedProduct) {
            // Update existing product
            setProducts(products.map(p => (p.id === updatedProduct.id ? updatedProduct : p)))
        } else {
            // Add new product
            const newProduct = { ...updatedProduct, id: Math.max(...products.map(p => p.id)) + 1 }
            setProducts([...products, newProduct])
        }
        setEditDialogOpen(false)
    }

    const handleDeleteProduct = (productId) => {
        if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
            setProducts(products.filter(p => p.id !== productId))
        }
    }

    const filteredProducts = products.filter(
        product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold px-8">Управление товарами</h2>
                <Button className="gap-2 bg-gradient-to-r from-purple-800 to-purple-950 hover:from-purple-700 hover:to-purple-900" onClick={handleAddProduct}>
                    <Plus className="h-4 w-4" />
                    Добавить товар
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Поиск товаров..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="space-y-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Card key={product.id} className="bg-background">
                            <CardContent className="p-8">
                                <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2 mb-3 ">
                                    {product.name}
                                    <Badge variant={product.quantity > 0 ? "default" : "destructive"}
                                        className={
                                            product.quantity > 0
                                                ? "bg-gradient-to-r from-purple-800 to-purple-950"
                                                : ""
                                        }
                                    >
                                        {product.quantity > 0 ? "В наличии" : "Нет в наличии"}
                                    </Badge>
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 bg-background rounded-lg flex items-center justify-center">
                                        <img
                                            src={product.image_url ? `${API_URL}${product.image_url}` : "/placeholder.svg"}
                                            alt={product.name}
                                            className="w-full h-full object-contain rounded"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex flex-col gap-2 mt-2">
                                            <span className="font-medium text-xl px-3">{product.price} р.</span>
                                            <span className="text-sm text-muted-foreground px-3">
                                                Остаток: {product.quantity} шт.
                                            </span>

                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-md" onClick={() => handleViewProduct(product)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-md" onClick={() => handleEditProduct(product)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-md" onClick={() => handleDeleteProduct(product.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground">Нет товаров</p>
                )}
            </div>

            <ProductEditDialog
                product={selectedProduct}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSave={handleSaveProduct}
                readOnly={isReadOnly}
            />

        </div>
    );
}
