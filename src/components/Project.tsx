import Image from "next/image";
import {FiGithub, FiCopy, FiCheck} from "react-icons/fi";
import {MdOpenInNew} from "react-icons/md";
import FormattedText from "./FormattedText";
import { getTranslatedContent } from "@/util/getTranslate";

export type ProjectProps = {
    name: string;
    description: string;
    techstack: string[];
    repositories: {LINK: string, NAME: string}[];
    deployment: string;
    credential: {username: string, password: string};
    projectsnap: string;
    justify: string;
    specialimageclasses: string;
    languageCode: string;
}

/**
 * Project is a component that displays the user's project.
 * It includes the project name, description, techstack, repositories, deployment, credential, projectsnap.
 * 
 * @returns The Project component.
 */
function Project({name,description,techstack,repositories,deployment,credential,projectsnap,justify,specialimageclasses,languageCode}: ProjectProps){
    return (
        <div className="relative">
            <a target="_blank" rel="noreferrer" className="hidden md:inline-block" aria-label={`Visit ${name} Project`} href={deployment || repositories[0].LINK}>
                <div className={`inline-block group absolute top-1 bottom-0 ${justify==="end" ? "left-0 right-1/2" : "right-0 left-1/2" } ${specialimageclasses ? specialimageclasses : "w-3/5"}`}>
                    <Image className="hover:opacity-100 opacity-60" fill={true} objectFit="contain" objectPosition={justify==="start" ? "right" : "left"} src={`/ProjectSnaps/${projectsnap}.png`} alt="" />
                    <MdOpenInNew className="mx-2 absolute w-6 h-6 top-2 right-2 hidden group-hover:block"/>
                </div>
            </a>
            <div className={`flex ${justify==="start" ? "justify-start" : "justify-start md:justify-end"} my-1 font-mono text-lg font-thin text-theme-light`}>{getTranslatedContent("FEATURED_HEADER","PROJECTS",languageCode)}</div>
            <div className={`flex ${justify==="start" ? "justify-start" : "justify-start md:justify-end"} my-1 font-sans text-2xl md:text-3xl font-bold`}>{name}</div>
            <div className={`flex ${justify==="start" ? "justify-start" : "justify-start md:justify-end"} my-4 font-sans text-base`}>
                <div className={`md:w-2/3 lg:1/2 p-6 bg-theme-muted-dark-medium rounded-md ${justify==="end" ? "md:text-right" : "text-left"} z-10`}>
                    <FormattedText text={description} className="font-normal"/>
                    {
                        credential &&
                        <div className="mt-5 text-sm rounded-md bg-neutral-600 p-2 inline-block">
                            <div className="my-2 lg:my-0 lg:inline-block mx-2 font-bold">Sample Credentials :</div>
                            <div aria-label="Copy Username" onClick={()=>{
                                    navigator.clipboard.writeText(credential.username); 
                                    const check=document.getElementById("check1");
                                    const copy=document.getElementById("copy1");
                                    copy?.classList.toggle("hidden");
                                    setTimeout(()=>{
                                        check?.classList.toggle("hidden");
                                    },100);
                                    setTimeout(()=>{
                                        check?.classList.toggle("hidden");
                                        setTimeout(()=>{
                                            copy?.classList.toggle("hidden");
                                        },100);
                                    },500);
                                }} className="cursor-pointer relative hover:opacity-70 inline-block mx-2 p-0.5 rounded-md bg-matte-black-dark">
                                <FiCopy id="copy1" className="absolute top-1 right-1"/>
                                <FiCheck id="check1" className="hidden text-mint-green animate-ping absolute top-1 right-1"/>
                                <span className="inline-block m-3">{credential.username}</span>
                            </div>
                            <div aria-label="Copy Password" onClick={()=>{
                                    navigator.clipboard.writeText(credential.password); 
                                    const check=document.getElementById("check2");
                                    const copy=document.getElementById("copy2");
                                    copy?.classList.toggle("hidden");
                                    setTimeout(()=>{
                                        check?.classList.toggle("hidden");
                                    },100);
                                    setTimeout(()=>{
                                        check?.classList.toggle("hidden");
                                        setTimeout(()=>{
                                            copy?.classList.toggle("hidden");
                                        },100);
                                    },500);
                                }} className="cursor-pointer relative hover:opacity-70 inline-block mx-2 p-0.5 rounded-md bg-matte-black-dark">
                                <FiCopy id="copy2" className="absolute top-1 right-1"/>
                                <FiCheck id="check2" className="hidden text-mint-green animate-ping absolute top-1 right-1"/>
                                <span className="inline-block m-3">{credential.password}</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className={`flex flex-wrap ${justify==="start" ? "justify-start" : "md:justify-end"} my-5 font-mono text-sm font-thin`}>
                {techstack.map(technology=>{
                    return(
                        <div key={technology} className="mx-2">{technology}</div>
                    );
                })}
            </div>
            <div className={`flex ${justify==="start" ? "justify-start" : "md:justify-end"} gap-2 my-5 font-sans font-bold`}>
                {
                    repositories.length &&
                    <>
                        {
                            repositories.map(({LINK,NAME},index)=>{
                                return(
                                    <a key={index} target="_blank" rel="noreferrer" aria-label={`Visit ${NAME} Repository for ${name} Project`} href={LINK} className="flex gap-2 p-2 border rounded-lg items-center hover:text-theme-muted-light-medium hover:border-theme-muted-light-medium"><FiGithub className="inline text-2xl"/> {NAME}</a>
                                );
                            })
                        }
                    </>
                }
            </div>
        </div>
    );
}

export default Project;