"use client"

import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export function Header({ sidebarOpen, setSidebarOpen, search, setSearch, showSearch = false }) {
  const { isAuthenticated, loading } = useAuth();
  const { cartCount } = useCart();
  if (loading) return null;
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-xl">T</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">TechStore</h1>
          </Link>

          {/* Search Bar */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-lg mx-12">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Поиск товаров..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 py-3 bg-[var(--input-bg)] border-border focus:border-primary transition-all duration-200 rounded-xl text-base"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 text-foreground hover:bg-[var(--input-bg)] hover:text-primary transition-colors rounded-xl relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Корзина</span>
              </Button>
            </Link>
            {isAuthenticated && (
              <Link to="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 text-foreground hover:bg-[var(--input-bg)] hover:text-primary transition-colors rounded-xl"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Профиль</span>
                </Button>
              </Link>
            )}

            {!isAuthenticated && (
              <Link to="/login">
                <Button variant="ghost"
                  className="text-foreground hover:bg-[var(--input-bg)] hover:text-primary transition-colors rounded-xl"
                >Войти
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-11 w-11 text-foreground hover:bg-[var(--input-bg)] hover:text-primary transition-colors rounded-xl"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Меню</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
