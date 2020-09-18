// package imports
import React from "react";

// component imports
import ShorthandCard from "../../cards/shorthand-card/shorthand-card";

//css imports
import "./organization-grid-body.css";

function OrganizationGridBody(props) {
    const { shorts, searchString } = props;
    return (
        <React.Fragment>
            <div className="organization-separator">
                <div className="organization-body-subheading">
                    &nbsp;&nbsp;
                    {!searchString
                        ? "All Shorts"
                        : "Shorts matching " + searchString}
                    &nbsp;&nbsp;
                </div>
            </div>
            <div className="organization-grid-container">
                {shorts.map((short, index) => {
                    return (
                        <div
                            className="organization-grid-item organization-item-color"
                            key={index}
                        >
                            <ShorthandCard short={short}></ShorthandCard>
                        </div>
                    );
                })}
            </div>
        </React.Fragment>
    );
}

export default OrganizationGridBody;
