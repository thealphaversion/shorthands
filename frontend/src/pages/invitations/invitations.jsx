// package imports
import React, { useState, useEffect } from "react";
import axios from "axios";

// component imports
import NavigationBar from "../../components/navigation-bar/navigation-bar";
import InvitationBody from "../../components/invitations/body/invitation-body";
import InvitationHeader from "../../components/invitations/header/invitation-header";

// css imports
import "./invitations.css";

// service imports
import { getToken } from "../../services/session";
import server_url from "../../services/server";

function Invitations(props) {
    const [invitations, setInvitations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = getToken();

        if (!token) {
            return;
        }

        axios
            .get(server_url + "/invitations/all/user", {
                headers: {
                    "x-auth-token": token,
                },
            })
            .then((response) => {
                const invites = response.data.invitations;
                setInvitations(invites);
            })
            .catch((error) => {
                setError(error);
            });
    }, []);

    return (
        <div className="invitation-page">
            <NavigationBar></NavigationBar>
            <InvitationHeader></InvitationHeader>
            <InvitationBody invitations={invitations}></InvitationBody>
        </div>
    );
}

export default Invitations;
