import React, { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Howl } from "howler";

export function LearningTopicPage(props) {
  const location = useLocation();
  const soundRef = useRef(null);
  const [state, setState] = useState({
    sections: null,
    isLoading: true,
    disable: false,
  });

  const parseHtmlToComponents = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const rootElement = doc.body.firstChild;

    if (!rootElement) return null;

    return React.cloneElement(convertElementToComponent(rootElement), {
      key: "root",
    });
  };

  const convertElementToComponent = (element) => {
    const tagName = element.tagName.toLowerCase();
    const attributes = {};
    for (const attr of element.attributes) {
      attributes[attr.name.toLowerCase()] = attr.value;
    }

    const children = [];
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        children.push(child.textContent);
      } else {
        children.push(
          React.cloneElement(convertElementToComponent(child), {
            key: child.id || `child-${children.length}`,
          })
        );
      }
    }

    return React.createElement(tagName, attributes, children);
  };

  const getRawData = (htmlString) => {
    return htmlString;
  };

  const playAudio = () => {
    if (props.page.voice_over_url) {
      const audioSrc = `../src/Asset/LearningModulesVoiceovers/${props.page.voice_over_url}`;

      soundRef.current = new Howl({
        src: [audioSrc],
      });

      soundRef.current.on("end", () => {
        setState((prevState) => ({ ...prevState, disable: false }));
      });

      props.registerSlide(soundRef.current, handleButtonReset);
      soundRef.current.play();
      setState((prevState) => ({ ...prevState, disable: true }));
    }
  };

  const handleButtonReset = () => {
    setState((prevState) => ({ ...prevState, disable: false }));
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  useEffect(() => {
    selectPageData();
  }, []);

  const selectPageData = async () => {
    try {
      const inputData = [location.state.topicId];
      const query = `
        SELECT tutor_section.*, tutor_topic.heading AS topic_heading, section_type.code AS st_code
        FROM tutor_section
        LEFT JOIN tutor_topic ON tutor_topic.id = tutor_section.topic_id
        LEFT JOIN section_type ON section_type.id = tutor_section.sect_type_id
        WHERE topic_id=?
        ORDER BY order_idx ASC
      `;

      const data = await window.electron.ipcRenderer.invoke("select-data", {
        query,
        inputData,
      });
      setState({ sections: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={{ marginLeft: "25px", marginRight: "25px" }}>
      <div className="row">
        <div className="mb-5 mt-5">
          <h3>{location.state.heading}</h3>
          <p>{location.state.description}</p>
          {/* <p>Estimated Time: {location.state.duraMin} minutes</p> */}
          <div class="col-sm-4 d-flex align-items-center justify-content-start">
            <p
              className="text-danger ellipsis"
              style={{ fontSize: "0.8rem", color: "#555" }}
            >
              {location.state.duraMin} minutes read
            </p>
          </div>
        </div>
        {/* <hr className="mb-3" /> */}

        <div className="row">
          {state.sections ? (
            state.sections.map((oSection, index) =>
              oSection ? (
                <div className="col-md-12 mb-3" key={index}>
                  {oSection.content_html !== null ? (
                    <div
                      className="card border-light mb-3"
                      style={{ width: "100%", maxWidth: "none" }}
                    >
                      <div className="card-header border-light">
                        <h5 className="card-title text-primary">
                          {oSection.heading}
                        </h5>
                      </div>
                      <div className="card-body">
                        {oSection.st_code}
                        <p style={{ margin: "5px 0" }}>
                          {parseHtmlToComponents(oSection.content_html)}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null
            )
          ) : state.isLoading ? (
            <div className="col-12 text-center">Loading...</div>
          ) : (
            <div className="col-12 text-center">
              Error: Unable to load the learning sections
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
