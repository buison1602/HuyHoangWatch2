"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useState, useMemo } from "react"
import Link from "next/link"
import { formatCurrency } from "@/lib/format"

interface Transaction {
  id: string
  user_id: string
  total_amount: number
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
  items: any
}

interface TransactionManagementProps {
  transactions: Transaction[]
}

export function TransactionManagement({ transactions: initialTransactions }: TransactionManagementProps) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const supabase = createClient()

  const handleStatusChange = async (transactionId: string, newStatus: string) => {
    const { error } = await supabase
      .from("transactions")
      .update({ status: newStatus })
      .eq("id", transactionId)

    if (!error) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === transactionId ? { ...t, status: newStatus as any } : t
        )
      )
    }
  }

  // sort theo priority: pending -> confirmed -> cancelled
  const sortedTransactions = useMemo(() => {
    const priority: Record<string, number> = {
      pending: 1,
      confirmed: 2,
      cancelled: 3,
    }
    return [...transactions].sort(
      (a, b) => priority[a.status] - priority[b.status]
    )
  }, [transactions])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Danh sách giao dịch</h2>

      <div className="space-y-4">
        {sortedTransactions.map((transaction) => (
          <Card key={transaction.id} className="hover:bg-muted/30">
            <CardContent className="p-4 flex flex-col gap-4">

              {/* Hàng trên: thông tin + action */}
              <div className="flex items-start justify-between flex-wrap gap-4">
                {/* Khối clickable dẫn tới trang chi tiết */}
                <Link
                  href={`/admin/transactions/${transaction.id}`}
                  className="block"
                >
                  <div>
                    <h3 className="font-semibold underline underline-offset-2 hover:text-primary">
                      Order #{transaction.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(transaction.total_amount)} •{" "}
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>

                {/* Status + nút Confirm/Cancel */}
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>

                  {transaction.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusChange(transaction.id, "confirmed")
                        }
                      >
                        Xác nhận
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleStatusChange(transaction.id, "cancelled")
                        }
                      >
                        Hủy
                      </Button>
                    </div>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
