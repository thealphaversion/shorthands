// package imports
import React from "react";

// component imports
import ShorthandCard from "../../cards/shorthand-card/shorthand-card";

//css imports
import "./organization-body.css";
// import "./org-body.css";

function OrganizationBody(props) {
    const { shorts } = props;
    return (
        <div className="organization-body">
            <div className="organization-body-container">
                {shorts.map((short, index) => {
                    return (
                        <div key={index} className="organization-body-items">
                            <ShorthandCard short={short}></ShorthandCard>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default OrganizationBody;
