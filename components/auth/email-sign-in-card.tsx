"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "login" | "register";

type ApiError = {
  error?: string;
};

export default function EmailSignInCard() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerLogin, setRegisterLogin] = useState("");
  const [registerNickname, setRegisterNickname] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const title = useMemo(() => {
    return mode === "login" ? "Вход в аккаунт" : "Создать аккаунт";
  }, [mode]);

  const description = useMemo(() => {
    return mode === "login"
      ? "Войди по email или логину и продолжи работу с заказами."
      : "Создай аккаунт, чтобы хранить заказы, баланс кредитов и историю генераций.";
  }, [mode]);

  async function parseError(response: Response): Promise<string> {
    try {
      const data = (await response.json()) as ApiError;
      return data.error || "Произошла ошибка";
    } catch {
      return "Произошла ошибка";
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorText("");
    setSuccessText("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });

      if (!response.ok) {
        setErrorText(await parseError(response));
        setIsSubmitting(false);
        return;
      }

      setSuccessText("Вход выполнен успешно. Перенаправляем в кабинет...");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorText("Не удалось выполнить вход");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorText("");
    setSuccessText("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: registerEmail.trim(),
          login: registerLogin.trim(),
          nickname: registerNickname.trim(),
          password: registerPassword,
        }),
      });

      if (!response.ok) {
        setErrorText(await parseError(response));
        setIsSubmitting(false);
        return;
      }

      setSuccessText("Аккаунт создан. Перенаправляем в кабинет...");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorText("Не удалось зарегистрировать пользователя");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="overflow-hidden rounded-[32px] border border-[#eadfd6] bg-white/90 shadow-[0_24px_80px_rgba(88,62,40,0.08)]">
      <CardHeader className="border-b border-[#efe4db] bg-[linear-gradient(180deg,#fffaf6_0%,#f7efe8_100%)]">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorText("");
              setSuccessText("");
            }}
            className={`rounded-full px-4 py-2 text-sm transition ${
              mode === "login"
                ? "bg-[#b79273] text-white"
                : "border border-[#d8c5b7] text-[#5f5248] hover:bg-[#efe4db]"
            }`}
          >
            Вход
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorText("");
              setSuccessText("");
            }}
            className={`rounded-full px-4 py-2 text-sm transition ${
              mode === "register"
                ? "bg-[#b79273] text-white"
                : "border border-[#d8c5b7] text-[#5f5248] hover:bg-[#efe4db]"
            }`}
          >
            Регистрация
          </button>
        </div>

        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        {errorText ? (
          <div className="mb-5 rounded-2xl border border-[#e7c6c6] bg-[#fff4f4] px-4 py-3 text-sm text-[#9a4b4b]">
            {errorText}
          </div>
        ) : null}

        {successText ? (
          <div className="mb-5 rounded-2xl border border-[#d8e8d5] bg-[#f5fbf3] px-4 py-3 text-sm text-[#4f7a4c]">
            {successText}
          </div>
        ) : null}

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm text-[#6f6156]">
                Email или логин
              </span>
              <Input
                placeholder="Введите email или login"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                autoComplete="username"
                disabled={isSubmitting}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-[#6f6156]">Пароль</span>

              <div className="relative">
                <Input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Введите пароль"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className="pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f7f73] transition hover:text-[#5f5248]"
                  aria-label="Показать или скрыть пароль"
                >
                  {showLoginPassword ? (
                    <EyeOff className="size-4.5" />
                  ) : (
                    <Eye className="size-4.5" />
                  )}
                </button>
              </div>
            </label>

            <Button type="submit" size="xl" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4.5 animate-spin" />
                  Входим...
                </>
              ) : (
                "Войти"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm text-[#6f6156]">Email</span>
              <Input
                type="email"
                placeholder="Введите email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                autoComplete="email"
                disabled={isSubmitting}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-[#6f6156]">Логин</span>
                <Input
                  placeholder="Например: atelia_user"
                  value={registerLogin}
                  onChange={(e) => setRegisterLogin(e.target.value)}
                  autoComplete="username"
                  disabled={isSubmitting}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-[#6f6156]">Никнейм</span>
                <Input
                  placeholder="Как тебя показывать в кабинете"
                  value={registerNickname}
                  onChange={(e) => setRegisterNickname(e.target.value)}
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm text-[#6f6156]">Пароль</span>

              <div className="relative">
                <Input
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder="Минимум 6 символов"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  className="pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowRegisterPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f7f73] transition hover:text-[#5f5248]"
                  aria-label="Показать или скрыть пароль"
                >
                  {showRegisterPassword ? (
                    <EyeOff className="size-4.5" />
                  ) : (
                    <Eye className="size-4.5" />
                  )}
                </button>
              </div>
            </label>

            <Button type="submit" size="xl" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4.5 animate-spin" />
                  Создаем аккаунт...
                </>
              ) : (
                "Создать аккаунт"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
