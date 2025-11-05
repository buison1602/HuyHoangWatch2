"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { toast } from "sonner"
import { BrandForm } from "@/components/admin/brand-form"

interface Brand {
  id: string
  name: string
  description: string
  logo_url: string | null
  created_at: string
  updated_at: string
}

interface BrandManagementProps {
  brands: Brand[]
}

export function BrandManagement({ brands: initialBrands }: BrandManagementProps) {
  const [brands, setBrands] = useState(initialBrands)
  const [showDialog, setShowDialog] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [deletingBrandId, setDeletingBrandId] = useState<string | null>(null)
  const supabase = createClient()

  const handleAddBrand = async (data: { name: string; description: string; logo_url?: string }) => {
    const { error } = await supabase.from("brands").insert([data])

    if (error) {
      toast.error("Không thể thêm thương hiệu")
      return
    }

    const { data: newBrand } = await supabase.from("brands").select("*").eq("name", data.name).single()

    if (newBrand) {
      setBrands([...brands, newBrand])
      toast.success("Thêm thương hiệu thành công")
    }

    setShowDialog(false)
  }

  const handleEditBrand = async (data: { name: string; description: string; logo_url?: string }) => {
    if (!editingBrand) return

    const { error } = await supabase.from("brands").update(data).eq("id", editingBrand.id)

    if (error) {
      toast.error("Không thể cập nhật thương hiệu")
      return
    }

    setBrands(
      brands.map((b) =>
        b.id === editingBrand.id ? { ...b, ...data, updated_at: new Date().toISOString() } : b,
      ),
    )

    toast.success("Cập nhật thương hiệu thành công")
    setShowDialog(false)
    setEditingBrand(null)
  }

  const handleDeleteBrand = async () => {
    if (!deletingBrandId) return

    const { error } = await supabase.from("brands").delete().eq("id", deletingBrandId)

    if (error) {
      toast.error("Không thể xóa thương hiệu")
      return
    }

    setBrands(brands.filter((b) => b.id !== deletingBrandId))
    toast.success("Xóa thương hiệu thành công")
    setDeletingBrandId(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Danh sách thương hiệu</h2>
        <Button
          onClick={() => {
            setEditingBrand(null)
            setShowDialog(true)
          }}
        >
          Thêm thương hiệu mới
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBrand ? "Sửa thông tin thương hiệu" : "Thêm thương hiệu mới"}</DialogTitle>
          </DialogHeader>
          <BrandForm
            brand={editingBrand}
            onSubmit={editingBrand ? handleEditBrand : handleAddBrand}
            onClose={() => {
              setShowDialog(false)
              setEditingBrand(null)
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingBrandId} onOpenChange={() => setDeletingBrandId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Xoá thương hiệu</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa thương hiệu này không? Thao tác này không thể hoàn tác.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Dừng lại</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBrand}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Thời gian tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Không tìm thấy thương hiệu
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell className="text-muted-foreground">{brand.description}</TableCell>
                  <TableCell>
                    {brand.logo_url ? (
                      <img src={brand.logo_url} alt={brand.name} className="h-8 w-auto object-contain" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Chưa có logo</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(brand.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingBrand(brand)
                          setShowDialog(true)
                        }}
                      >
                        Sửa
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeletingBrandId(brand.id)}>
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
