import { MapPin, Phone, Clock } from 'lucide-react';

// Static year to avoid hydration mismatch
const CURRENT_YEAR = 2025;

export function ShopFooter() {
  return (
    <footer className="bg-[#9f1d25] text-gray-300 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Địa chỉ */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-1 text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-2 text-lg">Địa chỉ</h3>
              {/* <p className="text-sm leading-relaxed">
                Đồng hồ Huy Hoàng<br />
                Tổ 1 khu phố Khánh Long, Tân Khánh<br />
                Thành phố Hồ Chí Minh
              </p> */}
              <a
                href="https://www.google.com/maps/place/10%C2%B059'15.2%22N+106%C2%B044'31.3%22E/@10.98754,106.73944,3621m/data=!3m1!1e3!4m4!3m3!8m2!3d10.9875556!4d106.7420278?hl=vi&entry=ttu&g_ep=EgoyMDI1MTAyOC4wIKXMDSoASAFQAw%3D%3D" 
                className="text-base hover:text-blue-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Đồng hồ Huy Hoàng<br />
                Tổ 1 khu phố Khánh Long, Tân Khánh<br />
                Thành phố Hồ Chí Minh
              </a>
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 mt-1 text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-2 text-lg">Liên hệ</h3>
              <a 
                href="https://zalo.me/0835978834" 
                className="text-base hover:text-blue-400 transition-colors"
              >
                0835 978 834
              </a>
            </div>
          </div>

          {/* Giờ mở cửa */}
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 mt-1 text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-2 text-lg">Giờ mở cửa</h3>
              <p className="text-base">
                07:00 - 22:00<br />
                Thứ 2 - Chủ Nhật
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {CURRENT_YEAR} Đồng hồ Huy Hoàng. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
