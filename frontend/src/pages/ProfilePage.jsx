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
        <div className="min-h-screen bg-gray-100">
            <Header />

            <main className="container mx-auto px-20 py-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-4">
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
                        <div className="relative overflow-hidden rounded-lg gradient-header from-slate-900 via-purple-900 to-slate-900 p-4 mb-7">
                            <div className="relative flex items-center gap-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-white mb-2 tracking-tight px-6">Профиль</h1>
                                </div>
                            </div>
                        </div>
                        {/* <h1 className="text-3xl font-bold mb-6">Профиль</h1> */}

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