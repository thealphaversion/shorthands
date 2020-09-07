import React, { useState } from "react";
import axios from "axios";
import { setUserSession } from "../../services/session";
import { Form, Button } from "react-bootstrap";
import "./login.css";

import server_url from "../../services/server";

function Login(props) {
    const [loading, setLoading] = useState(false);
    const username = useFormInput("");
    const password = useFormInput("");
    const [error, setError] = useState(null);

    // to switch between user and organization login
    const [isUser, setIsUser] = useState(true);

    // button texts
    const [loginButtonText, setLoginButtonText] = useState("login");
    const [signupButtonText, setSignUpButtonText] = useState("sign up");

    // handle button click of login form
    const handleUserLogin = (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setLoginButtonText("logging in...");

        const uri = isUser
            ? `${server_url}/auth/users`
            : `${server_url}/auth/organizations`;

        axios
            .post(uri, {
                username: username.value,
                password: password.value,
            })
            .then((response) => {
                setLoading(false);
                setLoginButtonText("log in");
                if (response.status === 400) {
                    setError(response.data);
                } else {
                    setUserSession(
                        response.data.token,
                        response.data.username,
                        response.data.type
                    );
                    props.history.push("/");
                }
            })
            .catch((error) => {
                setLoading(false);
                setLoginButtonText("log in");
                setError(
                    "Something went wrong. Please try again later." + error
                );
            });
    };

    // handle button click of login form
    const handleUserSignup = (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setSignUpButtonText("signing up...");

        const uri = isUser
            ? `${server_url}/users/create`
            : `${server_url}/organizations/create`;

        axios
            .post(uri, {
                username: username.value,
                password: password.value,
            })
            .then((response) => {
                setLoading(false);
                setSignUpButtonText("sign up");
                if (response.status === 400) {
                    setError(response.data);
                } else {
                    setUserSession(
                        response.data.token,
                        response.data.user,
                        response.data.type
                    );
                    props.history.push("/");
                }
            })
            .catch((error) => {
                setLoading(false);
                setSignUpButtonText("sign up");
                setError("Something went wrong. Please try again later.");
            });
    };

    const handleTypeChange = () => {
        if (isUser) {
            setIsUser(false);
        } else {
            setIsUser(true);
        }
    };

    return (
        <div className={`login-container ${isUser ? "user-bg" : "org-bg"}`}>
            <div className="login-title">
                <p>shorthands</p>
            </div>
            <div className="login-input-block">
                <Form>
                    <Form.Group controlId="formGroupEmail">
                        <Form.Label>username</Form.Label>
                        <Form.Control
                            placeholder={
                                isUser
                                    ? "enter your username"
                                    : "enter organization name"
                            }
                            {...username}
                            required
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formGroupEmail">
                        <Form.Label>password</Form.Label>
                        <Form.Control
                            type="password"
                            {...password}
                            required
                            placeholder={
                                isUser
                                    ? "enter your password"
                                    : "enter organization password"
                            }
                        />
                    </Form.Group>
                </Form>
            </div>
            <div className="login-button-container">
                <Button
                    variant="outline-dark"
                    className="login-button"
                    disabled={loading}
                    onClick={handleUserLogin}
                >
                    {loginButtonText}
                </Button>
                <Button
                    variant="outline-dark"
                    className="login-button"
                    disabled={loading}
                    onClick={handleUserSignup}
                >
                    {signupButtonText}
                </Button>
            </div>
            <div className="org-button-container">
                <Button
                    variant="link"
                    className="org-button"
                    disabled={loading}
                    onClick={handleTypeChange}
                >
                    {isUser ? "login as an organization" : "login as a user"}
                </Button>
            </div>
            <div>
                {error && (
                    <>
                        <small style={{ color: "red" }}>{error}</small>
                        <br />
                    </>
                )}
            </div>
        </div>
    );
}

const useFormInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = (e) => {
        setValue(e.target.value);
    };
    return {
        value,
        onChange: handleChange,
    };
};

export default Login;
