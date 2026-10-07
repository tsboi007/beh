import Image from "next/image";
import { UserRound } from "lucide-react";
import type { Doctor } from "@/lib/db/schema";

export function DoctorCard({ doctor, showBio = false }: { doctor: Doctor; showBio?: boolean }) {
  return (
    <article className="group h-full overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-primary-100 to-primary-200">
        {doctor.photo ? (
          <Image
            src={doctor.photo}
            alt={`${doctor.degree} ${doctor.name}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-end justify-center">
            <div aria-hidden className="absolute left-1/2 top-[38%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-[16px] border-white/50" />
            <UserRound className="relative mb-6 h-36 w-36 text-primary-700/35" strokeWidth={1.2} aria-hidden />
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-700">{doctor.degree}</p>
        <h3 className="mt-1 font-display text-xl font-bold text-ink">{doctor.name}</h3>
        <p className="mt-1 text-muted">{[doctor.position, doctor.specialty].filter(Boolean).join(" · ")}</p>
        {showBio && doctor.bio ? <p className="mt-3 border-t border-line pt-3 text-[0.95rem] text-ink-soft">{doctor.bio}</p> : null}
      </div>
    </article>
  );
}
