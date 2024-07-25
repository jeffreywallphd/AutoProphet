// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { useEffect, useState, useRef } from "react";
import { Howl } from "howler";

function SlideMaster(props) {
  const [state, setState] = useState({ disable: false });
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

    const content = React.cloneElement(convertElementToComponent(rootElement), {
      key: "root",
    });

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
        children.push(
          React.cloneElement(convertElementToComponent(child), {
            key: child.id || `child-${children.length}`,
          })
        );
      }
    }

    // Create a React component based on the element
    return React.createElement(tagName, attributes, children);
  };

  const contents = props.page ? props.page.content_html : null;

  //   const contents =
  //   "<p>Stocks topic 1 content...</p>";
  // props.page.content_html;
  // "<ul> <li>A Beginner's Overview To Blockchain</li> <li>Blockchain</li> <li>How to Invest</li> <li>Risks and Obligations</li> </ul>";
  // props.page.pageContentUrl !== null
  //   ? window.fs.fs.readFileSync(
  //       `src/View/LearningModuleSlideshows/${props.page.pageContentUrl}`,
  //       "utf-8"
  //     )
  //   : null;

  const playAudio = () => {
    if (props.page.voice_over_url !== null) {
      var audioSrc = `../src/Asset/LearningModulesVoiceovers/${props.page.voice_over_url}`;

      console.log(props.page.voice_over_url);
      console.log(audioSrc);

      soundRef.current = new Howl({
        src: [audioSrc],
      });

      soundRef.current.on("end", () => {
        setState({ disable: false });
      });

      props.registerSlide(soundRef.current, handleButtonReset);

      soundRef.current.play();
      setState({ disable: true });
    }
  };

  const handleButtonReset = () => {
    setState({ disable: false });
  };

  // stop playing sound after leaving page
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  // topic_id: module.id,
  // heading: module.heading,
  // description: module.description,
  // dura_min: module.dura_min,
  // // dateCreated: module.dateCreated,
  // created: module.created,
  // pages: null,

  //   console.log(props.page.voice_over_url);

  return (
    <div className="slide">
      {contents !== null ? (
        <div className="titleContainer mb-5">
          <h3>
            {props.page.topic_heading}
            {props.page.heading !== null ? <span>:</span> : null}
          </h3>

          {props.page.heading !== null ? (
            <h4 className="slideSubTitle">{props.page.heading}</h4>
          ) : null}
        </div>
      ) : null}

      {contents !== null ? <div className="mb-3">{contents}</div> : null}

      {contents !== null ? (
        <div className="contentContainer">
          {parseHtmlToComponents(contents)}
        </div>
      ) : null}

      {props.page.voice_over_url !== null ? (
        <div className="audioBar">
          <button onClick={playAudio} disabled={state.disable}>
            Play Audio
          </button>
        </div>
      ) : null}

      {contents === null ? (
        <div className="contentContainer">No content available for section</div>
      ) : null}
    </div>
  );
}

export { SlideMaster };
