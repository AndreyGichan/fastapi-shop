import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Checkbox from "../ui/Checkbox";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../lib/auth";
import { useAuth } from "../../context/AuthContext";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { setIsAuthenticated, setUserRole } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login({ email, password });

      setIsAuthenticated(true);
      setUserRole(data.role || null);

      if (data.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      setError(err.message || "Ошибка логина");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card className="w-full bg-background">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Вход в аккаунт</CardTitle>
        <p className="text-muted-foreground">Войдите в свой аккаунт TechStore</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium px-4">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-md"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium px-4">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-3 pl-10 pr-10 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-md"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>


          <Button type="submit" className="w-full bg-gradient-to-r from-purple-800 to-purple-950 hover:from-purple-500 hover:to-purple-800" disabled={loading}>
            {loading ? "Входим..." : "Войти"}
          </Button>

          {/* Ошибка */}
          {error && <div className="text-red-600 text-sm text-center mt-2">{error}</div>}
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
