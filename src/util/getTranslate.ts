import getJson from "./getJson";

/**
 * getContentFromJson is a function that returns the content from the JSON object for the given key.
 * It includes the content from the JSON object for the given key.
 * 
 * @returns The content from the JSON object for the given key.
 */
const getContentFromJson = (json: any, key: string): string => {
    const keySplit = key.split(".");
    let currentJson = json;
    for (key of keySplit) {
        currentJson = currentJson[key];
    }
    return currentJson;
}

/**
 * getTranslatedContent is a function that returns the translated content from the JSON object for the given key.
 * It includes the translated content from the JSON object for the given key.
 * 
 * @returns The translated content from the JSON object for the given key.
 */
export const getTranslatedContent = (key: string, section: string, languageCode: string, joinArray: boolean = true): string => {
    const sectionJson = getJson(section, languageCode);
    const content = getContentFromJson(sectionJson, key);
    if(Array.isArray(content) && joinArray) return content.join(",");
    else return content;
};

/**
 * getUntranslatedContent is a function that returns the untranslated content from the JSON object for the given key.
 * It includes the untranslated content from the JSON object for the given key.
 * 
 * @returns The untranslated content from the JSON object for the given key.
 */
export const getUntranslatedContent = (key: string, section: string): any => {
    const sectionJson = getJson(section, "eng");
    return getContentFromJson(sectionJson, key);
};