// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React from "react";
import {
    NavLink
} from "react-router-dom";
  
import { Slide } from "./Slide";

function SlideshowWindow(props) {
    const nextPageIndex = props.currentPageIndex + 1;
    const previousPageIndex = props.currentPageIndex -1;

    return (
        <div className="slideshowWindow">
            <Slide page={props.pages[props.currentPageIndex]}/>
            <div className="flex">
                {
                    props.currentPageIndex > 0 ? 
                    (
                        <div>
                            <NavLink to="/learningModulePage" state={{
                                "pages": props.pages,
                                "currentPageIndex": previousPageIndex,
                            }}>Previous Page</NavLink>
                        </div>
                    ) :
                    (<div></div>)
                }
                <div>Page {props.currentPageIndex + 1}</div>
                {
                    nextPageIndex < props.pages.length ? 
                    (
                        <div>
                            <NavLink to="/learningModulePage" state={{
                                "pages": props.pages,
                                "currentPageIndex": nextPageIndex,
                            }}>Next Page</NavLink>
                        </div>
                    ) :
                    (<div></div>)
                }
            </div>   
        </div>
    );
}

export { SlideshowWindow }