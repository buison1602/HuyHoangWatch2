import { createClient } from "@/lib/supabase/server"
import { BrandManagement } from "@/components/admin/brand-management"

export default async function BrandsPage() {
  const supabase = await createClient()

  // Fetch brands
  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .order("name")

  return <BrandManagement brands={brands || []} />
}
