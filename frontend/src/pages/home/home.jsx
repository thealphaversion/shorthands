import React, { useState, useEffect } from "react";
import axios from "axios";

import NavigationBar from "../../components/navigation-bar/navigation-bar";
import Header from "../../components/home/header";

import { getUser, removeUserSession } from "../../services/session";

import "./home.css";

function Home(props) {
    const user = getUser();

    const [organizations, setOrganizations] = useState([]);

    useEffect(() => {});
    // handle click event of logout button
    const handleLogout = () => {
        removeUserSession();
        props.history.push("/login");
    };

    return (
        <div>
            <NavigationBar></NavigationBar>
            <div className="home-container">
                <Header user={user}></Header>
            </div>
        </div>
    );
}

export default Home;
