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
import { CategoryForm } from "@/components/admin/category-form"

interface Category {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

interface CategoryManagementProps {
  categories: Category[]
}

export function CategoryManagement({ categories: initialCategories }: CategoryManagementProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [showDialog, setShowDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)
  const supabase = createClient()

  const handleAddCategory = async (data: { name: string; description: string }) => {
    const { error } = await supabase.from("categories").insert([data])

    if (error) {
      toast.error("Failed to add category")
      return
    }

    const { data: newCategory } = await supabase.from("categories").select("*").eq("name", data.name).single()

    if (newCategory) {
      setCategories([...categories, newCategory])
      toast.success("Category added successfully")
    }

    setShowDialog(false)
  }

  const handleEditCategory = async (data: { name: string; description: string }) => {
    if (!editingCategory) return

    const { error } = await supabase.from("categories").update(data).eq("id", editingCategory.id)

    if (error) {
      toast.error("Failed to update category")
      return
    }

    setCategories(
      categories.map((c) =>
        c.id === editingCategory.id ? { ...c, ...data, updated_at: new Date().toISOString() } : c,
      ),
    )

    toast.success("Category updated successfully")
    setShowDialog(false)
    setEditingCategory(null)
  }

  const handleDeleteCategory = async () => {
    if (!deletingCategoryId) return

    const { error } = await supabase.from("categories").delete().eq("id", deletingCategoryId)

    if (error) {
      toast.error("Failed to delete category")
      return
    }

    setCategories(categories.filter((c) => c.id !== deletingCategoryId))
    toast.success("Category deleted successfully")
    setDeletingCategoryId(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Danh sách danh mục</h2>
        <Button
          onClick={() => {
            setEditingCategory(null)
            setShowDialog(true)
          }}
        >
          Thêm danh mục mới
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Sửa thông tin danh mục" : "Thêm danh mục mới"}</DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={editingCategory}
            onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
            onClose={() => {
              setShowDialog(false)
              setEditingCategory(null)
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingCategoryId} onOpenChange={() => setDeletingCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Xoá danh mục</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa danh mục này không? Thao tác này không thể hoàn tác.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Dừng lại</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
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
              <TableHead>Thời gian tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Không tìm thấy danh mục
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">{category.description}</TableCell>
                  <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(category)
                          setShowDialog(true)
                        }}
                      >
                        Sửa
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeletingCategoryId(category.id)}>
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
