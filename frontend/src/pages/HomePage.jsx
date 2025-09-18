"use client"

import { useState, useEffect, useRef } from "react"
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


const API_URL = process.env.REACT_APP_API_URL;
const LIMIT = 12
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
    const [minRating, setMinRating] = useState(0)
    const { cartItems } = useCart()
    const cartCount = cartItems.reduce((sum, i) => sum + (i.quantity || 0), 0)
    const productsRef = useRef(null);
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [selectedRatings, setSelectedRatings] = useState([]);


    useEffect(() => {
        fetch(`${API_URL}/products/categories`)
            .then((res) => res.json())
            .then(data => {
                setCategories(data)
            })
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
        if (minRating) params.append("min_rating", minRating)


        params.append("limit", LIMIT.toString())
        params.append("page", page.toString())

        fetch(`${API_URL}/products/?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                const items = Array.isArray(data) ? data : data.items || []

                const filteredItems = items.filter(product =>
                    product.quantity > 0 &&
                    (selectedRatings.length === 0 || selectedRatings.some(r => product.average_rating >= r))
                );

                setProducts(filteredItems);
                setHasMore(filteredItems.length === LIMIT);

            })

            .catch((err) => console.error(err))
    }, [search, selectedCategories, priceRange, minRating, sortBy, sortOrder, page, selectedRatings])

    useEffect(() => {
        setPage(1)
    }, [search, selectedCategories, priceRange, sortBy, sortOrder])

    const handleSortChange = (e) => {
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
        } else if (value === "rating_desc") {
            setSortBy("average_rating")
            setSortOrder("desc")
        } else {
            setSortBy("")
            setSortOrder("desc")
        }
        setPage(1)
    }


    const handleCategoryChange = (category, checked) => {
        if (checked) {
            setSelectedCategories([...selectedCategories, category])
        } else {
            setSelectedCategories(selectedCategories.filter((c) => c !== category))
        }
        setPage(1)
    }

    const handleRatingChange = (rating, checked) => {
        if (checked) {
            setSelectedRatings([...selectedRatings, rating]);
        } else {
            setSelectedRatings(selectedRatings.filter(r => r !== rating));
        }
        setPage(1);
    };

    const resetFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, 0]);
        setSelectedRatings([]);
        setSortBy("");
        setSortOrder("desc");
        setMinRating(0);
        setPage(1);
    };


    const renderStars = (rating) => {
        return [...Array(rating)].map((_, i) => (
            <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))
    }

    const scrollToProducts = () => {
        if (productsRef.current) {
            productsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} search={search} setSearch={setSearch} cartCount={cartCount} showSearch={true} />
            <HeroSection onExplore={scrollToProducts} />

            <div className="container mx-auto px-20 py-6">
                <div className="flex gap-6">
                    <aside
                        className={`w-64 space-y-6 h-fit sticky top-24 ${sidebarOpen ? "block" : "hidden md:block"}`}
                    >

                        <Card className="gradient-card border-0 shadow-[0_0_07px_rgba(0,0,0,0.2)]">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Категории</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {categories.map((category) => (
                                    <div
                                        key={category.name}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id={category.name}
                                                checked={selectedCategories.includes(category.name)}
                                                onCheckedChange={(checked) =>
                                                    handleCategoryChange(category.name, checked)
                                                }
                                            />
                                            <label
                                                htmlFor={category.name}
                                                className="text-sm font-medium cursor-pointer"
                                            >
                                                {category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}
                                            </label>
                                        </div>
                                        <Badge variant="outline" className="text-xs bg-[var(--input-bg)] text-primary">
                                            {category.count}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card className="gradient-card border-0 shadow-[0_0_07px_rgba(0,0,0,0.2)]">
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

                        <Card className="gradient-card border-0 shadow-[0_0_07px_rgba(0,0,0,0.2)]">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Рейтинг товара</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`rating-${rating}`}
                                            checked={selectedRatings.includes(rating)}
                                            onCheckedChange={(checked) => handleRatingChange(rating, checked)}
                                        />
                                        <label htmlFor={`rating-${rating}`} className="flex items-center text-sm cursor-pointer">
                                            <span className="mr-1">от</span>
                                            <div className="flex">{renderStars(rating)}</div>
                                        </label>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Button
                            onClick={resetFilters}
                            className="w-full bg-gradient-to-r from-purple-800 to-purple-950 hover:from-purple-700 text-white px-4 py-2 rounded-lg shadow-md text-sm font-medium transition-all"
                        >
                            Сбросить фильтры
                        </Button>
                    </aside>

                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground">Рекомендуемые товары</h2>
                                <p className="text-muted-foreground mt-2">Лучшие предложения для вас</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <select
                                    className="bg-gradient-to-r from-purple-800 to-purple-950 text-white 
             px-4 py-2 rounded-xl shadow-md text-sm font-medium 
             hover:from-purple-700 hover:to-purple-900 transition-all 
             focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={sortBy === "average_rating" ? "rating_desc" : `${sortBy}_${sortOrder}`}
                                    onChange={handleSortChange}
                                >
                                    <option value="" className="text-black">Без сортировки</option>
                                    <option value="price_asc" className="text-black">Цена: по возрастанию</option>
                                    <option value="price_desc" className="text-black">Цена: по убыванию</option>
                                    <option value="name_asc" className="text-black">Название: А-Я</option>
                                    <option value="name_desc" className="text-black">Название: Я-А</option>
                                    <option value="rating_desc" className="text-black">Рейтинг: по убыванию</option>
                                </select>
                            </div>
                        </div>


                        <div ref={productsRef} className="grid justify-center gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, 250px)', scrollMarginTop: '195px' }}>

                            {products
                                .filter((product) => product.quantity > 0)
                                .map((product, idx) => (
                                    <ProductCard
                                        key={product.id ?? product._id ?? `${product.name ?? 'product'}-${idx}`}
                                        product={product}
                                    />
                                ))}
                        </div>

                        <div className="flex justify-center gap-4 mt-8">
                            <Button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="bg-gradient-to-r from-purple-800 to-purple-950 hover:from-purple-700 hover:to-purple-900 transition-colors"
                                disabled={page === 1}
                            >
                                Предыдущая
                            </Button>
                            <span className="self-center text-sm text-gray-600">
                                Страница {page}
                            </span>
                            <Button
                                onClick={() => setPage((p) => p + 1)}
                                className="bg-gradient-to-r from-purple-800 to-purple-950 hover:from-purple-700 hover:to-purple-900 transition-colors"
                                disabled={!hasMore}
                            >
                                Следующая
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default HomePage
