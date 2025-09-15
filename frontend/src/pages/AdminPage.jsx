'use client'

import { Header } from "../components/Header";
import { AdminProducts } from "../components/admin/AdminProducts";
import { AdminUsers } from "../components/admin/AdminUsers";
import { AdminOrders } from "../components/admin/AdminOrders";
import { AdminStats } from "../components/admin/AdminStats";
import { Button } from "../components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ArrowLeft, Shield, Settings, BarChart3, Users, Package, ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-lg gradient-header from-slate-900 via-purple-900 to-slate-900 p-4 mb-6">
              {/* Gradient overlay */}
              <div className="relative flex items-center gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2 tracking-tight px-4">Админ-панель</h1>
                </div>
              </div>
            </div>

            <Tabs defaultValue="products" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-[var(--input-bg)]">
                <TabsTrigger value="products">Товары</TabsTrigger>
                <TabsTrigger value="users">Пользователи</TabsTrigger>
                <TabsTrigger value="orders">Заказы</TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="space-y-6">
                <AdminProducts />
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <AdminUsers />
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <AdminOrders />
              </TabsContent>
            </Tabs>
          </div>

          {/* Admin Stats */}
          <div className="lg:col-span-1">
            <AdminStats />
          </div>
        </div>
      </main>
    </div>
  );
}
