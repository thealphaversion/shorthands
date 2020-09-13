import React from "react";

import "./invitation-header.css";

function InvitationHeader(props) {
    const { user } = props;

    return (
        <div className="invitation-heading invitation-header-color">
            Invitations
        </div>
    );
}

export default InvitationHeader;
