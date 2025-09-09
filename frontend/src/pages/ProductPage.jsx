"use client"
import { useParams } from "react-router-dom"
import { Header } from "../components/Header"

const ProductPage = () => {
    const { id } = useParams()

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold">Product Details - ID: {id}</h1>
                <p className="text-gray-600 mt-2">Product page content will be implemented here.</p>
            </div>
        </div>
    )
}

export default ProductPage
