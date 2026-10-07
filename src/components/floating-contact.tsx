"use client";

import { useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import clsx from "clsx";
import { MessengerIcon, ZaloIcon } from "./brand-icons";

export function FloatingContact({ hotline, zaloUrl, messengerUrl }: { hotline: string; zaloUrl: string; messengerUrl: string }) {
  const [open, setOpen] = useState(false);
  const tel = hotline.replace(/[^\d+]/g, "");

  const items = [
    { href: zaloUrl, label: "Chat Zalo", icon: <ZaloIcon className="h-7 w-7" />, bg: "bg-white", external: true },
    {
      href: messengerUrl,
      label: "Chat Messenger",
      icon: <MessengerIcon className="h-6 w-6 text-white" />,
      bg: "bg-gradient-to-br from-[#00B2FF] to-[#006AFF]",
      external: true,
    },
    { href: `tel:${tel}`, label: `Gọi ${hotline}`, icon: <Phone className="h-6 w-6 text-white" aria-hidden />, bg: "bg-primary-700", external: false },
  ];

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <ul
        className={clsx(
          "flex flex-col items-end gap-3 transition-all duration-300",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
        aria-hidden={!open}
      >
        {items.map((it) => (
          <li key={it.label}>
            <a
              href={it.href}
              target={it.external ? "_blank" : undefined}
              rel={it.external ? "noopener noreferrer" : undefined}
              tabIndex={open ? 0 : -1}
              className="group flex items-center gap-3"
            >
              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink shadow-soft">{it.label}</span>
              <span className={clsx("flex h-12 w-12 items-center justify-center rounded-full shadow-lift ring-1 ring-black/5 transition-transform group-hover:scale-110", it.bg)}>
                {it.icon}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Đóng liên hệ nhanh" : "Mở liên hệ nhanh: Zalo, Messenger, gọi điện"}
        className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary-700 text-white shadow-lift transition hover:bg-primary-800"
      >
        {!open ? <span className="absolute inset-0 rounded-full bg-primary-500 animate-pulse-ring" aria-hidden /> : null}
        {open ? <X className="relative h-6 w-6" aria-hidden /> : <MessageCircle className="relative h-6 w-6" aria-hidden />}
      </button>
    </div>
  );
}
