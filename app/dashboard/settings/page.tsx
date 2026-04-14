import { redirect } from "next/navigation";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import DashboardSettings from "@/components/dashboard/dashboard-settings";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { clearSessionCookie, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardSettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      login: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/auth/sign-in");
  }

  async function logoutAction() {
    "use server";
    await clearSessionCookie();
    redirect("/auth/sign-in");
  }

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />

      <DashboardSettings login={user.login} email={user.email} />

      <section className="pb-12 sm:pb-14 lg:pb-18">
        <Container>
          <div className="max-w-3xl">
            <form action={logoutAction}>
              <Button
                type="submit"
                size="lg"
                className="h-14 rounded-[20px] border border-[#d9a3a3] bg-[#b94f4f] px-8 text-white shadow-[0_16px_40px_rgba(145,53,53,0.18)] transition-all duration-300 hover:bg-[#a84444] hover:shadow-[0_22px_52px_rgba(145,53,53,0.24)]"
              >
                Выйти из аккаунта
              </Button>
            </form>
          </div>
        </Container>
      </section>

      <SiteFooter />
    </main>
  );
}
