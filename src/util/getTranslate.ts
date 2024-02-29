import getJson from "./getJson";

const getContentFromJson = (json: any, key: string): string => {
    const keySplit = key.split(".");
    let currentJson = json;
    for (key of keySplit) {
        currentJson = currentJson[key];
    }
    return currentJson;
}

export const getTranslatedContent = (key: string, section: string, languageCode: string): string => {
    const sectionJson = getJson(section);
    const content = getContentFromJson(sectionJson, key);
    if(Array.isArray(content)) return content.join(",");
    else return content;
};
export const getUntranslatedContent = (key: string, section: string): any => {
    const sectionJson = getJson(section);
    return getContentFromJson(sectionJson, key);
};