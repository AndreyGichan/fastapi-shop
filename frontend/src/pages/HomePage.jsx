"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Header } from "../components/Header"
import { HeroSection } from "../components/HeroSection";
import ProductCard from "../components/ProductCard"
import { Button } from "../components/ui/Button"
import Slider from "../components/ui/Slider"
import Checkbox from "../components/ui/Checkbox"
import { Badge } from "../components/ui/Badge"
import { apiFetch } from "../lib/api"
import { useCart } from "../context/CartContext"

const MAX_PRICE = 5000
const brands = [
    { id: "apple", label: "Apple", count: 45 },
    { id: "samsung", label: "Samsung", count: 67 },
    { id: "logitech", label: "Logitech", count: 89 },
    { id: "razer", label: "Razer", count: 34 },
    { id: "asus", label: "ASUS", count: 56 },
]

const HomePage = () => {
    const [categories, setCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState([0, 0])
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("")
    const [sortOrder, setSortOrder] = useState("desc")
    const { cartItems } = useCart()
    const cartCount = cartItems.reduce((sum, i) => sum + (i.quantity || 0), 0)

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/products/categories/`)
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error(err))
    }, [])

    useEffect(() => {
        const params = new URLSearchParams()

        if (search) params.append("search", search)
        if (selectedCategories.length > 0) {
            selectedCategories.forEach(cat => params.append("categories", cat));
        }
        if (priceRange[0]) params.append("min_price", priceRange[0])
        if (priceRange[1]) params.append("max_price", priceRange[1])
        if (sortBy) params.append("sort_by", sortBy)
        if (sortOrder) params.append("sort_order", sortOrder)

        fetch(`${API_URL}/products/?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error(err))
    }, [search, selectedCategories, priceRange, sortBy, sortOrder])

    const handleCategoryChange = (category, checked) => {
        if (checked) {
            setSelectedCategories([...selectedCategories, category])
        } else {
            setSelectedCategories(selectedCategories.filter((c) => c !== category))
        }
    }

    const renderStars = (rating) => {
        return [...Array(rating)].map((_, i) => (
            <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} search={search} setSearch={setSearch} cartCount={cartCount} showSearch={true}/>
            <HeroSection />

            <div className="container mx-auto px-20 py-6">
                <div className="flex gap-6">
                    <aside
                        className={`w-64 space-y-6 h-fit sticky top-24 ${sidebarOpen ? "block" : "hidden md:block"}`}
                    >

                        <Card className="gradient-card border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Категории</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {categories.map((category) => (
                                    <div
                                        key={category}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id={category}
                                                checked={selectedCategories.includes(category)}
                                                onCheckedChange={(checked) =>
                                                    handleCategoryChange(category, checked)
                                                }
                                            />
                                            <label
                                                htmlFor={category}
                                                className="text-sm font-medium cursor-pointer"
                                            >
                                                {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
                                            </label>
                                        </div>
                                        {/* пока нет количества в API → можно убрать */}
                                        {/* <Badge variant="outline" className="text-xs">
                                            {Math.floor(Math.random() * 100)}
                                        </Badge> */}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        {/* Price Range */}
                        <Card className="gradient-card border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Цена</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Slider
                                    value={priceRange}
                                    onValueChange={setPriceRange}
                                    max={MAX_PRICE}
                                    step={10}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{priceRange[0]} р.</span>
                                    <span>{priceRange[1]} р.</span>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Brands */}
                        <Card className="gradient-card border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Бренды</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {brands.map((brand) => (
                                    <div
                                        key={brand.id}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Checkbox id={brand.id} />
                                            <label htmlFor={brand.name} className="text-sm font-medium cursor-pointer">
                                                {brand.label}
                                            </label>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {brand.count}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="mb-6">
                            <h4 className="font-medium mb-3">Рейтинг товара</h4>
                            <div className="space-y-2">
                                {[4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center space-x-2">
                                        <Checkbox id={`rating-${rating}`} />
                                        <label htmlFor={`rating-${rating}`} className="flex items-center text-sm cursor-pointer">
                                            <span className="mr-1">от</span>
                                            <div className="flex">{renderStars(rating)}</div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground">Рекомендуемые товары</h2>
                                <p className="text-muted-foreground mt-2">Лучшие предложения для вас</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className="text-sm">
                                    {`1-24 из 1,000+ товаров`}
                                </Badge>
                                <select
                                    className="border rounded-md px-3 py-1 text-sm"
                                    value={`${sortBy}_${sortOrder}`}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (value === "price_asc") {
                                            setSortBy("price")
                                            setSortOrder("asc")
                                        } else if (value === "price_desc") {
                                            setSortBy("price")
                                            setSortOrder("desc")
                                        } else if (value === "name_asc") {
                                            setSortBy("name")
                                            setSortOrder("asc")
                                        } else if (value === "name_desc") {
                                            setSortBy("name")
                                            setSortOrder("desc")
                                        } else {
                                            setSortBy("")
                                            setSortOrder("desc")
                                        }
                                    }}
                                >
                                    <option value="">Без сортировки</option>
                                    <option value="price_asc">Цена: по возрастанию</option>
                                    <option value="price_desc">Цена: по убыванию</option>
                                    <option value="name_asc">Название: А-Я</option>
                                    <option value="name_desc">Название: Я-А</option>
                                </select>
                            </div>
                        </div>



                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product, idx) => (
                                <ProductCard
                                    key={product.id ?? product._id ?? `${product.name ?? 'product'}-${idx}`}
                                    product={product}
                                />
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <Button variant="outline" className="px-8 bg-transparent">
                                Загрузить еще товары
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default HomePage
