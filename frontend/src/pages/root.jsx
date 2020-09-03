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
import NavigationBar from "../components/navigation-bar/navigation-bar";

import PrivateRoute from "../utils/private-route";
import PublicRoute from "../utils/public-route";
import { getToken, removeUserSession, setUserSession } from "../utils/common";

import history from "../services/history";

function Root() {
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            return;
        }

        axios
            .get(`http://localhost:3000/verifyToken?token=${token}`)
            .then((response) => {
                setUserSession(response.data.token, response.data.user);
                setAuthLoading(false);
            })
            .catch((error) => {
                removeUserSession();
                setAuthLoading(false);
            });
    }, []);

    if (authLoading && getToken()) {
        return <div className="content">Checking Authentication...</div>;
    }

    return (
        <div className="root-container">
            <div className="content-wrap">
                <Router history={history}>
                    <Container className="p-0" fluid={true}>
                        <NavigationBar></NavigationBar>
                        <Route
                            path="/"
                            exact
                            render={() => <Login></Login>}
                        ></Route>
                        <Route
                            path="/projects"
                            exact
                            render={() => <div></div>}
                        ></Route>
                        <Route
                            path="/resume"
                            exact
                            render={() => <div></div>}
                        ></Route>
                        <Route
                            path="/contact"
                            exact
                            render={() => <div></div>}
                        ></Route>
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
