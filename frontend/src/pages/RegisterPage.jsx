import { Header } from "../components/Header";
import { RegisterForm } from "../components/auth/RegisterForm";
import { Button } from "../components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-20 py-4">
        <div className="flex items-center gap-2 mb-2">
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
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}
