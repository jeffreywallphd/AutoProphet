// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React from "react";

import { SlideshowPage } from "./SlideshowPage";

function SlideshowWindow(props) {
    const nextPageIndex = props.currentPageIndex + 1;

    return (
        <div className="slideshowWindow">
            <SlideshowPage page={props.pages[props.currentPageIndex]}/>
                {
                    nextPageIndex < props.pages.length ? 
                    (
                        <div>
                            <NavLink to="/learningModulePage" state={{
                                "title": props.pages[nextPageIndex].title,
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