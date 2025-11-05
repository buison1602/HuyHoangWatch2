/**
 * Static filter options for shop page
 * These MUST be identical on server and client to avoid hydration mismatch
 */

export const GENDER_OPTIONS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "unisex", label: "Cả nam và nữ" },
] as const;

export const STRAP_TYPE_OPTIONS = [
  { value: "leather", label: "Dây da" },
  { value: "metal", label: "Dây kim loại" },
  { value: "rubber", label: "Dây cao su" },
  { value: "fabric", label: "Dây vải" },
] as const;

export const ACCESSORY_OPTIONS = [
  { value: "strap", label: "Dây" },
  { value: "clasp", label: "Khóa" },
] as const;

export const SERVICE_OPTIONS = [
  { value: "battery replacement", label: "Thay pin" },
  { value: "polishing", label: "Đánh bóng" },
  { value: "crystal replacement", label: "Thay mặt kính" },
  { value: "cleaning & oiling", label: "Lau dầu" },
] as const;

export const FILTER_LABELS = {
  category: "Danh mục",
  brand: "Thương hiệu",
  gender: "Giới tính",
  strapType: "Loại dây đeo",
  accessories: "Phụ kiện",
  services: "Dịch vụ",
} as const;
