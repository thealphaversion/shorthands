// package imports
import React from "react";

// css imports
import "./organization-header.css";

function OrganizationHeader(props) {
    const { username } = props;

    return (
        <div className="organization-heading organization-header-color">
            <div className="organization-heading-name">{username}</div>
        </div>
    );
}

export default OrganizationHeader;
