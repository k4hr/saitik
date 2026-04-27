"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

export default function VkSignInButton() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInitializedRef = useRef(false);

  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (!sdkLoaded || !window.VKIDSDK || !containerRef.current || isInitializedRef.current) {
      return;
    }

    const appId = process.env.NEXT_PUBLIC_VK_APP_ID;
    const redirectUri = process.env.NEXT_PUBLIC_VK_REDIRECT_URI;

    if (!appId || !redirectUri) {
      setErrorText("VK ID не настроен");
      return;
    }

    try {
      const VKID = window.VKIDSDK;

      VKID.Config.init({
        app: Number(appId),
        redirectUrl: redirectUri,
        responseMode: VKID.ConfigResponseMode.Callback,
        source: VKID.ConfigSource.LOWCODE,
        scope: "email",
      });

      containerRef.current.innerHTML = "";

      const oneTap = new VKID.OneTap();

      oneTap
        .render({
          container: containerRef.current,
          showAlternativeLogin: false,
        })
        .on(VKID.WidgetEvents.ERROR, () => {
          setErrorText("Не удалось загрузить вход через ВКонтакте");
        })
        .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, async (payload: any) => {
          try {
            setErrorText("");

            const authData = await VKID.Auth.exchangeCode(
              payload.code,
              payload.device_id,
            );

            const userInfo = await VKID.Auth.userInfo(authData.access_token);
            const completePayload = extractVkProfile(userInfo);

            if (!completePayload.vkId) {
              throw new Error("Не удалось получить данные профиля VK");
            }

            const response = await fetch("/api/auth/vk/complete", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(completePayload),
            });

            const data = (await response.json()) as { error?: string };

            if (!response.ok) {
              throw new Error(data.error || "Ошибка входа через ВКонтакте");
            }

            router.push("/dashboard");
            router.refresh();
          } catch (error) {
            setErrorText(
              error instanceof Error
                ? error.message
                : "Не удалось выполнить вход через ВКонтакте",
            );
          }
        });

      isInitializedRef.current = true;
    } catch {
      setErrorText("Не удалось инициализировать VK ID");
    }
  }, [router, sdkLoaded]);

  return (
    <div>
      <Script
        src="https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js"
        strategy="afterInteractive"
        onLoad={() => setSdkLoaded(true)}
      />

      <div ref={containerRef} />

      {errorText ? (
        <div className="mt-3 rounded-2xl border border-[#e7c6c6] bg-[#fff4f4] px-4 py-3 text-sm text-[#9a4b4b]">
          {errorText}
        </div>
      ) : null}
    </div>
  );
}
