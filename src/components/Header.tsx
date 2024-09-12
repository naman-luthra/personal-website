"use client"
import Image from 'next/image';
import React, { useState } from 'react';
import { IoMenuOutline, IoCloseCircleOutline } from "react-icons/io5";


interface Section {
    id: string;
    displayText: string;
}

const Header: React.FC = () => {
    const sections: Section[] = [
        { id: 'about-section', displayText: 'About' },
        { id: 'skills-section', displayText: 'Skills' },
        { id: 'experience-section', displayText: 'Experience' },
        { id: 'projects-section', displayText: 'Projects' }
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

    return (
        <nav className="flex justify-between items-center text-lg md:text-xl w-full">
            <Image src="/icons/nl.svg" alt="Logo" width={80} height={80} />
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
            <div className="md:hidden">
                <button onClick={toggleMenu}>
                    <IoMenuOutline className="text-4xl"/>
                </button>
            </div>
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
    );
};

export default Header;