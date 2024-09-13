import Project, { ProjectProps } from "@/components/Project";
import SideProject, { SideProjectProps } from "@/components/SideProject";
import getJson from "@/util/getJson";
import { getTranslatedContent, getUntranslatedContent } from "@/util/getTranslate";

/**
 * ProjectsSection is a component that displays the user's projects.
 * It includes the user's featured projects and side projects.
 * 
 * @returns The ProjectsSection component.
 */
const ProjectsSection = ({languageCode}: {languageCode: string}) =>{
    const featuredProjectKeys = Object.keys(getJson("PROJECTS", "eng").FEATURED);
    const featuredProjects = featuredProjectKeys.map((key): ProjectProps=>({
        name: getTranslatedContent(`FEATURED.${key}.NAME`,"PROJECTS",languageCode),
        description: getTranslatedContent(`FEATURED.${key}.DESCRIPTION`,"PROJECTS",languageCode),
        techstack: getUntranslatedContent(`FEATURED.${key}.TECHSTACK`,"PROJECTS"),
        repositories: getUntranslatedContent(`FEATURED.${key}.REPOSITORIES`,"PROJECTS"),
        deployment: getUntranslatedContent(`FEATURED.${key}.DEPLOYMENT`,"PROJECTS"),
        credential: getUntranslatedContent(`FEATURED.${key}.CREDENTIAL`,"PROJECTS"),
        projectsnap: getUntranslatedContent(`FEATURED.${key}.PROJECTSNAP`,"PROJECTS"),
        justify: getUntranslatedContent(`FEATURED.${key}.JUSTIFY`,"PROJECTS"),
        specialimageclasses: getUntranslatedContent(`FEATURED.${key}.SPECIALIMAGECLASSES`,"PROJECTS"),
        languageCode: languageCode
    }));
    const sideProjectKeys = Object.keys(getJson("PROJECTS", "eng").OTHER);
    const sideProjects = sideProjectKeys.map((key): SideProjectProps=>({
        name: getTranslatedContent(`OTHER.${key}.NAME`,"PROJECTS",languageCode),
        description: getTranslatedContent(`OTHER.${key}.DESCRIPTION`,"PROJECTS",languageCode),
        techstack: getUntranslatedContent(`OTHER.${key}.TECHSTACK`,"PROJECTS"),
        codebase: getUntranslatedContent(`OTHER.${key}.CODEBASE`,"PROJECTS"),
        deployment: getUntranslatedContent(`OTHER.${key}.DEPLOYMENT`,"PROJECTS")
    }));
    return(
        <div id="projects-section">
            <div className="font-sans font-extrabold text-4xl">{getTranslatedContent("HEADER","PROJECTS",languageCode)}</div>
            <div className="flex flex-col gap-6 mt-8">
                {
                    featuredProjects.map((project,index)=>{
                        return(
                            <Project key={index} {...project}/>
                        );
                    })
                }
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
                {
                    sideProjects.map((project,index)=>{
                        return(
                            <SideProject key={index} {...project}/>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default ProjectsSection;