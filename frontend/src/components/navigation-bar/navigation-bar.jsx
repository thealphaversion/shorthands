// package imports
import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { withRouter } from "react-router-dom";

function NavigationBar(props) {
    return (
        <React.Fragment>
            <Navbar
                className="bg-dark justify-content-between"
                variant="dark"
                expand="lg"
            >
                <Navbar.Brand href="/">
                    <div className="nav-name">Shorthands</div>
                </Navbar.Brand>
                <Navbar.Toggle
                    className="border-0"
                    aria-controls="navbar=toggle"
                ></Navbar.Toggle>
                <Navbar.Collapse>
                    <Nav className="ml-auto nav-items">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/search">Search</Nav.Link>
                        <Nav.Link href="/resume">Resume</Nav.Link>
                        <Nav.Link href="/contact">Contact</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </React.Fragment>
    );
}

export default withRouter(NavigationBar);
