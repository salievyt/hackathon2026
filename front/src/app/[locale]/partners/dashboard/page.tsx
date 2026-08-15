import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PartnerDashboard } from "@/components/sections/partner/PartnerDashboard";

export default async function PartnerDashboardPage() {
  const t = await getTranslations("PartnerDashboard");

  return (
    <>
      <Navbar />
      <main className="bg-canvas px-8 py-24">
        <div className="max-w-[980px] mx-auto mb-16">
          <div className="text-eyebrow text-primary mb-3">[{t("eyebrow")}]</div>
          <h1 className="text-display-lg text-ink">{t("title")}</h1>
        </div>
        <PartnerDashboard />
      </main>
      <Footer />
    </>
  );
}
