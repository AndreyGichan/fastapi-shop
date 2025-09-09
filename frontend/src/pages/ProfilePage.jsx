import React from 'react';
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { ProfileInfo } from "../components/profile/ProfileInfo";
import { ProfileOrders } from "../components/profile/ProfileOrders";
import { ProfileSettings } from "../components/profile/ProfileSettings";
import { Button } from "../components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-8">
                    <Link to="/">
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" />
                            На главную
                        </Button>
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Info */}
                    <div className="lg:col-span-2">
                        <h1 className="text-3xl font-bold mb-6">Профиль</h1>

                        <div className="space-y-8">
                            <ProfileInfo />
                            <ProfileOrders />
                        </div>
                    </div>

                    {/* Profile Settings */}
                    <div className="lg:col-span-1">
                        <ProfileSettings />
                    </div>
                </div>
            </main>
        </div>
    );
}