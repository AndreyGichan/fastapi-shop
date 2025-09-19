import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Checkbox from "../ui/Checkbox";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../lib/auth";
import { login } from "../../lib/auth";
import { useAuth } from "../../context/AuthContext";

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
        subscribeToNews: false,
    });
    const { setIsAuthenticated, setUserRole } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Пароли не совпадают");
            return;
        }

        try {
            const newUser = await register({
                username: formData.firstName,
                last_name: formData.lastName || null,
                email: formData.email,
                password: formData.password,
            });

            console.log("Успешная регистрация:", newUser);

            const loginData = await login({
                email: formData.email,
                password: formData.password,
            });

            setIsAuthenticated(true);
            setUserRole(loginData.role || null);

            if (loginData.role === "admin") navigate("/admin");
            else navigate("/");
        } catch (err) {
            console.error("Ошибка регистрации:", err.message);
            alert(err.message);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Card className="w-full bg-background">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
                <p className="text-muted-foreground">Создайте аккаунт в TechStore</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="text-sm font-medium px-4">
                                Имя
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="Иван"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    className="pl-10 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-md"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="lastName" className="text-sm font-medium px-4">
                                Фамилия
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Иванов"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    className="pl-10 border border-gray-100 focus:border-primary focus:ring-1 focus:ring-primary rounded-md"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground italic px-4">* это поле необязательно</p>
                        </div>
                    </div>

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
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
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
                                placeholder="Минимум 8 символов"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                className="pl-10 pr-10 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-md"
                                required
                                minLength={8}
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

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium px-4">
                            Подтвердите пароль
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Повторите пароль"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                className="mb-3 pl-10 pr-10 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-md"
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-800 to-purple-950 hover:from-purple-700 hover:to-purple-900">
                        Зарегистрироваться
                    </Button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Уже есть аккаунт?{" "}
                        <Link to="/login" className="text-primary hover:underline">
                            Войти
                        </Link>
                    </p>
                </div>


            </CardContent>
        </Card>
    );
}
