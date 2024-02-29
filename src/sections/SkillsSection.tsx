'use client';
import * as d3 from "d3";
import ReactDOM from 'react-dom/client';
import { useEffect, useState } from "react";
import { getTranslatedContent, getUntranslatedContent } from "@/util/getTranslate";
const SkillBubble = ({data}:{
    data: any
})=>{
    return (
        <div className="rounded-full cursor-pointer absolute top-0 left-0 w-full h-full text-black flex flex-col justify-center bg-gray-200 group-hover:scale-110 ease-in-out duration-300">
            <img src={data.icon} alt="" className="w-2/3 self-center"/>
            <div className="bg-black bg-opacity-50 hidden group-hover:flex rounded-full absolute top-0 left-0 w-full h-full text-center flex-col justify-center font-bold text-white">{data.name}</div>
        </div>
    );
}
interface SkillDatumD3 extends d3.SimulationNodeDatum {
    id: string;
    name: string;
    icon: string;
    proficiency: string;
    domain: string;
}

const MySkills = () => {
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
      "CHROMIUM"
    ];

    const skillData = skillKeys.map((key)=>({
        id: getUntranslatedContent(`SKILLS.${key}.ID`,"SKILLS"),
        name: getUntranslatedContent(`SKILLS.${key}.NAME`,"SKILLS"),
        icon: getUntranslatedContent(`SKILLS.${key}.ICON`,"SKILLS"),
        proficiency: getUntranslatedContent(`SKILLS.${key}.PROFICIENCY`,"SKILLS")
    }));

    useEffect(()=>{
        const skillDataD3: SkillDatumD3[] = skillData.map((skill)=>{
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
        const radiusScale = d3.scaleSqrt().domain([1,10]).range([width<900 ? 10 : 12, width<900 ? 60 : 80]);
        const simulation = d3.forceSimulation()
            .force("x",d3.forceX(width/2).strength(0.05))
            .force("y",d3.forceY(height/2).strength(0.1))
            .force("collide",d3.forceCollide((d:any)=>(radiusScale(d.proficiency)+12)));
        const dragstarted = (event: any, d:any) => {
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
        const ticked = ()=>{
            skillDataD3.forEach((d:any)=>{
                const element = document.getElementById(d.id);
                if(!element) return;
                element.style.left = `${d.x-radiusScale(d.proficiency)}px`;
                element.style.top = `${d.y-radiusScale(d.proficiency)}px`;
            });
        };
        skillDataD3.forEach((d:any)=>{
            const elementNode = document.getElementById(d.id);
            if(!elementNode) return;
            elementNode.style.width = `${radiusScale(d.proficiency)*2}px`;
            elementNode.style.height = `${radiusScale(d.proficiency)*2}px`;
        });
        simulation.nodes(skillDataD3).on("tick",ticked);

        return ()=>{
            simulation.stop();
        }
    },[]);
    const languageCode = "en";
    return(
        <div className="text-white w-full relative">
            <div className="font-bold text-3xl bg-black absolute z-10 pb-4 pr-4">{getTranslatedContent("HEADER", "SKILLS", languageCode)}</div>
            <div id="bubbleSkills" className="w-full h-[600px] md:h-[600px] relative mt-2 overflow-hidden  text-center">
                {
                    skillData.map((skill)=>{
                        return(
                            <div 
                                key={skill.id} 
                                id={skill.id}
                                className="absolute skill bg-white inline-block group rounded-full w-12 h-12"
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