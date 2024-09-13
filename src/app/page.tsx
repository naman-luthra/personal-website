"use client";
import Header from "@/components/Header";
import AboutSection from "@/sections/AboutSection";
import ExperienceSection from "@/sections/ExperienceSection";
import ProjectsSection from "@/sections/ProjectsSection";
import MySkills from "@/sections/SkillsSection";
import { getTranslatedContent } from "@/util/getTranslate";
import { useState, useEffect } from "react";

export default function Home() {
  const [languageCode, setLanguageCode] = useState("eng"); // Set default language code

  useEffect(() => {
    // Access localStorage only on client side
    const storedLanguageCode = localStorage.getItem('language_code');
    if (storedLanguageCode) {
      setLanguageCode(storedLanguageCode); // Update state if a value is found in localStorage
    }
  }, []);

  useEffect(() => {
    const title = getTranslatedContent("NAME", "ABOUT", languageCode);
    document.title = title;
    if (languageCode !== "eng") {
      localStorage.setItem('language_code', languageCode); // Persist language setting in localStorage
    }
  }, [languageCode]);

  return (
    <>
      <main className="min-h-screen w-full overflow-hidden p-5 md:p-10 lg:p-32 lg:pt-16">
        <Header languageCode={languageCode} setLanguageCode={setLanguageCode}/>
        <div className="flex flex-col items-center justify-between mt-10 md:mt-20 gap-20 md:gap-40">
          <AboutSection languageCode={languageCode} />
          <MySkills languageCode={languageCode} />
          <ExperienceSection languageCode={languageCode} />
          <ProjectsSection languageCode={languageCode} />
        </div>
      </main>
    </>
  );
}