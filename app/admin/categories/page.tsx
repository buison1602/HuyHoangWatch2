import { createClient } from "@/lib/supabase/server"
import { CategoryManagement } from "@/components/admin/category-management"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return <CategoryManagement categories={categories || []} />
}
