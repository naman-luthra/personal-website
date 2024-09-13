import { SiLinkedin } from 'react-icons/si';
import { SiLeetcode} from 'react-icons/si';
import { SiGithub} from 'react-icons/si';
import { HiOutlineMail} from 'react-icons/hi';

/**
 * ProfileLinks is a component that displays the user's profile links.
 * It includes the user's LinkedIn, Leetcode, Github, and email links.
 * 
 * @returns The ProfileLinks component.
 */
function ProfileLinks(){
    return(
        <div className="flex gap-4">
                <div><a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/namanluthra/"><SiLinkedin className="hover:text-theme-muted-light-medium font-thin w-8 h-8"/></a></div>
                <div><a target="_blank" rel="noreferrer" href="https://leetcode.com/f20201682/"><SiLeetcode className="hover:text-theme-muted-light-medium font-thin w-8 h-8"/></a></div>
                <div><a target="_blank" rel="noreferrer" href="https://github.com/naman-luthra"><SiGithub className="hover:text-theme-muted-light-medium font-thin w-8 h-8"/></a></div>
                <div><a target="_blank" rel="noreferrer" href="mailto:namanluthra31@gmail.com"><HiOutlineMail className="hover:text-theme-muted-light-medium font-thin w-8 h-8"/></a></div>
        </div>
    )
}
export default ProfileLinks;