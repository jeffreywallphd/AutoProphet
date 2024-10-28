// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { useEffect, useState, useRef } from "react";
import { Howl } from 'howler';

function Slide(props) {
    const [state, setState] = useState({disable: false});
    const soundRef = useRef(null);

    const parseHtmlToComponents = (htmlString) => {
        const parser = new DOMParser(); // Parse the HTML string
        const doc = parser.parseFromString(htmlString, "text/html");
        //const rootElement = doc.documentElement;

        const rootElement = doc.body.firstChild;

        if (!rootElement) {
            // Handle potential empty content or invalid HTML
            return null;
        }
      
        const content = React.cloneElement(convertElementToComponent(rootElement), { key: 'root' });
        
        // Assign a unique key to the root element
        return content;
    };
      
    const convertElementToComponent = (element) => {
        const tagName = element.tagName.toLowerCase(); // Ensure lowercase tag names
        const attributes = {};
        for (const attr of element.attributes) {
          attributes[attr.name.toLowerCase()] = attr.value; // Ensure lowercase attribute names
        }
      
        const children = [];
        for (const child of element.childNodes) {
          if (child.nodeType === Node.TEXT_NODE) {
            children.push(child.textContent);
          } else {
            // Assign a unique key to each child element
            children.push(React.cloneElement(convertElementToComponent(child), { key: child.id || `child-${children.length}` }));
          }
        }
      
        // Create a React component based on the element
        return React.createElement(tagName, attributes, children);
    };

    const contents = props.page.pageContentUrl !== null ? window.fs.fs.readFileSync(`src/View/LearningModuleSlideshows/${props.page.pageContentUrl}`, 'utf-8') : null;

    const playAudio = () => {
        if(props.page.voiceoverUrl !== null) {
            var audioSrc = `../src/Asset/LearningModulesVoiceovers/${props.page.voiceoverUrl}`;

            soundRef.current = new Howl({
                src: [audioSrc]
            });

            soundRef.current.on('end', () => {
                setState({disable: false});
            });

            props.registerSlide(soundRef.current, handleButtonReset);

            soundRef.current.play();
            setState({disable: true});
        }
    };

    const handleButtonReset = () => {
        setState({disable: false});
    }

    // stop playing sound after leaving page
    useEffect(() => {
        return () => {
          if (soundRef.current) {
            soundRef.current.unload(); 
          }
        };
    }, []);

    return (
        <div className="slide">
            {
                props.page.pageType === "ContentPage" ? 
                (<h2>{props.page.title}</h2>) 
                :
                (
                    <div className="titleContainer">
                        <h1>
                            {props.page.title}{props.page.subTitle !== null ?
                                (<span>:</span>) :
                                (null)}
                        </h1>
                        {props.page.subTitle !== null ?
                            (<h2 className="slideSubTitle">{props.page.subTitle}</h2>) :
                            (null)
                        }
                    </div>
                )
            }
            {
                contents !== null ? 
                (
                    <div className="contentContainer">
                        {parseHtmlToComponents(contents)}
                    </div>
                ) 
                :
                (null) 
            }
            {   
                props.page.voiceoverUrl !== null ?
                (    
                    <div className="audioBar">
                        <button onClick={playAudio} disabled={state.disable}>Play Audio</button>
                    </div>
                )
                :
                (null)   
            }
        </div>
    );
}

export { Slide }