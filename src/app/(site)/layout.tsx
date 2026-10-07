import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FloatingContact } from "@/components/floating-contact";
import { RevealObserver } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { getServices, getSettings } from "@/lib/data";
import { SITE } from "@/lib/site";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [s, services] = await Promise.all([getSettings(), getServices()]);
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-primary-800 px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Bỏ qua, tới nội dung chính
      </a>
      <SiteHeader hotline={s.hotline} />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <SiteFooter s={s} services={services} />
      <FloatingContact hotline={s.hotline} zaloUrl={s.zaloUrl} messengerUrl={s.messengerUrl} />
      <RevealObserver />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": ["Hospital", "MedicalOrganization"],
          name: SITE.name,
          alternateName: SITE.shortName,
          slogan: SITE.tagline,
          url: SITE.url,
          logo: `${SITE.url}/icon.svg`,
          telephone: s.hotline,
          email: s.email,
          foundingDate: String(SITE.founded),
          medicalSpecialty: "Ophthalmology",
          address: {
            "@type": "PostalAddress",
            streetAddress: "17 Phạm Ngọc Thạch",
            addressLocality: "Phường Bà Rịa",
            addressRegion: "TP. Hồ Chí Minh",
            addressCountry: "VN",
          },
          sameAs: [s.facebookUrl, s.youtubeUrl, s.tiktokUrl],
          availableService: services.map((sv) => ({ "@type": "MedicalProcedure", name: sv.title, url: `${SITE.url}/dich-vu/${sv.slug}` })),
        }}
      />
    </>
  );
}
