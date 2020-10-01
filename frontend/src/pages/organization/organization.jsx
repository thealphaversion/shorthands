// package imports
import React, { useState, useEffect } from "react";
import axios from "axios";

// component imports
import NavigationBar from "../../components/navigation-bar/navigation-bar";
import OrganizationHeader from "../../components/organization/header/organization-header";
// import OrganizationGridBody from "../../components/organization/body/organization-grid-body";
import OrganizationBody from "../../components/organization/body/organization-body";
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
    const [columns, setColumns] = useState(3);
    const [view, setView] = useState("desktop");

    useEffect(() => {
        const token = getToken();

        if (!token) {
            return;
        }

        setMobileView();

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

        const url =
            server_url +
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

    const handleVote = (vote) => {
        const token = getToken();

        if (!token) {
            return;
        }

        const url = server_url + `/shorts/`;

        axios
            .get(url, {
                headers: {
                    "x-auth-token": token,
                },
            })
            .then((response) => {
                console.log(vote);
                setSearchValue(vote);
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

    const changeLayout = (value) => {
        const acceptableLayouts = [1, 2, 3];
        if (acceptableLayouts.includes(value)) {
            setColumns(value);
        } else {
            console.log("out of bounds");
        }
    };

    const setMobileView = () => {
        if (window.innerWidth <= 600) {
            setView("mobile");
            setColumns(1);
        } else if (window.innerWidth > 600 && window.innerWidth <= 1180) {
            setView("tablet");
            setColumns(2);
        } else {
            setView("desktop");
            setColumns(3);
        }
    };

    window.addEventListener("resize", setMobileView);

    return (
        <div className="organization-page organization-background-color">
            <NavigationBar></NavigationBar>
            <OrganizationHeader username={username}></OrganizationHeader>
            <Search
                onSearch={(searchString) => handleSearch(searchString)}
            ></Search>
            <OrganizationBody
                shorts={shorts}
                searchString={searchValue}
                onVote={(vote) => handleVote(vote)}
                columns={columns}
                onLayoutChange={(value) => changeLayout(value)}
                view={view}
            ></OrganizationBody>
        </div>
    );
}

export default Organization;
