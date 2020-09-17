/**
 * This page renders the home page for a user
 */

// package imports
import React, { useState, useEffect } from "react";
import axios from "axios";

// component imports
import NavigationBar from "../../components/navigation-bar/navigation-bar";
import Header from "../../components/home/header/header";
import HomeBody from "../../components/home/body/home-body";

// css imports
import "./home.css";

// service imports
import { getUser, getToken, removeUserSession } from "../../services/session";
import server_url from "../../services/server";

function Home(props) {
    const user = getUser();

    const [organizations, setOrganizations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = getToken();

        if (!token) {
            return;
        }

        axios
            .get(server_url + "/users/current", {
                headers: {
                    "x-auth-token": token,
                },
            })
            .then((response) => {
                const orgs = response.data.organizations;
                setOrganizations(orgs);
            })
            .catch((error) => {
                setError(error);
            });
    }, []);

    // handle click event of logout button
    const handleLogout = () => {
        removeUserSession();
        props.history.push("/login");
    };

    return (
        <div className="home-page home-background-color">
            <NavigationBar></NavigationBar>
            <Header user={user}></Header>
            <HomeBody
                organizations={organizations}
                history={props.history}
            ></HomeBody>
        </div>
    );
}

export default Home;
