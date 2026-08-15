import { SectionHeader } from "@/components/ui/section-header";
import { FeatureCard } from "@/components/ui/card";
import { Code, PenTool, Lightbulb, GraduationCap } from "lucide-react";

export function AboutSection({ tAbout, tParticipants }: { tAbout: any, tParticipants: any }) {
  return (
    <section id="about" className="bg-canvas py-[120px] px-8">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeader 
          eyebrow={`[${tAbout('eyebrow')}]`}
          title={tAbout('title')}
          description={tAbout('description')}
        />

        <div className="mt-[120px]">
          <SectionHeader 
            eyebrow={`[${tParticipants('eyebrow')}]`}
            title={tParticipants('title')}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={Code}
              title={tParticipants('dev')}
              description={tParticipants('devDesc')}
            />
            <FeatureCard 
              icon={PenTool}
              title={tParticipants('design')}
              description={tParticipants('designDesc')}
            />
            <FeatureCard 
              icon={Lightbulb}
              title={tParticipants('product')}
              description={tParticipants('productDesc')}
            />
            <FeatureCard 
              icon={GraduationCap}
              title={tParticipants('student')}
              description={tParticipants('studentDesc')}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
