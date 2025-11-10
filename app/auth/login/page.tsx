"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/shop"

  // Đăng nhập bằng email / mật khẩu
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("/n/n data = ", data.user?.id, " /n/n")

      if (error) throw error

      let currentUserId = data.user?.id

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", currentUserId)
        .single()

      if (profile?.is_admin == true) {
        router.push("/admin")
      }
      else {
        // Redirect về trang được yêu cầu hoặc /shop
        router.push(redirectTo)
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  // Đăng nhập với Google
  const handleGoogleLogin = async () => {
    const supabase = createClient()
    setIsGoogleLoading(true)
    setError(null)

    try {
      // redirectTo: sau khi Google login xong sẽ quay về callback để xử lý session
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
            : undefined,
        },
      })

      if (error) throw error
      // Lưu ý: signInWithOAuth sẽ tự redirect sang Google,
      // nên đoạn dưới thường sẽ không chạy cho tới khi quay lại app.
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Không thể đăng nhập bằng Google")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Đăng nhập</CardTitle>
            <CardDescription>
              Điền Email và Mật khẩu để đăng nhập
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">
                    {error}
                  </p>
                )}

                {/* Nút đăng nhập thường */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>

                {/* hoặc dùng <Separator /> nếu bạn có component Separator trong UI lib */}
                <div className="text-center text-xs uppercase text-muted-foreground">
                  <span>hoặc</span>
                </div>

                {/* Nút đăng nhập với Google */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Image
                    src="/images/design-mode/g-logo.png"
                    alt="Google logo"
                    width={18}
                    height={18}
                  />
                  <span>
                    {isGoogleLoading
                      ? "Đang chuyển tới Google..."
                      : "Đăng nhập với Google"}
                  </span>
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                Bạn chưa có tài khoản?{" "}
                <Link
                  href={`/auth/sign-up${redirectTo !== "/shop" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
                  className="underline underline-offset-4"
                >
                  Đăng ký
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
