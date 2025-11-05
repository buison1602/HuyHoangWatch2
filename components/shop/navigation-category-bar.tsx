"use client"

import { CategoryBar } from "@/components/shop/category-bar"

interface Category {
  id: string
  name: string
  slug?: string
}

interface Brand {
  id: string
  name: string
  slug?: string
}

interface NavigationCategoryBarProps {
  categories: Category[]
  brands: Brand[]
}

export function NavigationCategoryBar({ categories, brands }: NavigationCategoryBarProps) {
  return (
    <CategoryBar
      categories={categories}
      brands={brands}
      selectedCategories={[]}
      selectedBrands={[]}
      selectedGender={[]}
      selectedStrap={[]}
      selectedAccessories={[]}
      selectedServices={[]}
      onToggleCategory={() => {}}
      onToggleBrand={() => {}}
      onToggleGender={() => {}}
      onToggleStrap={() => {}}
      onToggleAccessory={() => {}}
      onToggleService={() => {}}
      enableNavigation={true}
    />
  )
}
