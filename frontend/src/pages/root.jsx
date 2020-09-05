import React, { useState, useEffect } from "react";
import {
    BrowserRouter,
    Router,
    Switch,
    Route,
    NavLink,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";

import Login from "../pages/login/login";
import Home from "../pages/home/home";
import Footer from "../components/footer/footer";

import PrivateRoute from "../utils/private-route";
import PublicRoute from "../utils/public-route";
import { getToken, getType, removeUserSession } from "../services/session";

import history from "../services/history";

function Root() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        const type = getType();

        console.log("type: " + type);

        if (!token) {
            return;
        }

        const uri =
            type == "user"
                ? "http://localhost:5000/api/users/current"
                : "http://localhost:5000/api/organizations/current";

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
                            path="/projects"
                            exact
                            component={Home}
                        ></PrivateRoute>
                        <PrivateRoute
                            path="/resume"
                            exact
                            component={Home}
                        ></PrivateRoute>
                        <PrivateRoute
                            path="/contact"
                            exact
                            component={Home}
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
