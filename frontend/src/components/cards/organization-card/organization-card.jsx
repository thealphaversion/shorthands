// package imports
import React from "react";

// css imports
import "./organization-card.css";

function OrganizationCard(props) {
    const { organization } = props;
    return (
        <div className="organization-card">
            <div className="organization-card-indicator">
                <i>Organization</i>
            </div>
            <div className="organization-card-title">
                {organization.username}
            </div>
            <div className="organization-card-button">
                <a type="button" className="org-button">
                    Open Org
                </a>
            </div>
        </div>
    );
}

export default OrganizationCard;
