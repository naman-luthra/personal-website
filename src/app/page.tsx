import Header from "@/components/Header";
import AboutSection from "@/sections/AboutSection";
import ExperienceSection from "@/sections/ExperienceSection";
import ProjectsSection from "@/sections/ProjectsSection";
import MySkills from "@/sections/SkillsSection";

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-hidden p-5 pt-2 md:p-10 lg:p-32 lg:pt-16 bg-black text-white">
      <Header />
      <div className="flex flex-col items-center justify-between mt-20 gap-20 md:gap-40">
        <AboutSection />
        <MySkills />
        <ExperienceSection />
        <ProjectsSection />
      </div>
    </main>
  );
}
