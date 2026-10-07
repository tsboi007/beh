import type { Metadata } from "next";
import { Info, ShieldCheck } from "lucide-react";
import { Badge, ButtonLink, Container, PageHero } from "@/components/ui";
import { getPriceItems, getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Bảng giá dịch vụ",
  description: "Bảng giá khám mắt, phẫu thuật Phaco, phẫu thuật khúc xạ ReLEx SMILE, LASIK và các dịch vụ cận lâm sàng tại Bệnh viện Mắt Bà Rịa – Vũng Tàu.",
  alternates: { canonical: "/bang-gia" },
};

export default async function PricePage() {
  const [items, s] = await Promise.all([getPriceItems(), getSettings()]);
  const groups = Map.groupBy(items, (i) => i.category);

  return (
    <>
      <PageHero
        eyebrow="Chi phí minh bạch"
        title="Bảng giá dịch vụ"
        lead="Giá dịch vụ được niêm yết theo quy định. Người bệnh có thẻ BHYT được hưởng mức chi trả theo đối tượng và tuyến."
      />
      <Container className="py-14 sm:py-20">
        <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-secondary-100 bg-secondary-50 p-6 sm:flex-row sm:items-start">
          <Info className="h-6 w-6 shrink-0 text-secondary-700" aria-hidden />
          <p className="text-ink-soft">
            Bảng giá mang tính tham khảo và có thể thay đổi theo quy định của cơ quan có thẩm quyền. Chi phí thực tế phụ thuộc chỉ định của bác sĩ và loại vật tư (ví dụ: thủy tinh thể nhân tạo). Vui lòng gọi{" "}
            <a className="font-semibold text-primary-700 underline" href={`tel:${s.hotline.replace(/[^\d+]/g, "")}`}>
              {s.hotline}
            </a>{" "}
            để được tư vấn chi tiết.
          </p>
        </div>

        <div className="space-y-10">
          {[...groups.entries()].map(([category, rows]) => (
            <section key={category} data-reveal aria-labelledby={`cat-${category}`}>
              <h2 id={`cat-${category}`} className="font-display text-2xl font-bold text-ink">
                {category}
              </h2>
              <div className="mt-4 overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
                <table className="w-full text-left">
                  <thead className="bg-primary-50 text-sm uppercase tracking-wide text-primary-800">
                    <tr>
                      <th scope="col" className="px-5 py-4 font-semibold sm:px-7">Dịch vụ</th>
                      <th scope="col" className="hidden px-5 py-4 font-semibold sm:table-cell">Đơn vị</th>
                      <th scope="col" className="px-5 py-4 text-right font-semibold sm:px-7">Giá (VNĐ)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {rows!.map((r) => (
                      <tr key={r.id} className="transition-colors hover:bg-primary-50/40">
                        <td className="px-5 py-4 sm:px-7">
                          <span className="font-medium text-ink">{r.name}</span>
                          {r.insured ? (
                            <span className="ml-2 align-middle">
                              <Badge>
                                <ShieldCheck className="mr-1 h-3.5 w-3.5" aria-hidden /> BHYT
                              </Badge>
                            </span>
                          ) : null}
                          {r.note ? <p className="mt-1 text-sm text-muted">{r.note}</p> : null}
                        </td>
                        <td className="hidden px-5 py-4 text-muted sm:table-cell">{r.unit}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-primary-800 sm:px-7">{r.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 text-center">
          <ButtonLink href="/dat-lich">Đặt lịch khám & tư vấn chi phí</ButtonLink>
        </div>
      </Container>
    </>
  );
}
