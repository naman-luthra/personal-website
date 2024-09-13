
export default function getJson(sectionKey: string, languageCode: string): { [key: string]: any } {
  switch (sectionKey) {
    case "ABOUT":
        return require(`../content/${languageCode}/about.json`);
    case "EXP":
        return require(`../content/${languageCode}/experience.json`);
    case "SKILLS":
        return require(`../content/${languageCode}/skills.json`);
    case "PROJECTS":
        return require(`../content/${languageCode}/projects.json`);
    case "HEADER":
        return require(`../content/${languageCode}/header.json`);
    default:
      return {};
  }
}