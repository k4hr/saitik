"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const COOKIE_STORAGE_KEY = "atelia_cookie_consent_v1";

export default function CookieConsentBanner() {
  const [isMounted, setIsMounted] = useState(false);
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const value = window.localStorage.getItem(COOKIE_STORAGE_KEY);
    setAccepted(value === "accepted");
    setIsMounted(true);
  }, []);

  function handleAccept() {
    window.localStorage.setItem(COOKIE_STORAGE_KEY, "accepted");
    setAccepted(true);
  }

  function handleClose() {
    setAccepted(true);
  }

  if (!isMounted || accepted) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-[100] px-4">
      <div className="relative mx-auto max-w-[720px] rounded-[28px] border border-[#d8cbbf] bg-[#f8f2ed]/95 p-4 shadow-[0_18px_46px_rgba(61,49,40,0.20)] backdrop-blur-md sm:p-5">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Закрыть уведомление"
          className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-full border border-[#dfd1c4] bg-white/80 text-[#7a6b5f] transition hover:bg-white hover:text-[#3d3128]"
        >
          <X className="size-4.5" />
        </button>

        <p className="pr-12 text-sm leading-7 text-[#5f5248] sm:text-base">
          Мы используем cookies для улучшения сервиса.{" "}
          <Link
            href="/privacy-policy"
            className="underline underline-offset-4 transition hover:text-[#3d3128]"
          >
            Политика конфиденциальности
          </Link>
        </p>

        <button
          type="button"
          onClick={handleAccept}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#b79273] px-6 py-4 text-base font-medium text-white transition hover:bg-[#a88466]"
        >
          Принять
        </button>
      </div>
    </div>
  );
}
