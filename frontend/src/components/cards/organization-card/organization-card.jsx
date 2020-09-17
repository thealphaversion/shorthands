// package imports
import React from "react";

// css imports
import "./organization-card.css";

function OrganizationCard(props) {
    const { organization } = props;

    // handle opening organization page
    const openOrganization = () => {
        props.history.push(`/organization/${organization._id}`);
    };

    return (
        <div className="organization-card">
            <div className="organization-card-indicator">
                <i>Organization</i>
            </div>
            <div className="organization-card-title">
                {organization.username}
            </div>
            <div className="organization-card-button">
                <button className="org-button" onClick={openOrganization}>
                    Open Organization
                </button>
            </div>
        </div>
    );
}

export default OrganizationCard;
