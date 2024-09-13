'use client'

import FormattedText from "@/components/FormattedText";
import { getTranslatedContent, getUntranslatedContent } from "@/util/getTranslate";
import { IoArrowBackCircleSharp, IoArrowForwardCircleSharp } from "react-icons/io5";
import { useState } from "react";

type Experience = {
    title: string;
    company: string;
    logo: string;
    startDate: string;
    endDate: string;
    techstack: string[];
    description: string;
};

/**
 * ExperienceCard is a component that displays the user's experience.
 * It includes the user's experience data and a button to download the user's resume.
 * 
 * @returns The ExperienceCard component.
 */
const ExperienceCard = ({exp, style, languageCode}: {
    exp: Experience;
    style: React.CSSProperties;
    languageCode: string;
}) => {
    return (
        <div className="flex flex-col gap-2 md:gap-8 justify-center" style={style}>
            <div>
                <div className="text-xl md:text-2xl font-semibold">{exp.title}</div>
                <div className="text-xl md:text-2xl text-gray-100 mt-2">{exp.company}</div>
                <div className="mt-1 text-gray-100">{exp.startDate} - {exp.endDate}</div>
                <div className="text-lg font-medium mt-4 text-gray-100">{getTranslatedContent("SKILLS_USED","EXP",languageCode)}</div>
                <div className={`flex flex-wrap mt-1 font-mono text-sm font-thin gap-3 text-gray-100`}>
                    {exp.techstack.map(technology=>{
                        return(
                            <div key={technology}>{technology}</div>
                        );
                    })}
                </div>
                <FormattedText text={exp.description} className="mt-4 font-normal text-gray-200"/>
            </div>
        </div>
    );
}

/**
 * ExperienceSection is a component that displays the user's experience.
 * It includes the user's experience data and a button to download the user's resume.
 * 
 * @returns The ExperienceSection component.
 */
const ExperienceSection = ({languageCode}: {languageCode: string}) => {
    const experienceKeys = ["WFX_FTE", "WFX_INTERN","CLRFD_INTERN","BYS_INTERN","BYT_INTERN"];
    const experienceData: Experience[] = experienceKeys.map((key)=>({
        title: getTranslatedContent(`${key}.TITLE`,"EXP",languageCode),
        company: getTranslatedContent(`${key}.COMPANY`,"EXP",languageCode),
        logo: getUntranslatedContent(`${key}.LOGO`,"EXP"),
        startDate: getTranslatedContent(`${key}.START_DATE`,"EXP",languageCode),
        endDate: getTranslatedContent(`${key}.END_DATE`,"EXP",languageCode),
        techstack: getUntranslatedContent(`${key}.TECHSTACK`,"EXP"),
        description: getTranslatedContent(`${key}.DESCRIPTION`,"EXP",languageCode)
    }));

    const [selectedExperience, setSelectedExperience] = useState(0);

    return (
        <div className="md:w-5/6 lg:w-4/5 xl:w-2/3 mx-auto" id="experience-section">
            <div className="font-bold text-2xl text-center md:text-left">{getTranslatedContent("HEADER","EXP", languageCode)}</div>
            <div className="md:grid md:grid-cols-4 gap-8 w-full min-h-[36rem] md:min-h-[28rem] mt-8">
                <div className="flex md:flex-col md:text-lg w-full h-fit overflow-x-auto max-w-[90vw]">
                    <button disabled={selectedExperience===0} onClick={()=>{setSelectedExperience(i => i-1)}} className="md:hidden text-4xl pr-2 disabled:text-theme-darkest">
                        <IoArrowBackCircleSharp />
                    </button>
                    {
                        experienceData.map((exp,index)=>{
                            return(
                                <>
                                    <div key={index} onClick={()=>{setSelectedExperience(index)}} className={`cursor-pointer grow border-t-2 md:border-t-0 md:border-l-2 py-3 px-4 ${selectedExperience===index ? "border-theme-light-text bg-theme-muted-dark-medium text-center md:text-left" : "hidden md:block border-gray-400 text-gray-400"}`}>
                                        <div className={`${selectedExperience===index ? "font-semibold" : ""}`}>
                                            {exp.company}
                                        </div>
                                    </div>
                                </>
                            );
                        })
                    }
                    <button disabled={selectedExperience===experienceData.length-1} onClick={()=>{setSelectedExperience(i => i+1)}} className="md:hidden text-4xl pl-2 disabled:text-theme-darkest">
                        <IoArrowForwardCircleSharp />
                    </button>
                </div>
                <div className="mt-8 md:mt-0 md:col-span-3">
                    {
                        experienceData.map((exp,index)=>{
                            return(
                                <ExperienceCard
                                    key={index}
                                    exp={exp}
                                    style={{display: selectedExperience===index ? "block" : "none"}}
                                    languageCode={languageCode}
                                />
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default ExperienceSection;