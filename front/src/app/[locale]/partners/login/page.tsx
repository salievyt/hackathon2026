import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PartnerLoginForm } from "@/components/sections/partner/PartnerLoginForm";

export default async function PartnerLoginPage() {
  const t = await getTranslations("PartnerAuth");

  return (
    <>
      <Navbar />
      <main className="bg-canvas px-8 py-24">
        <div className="max-w-[600px] mx-auto text-center mb-12">
          <div className="text-eyebrow text-primary mb-6">[{t("eyebrow")}]</div>
          <h1 className="text-display-lg text-ink mb-4">{t("title")}</h1>
          <p className="text-lead text-ink-muted">{t("subtitle")}</p>
        </div>
        <PartnerLoginForm />
      </main>
      <Footer />
    </>
  );
}
