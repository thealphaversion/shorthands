import React, { useState, useEffect } from "react";
import { Router } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";

import Login from "../pages/login/login";
import Home from "../pages/home/home";
import Invitaitons from "../pages/invitations/invitations";
import Organization from "../pages/organization/organization";
import Footer from "../components/footer/footer";

import PrivateRoute from "../utils/private-route";
import PublicRoute from "../utils/public-route";
import { getToken, getType, removeUserSession } from "../services/session";

import history from "../services/history";
import server_url from "../services/server";

function Root() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        const type = getType();

        if (!token) {
            return;
        }

        const uri =
            type === "user"
                ? server_url + "/users/current"
                : server_url + "/organizations/current";

        axios
            .get(uri, {
                headers: {
                    "x-auth-token": token,
                },
            })
            .then((response) => {
                setLoading(false);
            })
            .catch((error) => {
                removeUserSession();
                setLoading(false);
            });
    }, []);

    if (loading && getToken()) {
        return <div className="content">Loading...</div>;
    }

    return (
        <div className="root-container">
            <div className="content-wrap">
                <Router history={history}>
                    <Container className="p-0" fluid={true}>
                        <PublicRoute
                            path="/login"
                            exact
                            component={Login}
                        ></PublicRoute>
                        <PrivateRoute
                            path="/"
                            exact
                            component={Home}
                        ></PrivateRoute>
                        <PrivateRoute
                            path="/invitations"
                            exact
                            component={Invitaitons}
                        ></PrivateRoute>
                        <PrivateRoute
                            path="/profile"
                            exact
                            component={Home}
                        ></PrivateRoute>
                        <PrivateRoute
                            path="/organization/:organizationId"
                            exact
                            component={Organization}
                        ></PrivateRoute>
                    </Container>
                </Router>
            </div>
            <div>
                <Footer></Footer>
            </div>
        </div>
    );
}

export default Root;
