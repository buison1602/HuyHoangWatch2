"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface Brand {
  id: string
  name: string
  description: string
  logo_url: string | null
  created_at: string
  updated_at: string
}

interface BrandFormProps {
  brand?: Brand | null
  onSubmit: (data: { name: string; description: string; logo_url?: string }) => Promise<void>
  onClose: () => void
}

export function BrandForm({ brand, onSubmit, onClose }: BrandFormProps) {
  const [name, setName] = useState(brand?.name || "")
  const [description, setDescription] = useState(brand?.description || "")
  const [logoUrl, setLogoUrl] = useState(brand?.logo_url || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      return
    }

    setIsLoading(true)
    try {
      await onSubmit({ 
        name: name.trim(), 
        description: description.trim(),
        logo_url: logoUrl.trim() || undefined
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tên thương hiệu</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên thương hiệu"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Nhập mô tả"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logoUrl">Logo URL (tùy chọn)</Label>
        <Input
          id="logoUrl"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://example.com/logo.png"
          type="url"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Dừng lại
        </Button>
        <Button type="submit" disabled={isLoading || !name.trim()}>
          {isLoading ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </form>
  )
}
