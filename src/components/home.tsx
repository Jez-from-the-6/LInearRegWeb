import * as React from "react";
import LandingSliders from "../../skeleton/shared/components/landingSliders"
import DOC from "./Intro.mdx";

const Frame = (...children) : JSX.Element => {

    console.log(children)
    return (
            <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}> 
                <div style={{width: "100%", paddingBottom: "5%"}}></div>
                <DOC />
                <div>{LandingSliders()}</div>
            </div>

    )
}

export default Frame;