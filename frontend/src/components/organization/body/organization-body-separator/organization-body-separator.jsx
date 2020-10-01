// package imports
import React from "react";

//css imports
import "./organization-body-separator.css";

function OrganizationBodySeparator(props) {
    let { searchString } = props;
    return (
        <div className="organization-separator">
            <div className="organization-body-subheading">
                &nbsp;&nbsp;
                {!searchString
                    ? "All Shorts"
                    : "Shorts matching " + searchString}
                &nbsp;&nbsp;
            </div>
        </div>
    );
}

export default OrganizationBodySeparator;
