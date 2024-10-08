'use client';
import * as d3 from "d3";
import ReactDOM from 'react-dom/client';
import { useEffect, useState } from "react";
import { getTranslatedContent, getUntranslatedContent } from "@/util/getTranslate";

/**
 * SkillBubble is a component that displays the user's skill in a bubble format.
 * It includes the skill name, and the skill icon.
 * 
 * @returns The SkillBubble component.
 */
const SkillBubble = ({ data }: {
    data: any
}) => {
    return (
        <div className="rounded-full cursor-pointer absolute top-0 left-0 w-full h-full flex flex-col justify-center bg-gray-200 group-hover:scale-110 ease-in-out duration-300">
            <img src={data.icon} alt="" className="w-2/3 self-center" />
            <div className="bg-black text-white bg-opacity-50 hidden group-hover:flex rounded-full absolute top-0 left-0 w-full h-full text-center flex-col justify-center font-bold">{data.name}</div>
        </div>
    );
}

/**
 * SkillDatumD3 is a type that extends the d3.SimulationNodeDatum type.
 * It includes the skill id, name, icon, proficiency, and domain.
 * 
 * @returns The SkillDatumD3 type.
 */
interface SkillDatumD3 extends d3.SimulationNodeDatum {
    id: string;
    name: string;
    icon: string;
    proficiency: string;
    domain: string;
}


/**
 * MySkills is a component that displays the user's skills in form of floating and interactive bubbles.
 * 
 * @returns The MySkills component.
 */
const MySkills = ({languageCode}: {languageCode: string}) => {

    /**
     * skillKeys is an array that includes the skill names.
     * 
     * @returns The skillKeys array.
     */
    const skillKeys = [
        "REACT",
        "JAVASCRIPT",
        "TYPESCRIPT",
        "REDUX",
        "TAILWINDCSS",
        "NODEJS",
        "EXPRESSJS",
        "MONGODB",
        "MYSQL",
        "GIT",
        "CPP",
        "JAVA",
        "CASSANDRA",
        "ELASTICSEARCH",
        "CHROMIUM",
        "NEXT"
    ];


    const skillData = skillKeys.map((key) => ({
        id: getUntranslatedContent(`SKILLS.${key}.ID`, "SKILLS"),
        name: getUntranslatedContent(`SKILLS.${key}.NAME`, "SKILLS"),
        icon: getUntranslatedContent(`SKILLS.${key}.ICON`, "SKILLS"),
        proficiency: getUntranslatedContent(`SKILLS.${key}.PROFICIENCY`, "SKILLS")
    }));

    useEffect(() => {
        const skillDataD3: SkillDatumD3[] = skillData.map((skill) => {
            return {
                id: skill.id,
                name: skill.name,
                icon: skill.icon,
                proficiency: skill.proficiency,
                domain: "SKILLS"
            };
        });
        const width = document.getElementById("bubbleSkills")?.offsetWidth || 0;
        const height = document.getElementById("bubbleSkills")?.offsetHeight || 0;
        const radiusScale = d3.scaleSqrt().domain([1, 10]).range([width < 900 ? 10 : 12, width < 900 ? 60 : 80]);
        const simulation = d3.forceSimulation()
            .force("x", d3.forceX(width / 2).strength(0.05))
            .force("y", d3.forceY(height / 2).strength(width < 900 ? 0.05 : 0.15))
            .force("collide", d3.forceCollide((d: any) => (radiusScale(d.proficiency) + 12)));
        const dragstarted = (event: any, d: any) => {
            console.log("drag started", d)
            simulation.alphaTarget(0.3).restart();
            d.x = event.x;
            d.y = event.y;
        }
        const dragged = (event: any, d: any) => {
            d.x = event.x;
            d.y = event.y;
        }
        const dragended = () => {
            //simulation.alphaTarget(0);
        }
        const drag = d3.drag()
            .on("start", (event, d) => dragstarted(event, d))
            .on("drag", (event, d) => dragged(event, d))
            .on("end", (event, d) => dragended());

        const nodes = d3.select("#bubbleSkills").selectAll(".skill")
        nodes.data(skillDataD3);
        nodes.call(drag as any);
        const ticked = () => {
            skillDataD3.forEach((d: any) => {
                const element = document.getElementById(d.id);
                if (!element) return;
                element.style.left = `${d.x - radiusScale(d.proficiency)}px`;
                element.style.top = `${d.y - radiusScale(d.proficiency)}px`;
            });
        };
        skillDataD3.forEach((d: any) => {
            const elementNode = document.getElementById(d.id);
            if (!elementNode) return;
            elementNode.style.width = `${radiusScale(d.proficiency) * 2}px`;
            elementNode.style.height = `${radiusScale(d.proficiency) * 2}px`;
        });
        simulation.nodes(skillDataD3).on("tick", ticked);

        return () => {
            simulation.stop();
        }
    }, []);

    return (
        <div id="skills-section" className="w-full relative">
            <div className="font-semibold text-2xl md:text-3xl z-10 pb-4 pr-4">{getTranslatedContent("HEADER", "SKILLS", languageCode)}</div>
            <div id="bubbleSkills" className="w-full h-[600px] md:h-[600px] relative mt-2 overflow-hidden  text-center">
                {
                    skillData.map((skill) => {
                        return (
                            <div
                                key={skill.id}
                                id={skill.id}
                                className="absolute skill inline-block group rounded-full w-12 h-12"
                            >
                                <SkillBubble data={skill} />
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}
export default MySkills;