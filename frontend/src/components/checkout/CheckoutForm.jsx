"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Input } from "../ui/Input"
import Checkbox from "../ui/Checkbox"
import { CreditCard, Truck, MapPin, User, Phone } from "lucide-react"
import InputMask from "react-input-mask"

export function CheckoutForm({ address, setAddress, phone, setPhone }) {
  const [deliveryMethod, setDeliveryMethod] = useState("courier")
  const [paymentMethod, setPaymentMethod] = useState("card")

  return (
    <div className="space-y-6">
      <Card className="bg-background">
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
              <Checkbox checked={deliveryMethod === "courier"} onCheckedChange={() => setDeliveryMethod("courier")} />
              <div className="flex-1">
                <div className="font-medium">Курьерская доставка</div>
                <div className="text-sm text-muted-foreground">1-2 дня, 20 р. (бесплатно от 1000 р.)</div>
              </div>
            </div>

            <div
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
              onClick={() => setDeliveryMethod("pickup")}
            >
              <Checkbox checked={deliveryMethod === "pickup"} onCheckedChange={() => setDeliveryMethod("pickup")} />
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
              <Input placeholder="г. Минск, ул. Примерная, д. 1, кв. 1"
                className="border border-gray-200 rounded-lg p-3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Телефон
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InputMask
            mask="+375 (99) 999-99-99"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maskChar={null}
          >
            {(inputProps, ref) => (
              <Input
                {...inputProps}
                ref={ref}
                placeholder="+375 (29) 999-99-99"
                className="border border-gray-200 rounded-lg p-3"
              />
            )}
          </InputMask>
        </CardContent>
      </Card>

      <Card className="bg-background">
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
              <Checkbox checked={paymentMethod === "card"} onCheckedChange={() => setPaymentMethod("card")} />
              <div className="flex-1">
                <div className="font-medium">Банковская карта</div>
                <div className="text-sm text-muted-foreground">Visa, MasterCard</div>
              </div>
            </div>

            <div
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
              onClick={() => setPaymentMethod("cash")}
            >
              <Checkbox checked={paymentMethod === "cash"} onCheckedChange={() => setPaymentMethod("cash")} />
              <div className="flex-1">
                <div className="font-medium">Наличными при получении</div>
                <div className="text-sm text-muted-foreground">Оплата курьеру или в пункте выдачи</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
