// Chuyển đổi giá trị từ database sang tiếng Việt

export const genderTranslations: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  unisex: "Cả nam và nữ",
}

export const strapTypeTranslations: Record<string, string> = {
  leather: "Dây da",
  metal: "Dây kim loại",
  rubber: "Dây cao su",
  fabric: "Dây vải",
}

export function translateGender(gender: string): string {
  return genderTranslations[gender.toLowerCase()] || gender
}

export function translateStrapType(strapType: string): string {
  return strapTypeTranslations[strapType.toLowerCase()] || strapType
}
