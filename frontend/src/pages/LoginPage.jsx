import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/auth";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Header } from "../components/Header";
import { LoginForm } from "../components/auth/LoginForm";
import { Button } from "../components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login({ email, password });
            navigate("/");
        } catch (err) {
            setError(err.message || "Ошибка логина");
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              На главную
            </Button>
          </Link>
        </div>

        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}