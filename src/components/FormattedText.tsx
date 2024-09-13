import { IoMdArrowDroprightCircle } from "react-icons/io";

/**
 * FormattedText is a component that displays the user's formatted text.
 * It includes the user's text and a className for styling.
 * 
 * @returns The FormattedText component.
 */
const FormattedText = ({text, className} : {
    text: string,
    className?: string
}) => {
    const lines = text.split("\n").map((line)=>line.trim());
    const groups: {
        type: string;
        items: string[];
    }[] = [];
    let currentGroup: {
        type: string;
        items: string[];
    } = {
        type: "span",
        items: []
    };
    for(const line of lines){
        if(line[0] === '\u2022'){
            if(currentGroup.type !== "ul"){
                if(currentGroup.items.length > 0){
                    groups.push(currentGroup);
                }
                currentGroup = {
                    type: "ul",
                    items: []
                };
            }
            currentGroup.items.push(line.slice(1).trim());
        }
        else{
            if(currentGroup.items.length > 0){
                groups.push(currentGroup);
                currentGroup = {
                    type: "span",
                    items: []
                };
            }
            currentGroup.items.push(line);
        }
    }
    if(currentGroup.items.length > 0){
        groups.push(currentGroup);
    }
    return (
        <div className={`${className}`}>
            {
                groups.map((group,index)=>{
                    return(
                        group.type === "span" ? (
                            <div key={index}>
                                {
                                    group.items.map((item,index)=>{
                                        return(
                                            <div key={index}>{item}</div>
                                        );
                                    })
                                }
                            </div>
                        ) : (
                            <div key={index} className="">
                                {
                                    group.items.map((item,index)=>{
                                        return(
                                            <div key={index} className="flex gap-2">
                                                <div className="text-theme-muted-light-medium text-xl mt-0.5">
                                                    <IoMdArrowDroprightCircle/>
                                                </div>
                                                <div>{item}</div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        )
                    );
                })
            }
        </div>
    );
};

export default FormattedText; 