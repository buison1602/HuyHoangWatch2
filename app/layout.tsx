import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HuyHoangWatch - Đồng Hồ Chính Hãng",
  description: "Cửa hàng đồng hồ Huy Hoàng - Chuyên cung cấp đồng hồ nam, nữ, dây đeo và phụ kiện chính hãng. Giao hàng toàn quốc, bảo hành uy tín.",
  keywords: ["đồng hồ", "đồng hồ nam", "đồng hồ nữ", "dây đeo đồng hồ", "phụ kiện đồng hồ"],
  authors: [{ name: "HuyHoangWatch" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "HuyHoangWatch",
    title: "HuyHoangWatch - Đồng Hồ Chính Hãng",
    description: "Cửa hàng đồng hồ Huy Hoàng - Chuyên cung cấp đồng hồ chính hãng",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "HuyHoangWatch",
              description: "Cửa hàng đồng hồ Huy Hoàng - Chuyên cung cấp đồng hồ chính hãng",
              url: "https://yourwebsite.com",
              logo: "https://yourwebsite.com/logo.png",
              address: {
                "@type": "PostalAddress",
                streetAddress: "41/1H Đinh Bộ Lĩnh, Phường 24, Quận Bình Thạnh",
                addressLocality: "TP. Hồ Chí Minh",
                addressCountry: "VN",
              },
              telephone: "+84907783339",
              email: "huyhoangnew@gmail.com",
              openingHours: ["Mo-Su 09:00-21:00"],
              sameAs: [
                "https://www.facebook.com/yourpage",
              ],
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning className={`font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
