"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    VKIDSDK?: any;
  }
}

type CompletePayload = {
  vkId: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
};

function extractVkProfile(data: any): CompletePayload {
  const user =
    data?.user ||
    data?.users?.[0] ||
    data?.response?.[0] ||
    data?.result?.user ||
    data?.result?.users?.[0] ||
    data;

  const vkId = String(
    user?.user_id ||
      user?.id ||
      user?.sub ||
      user?.vk_user_id ||
      "",
  ).trim();

  return {
    vkId,
    email: data?.email || user?.email || null,
    firstName:
      user?.first_name ||
      user?.firstName ||
      user?.given_name ||
      null,
    lastName:
      user?.last_name ||
      user?.lastName ||
      user?.family_name ||
      null,
    avatarUrl:
      user?.avatar ||
      user?.avatar_url ||
      user?.photo_200 ||
      user?.picture ||
      null,
  };
}

export default function VkCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [statusText, setStatusText] = useState(
    "Подтверждаем вход через ВКонтакте...",
  );
  const [errorText, setErrorText] = useState("");
  const hasStartedRef = useRef(false);

  const callbackCode = useMemo(
    () => searchParams.get("code") || "",
    [searchParams],
  );
  const deviceId = useMemo(
    () => searchParams.get("device_id") || "",
    [searchParams],
  );

  const completeLogin = useCallback(async () => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    if (!callbackCode || !deviceId || !window.VKIDSDK) {
      setErrorText("Не удалось завершить вход через ВКонтакте");
      setStatusText("");
      return;
    }

    try {
      const VKID = window.VKIDSDK;
      const appId = process.env.NEXT_PUBLIC_VK_APP_ID;
      const redirectUri = process.env.NEXT_PUBLIC_VK_REDIRECT_URI;

      if (!appId || !redirectUri) {
        throw new Error("VK ID не настроен");
      }

      VKID.Config.init({
        app: Number(appId),
        redirectUrl: redirectUri,
        responseMode: VKID.ConfigResponseMode.Callback,
        source: VKID.ConfigSource.LOWCODE,
        scope: "email",
      });

      const authData = await VKID.Auth.exchangeCode(callbackCode, deviceId);
      const userInfo = await VKID.Auth.userInfo(authData.access_token);
      const payload = extractVkProfile(userInfo);

      if (!payload.vkId) {
        throw new Error("Не удалось получить профиль пользователя VK");
      }

      const response = await fetch("/api/auth/vk/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Ошибка входа через ВКонтакте");
      }

      setStatusText("Вход выполнен успешно. Перенаправляем...");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? error.message
          : "Не удалось выполнить вход через ВКонтакте",
      );
      setStatusText("");
    }
  }, [callbackCode, deviceId, router]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (window.VKIDSDK) {
        window.clearInterval(timer);
        void completeLogin();
      }
    }, 150);

    return () => window.clearInterval(timer);
  }, [completeLogin]);

  return (
    <>
      {statusText ? (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#d8e8d5] bg-[#f5fbf3] px-4 py-4 text-[#4f7a4c]">
          <Loader2 className="size-4.5 animate-spin" />
          <span>{statusText}</span>
        </div>
      ) : null}

      {errorText ? (
        <div className="mt-6 rounded-2xl border border-[#e7c6c6] bg-[#fff4f4] px-4 py-4 text-[#9a4b4b]">
          {errorText}
        </div>
      ) : null}
    </>
  );
}
