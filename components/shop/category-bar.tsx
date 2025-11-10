"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Menu, X } from "lucide-react"
import { FILTER_LABELS } from "@/lib/filter-constants"
import { Button } from "@/components/ui/button"
import { getCategoryUrl, getBrandUrl } from "@/lib/url-helpers"

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

interface CategoryBarProps {
  categories: Category[]
  brands: Brand[]
  selectedCategories: string[]
  selectedBrands: string[]
  selectedGender: string[]
  selectedStrap: string[]
  selectedAccessories: string[]
  selectedServices: string[]
  onToggleCategory: (id: string) => void
  onToggleBrand: (id: string) => void
  onToggleGender: (gender: string) => void
  onToggleStrap: (strap: string) => void
  onToggleAccessory: (accessory: string) => void
  onToggleService: (service: string) => void
  // New prop: if true, clicking category/brand navigates to dedicated page
  enableNavigation?: boolean
}

const STRAP_TYPE_OPTIONS = [
  { value: "leather", label: "Dây da" },
  { value: "metal", label: "Dây kim loại" },
  { value: "rubber", label: "Dây cao su" },
  { value: "fabric", label: "Dây vải" },
]

const ACCESSORY_OPTIONS = [
  { value: "strap", label: "Dây" },
  { value: "clasp", label: "Khóa" },
]

const SERVICE_OPTIONS = [
  { value: "battery replacement", label: "Thay pin" },
  { value: "polishing", label: "Đánh bóng" },
  { value: "crystal replacement", label: "Thay mặt kính" },
  { value: "cleaning & oiling", label: "Lau dầu" },
]

export function CategoryBar({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  selectedGender,
  selectedStrap,
  selectedAccessories,
  selectedServices,
  onToggleCategory,
  onToggleBrand,
  onToggleGender,
  onToggleStrap,
  onToggleAccessory,
  onToggleService,
  enableNavigation = false,
}: CategoryBarProps) {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null)

  // Helper to handle category click - navigate if enabled
  const handleCategoryClick = (category: Category) => {
    if (enableNavigation) {
      router.push(getCategoryUrl(category))
    } else {
      onToggleCategory(category.id)
    }
  }

  // Helper to handle brand click - navigate if enabled
  const handleBrandClick = (brand: Brand) => {
    if (enableNavigation) {
      router.push(getBrandUrl(brand))
    } else {
      onToggleBrand(brand.id)
    }
  }

  // Helper to handle gender button click - navigate to category page
  const handleGenderButtonClick = (genderValue: string) => {
    if (enableNavigation) {
      // Map gender to category slug
      const genderCategoryMap: Record<string, string> = {
        'male': 'dong-ho-nam',
        'female': 'dong-ho-nu',
        'unisex': 'dong-ho-cap-doi',
      }
      const slug = genderCategoryMap[genderValue]
      if (slug) {
        router.push(`/danh-muc/${slug}`)
      }
    } else {
      // Original filter behavior
      handleGenderClick(genderValue)
    }
  }

  // Helper to handle accessory click - navigate to category page
  const handleAccessoryClick = (accessoryValue: string) => {
    if (enableNavigation) {
      // Map accessory to category slug
      const accessoryCategoryMap: Record<string, string> = {
        'strap': 'day-da-dong-ho',
        'clasp': 'khoa',
      }
      const slug = accessoryCategoryMap[accessoryValue]
      if (slug) {
        router.push(`/danh-muc/${slug}`)
      }
    } else {
      // Original filter behavior
      onToggleAccessory(accessoryValue)
    }
  }

  // Helper to handle service click - navigate to service page
  const handleServiceClick = () => {
    if (enableNavigation) {
      router.push('/dich-vu-va-thong-tin-lien-he')
    } else {
      // Original filter behavior - do nothing or can call onToggleService
    }
  }

  // Helper function to handle gender selection (single select behavior)
  const handleGenderClick = (genderValue: string) => {
    // If clicking the same gender that's already selected, deselect it
    // Otherwise, replace the current selection with the new one
    if (selectedGender.includes(genderValue)) {
      onToggleGender(genderValue) // Deselect
    } else {
      // Clear all genders first, then select the new one
      selectedGender.forEach(g => onToggleGender(g)) // Clear all
      onToggleGender(genderValue) // Select new one
    }
  }

  const menuItems: Array<{
    id: string
    label: string
    isGenderButton?: boolean
    genderValue?: string
    items: Array<{
      id: string
      label: string
      selected: boolean
      onToggle: () => void
    }>
  }> = [
    // Hidden category menu as per user request
    // {
    //   id: "category",
    //   label: FILTER_LABELS.category,
    //   items: categories.map(cat => ({
    //     id: cat.id,
    //     label: cat.name,
    //     selected: selectedCategories.includes(cat.id),
    //     onToggle: () => handleCategoryClick(cat),
    //   })),
    // },
    {
      id: "brand",
      label: FILTER_LABELS.brand,
      items: brands.map(brand => ({
        id: brand.id,
        label: brand.name,
        selected: selectedBrands.includes(brand.id),
        onToggle: () => handleBrandClick(brand),
      })),
    },
    // Nam - simple button, no mega menu
    {
      id: "male",
      label: "Nam",
      isGenderButton: true,
      genderValue: "male",
      items: [],
    },
    // Nữ - simple button, no mega menu
    {
      id: "female",
      label: "Nữ",
      isGenderButton: true,
      genderValue: "female",
      items: [],
    },
    // Cặp đôi - simple button, no mega menu
    {
      id: "couple",
      label: "Cặp đôi",
      isGenderButton: true,
      genderValue: "unisex",
      items: [],
    },
    {
      id: "strapType",
      label: FILTER_LABELS.strapType,
      items: STRAP_TYPE_OPTIONS.map(opt => ({
        id: opt.value,
        label: opt.label,
        selected: selectedStrap.includes(opt.value),
        onToggle: () => onToggleStrap(opt.value),
      })),
    },
    {
      id: "accessories",
      label: FILTER_LABELS.accessories,
      items: ACCESSORY_OPTIONS.map(opt => ({
        id: opt.value,
        label: opt.label,
        selected: selectedAccessories.includes(opt.value),
        onToggle: () => handleAccessoryClick(opt.value),
      })),
    },
    {
      id: "services",
      label: FILTER_LABELS.services,
      items: SERVICE_OPTIONS.map(opt => ({
        id: opt.value,
        label: opt.label,
        selected: selectedServices.includes(opt.value),
        onToggle: () => handleServiceClick(),
      })),
    },
  ]

  return (
    <div className="border-b bg-card shadow-sm relative z-50">
      <div className="container mx-auto px-4">
        {/* Mobile Menu Toggle Button */}
        <div className="lg:hidden py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-2"
          >
            <Menu className="h-4 w-4" />
            <span>Danh mục sản phẩm</span>
          </Button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-[100]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar Menu (slides from left) */}
        <div
          className={`
            lg:hidden fixed top-0 left-0 h-full w-[280px] bg-card z-[101]
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            shadow-xl overflow-y-auto
          `}
        >
          {/* Sidebar Header */}
          <div className="sticky top-0 bg-card border-b px-4 py-4 flex items-center justify-between z-10">
            <h2 className="font-semibold text-lg">Danh mục sản phẩm</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="p-4 space-y-2">
            {menuItems.map((menu) => {
              // Gender buttons for mobile
              if (menu.isGenderButton) {
                const isActive = selectedGender.includes(menu.genderValue || "")
                return (
                  <button
                    key={menu.id}
                    onClick={() => {
                      handleGenderButtonClick(menu.genderValue || "")
                      setIsMobileMenuOpen(false)
                    }}
                    className={`
                      w-full text-left px-4 py-3 text-sm font-medium rounded-md
                      transition-colors
                      ${isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted hover:bg-accent"
                      }
                    `}
                  >
                    {menu.label}
                  </button>
                )
              }

              // Regular menu with expandable items
              return (
                <div key={menu.id} className="border rounded-md overflow-hidden">
                  {/* Menu header */}
                  <button
                    onClick={() => setExpandedMobileMenu(
                      expandedMobileMenu === menu.id ? null : menu.id
                    )}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium bg-muted hover:bg-accent transition-colors"
                  >
                    <span>{menu.label}</span>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${
                        expandedMobileMenu === menu.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Expanded items */}
                  {expandedMobileMenu === menu.id && menu.items.length > 0 && (
                    <div className="bg-card border-t">
                      {menu.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            item.onToggle()
                            setIsMobileMenuOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-accent cursor-pointer transition-colors text-sm"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Desktop Horizontal Menu */}
        <nav className="hidden lg:flex items-center justify-center gap-6">
          {menuItems.map((menu) => {
            // Gender buttons (Nam, Nữ, Cặp đôi) - no dropdown
            if (menu.isGenderButton) {
              const isActive = selectedGender.includes(menu.genderValue || "")
              return (
                <button
                  key={menu.id}
                  onClick={() => handleGenderButtonClick(menu.genderValue || "")}
                  className={`
                    px-6 py-4 text-sm font-medium
                    transition-colors hover:bg-accent hover:text-accent-foreground
                    ${isActive ? "bg-primary text-primary-foreground" : ""}
                  `}
                >
                  {menu.label}
                </button>
              )
            }

            // Regular menu with dropdown
            return (
              <div
                key={menu.id}
                className="relative"
                onMouseEnter={() => setActiveMenu(menu.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                {/* Menu trigger */}
                <button
                  className={`
                    flex items-center gap-2 px-6 py-4 text-sm font-medium
                    transition-colors hover:bg-accent hover:text-accent-foreground
                    ${activeMenu === menu.id ? "bg-accent text-accent-foreground" : ""}
                  `}
                >
                  {menu.label}
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Mega Menu Dropdown */}
                {activeMenu === menu.id && menu.items.length > 0 && (
                  <div className="absolute left-0 top-full min-w-[250px] bg-card border border-border shadow-lg rounded-b-md">
                    <div className="py-2 max-h-[400px] overflow-y-auto">
                      {menu.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={item.onToggle}
                          className="w-full text-left px-4 py-2 hover:bg-accent cursor-pointer transition-colors text-sm"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
