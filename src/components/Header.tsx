"use client"
import { getTranslatedContent } from '@/util/getTranslate';
import { getColorPalette, getLanguageName, Languages, useThrottle } from '@/util/util';
import Image from 'next/image';
import React, { use, useEffect, useState } from 'react';
import { IoMdArrowDropdownCircle } from 'react-icons/io';
import { IoMenuOutline, IoCloseCircleOutline } from "react-icons/io5";


interface Section {
    id: string;
    displayText: string;
}

/**
 * Header is a component that displays the user's header.
 * It includes the user's sections and logo.
 * 
 * @returns The Header component.
 */
const Header = ({languageCode, setLanguageCode}: {languageCode: string, setLanguageCode: (languageCode: string) => void}) => {
    const sections: Section[] = [
        { id: 'about-section', displayText: getTranslatedContent("ABOUT","HEADER",languageCode) },
        { id: 'skills-section', displayText: getTranslatedContent("SKILLS","HEADER",languageCode) },
        { id: 'experience-section', displayText: getTranslatedContent("EXPERIENCE","HEADER",languageCode) },
        { id: 'projects-section', displayText: getTranslatedContent("PROJECTS","HEADER",languageCode) }
    ];

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const [theme, setTheme] = useState("#20232d");

    const selectedLanguage = getLanguageName(languageCode);
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

    const throttledTheme = useThrottle(theme, 50);

    useEffect(() => {
        const palette = getColorPalette(throttledTheme);
        document.documentElement.style.setProperty('--color-theme', palette.default);
        document.documentElement.style.setProperty('--color-theme-light', palette.light);
        document.documentElement.style.setProperty('--color-theme-lightest', palette.lightest);
        document.documentElement.style.setProperty('--color-theme-dark', palette.dark);
        document.documentElement.style.setProperty('--color-theme-darkest', palette.darkest);
        document.documentElement.style.setProperty('--color-theme-light-text', palette.lightText);
        document.documentElement.style.setProperty('--color-theme-dark-text', palette.darkText);
        document.documentElement.style.setProperty('--color-theme-muted-light', palette.mutedLight);
        document.documentElement.style.setProperty('--color-theme-muted-dark', palette.mutedDark);
        document.documentElement.style.setProperty('--color-theme-muted-medium', palette.mutedMedium);
        document.documentElement.style.setProperty('--color-theme-muted-light-medium', palette.mutedLightMedium);
        document.documentElement.style.setProperty('--color-theme-muted-dark-medium', palette.mutedDarkMedium);

        if (throttledTheme !== "#20232d") {
            localStorage.setItem('theme_base', throttledTheme);
        }
    }, [throttledTheme]);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme_base');
        if (storedTheme) {
            setTheme(storedTheme);
        }
    }, []);

    return (
        <>
            <nav className="flex justify-between items-center text-lg md:text-xl w-full">
                <div className="flex gap-2 items-center group-hover:text-theme-light">
                    <div className="flex text-base items-center gap-2 px-4 py-2 rounded-full bg-theme-muted-dark-medium group cursor-pointer border border-theme-muted-dark-medium hover:border-theme-light transition-all duration-300">
                        <div className="font-semibold">{getTranslatedContent("THEME","HEADER",languageCode)}</div>
                        <div className="color-picker-wrapper border border-theme-lightest w-5 h-5 rounded-full bg-theme relative cursor-pointer overflow-hidden group-hover:scale-125 transition-all duration-300" title="Change Theme Color">
                            <input type="color" className="color-picker-input absolute w-full h-full opacity-0 cursor-pointer" value={theme} onChange={(e) => setTheme(e.target.value)}/>
                        </div>
                    </div>
                    <div onClick={()=>{setLanguageDropdownOpen(!languageDropdownOpen)}} className="flex text-base items-center gap-2 px-4 py-2 rounded-full bg-theme-muted-dark-medium group cursor-pointer border border-theme-muted-dark-medium hover:border-theme-light transition-all duration-300 relative">
                        <div className="group-hover:text-theme-light">{selectedLanguage}</div>
                        <div className="text-2xl group-hover:scale-125 transition-all duration-300"><IoMdArrowDropdownCircle /></div>
                        {
                            languageDropdownOpen && (
                                <div className="absolute top-12 left-0 w-full flex flex-col gap-2 z-50">
                                    {Languages.map((language) => (
                                        <button
                                            key={language}
                                            onClick={() => {
                                                setLanguageCode(language);
                                                setLanguageDropdownOpen(false);
                                            }}
                                            className="px-4 py-1 text-sm rounded-full bg-theme-muted-dark-medium hover:bg-theme-light hover:text-theme-dark-text transition-all duration-300"
                                        >
                                            {getLanguageName(language)}
                                        </button>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                </div>
                <Image src="/icons/nl.svg" alt="Logo" width={80} height={80} className="hidden md:block"/>
                <div className="space-x-4 items-center hidden md:flex">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className="invert-0 mix-blend-difference transition-colors duration-300"
                        >
                            {section.displayText}
                        </button>
                    ))}
                </div>
                <button className="md:hidden" onClick={toggleMenu}>
                    <IoMenuOutline className="text-4xl"/>
                </button>
                {isMenuOpen && (
                    <div className="md:hidden text-2xl fixed z-50 flex flex-col justify-center items-center gap-10 top-0 left-0 h-screen w-screen backdrop-blur-lg">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => {
                                    scrollToSection(section.id);
                                    toggleMenu();
                                }}
                            >
                                {section.displayText}
                            </button>
                        ))}
                        <button
                            onClick={toggleMenu}
                            className="absolute top-10 right-10"
                        >
                            <IoCloseCircleOutline className="text-5xl"/>
                        </button>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Header;