'use client'

import FormattedText from "@/components/FormattedText";
import { getTranslatedContent, getUntranslatedContent } from "@/util/getTranslate";
import Image from "next/image";
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
const ExperienceCard = ({exp, style}: {
    exp: Experience;
    style: React.CSSProperties;
}) => {
    const languageCode = "en";
    return (
        <div className="flex flex-col gap-2 md:gap-8 justify-center" style={style}>
            <div className="h-16 w-full relative">
                <Image src={exp.logo} alt="" fill objectFit="contain" objectPosition="left"/>
            </div>
            <div className="text-white mt-4">
                <div className="text-xl md:text-2xl font-bold">{exp.title}</div>
                <div className="text-2xl md:text-3xl font-semibold">{exp.company}</div>
                <div className="font-semibold mt-1">{exp.startDate} - {exp.endDate}</div>
                <div className="text-lg font-medium mt-4">{getTranslatedContent("SKILLS_USED","EXP",languageCode)}</div>
                <div className={`flex flex-wrap mt-1 font-mono text-sm font-thin gap-3`}>
                    {exp.techstack.map(technology=>{
                        return(
                            <div key={technology}>{technology}</div>
                        );
                    })}
                </div>
                <FormattedText text={exp.description} className="mt-4 font-normal"/>
            </div>
        </div>
    );
}

const ExperienceSection = () => {
    const experienceKeys = ["WFX_INTERN","CLRFD_INTERN","BYS_INTERN","BYT_INTERN"];
    const languageCode = "en";
    const experienceData: Experience[] = experienceKeys.map((key)=>({
        title: getUntranslatedContent(`${key}.TITLE`,"EXP"),
        company: getUntranslatedContent(`${key}.COMPANY`,"EXP"),
        logo: getUntranslatedContent(`${key}.LOGO`,"EXP"),
        startDate: getTranslatedContent(`${key}.START_DATE`,"EXP",languageCode),
        endDate: getTranslatedContent(`${key}.END_DATE`,"EXP",languageCode),
        techstack: getUntranslatedContent(`${key}.TECHSTACK`,"EXP"),
        description: getTranslatedContent(`${key}.DESCRIPTION`,"EXP",languageCode)
    }));

    const [selectedExperience, setSelectedExperience] = useState(0);

    return (
        <div className="w-full">
            <div className="font-bold text-4xl">Work Experience</div>
            <div className="grid md:grid-cols-4 gap-8 w-full h-[48rem] md:h-[28rem] mt-8">
                <div className="">
                    <div className="hidden md:block">{experienceData[0].endDate}</div>
                    <div className="flex md:flex-col items-center w-full md:w-fit">
                        <div className="w-8 h-0.5 md:h-12 md:w-0.5 bg-white opacity-80 md:mt-4"/>
                        {
                            experienceData.map((exp,index)=>{
                                return(
                                    <>
                                        <div className={`relative ${selectedExperience===index ? "w-4 h-4 bg-none border-4 border-white" : "w-2 h-2 opacity-80 bg-white hover:opacity-100"} rounded-full`}>
                                            <div key={index} onClick={()=>{setSelectedExperience(index)}} className={`cursor-pointer absolute top-8 -translate-x-1/2 md:translate-x-0 md:left-8 md:-translate-y-1/2 font-semibold ${selectedExperience===index ? "text-xl md:top-2" : "md:top-1"}`}>
                                                {exp.company}
                                            </div>
                                        </div>
                                        <div className={`${index===experienceData.length-1 ? "w-8" : "grow"} h-0.5 md:h-12 md:w-0.5 bg-white`}/>
                                    </>
                                );
                            })
                        }
                    </div>
                    <div className="md:mt-4 hidden md:block">{experienceData[experienceData.length-1].endDate}</div>
                </div>
                <div className="mt-16 md:mt-0 md:col-span-3">
                    {
                        experienceData.map((exp,index)=>{
                            return(
                                <ExperienceCard
                                    key={index}
                                    exp={exp}
                                    style={{display: selectedExperience===index ? "block" : "none"}}
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