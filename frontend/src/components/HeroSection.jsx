import { Button } from "./ui/Button"
import { ArrowRight, Zap, Shield, Truck } from "lucide-react"

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-background bg-gray-50">
            <div className="absolute inset-0 tech-grid opacity-5 "></div>
            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <h2 className="text-6xl font-bold text-balance leading-tight">
                                Премиальные <span className="text-gradient">технологии</span> для профессионалов
                            </h2>
                            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                                Тщательно отобранные устройства и аксессуары от ведущих мировых производителей для тех, кто ценит
                                качество
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg rounded-xl emerald-glow hover:shadow-lg transition-all duration-300 group"
                            >
                                Исследовать каталог
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 px-8 py-4 text-lg rounded-xl bg-transparent transition-all duration-300"
                            >
                                Узнать больше
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-8 pt-12">
                            <div className="text-center space-y-3 group">
                                <div className="w-16 h-16 bg-[var(--input-bg)] rounded-2xl flex items-center justify-center mx-auto border border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
                                    <Zap className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
                                </div>
                                <p className="text-sm font-semibold text-card-foreground">Молниеносная доставка</p>
                            </div>
                            <div className="text-center space-y-3 group">
                                <div className="w-16 h-16 bg-[var(--input-bg)] rounded-2xl flex items-center justify-center mx-auto border border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
                                    <Shield className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
                                </div>
                                <p className="text-sm font-semibold text-card-foreground">Расширенная гарантия</p>
                            </div>
                            <div className="text-center space-y-3 group">
                                <div className="w-16 h-16 bg-[var(--input-bg)] rounded-2xl flex items-center justify-center mx-auto border border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
                                    <Truck className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
                                </div>
                                <p className="text-sm font-semibold text-card-foreground">Бесплатная доставка</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square gradient-card rounded-3xl p-6 border border-primary/10 shadow-lg relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img
                                src="/modern-tech-setup.jpg"
                                alt="Инновационные технологии"
                                className="w-full h-full object-cover rounded-2xl relative z-10 group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}
