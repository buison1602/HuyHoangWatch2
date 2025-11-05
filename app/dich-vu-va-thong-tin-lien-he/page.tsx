import { ShopHeader } from "@/components/shop/shop-header"
import { NavigationCategoryBar } from "@/components/shop/navigation-category-bar"
import { ShopFooter } from "@/components/shop/shop-footer"
import { ServiceLocations } from "@/components/shop/service-locations"
import { FacebookFAB } from "@/components/shop/facebook-fab"
import { ZaloFAB } from "@/components/shop/zalo-fab"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dịch vụ sửa chữa đồng hồ & Thông tin liên hệ - Huy Hoàng Watch",
  description: "Dịch vụ sửa chữa, bảo dưỡng đồng hồ chuyên nghiệp tại Huy Hoàng Watch. Thay pin, đánh bóng, thay mặt kính, lau dầu với đội ngũ thợ giàu kinh nghiệm.",
}

export default async function ServiceContactPage() {
  const supabase = await createClient()

  // Fetch categories and brands for CategoryBar
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name")

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug")
    .order("name")

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      
      <NavigationCategoryBar
        categories={categories || []}
        brands={brands || []}
      />

      {/* Banner */}
      <div className="container mx-auto px-4 mt-[40px] mb-4">
        <div className="text-center mb-6">
          <h1 className="text-[#676767] text-xl font-bold mb-2">
            Dịch vụ sửa chữa & Bảo dưỡng đồng hồ chuyên nghiệp
          </h1>
          <p className="text-[#676767] text-base max-w-4xl mx-auto">
            Với hơn 10 năm kinh nghiệm trong ngành, Huy Hoàng Watch tự hào là đơn vị uy tín hàng đầu trong lĩnh vực sửa chữa, 
            bảo dưỡng đồng hồ cao cấp. Đội ngũ thợ lành nghề, tay nghề cao, cam kết mang đến dịch vụ chất lượng nhất với giá cả hợp lý. 
            Chúng tôi sử dụng thiết bị hiện đại, phụ tùng chính hãng, đảm bảo đồng hồ của bạn luôn hoạt động chính xác và bền bỉ theo thời gian.
          </p>
        </div>
        
        <Image
          src="/images/dhhh.jpg"
          alt="Dịch vụ sửa chữa đồng hồ chuyên nghiệp"
          width={1920}
          height={400}
          className="w-full h-auto object-cover rounded-lg"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Service Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#9f1d25]">Cam kết của chúng tôi</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-[#9f1d25] font-bold">✓</span>
                  <span><strong>Uy tín hàng đầu:</strong> Hơn 10 năm kinh nghiệm, được hàng nghìn khách hàng tin tưởng</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9f1d25] font-bold">✓</span>
                  <span><strong>Chất lượng đảm bảo:</strong> Sử dụng phụ tùng chính hãng, thiết bị hiện đại</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9f1d25] font-bold">✓</span>
                  <span><strong>Thợ giàu kinh nghiệm:</strong> Đội ngũ kỹ thuật viên được đào tạo bài bản, tay nghề cao</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9f1d25] font-bold">✓</span>
                  <span><strong>Giá cả hợp lý:</strong> Báo giá minh bạch, không phát sinh chi phí</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9f1d25] font-bold">✓</span>
                  <span><strong>Bảo hành chu đáo:</strong> Bảo hành dịch vụ, hỗ trợ tận tâm sau sửa chữa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9f1d25] font-bold">✓</span>
                  <span><strong>Thời gian nhanh chóng:</strong> Cam kết thời gian sửa chữa rõ ràng, đúng hẹn</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#9f1d25]">Dịch vụ của chúng tôi</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Thay pin đồng hồ (pin chính hãng, bảo hành 6 tháng)</li>
                <li>• Đánh bóng, làm mới vỏ và dây đồng hồ</li>
                <li>• Thay mặt kính đồng hồ (kính sapphire, kính mineral)</li>
                <li>• Lau dầu, bảo dưỡng máy đồng hồ cơ</li>
                <li>• Thay dây da, dây kim loại, dây cao su</li>
                <li>• Chỉnh size dây, khóa đồng hồ</li>
                <li>• Kiểm tra độ chống nước, thay gioăng</li>
              </ul>
            </div>
          </div>

          {/* Service Locations */}
          <div>
            <ServiceLocations />
          </div>
        </div>
      </div>

      <ShopFooter />
      <ZaloFAB />
      <FacebookFAB />
    </div>
  )
}
