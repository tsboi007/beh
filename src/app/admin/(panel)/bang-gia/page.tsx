import { asc } from "drizzle-orm";
import { Plus, Save, Trash2 } from "lucide-react";
import { schema } from "@/lib/db";
import { adminDb } from "@/lib/admin-db";
import { AdminHeader, Panel, smallInput } from "@/components/admin/bits";
import { deletePriceItem, savePriceItem } from "../../actions";
import type { PriceItem } from "@/lib/db/schema";

function Row({ r, categories }: { r?: PriceItem; categories: string[] }) {
  return (
    <form action={savePriceItem} className="grid gap-2 p-4 md:grid-cols-[10rem_1fr_8rem_8rem_5rem_auto] md:items-center">
      <input type="hidden" name="id" value={r?.id ?? ""} />
      <label>
        <span className="sr-only">Nhóm</span>
        <input name="category" list="price-cats" defaultValue={r?.category} placeholder="Nhóm" required className={smallInput} />
      </label>
      <label>
        <span className="sr-only">Tên dịch vụ</span>
        <input name="name" defaultValue={r?.name} placeholder="Tên dịch vụ" required className={smallInput} />
      </label>
      <label>
        <span className="sr-only">Giá BHYT</span>
        <input name="insurancePrice" defaultValue={r?.insurancePrice ?? ""} placeholder="Giá BHYT" className={smallInput} />
      </label>
      <label>
        <span className="sr-only">Giá thu phí</span>
        <input name="price" defaultValue={r?.price ?? ""} placeholder="Giá thu phí" className={smallInput} />
      </label>
      <input type="hidden" name="unit" value={r?.unit ?? "lần"} />
      <label>
        <span className="sr-only">Thứ tự</span>
        <input name="sortOrder" type="number" defaultValue={r?.sortOrder ?? 0} className={smallInput} />
      </label>
      <div className="flex gap-2">
        <button className="flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-primary-700 px-3 font-semibold text-white hover:bg-primary-800">
          {r ? <Save className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
          {r ? "Lưu" : "Thêm"}
        </button>
        {r ? (
          <button formAction={deletePriceItem} className="flex min-h-10 cursor-pointer items-center rounded-lg px-3 text-accent-700 ring-1 ring-accent-100 hover:bg-accent-100" aria-label={`Xóa ${r.name}`}>
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>
      <label className="md:col-span-6">
        <span className="sr-only">Ghi chú</span>
        <input name="note" defaultValue={r?.note ?? ""} placeholder="Ghi chú (không bắt buộc)" className={`${smallInput} text-sm`} />
      </label>
      {categories.length ? (
        <datalist id="price-cats">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      ) : null}
    </form>
  );
}

export default async function PricesAdmin() {
  const db = await adminDb();
  const rows = await db.select().from(schema.priceItems).orderBy(asc(schema.priceItems.sortOrder), asc(schema.priceItems.id));
  const categories = [...new Set(rows.map((r) => r.category))];
  return (
    <>
      <AdminHeader title="Bảng giá" desc="Giá theo Nghị quyết 399/NQ-HĐND (28/08/2025). Để trống Giá BHYT nếu dịch vụ không áp dụng BHYT." />
      <Panel className="mb-6 border-primary-200 bg-primary-50/50">
        <p className="px-4 pt-4 font-semibold text-primary-800">Thêm dòng mới</p>
        <Row categories={categories} />
      </Panel>
      <Panel className="divide-y divide-line">
        {rows.map((r) => (
          <Row key={r.id} r={r} categories={[]} />
        ))}
      </Panel>
    </>
  );
}
