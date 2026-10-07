import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";

export const metadata: Metadata = { title: "Quản trị", robots: { index: false, follow: false } };
export const instant = false;

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <AdminShell>
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center text-muted">
            <Loader2 className="h-6 w-6 animate-spin" aria-label="Đang tải" />
          </div>
        }
      >
        <Gate>{children}</Gate>
      </Suspense>
    </AdminShell>
  );
}

async function Gate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
