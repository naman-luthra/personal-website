import aboutJson from '../content/about.json';
import experienceJson from '../content/experience.json';
import skillsJson from '../content/skills.json';
import projectsJson from '../content/projects.json';

export default function getJson(sectionKey: string): { [key: string]: any } {
  switch (sectionKey) {
    case "ABOUT":
        return aboutJson;
    case "EXP":
        return experienceJson;
    case "SKILLS":
        return skillsJson;
    case "PROJECTS":
        return projectsJson;
    default:
      return {};
  }
}