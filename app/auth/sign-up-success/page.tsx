import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Kiếm tra Email của bạn</CardTitle>
            <CardDescription>Chúng tôi đã gửi cho bạn một liên kết xác nhận</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Vui lòng kiểm tra email và nhấp vào liên kết xác nhận để kích hoạt tài khoản của bạn.
              </p>
              <Link href="/auth/login">
                <Button className="w-full">Quay lại Đăng nhập</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
