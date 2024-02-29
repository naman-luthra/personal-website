import ProfileLinks from "@/components/ProfileLinks";
import { getTranslatedContent, getUntranslatedContent } from "@/util/getTranslate";

const AboutSection = () => {
    const languageCode = "en";
    const resumeLink = "https://drive.google.com/file/d/1mHrJTGdXRmvTNDGLak9CWZnVycNn1Y11/view?usp=sharing";
    const profilePicPath = "./icons/profilePic2023.png";
    return (
        <div className="flex">
            <div className="md:basis-2/3">
                <div className="my-2 text-xl text-react-blue-light font-mono font-semibold">
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
                    {getTranslatedContent("EXPECTED_GRADUATION", "ABOUT", languageCode)}
                </div>
                <p className="my-6 text-base md:text-lg lg:text-xl text-white font-sans font-normal">
                    {getTranslatedContent("BIO", "ABOUT", languageCode)}
                </p>
                <ProfileLinks />
                <a target="_blank" rel="noreferrer" href={resumeLink}>
                    <div className="inline-block mt-8 p-3 rounded-md font-semibold text-react-blue-light border-react-blue-light border-2 hover:bg-react-blue-light hover:text-matte-black">{getTranslatedContent("RESUME_BUTTON", "ABOUT", languageCode)}</div>
                </a>
            </div>
            <div className="md:basis-1/3 lg:basis-1/2 hidden md:flex justify-end">
                <img src={profilePicPath} className="w-36 h-36 sm:w-56 sm:h-56" alt="" />
            </div>
        </div>
    );
}

export default AboutSection;