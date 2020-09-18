// package imports
import React, { useState, useEffect } from "react";
import axios from "axios";

// component imports
import NavigationBar from "../../components/navigation-bar/navigation-bar";
import OrganizationHeader from "../../components/organization/header/organization-header";
import OrganizationGridBody from "../../components/organization/body/organization-grid-body";
import Search from "../../components/search/search";

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
    const [organizationId, setOrganizationId] = useState("");
    const [shorts, setShorts] = useState([]);
    const [searchValue, setSearchValue] = useState("");

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
                setOrganizationId(response.data._id);
                axios
                    .get(server_url + `/shorts/all/${response.data._id}`, {
                        headers: {
                            "x-auth-token": token,
                        },
                    })
                    .then((response) => {
                        setShorts(response.data.shorts);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleSearch = (searchString) => {
        const token = getToken();

        if (!token) {
            return;
        }

        const url = !searchString
            ? server_url + `/shorts/all/${organizationId}`
            : server_url +
              `/search/shorts?shorthand=${searchString}&organization_id=${organizationId}`;

        axios
            .get(url, {
                headers: {
                    "x-auth-token": token,
                },
            })
            .then((response) => {
                console.log(searchString);
                setSearchValue(searchString);
                setShorts(response.data.shorts);
            })
            .catch((error) => {
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error: ", error.message);
                }
            });
    };

    return (
        <div className="organization-page organization-background-color">
            <NavigationBar></NavigationBar>
            <OrganizationHeader username={username}></OrganizationHeader>
            <Search
                onSearch={(searchString) => handleSearch(searchString)}
            ></Search>
            <OrganizationGridBody
                shorts={shorts}
                searchString={searchValue}
            ></OrganizationGridBody>
        </div>
    );
}

export default Organization;
