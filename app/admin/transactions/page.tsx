import { createClient } from "@/lib/supabase/server"
import { TransactionManagement } from "@/components/admin/transaction-management"

export default async function AdminTransactionsPage() {
  const supabase = await createClient()

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false })

  return <TransactionManagement transactions={transactions || []} />
}
