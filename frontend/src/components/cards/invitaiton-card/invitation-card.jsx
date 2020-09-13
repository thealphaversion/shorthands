// package imports
import React, { useState } from "react";
import axios from "axios";

// component imports
import { Card, CardActions, CardContent, Button } from "@material-ui/core";

// css imports
import "./invitation-card.css";

// service imports
import { getToken } from "../../../services/session";
import server_url from "../../../services/server";

function InvitationCard(props) {
    const { invite } = props;

    const [status, setStatus] = useState(invite.status);
    const organization = invite.organization_id.username;

    const inviteId = invite._id;
    const date = new Date(invite.date);

    const accept = () => {
        const token = getToken();

        if (!token) {
            return;
        }

        axios
            .post(
                server_url + "/invitations/modify",
                {
                    id: inviteId,
                    status: "accepted",
                },
                {
                    headers: {
                        "x-auth-token": token,
                    },
                }
            )
            .then((response) => {
                setStatus("accepted");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const reject = () => {
        const token = getToken();

        if (!token) {
            return;
        }

        axios
            .post(
                server_url + "/invitations/modify",
                {
                    id: inviteId,
                    status: "rejected",
                },
                {
                    headers: {
                        "x-auth-token": token,
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    setStatus("rejected");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="invite-card invite-card-color">
            <Card style={{ backgroundColor: "#f3f1ef" }}>
                <CardContent>
                    <div className="invite-card-header">{organization}</div>
                    <div className="invite-card-date">{`${date.toDateString()}`}</div>
                    <div className="invite-card-status">
                        {status === "pending"
                            ? "This invite is pending a response."
                            : `This invitation has been ${status}.`}
                    </div>
                    {status === "pending" ? (
                        <div className="invite-card-button">
                            <CardActions>
                                <Button
                                    size="medium"
                                    variant="outlined"
                                    color="primary"
                                    onClick={accept}
                                >
                                    Accept
                                </Button>
                                <Button
                                    size="medium"
                                    variant="outlined"
                                    color="secondary"
                                    onClick={reject}
                                >
                                    Reject
                                </Button>
                            </CardActions>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default InvitationCard;
