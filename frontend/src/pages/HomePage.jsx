"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import ProductCard from "../components/ProductCard"
import Button from "../components/ui/Button"
import Slider from "../components/ui/Slider"
import Checkbox from "../components/ui/Checkbox"

const MAX_PRICE = 5000

const HomePage = () => {
    const [categories, setCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState([0, 0])
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("")
    const [sortOrder, setSortOrder] = useState("desc")

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
        <div className="min-h-screen bg-gray-50">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} search={search} setSearch={setSearch} />


            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    <aside
                        className={`w-64 bg-white border border-gray-200 rounded-lg p-6 h-fit sticky top-24 ${sidebarOpen ? "block" : "hidden md:block"}`}
                    >

                        <h3 className="font-semibold mb-4">Фильтры</h3>

                        <div className="mb-6">
                            <h4 className="font-medium mb-3">Категории</h4>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div key={category} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={category}
                                            checked={selectedCategories.includes(category)}
                                            onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                                        />
                                        <label htmlFor={category} className="text-sm cursor-pointer">
                                            {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-medium mb-3">Цена</h4>
                            <Slider value={priceRange} onValueChange={setPriceRange} max={MAX_PRICE} step={10} className="mb-2" />
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>{priceRange[0]} р.</span>
                                <span>{priceRange[1]} р.</span>
                            </div>
                        </div>

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
                            <h2 className="text-2xl font-semibold">Рекомендуемые товары</h2>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">1-24 of 1,000+ results</span>
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
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <Button variant="outline" className="px-8 bg-transparent">
                                Load More Products
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default HomePage
