"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Input } from "../ui/Input"
import Checkbox from "../ui/Checkbox"
import { CreditCard, Truck, MapPin, User } from "lucide-react"

export function CheckoutForm() {
  const [deliveryMethod, setDeliveryMethod] = useState("courier")
  const [paymentMethod, setPaymentMethod] = useState("card")

  return (
    <div className="space-y-6">
      {/* Контактная информация */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Контактная информация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Имя *</label>
              <Input placeholder="Введите ваше имя" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Фамилия *</label>
              <Input placeholder="Введите вашу фамилию" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Телефон *</label>
              <Input placeholder="+7 (999) 999-99-99" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email *</label>
              <Input type="email" placeholder="example@mail.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Способ доставки */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Способ доставки
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
              onClick={() => setDeliveryMethod("courier")}
            >
              <Checkbox checked={deliveryMethod === "courier"} onChange={() => setDeliveryMethod("courier")} />
              <div className="flex-1">
                <div className="font-medium">Курьерская доставка</div>
                <div className="text-sm text-muted-foreground">1-2 дня, 20 р. (бесплатно от 1000 р.)</div>
              </div>
            </div>

            <div
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
              onClick={() => setDeliveryMethod("pickup")}
            >
              <Checkbox checked={deliveryMethod === "pickup"} onChange={() => setDeliveryMethod("pickup")} />
              <div className="flex-1">
                <div className="font-medium">Самовывоз</div>
                <div className="text-sm text-muted-foreground">Сегодня, бесплатно</div>
              </div>
            </div>
          </div>

          {deliveryMethod === "courier" && (
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Адрес доставки
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Город *</label>
                  <Input placeholder="Москва" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Индекс</label>
                  <Input placeholder="123456" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Улица, дом, квартира *</label>
                <Input placeholder="ул. Примерная, д. 1, кв. 1" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Комментарий к заказу</label>
                <Input placeholder="Дополнительная информация для курьера" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Способ оплаты */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Способ оплаты
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
              onClick={() => setPaymentMethod("card")}
            >
              <Checkbox checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
              <div className="flex-1">
                <div className="font-medium">Банковская карта</div>
                <div className="text-sm text-muted-foreground">Visa, MasterCard, МИР</div>
              </div>
            </div>

            <div
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
              onClick={() => setPaymentMethod("cash")}
            >
              <Checkbox checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} />
              <div className="flex-1">
                <div className="font-medium">Наличными при получении</div>
                <div className="text-sm text-muted-foreground">Оплата курьеру или в пункте выдачи</div>
              </div>
            </div>
          </div>

          {paymentMethod === "card" && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Номер карты *</label>
                  <Input placeholder="1234 5678 9012 3456" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Срок действия *</label>
                  <Input placeholder="MM/YY" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">CVV *</label>
                  <Input placeholder="123" type="password" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Согласие */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Checkbox />
            <div className="text-sm text-muted-foreground">
              Я согласен с{" "}
              <a href="#" className="text-primary hover:underline">
                условиями использования
              </a>{" "}
              и
              <a href="#" className="text-primary hover:underline ml-1">
                политикой конфиденциальности
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
