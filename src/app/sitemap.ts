import type { MetadataRoute } from "next";
import { getJobs, getPosts, getServices } from "@/lib/data";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts, jobs] = await Promise.all([getServices(), getPosts(500), getJobs()]);
  const base = SITE.url;
  const pages = ["", "/gioi-thieu", "/dich-vu", "/bang-gia", "/bac-si", "/tin-tuc", "/hoi-dap", "/dat-lich", "/lien-he", "/tuyen-dung"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 })),
    ...services.map((s) => ({ url: `${base}/dich-vu/${s.slug}`, lastModified: s.updatedAt, priority: 0.9 })),
    ...posts.map((p) => ({ url: `${base}/tin-tuc/${p.slug}`, lastModified: p.publishedAt, priority: 0.7 })),
    ...jobs.map((j) => ({ url: `${base}/tuyen-dung/${j.slug}`, priority: 0.5 })),
  ];
}
