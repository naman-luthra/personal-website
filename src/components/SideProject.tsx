import { AiOutlineFileDone } from "react-icons/ai";
import { FiGithub } from "react-icons/fi";
import { MdOpenInNew } from "react-icons/md";

export type SideProjectProps = {
    name: string;
    description: string;
    techstack: string[];
    codebase: string;
    deployment: string;
}

/**
 * SideProject is a component that displays the user's side project.
 * It includes the project name, description, techstack, codebase, and deployment.
 * 
 * @returns The SideProject component.
 */
function SideProject({name,description,techstack,codebase,deployment}: SideProjectProps){
    return(
        <div className="p-2 px-4 bg-theme-muted-dark-medium rounded-md">
            <div className={`flex justify-end my-5 font-sans text-2xl md:text-3xl font-bold`}>
                <div className="grow"><AiOutlineFileDone className="w-12 h-12 inline mr-2 text-theme-muted-light-medium"/></div>
                {codebase && <a target="_blank" rel="noreferrer" href={codebase}><FiGithub className="hover:text-theme-muted-light-medium inline mx-2"/></a>}
                {deployment && <a target="_blank" rel="noreferrer" href={deployment}><MdOpenInNew className="hover:text-theme-muted-light-medium inline mx-2"/></a>}
            </div>
            <div className="my-1 font-sans text-2xl md:text-3xl font-bold">{name}</div>
            <div className="my-4 font-sans text-base">
                <p>{description}</p>
            </div>
            <div className="flex flex-wrap flex-row my-5 font-mono text-sm font-thin">
                {techstack.map(technology=>{
                    return(
                        <div key={technology} className="mx-2">{technology}</div>
                    );
                })}
            </div>
        </div>
    );
}

export default SideProject;