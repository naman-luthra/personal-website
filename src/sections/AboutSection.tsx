import ProfileLinks from "@/components/ProfileLinks";
import { getTranslatedContent, getUntranslatedContent } from "@/util/getTranslate";

const AboutSection = () => {
    const languageCode = "en";
    const resumeLink = "https://drive.google.com/file/d/1BSAkkz1K4lNtWCcd4pvoI_s1372rBs8D/view?usp=sharing";
    return (
        <div className="flex lg:gap-20" id="about-section">
            <div className="md:basis-2/3">
                <div className="my-2 text-xl text-white opacity-80 font-mono font-semibold">
                    {getTranslatedContent("HEADER", "ABOUT", languageCode)}
                </div>
                <div className="my-2 text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-sans font-bold">
                    {getUntranslatedContent("NAME", "ABOUT")}
                </div>
                <div className="my-2 text-2xl md:text-3xl lg:text-4xl xl:text-5xl  text-white font-sans font-bold">
                    {getTranslatedContent("WHOAMI", "ABOUT", languageCode)}
                </div>
                <div className="my-2 text-xl md:text-2xl lg:text-3xl text-white font-sans font-semibold">
                    {getUntranslatedContent("DEGREE", "ABOUT")}
                </div>
                <div className="my-2 text-lg md:text-xl lg:text-2xl text-white font-sans font-semibold">
                    {getUntranslatedContent("UNIVERSITY", "ABOUT")}
                </div>
                <div className="my-2 text-base md:text-lg lg:text-xl text-white font-sans font-semibold">
                    {getTranslatedContent("GRADUATION", "ABOUT", languageCode)}
                </div>
                <p className="my-6 text-base md:text-lg lg:text-xl text-white font-sans font-normal">
                    {getTranslatedContent("BIO", "ABOUT", languageCode)}
                </p>
                <ProfileLinks />
                <a target="_blank" rel="noreferrer" href={resumeLink}>
                    <div className="inline-block mt-8 p-3 rounded-md font-semibold text-white border-white border-2 hover:bg-white hover:text-matte-black">{getTranslatedContent("RESUME_BUTTON", "ABOUT", languageCode)}</div>
                </a>
            </div>
            <div className="basis-1/4 md:basis-1/3 lg:basis-1/2 relative hidden md:block">
                <div className="hidden md:inline-block w-56 h-56 rounded-full bg-white opacity-70 absolute left-4 top-16"></div>
                <img src="./profilePicFull.jpg" className="w-36 h-36 grayscale-[60%] hover:grayscale-0 object-cover sm:w-56 sm:h-56 absolute top-12 right-4 md:left-0 rounded-full" alt="" />
                <div className="w-screen h-[200vh] absolute bg-white opacity-80 rounded-lg -z-40 origin-top-left top-40 left-28 -rotate-45"/>
            </div>
        </div>
    );
}

export default AboutSection;