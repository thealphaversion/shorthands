import React, { useState } from "react";
import axios from "axios";
import { setUserSession } from "../../utils/common";
import { Form, Button } from "react-bootstrap";
import "./login.css";

function Login(props) {
    const [loading, setLoading] = useState(false);
    const username = useFormInput("");
    const password = useFormInput("");
    const [error, setError] = useState(null);

    // handle button click of login form
    const handleLogin = () => {
        setError(null);
        setLoading(true);
        axios
            .post("http://localhost:4000/users/signin", {
                username: username.value,
                password: password.value,
            })
            .then((response) => {
                setLoading(false);
                setUserSession(response.data.token, response.data.user);
                props.history.push("/dashboard");
            })
            .catch((error) => {
                setLoading(false);
                if (error.response.status === 401)
                    setError(error.response.data.message);
                else setError("Something went wrong. Please try again later.");
            });
    };

    return (
        <div className="login-container">
            <div className="login-title">
                <p>shorthands</p>
            </div>
            <div className="login-input-block">
                <Form>
                    <Form.Group controlId="formGroupEmail">
                        <Form.Label>username</Form.Label>
                        <Form.Control
                            placeholder="enter your username"
                            required
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formGroupEmail">
                        <Form.Label>password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="enter your password"
                        />
                    </Form.Group>
                </Form>
            </div>
            <div className="login-button-container">
                <Button variant="outline-dark" className="login-button">
                    login
                </Button>
                <Button variant="outline-dark" className="login-button">
                    sign up
                </Button>
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
