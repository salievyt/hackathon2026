import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LegalContent } from "@/components/sections/LegalContent";

export default function ConductPage() {
  return (
    <>
      <Navbar />
      <LegalContent section="Conduct" />
      <Footer />
    </>
  );
}
