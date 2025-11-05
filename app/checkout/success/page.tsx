import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Đơn hàng đã được đặt thành công</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Cảm ơn bạn đã đặt hàng! Chúng tôi đã nhận được thông tin thanh toán của bạn. Đội ngũ của chúng tôi sẽ xác minh chuyển khoản ngân hàng và xác nhận đơn hàng của bạn trong thời gian sớm nhất.
            </p>
            <p className="text-sm text-muted-foreground">
              Bạn sẽ nhận được email xác nhận với thông tin chi tiết đơn hàng và thông tin theo dõi sau khi thanh toán được xác minh.
            </p>
            <Link href="/shop">
              <Button className="w-full bg-[#9f1d25] hover:bg-[#8a1920]">Tiếp tục mua sắm</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
