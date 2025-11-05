"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Clock, Facebook } from "lucide-react"

export function ServiceLocations() {
  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg">Địa điểm dịch vụ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Mang đồng hồ của bạn đến trung tâm dịch vụ của chúng tôi để thay pin, đánh bóng, thay mặt kính hoặc vệ sinh và tra dầu chuyên nghiệp.
        </p>

        <div className="space-y-3">
          <div className="flex gap-3">
            <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <p className="font-semibold">Địa chỉ</p>
              <p className="text-sm text-muted-foreground">Đồng hồ Huy Hoàng - Tổ 1 khu phố Khánh Long, Tân Khánh, Thành phố Hồ Chí Minh</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <p className="font-semibold">Số điện thoại</p>
              {/* <p className="text-sm text-muted-foreground">0835978834</p> */}
              <a 
                href="https://zalo.me/0835978834" 
                className="text-sm text-muted-foreground hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                0835978834
              </a>
            </div>
          </div>

          <div className="flex gap-3">
            <Facebook className="h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <p className="font-semibold">Facebook</p>
              <a 
                href="https://www.facebook.com/profile.php?id=100069474111816&mibextid=wwXIfr&rdid=wQzhz0eItySg09OK&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1ANTiMr88r%2F%3Fmibextid%3DwwXIfr#" 
                className="text-sm text-muted-foreground hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Đồng hồ Huy Hoàng
              </a>
            </div>
          </div>

          <div className="flex gap-3">
            <Clock className="h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <p className="font-semibold">Giờ mở cửa</p>
              <p className="text-sm text-muted-foreground">07:00 - 22:00, Thứ 2 - Chủ nhật</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg overflow-hidden border border-primary/10 shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3942.1787940993026!2d106.73944037504492!3d10.987540489174343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTDCsDU5JzE1LjIiTiAxMDbCsDQ0JzMxLjMiRQ!5e1!3m2!1svi!2s!4v1761639144381!5m2!1svi!2s" 
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </CardContent>
    </Card>
  )
}
