import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LegalContent } from "@/components/sections/LegalContent";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <LegalContent section="Terms" />
      <Footer />
    </>
  );
}
