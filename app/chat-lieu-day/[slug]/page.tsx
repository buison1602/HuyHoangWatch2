import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { StrapMaterialPageClient } from "@/components/shop/strap-material-page-client"
import type { Metadata } from "next"

interface StrapMaterialPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Map slug to strap_type value and display info
const STRAP_MATERIAL_MAP: Record<string, {
  strapType: string
  name: string
  description: string
  bannerUrl: string
  metaTitle: string
  metaDescription: string
}> = {
  "dong-ho-day-da": {
    strapType: "leather",
    name: "Đồng hồ dây da",
    description: "Đồng hồ dây da đẹp, thời trang, chính hãng",
    bannerUrl: "/images/dong-ho-day-da-chinh-hang.avif",
    metaTitle: "Đồng hồ dây da đẹp, thời trang, chính hãng - Huy Hoàng Watch",
    metaDescription: "Khám phá bộ sưu tập đồng hồ dây da cao cấp, thiết kế sang trọng, phong cách thời trang. Đa dạng mẫu mã từ cổ điển đến hiện đại. Chính hãng 100%."
  },
  "dong-ho-day-kim-loai": {
    strapType: "metal",
    name: "Đồng hồ dây kim loại",
    description: "Đồng hồ dây kim loại đẹp, cao cấp, chính hãng",
    bannerUrl: "/images/dong-ho-day-kim-loai-chinh-hang.avif",
    metaTitle: "Đồng hồ dây kim loại đẹp, cao cấp, chính hãng - Huy Hoàng Watch",
    metaDescription: "Bộ sưu tập đồng hồ dây kim loại cao cấp, bền bỉ với thời gian. Thiết kế sang trọng, đẳng cấp. Đa dạng thương hiệu nổi tiếng. Chính hãng 100%."
  },
  "dong-ho-day-cao-su": {
    strapType: "rubber",
    name: "Đồng hồ dây cao su",
    description: "Đồng hồ nam dây cao su cao cấp, bền nhẹ",
    bannerUrl: "/images/dong-ho-nam-day-cao-su.avif",
    metaTitle: "Đồng hồ dây cao su cao cấp, bền nhẹ - Huy Hoàng Watch",
    metaDescription: "Đồng hồ dây cao su thể thao, năng động, chống nước tốt. Chất liệu bền bỉ, nhẹ nhàng, thoải mái khi đeo. Phù hợp mọi hoạt động. Chính hãng 100%."
  },
  "dong-ho-day-vai": {
    strapType: "fabric",
    name: "Đồng hồ dây vải",
    description: "Đồng hồ dây vải đẹp, bền, cao cấp, chính hãng",
    bannerUrl: "/images/dong-ho-day-vai-chinh-hang.avif",
    metaTitle: "Đồng hồ dây vải đẹp, bền, cao cấp, chính hãng - Huy Hoàng Watch",
    metaDescription: "Đồng hồ dây vải phong cách trẻ trung, năng động. Chất liệu thoáng khí, thoải mái. Dễ dàng thay đổi phong cách. Đa dạng màu sắc và kiểu dáng. Chính hãng 100%."
  }
}

export async function generateMetadata({ params }: StrapMaterialPageProps): Promise<Metadata> {
  const { slug } = await params
  const strapInfo = STRAP_MATERIAL_MAP[slug]

  if (!strapInfo) {
    return {
      title: "Trang không tồn tại",
    }
  }

  return {
    title: strapInfo.metaTitle,
    description: strapInfo.metaDescription,
  }
}

export default async function StrapMaterialPage({ params, searchParams }: StrapMaterialPageProps) {
  const { slug } = await params
  const strapInfo = STRAP_MATERIAL_MAP[slug]

  if (!strapInfo) {
    notFound()
  }

  const supabase = await createClient()

  // Fetch all categories and brands for filters
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name")

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name")
    .order("name")

  return (
    <StrapMaterialPageClient
      strapType={strapInfo.strapType}
      strapInfo={strapInfo}
      categories={categories || []}
      brands={brands || []}
    />
  )
}
