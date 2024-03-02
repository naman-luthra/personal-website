import AboutSection from "@/sections/AboutSection";
import ExperienceSection from "@/sections/ExperienceSection";
import ProjectsSection from "@/sections/ProjectsSection";
import MySkills from "@/sections/SkillsSection";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full overflow-hidden flex-col items-center justify-between p-5 pt-10 md:p-20 lg:p-32 gap-20 md:gap-40">
      <AboutSection />
      <MySkills />
      <ExperienceSection />
      <ProjectsSection />
    </main>
  );
}
