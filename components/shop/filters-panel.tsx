"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { 
  GENDER_OPTIONS, 
  STRAP_TYPE_OPTIONS, 
  ACCESSORY_OPTIONS, 
  SERVICE_OPTIONS,
  FILTER_LABELS 
} from "@/lib/filter-constants"

interface Category {
  id: string
  name: string
}

interface Brand {
  id: string
  name: string
}

interface FiltersPanelProps {
  categories?: Category[]
  brands?: Brand[]
  selectedCategories?: string[]
  selectedBrands?: string[]
  selectedGender?: string[]
  selectedStrap?: string[]
  selectedAccessories?: string[]
  selectedServices?: string[]
  onToggleCategory: (id: string) => void
  onToggleBrand: (id: string) => void
  onToggleGender: (gender: string) => void
  onToggleStrap: (strap: string) => void
  onToggleAccessory: (accessory: string) => void
  onToggleService: (service: string) => void
}

export function FiltersPanel({
  categories = [],
  brands = [],
  selectedCategories = [],
  selectedBrands = [],
  selectedGender = [],
  selectedStrap = [],
  selectedAccessories = [],
  selectedServices = [],
  onToggleCategory,
  onToggleBrand,
  onToggleGender,
  onToggleStrap,
  onToggleAccessory,
  onToggleService,
}: FiltersPanelProps) {
  return (
    <div className="space-y-4">
      {/* Danh mục */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{FILTER_LABELS.category}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => onToggleCategory(category.id)}
              />
              <Label htmlFor={`cat-${category.id}`} className="cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Thương hiệu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{FILTER_LABELS.brand}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand.id}`}
                checked={selectedBrands.includes(brand.id)}
                onCheckedChange={() => onToggleBrand(brand.id)}
              />
              <Label htmlFor={`brand-${brand.id}`} className="cursor-pointer">
                {brand.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Giới tính */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{FILTER_LABELS.gender}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {GENDER_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                id={`gender-${option.value}`}
                checked={selectedGender.includes(option.value)}
                onCheckedChange={() => onToggleGender(option.value)}
              />
              <Label
                htmlFor={`gender-${option.value}`}
                className="cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Loại dây đeo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{FILTER_LABELS.strapType}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {STRAP_TYPE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                id={`strap-${option.value}`}
                checked={selectedStrap.includes(option.value)}
                onCheckedChange={() => onToggleStrap(option.value)}
              />
              <Label
                htmlFor={`strap-${option.value}`}
                className="cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Phụ kiện */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{FILTER_LABELS.accessories}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ACCESSORY_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                id={`accessory-${option.value}`}
                checked={selectedAccessories.includes(option.value)}
                onCheckedChange={() => onToggleAccessory(option.value)}
              />
              <Label
                htmlFor={`accessory-${option.value}`}
                className="cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Dịch vụ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{FILTER_LABELS.services}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SERVICE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                id={`service-${option.value}`}
                checked={selectedServices.includes(option.value)}
                onCheckedChange={() => onToggleService(option.value)}
              />
              <Label
                htmlFor={`service-${option.value}`}
                className="cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
