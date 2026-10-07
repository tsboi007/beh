"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search, ShieldCheck, X } from "lucide-react";
import clsx from "clsx";

export type PriceRow = {
  id: number;
  category: string;
  name: string;
  price: string;
  insurancePrice: string | null;
  note: string | null;
};

const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();

export function PriceTable({ items }: { items: PriceRow[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const q = fold(useDeferredValue(query).trim());

  const categories = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);
  const indexed = useMemo(() => items.map((i) => ({ ...i, key: fold(i.name) })), [items]);
  const filtered = indexed.filter((i) => (cat === "all" || i.category === cat) && (!q || q.split(/\s+/).every((w) => i.key.includes(w))));
  const groups = Map.groupBy(filtered, (i) => i.category);

  return (
    <div>
      <div className="sticky top-[4.5rem] z-20 -mx-4 border-b border-line bg-canvas/95 px-4 pb-4 pt-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5 lg:top-20">
        <label className="relative block">
          <span className="sr-only">Tìm dịch vụ</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm dịch vụ: VD “phaco”, “đo nhãn áp”, “OCT”…"
            className="block min-h-12 w-full rounded-full border border-line bg-white pl-12 pr-12 text-base text-ink shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Xóa tìm kiếm"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-slate-100"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </label>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Lọc theo nhóm dịch vụ">
          {["all", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={clsx(
                "shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                cat === c ? "bg-primary-700 text-white" : "bg-white text-ink-soft ring-1 ring-line hover:bg-primary-50",
              )}
            >
              {c === "all" ? "Tất cả" : c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm text-muted" aria-live="polite">
        {filtered.length} dịch vụ{q || cat !== "all" ? " phù hợp" : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-dashed border-line bg-white p-10 text-center text-muted">
          Không tìm thấy dịch vụ phù hợp. Vui lòng gọi hotline để được tư vấn.
        </p>
      ) : null}

      <div className="mt-4 space-y-10">
        {[...groups.entries()].map(([category, rows]) => (
          <section key={category} aria-label={category}>
            <h2 className="font-display text-2xl font-bold text-ink">
              {category} <span className="text-base font-normal text-muted">({rows!.length})</span>
            </h2>
            <div className="mt-4 overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
              <table className="w-full text-left">
                <thead className="bg-primary-50 text-sm text-primary-800">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold sm:px-6">Dịch vụ kỹ thuật</th>
                    <th scope="col" className="whitespace-nowrap px-3 py-3 text-right font-semibold">Giá BHYT</th>
                    <th scope="col" className="whitespace-nowrap px-4 py-3 text-right font-semibold sm:px-6">Giá thu phí</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows!.map((r) => (
                    <tr key={r.id} className="align-top transition-colors hover:bg-primary-50/40">
                      <td className="px-4 py-3 sm:px-6">
                        <span className="text-ink">{r.name}</span>
                        {r.note ? <span className="mt-0.5 block text-xs text-muted">{r.note}</span> : null}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">
                        {r.insurancePrice ? (
                          <span className="inline-flex items-center gap-1 text-primary-800">
                            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                            {r.insurancePrice}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums text-ink sm:px-6">{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
