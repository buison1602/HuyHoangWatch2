"use client"

import { Suspense } from "react"
import { SignUpForm } from "./sign-up-form"

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  )
}
