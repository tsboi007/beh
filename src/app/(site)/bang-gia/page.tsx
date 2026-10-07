import type { Metadata } from "next";
import { Info } from "lucide-react";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { PriceTable } from "@/components/price-table";
import { getPriceItems, getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Bảng giá dịch vụ kỹ thuật",
  description:
    "Bảng giá dịch vụ kỹ thuật tại Bệnh viện Mắt Bà Rịa – Vũng Tàu theo Nghị quyết 399/NQ-HĐND TP.HCM: khám mắt, phẫu thuật Phaco, Glôcôm, võng mạc, xét nghiệm… giá BHYT và giá thu phí.",
  alternates: { canonical: "/bang-gia" },
};

export default async function PricePage() {
  const [items, s] = await Promise.all([getPriceItems(), getSettings()]);

  return (
    <>
      <PageHero
        eyebrow="Chi phí minh bạch"
        title="Bảng giá dịch vụ kỹ thuật"
        lead="Giá dịch vụ khám bệnh, chữa bệnh áp dụng theo Nghị quyết số 399/NQ-HĐND ngày 28/08/2025 của HĐND Thành phố Hồ Chí Minh."
      />
      <Container className="py-12 sm:py-16">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-secondary-100 bg-secondary-50 p-6 sm:flex-row sm:items-start">
          <Info className="h-6 w-6 shrink-0 text-secondary-700" aria-hidden />
          <div className="space-y-1 text-ink-soft">
            <p>
              <strong className="text-ink">Giá BHYT</strong> là giá dịch vụ dùng để quỹ BHYT thanh toán. Số tiền người bệnh cùng chi trả phụ thuộc mức hưởng ghi trên thẻ và tuyến khám.{" "}
              <strong className="text-ink">Giá thu phí</strong> áp dụng cho người bệnh không sử dụng BHYT. Đơn vị tính: đồng/lần.
            </p>
            <p>
              Chưa bao gồm thuốc, vật tư y tế (VD: thủy tinh thể nhân tạo). Liên hệ{" "}
              <a className="font-semibold text-primary-700 underline" href={`tel:${s.hotline.replace(/[^\d+]/g, "")}`}>
                {s.hotline}
              </a>{" "}
              để được tư vấn chi phí cụ thể.
            </p>
          </div>
        </div>

        <PriceTable
          items={items.map(({ id, category, name, price, insurancePrice, note }) => ({ id, category, name, price, insurancePrice, note }))}
        />

        <div className="mt-14 text-center">
          <ButtonLink href="/dat-lich">Đặt lịch khám & tư vấn chi phí</ButtonLink>
        </div>
      </Container>
    </>
  );
}
