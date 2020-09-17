// package imports
import React, { useState, useEffect } from "react";
import axios from "axios";

// component imports
import NavigationBar from "../../components/navigation-bar/navigation-bar";
import OrganizationHeader from "../../components/organization/header/organization-header";
import OrganizationBody from "../../components/organization/body/organization-body";

// css imports
import "./organization.css";

// service imports
import { getToken } from "../../services/session";
import server_url from "../../services/server";

function Organization(props) {
    const {
        match: { params },
    } = props;

    const [username, setUsername] = useState("");
    const [shorts, setShorts] = useState([]);

    useEffect(() => {
        const token = getToken();

        if (!token) {
            return;
        }

        axios
            .get(server_url + `/organizations/${params.organizationId}`, {
                headers: {
                    "x-auth-token": token,
                },
            })
            .then((response) => {
                setUsername(response.data.username);
                axios
                    .get(server_url + `/shorts/all/${response.data._id}`, {
                        headers: {
                            "x-auth-token": token,
                        },
                    })
                    .then((response) => {
                        setShorts(response.data.shorts);
                        console.log(response.data.shorts);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="organization-page organization-background-color">
            <NavigationBar></NavigationBar>
            <OrganizationHeader username={username}></OrganizationHeader>
            <OrganizationBody shorts={shorts}></OrganizationBody>
        </div>
    );
}

export default Organization;
