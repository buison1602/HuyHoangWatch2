"use client"

import { Suspense } from "react"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
