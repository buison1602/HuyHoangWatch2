import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server" // server-side Supabase helper
import { formatCurrency } from "@/lib/format"

interface PageProps {
  // Trong Next.js 16 dev, params được truyền dưới dạng Promise
  params: Promise<{
    id: string
  }>
}

export default async function TransactionDetailPage({ params }: PageProps) {
  // unwrap params để lấy id
  const { id: transactionId } = await params

  // tạo supabase server-side (lưu ý: hàm createClient() của bạn phải trả Promise<SupabaseClient>)
  const supabase = await createClient()

  // 3. Lấy transaction theo id
  const { data: transaction, error: txError } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .single()

  if (txError || !transaction) {
    redirect("/admin/transactions")
  }

  const {
    id,
    user_id,
    total_amount,
    status,
    payment_method,
    bank_info,
    shipping_address,
    notes,
    created_at,
    updated_at,
    items,
  } = transaction as {
    id: string
    user_id: string
    total_amount: number
    status: string
    payment_method: string | null
    bank_info: any
    shipping_address: any
    notes: string | null
    created_at: string
    updated_at: string
    items: any[]
  }

  return (
    <div className="p-8">
      {/* khung nội dung gọn giống /shop: canh giữa, giới hạn chiều rộng */}
      <div className="mx-auto w-full max-w-3xl space-y-8">
        {/* Header + nút quay lại */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold">Transaction Detail</h1>
            <p className="text-muted-foreground text-sm">
              Order #{id?.slice(0, 8)} •{" "}
              {new Date(created_at).toLocaleString()}
            </p>
          </div>

          <div>
            <Link href="/admin/transactions">
              <Button variant="outline" size="sm">
                Quay lại trang quản lý giao dịch
              </Button>
            </Link>
          </div>
        </div>

        {/* Thông tin chung */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="ID" value={id} mono />
            <Row label="User ID" value={user_id} mono />

            {/* 🔥 Status với màu nổi bật và hỗ trợ nhiều giá trị */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Trạng thái:</span>
              {(() => {
                // chuyển status về chữ thường, bỏ khoảng trắng
                const s = (status || "").toLowerCase().trim()

                // xác định màu tương ứng
                let colorClass = "text-gray-700 bg-gray-100 border-gray-300"
                if (["success", "hoàn thành", "xác nhận", "thành công", "done", "confirmed"].includes(s)) {
                  colorClass = "text-green-700 bg-green-100 border-green-300"
                } else if (["pending", "chờ", "đang chờ", "đợi duyệt"].includes(s)) {
                  colorClass = "text-yellow-700 bg-yellow-100 border-yellow-300"
                } else if (["cancelled", "hủy", "dừng lại", "failed", "error"].includes(s)) {
                  colorClass = "text-red-700 bg-red-100 border-red-300"
                }

                return (
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold border capitalize ${colorClass}`}
                  >
                    {status}
                  </span>
                )
              })()}
            </div>


            <Row
              label="Tổng tiền"
              value={formatCurrency(Number(total_amount))}
            />
            <Row label="Payment method" value={payment_method ?? "N/A"} />
            <Row
              label="Thời gian tạo"
              value={new Date(created_at).toLocaleString()}
            />
            <Row
              label="Thời gian cập nhật"
              value={new Date(updated_at).toLocaleString()}
            />
            <div className="flex flex-col">
              <span className="font-medium">Ghi chú:</span>
              <span className="whitespace-pre-wrap">
                {notes ?? "(no notes)"}
              </span>
            </div>
          </CardContent>
        </Card>


        {/* Danh sách sản phẩm */}
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {Array.isArray(items) && items.length > 0 ? (
              items.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded border p-4 flex flex-col gap-1 text-sm bg-background"
                >
                  <Row label="Tên sản phẩm" value={item.product_name} />
                  <Row label="Product ID" value={item.product_id} mono />
                  <Row
                    label="Giá"
                    value={formatCurrency(Number(item.price))}
                  />
                  <Row
                    label="Số lượng"
                    value={String(item.quantity)}
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Không có sản phẩm</p>
            )}
          </CardContent>
        </Card>

        {/* Địa chỉ giao hàng */}
        <Card>
          <CardHeader>
            <CardTitle>Địa chỉ giao hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {shipping_address ? (
              <>
                <Row
                  label="Tên"
                  value={shipping_address.fullName}
                />
                <Row label="Điện thoại" value={shipping_address.phone} />
                <Row label="Email" value={shipping_address.email} />
                <Row
                  label="Địa chỉ"
                  value={shipping_address.address}
                />
                <Row label="Thành phố" value={shipping_address.city} />
                <Row
                  label="Mã bưu chính"
                  value={shipping_address.postalCode}
                />
              </>
            ) : (
              <p className="text-muted-foreground">Không có địa chỉ giao hàng</p>
            )}
          </CardContent>
        </Card>

        {/* Thông tin thanh toán ngân hàng */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {bank_info ? (
              <>
                <Row label="Tên ngân hàng" value={bank_info.bankName} />
                <Row
                  label="Chủ tài khoản"
                  value={bank_info.accountHolder}
                />
                <Row
                  label="Số tài khoản"
                  value={bank_info.accountNumber}
                />
              </>
            ) : (
              <p className="text-muted-foreground">Không có thông tin ngân hàng</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span
        className={
          mono
            ? "font-mono break-all text-right"
            : "text-right"
        }
      >
        {value ?? "—"}
      </span>
    </div>
  )
}
