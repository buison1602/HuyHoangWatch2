import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  const stats = {
    total_products: 0,
    pending_orders: 0,
    total_revenue: 0,
    total_users: 0,
  }

  // Run all queries in parallel for faster response
  const [
    { count: productCount },
    { count: pendingCount },
    { data: revenueData },
    { count: userCount }
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("transactions").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("transactions").select("total_amount").eq("status", "paid"),
    supabase.from("profiles").select("*", { count: "exact", head: true })
  ])

  stats.total_products = productCount || 0
  stats.pending_orders = pendingCount || 0
  stats.total_revenue = revenueData?.reduce((sum, row) => sum + (row.total_amount || 0), 0) || 0
  stats.total_users = userCount || 0

  return <AdminDashboard stats={stats} />
}
