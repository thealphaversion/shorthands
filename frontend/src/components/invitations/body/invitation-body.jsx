// package imports
import React from "react";

// component imports
import InvitationCard from "../../cards/invitaiton-card/invitation-card";

// css imports
import "./invitation-body.css";

function InvitationBody(props) {
    const { invitations } = props;

    if (invitations.length === 0) {
        return (
            <div className="invitation-body">
                <div className="no-invitation-container">
                    No invitations received yet!
                </div>
            </div>
        );
    }

    return (
        <div className="invitation-body">
            <div className="invitation-container">
                {invitations.map((invite, index) => {
                    console.log(invite);
                    return (
                        <InvitationCard
                            invite={invite}
                            key={index}
                        ></InvitationCard>
                    );
                })}
            </div>
        </div>
    );
}

export default InvitationBody;
