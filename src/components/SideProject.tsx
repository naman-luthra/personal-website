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
function SideProject({name,description,techstack,codebase,deployment}: SideProjectProps){
    return(
        <div className="p-2 px-4 bg-neutral-900 rounded-md text-white">
            <div className={`flex justify-end my-5 font-sans text-3xl font-bold`}>
                <div className="grow"><AiOutlineFileDone className="text-white w-12 h-12 inline mx-2"/></div>
                {codebase && <a target="_blank" rel="noreferrer" href={codebase}><FiGithub className="hover:text-react-blue inline mx-2"/></a>}
                {deployment && <a target="_blank" rel="noreferrer" href={deployment}><MdOpenInNew className="hover:text-mint-green inline mx-2"/></a>}
            </div>
            <div className="my-1 font-sans text-3xl font-bold">{name}</div>
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