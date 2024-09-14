import ProfileLinks from "@/components/ProfileLinks";
import { getTranslatedContent, getUntranslatedContent } from "@/util/getTranslate";

/**
 * AboutSection is a component that displays information about the user.
 * It includes the user's name, degree, university, graduation, bio, and profile links.
 * It also includes a button to download the user's resume.
 * 
 * @returns The AboutSection component.
 */
const AboutSection = ({languageCode}: {languageCode: string}) => {
    const resumeLink = "https://drive.google.com/file/d/1BSAkkz1K4lNtWCcd4pvoI_s1372rBs8D/view?usp=sharing";
    return (
        <div className="flex lg:gap-20" id="about-section">
            <div className="md:basis-2/3">
                <div className="my-2 text-xl text-theme-muted-light font-mono font-semibold">
                    {getTranslatedContent("HEADER", "ABOUT", languageCode)}
                </div>
                <div className="my-2 text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-sans font-bold">
                    {getTranslatedContent("NAME", "ABOUT", languageCode)}
                </div>
                <div className="my-4 text-lg md:text-xl lg:text-2xl opacity-80 font-sans font-bold">
                    {getTranslatedContent("WHOAMI", "ABOUT", languageCode)}
                </div>
                <div className="my-2 text-lg md:text-xl lg:text-2xl opacity-90 font-sans font-semibold">
                    {getTranslatedContent("DEGREE", "ABOUT", languageCode)}
                </div>
                <div className="my-2 text-xl md:text-2xl lg:text-3xl font-sans font-semibold">
                    {getTranslatedContent("UNIVERSITY", "ABOUT", languageCode)}
                </div>
                <div className="my-2 text-base md:text-lg lg:text-xl opacity-80 font-sans font-semibold">
                    {getTranslatedContent("GRADUATION", "ABOUT", languageCode)}
                </div>
                <p className="my-6 text-base md:text-lg lg:text-xl opacity-80 font-sans font-normal">
                    {getTranslatedContent("BIO", "ABOUT", languageCode)}
                </p>
                <ProfileLinks />
                <a target="_blank" rel="noreferrer" aria-label={`Download ${getTranslatedContent("RESUME_BUTTON", "ABOUT", languageCode)}`} href={resumeLink}>
                    <div className="inline-block mt-8 p-3 rounded-md font-semibold border-theme-light-text border-2 hover:bg-theme-light-text hover:text-theme-dark-text">{getTranslatedContent("RESUME_BUTTON", "ABOUT", languageCode)}</div>
                </a>
            </div>
            <div className="basis-1/4 md:basis-1/3 lg:basis-1/2 relative hidden md:block">
                <div className="absolute w-56 h-56 top-12 left-0 group">
                    <img src="./profilePicFull.jpg" className="w-full h-full group-hover:scale-105 transition-all duration-300 object-cover rounded-full" alt="Profile Picture" />
                    <div className="absolute top-0 left-0 w-56 h-56 rounded-full bg-theme opacity-30 z-20 group-hover:hidden"/>
                    <div className="hidden md:inline-block w-56 h-56 rounded-full bg-theme opacity-70 absolute left-4 top-4 -z-10 group-hover:left-1 group-hover:top-1 transition-all duration-300"/>
                    <div className="w-screen h-[200vh] absolute bg-theme-dark opacity-80 rounded-lg -z-40 origin-top-left top-28 left-28 -rotate-45 group-hover:left-32 group-hover:top-32 transition-all duration-300"/>
                </div>
            </div>
        </div>
    );
}

export default AboutSection;