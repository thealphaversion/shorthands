import React from "react";

import "./header.css";

function Header(props) {
    const { user } = props;

    return (
        <div className="home-heading home-header-color">
            <h1>{"Hi, " + user}</h1>
        </div>
    );
}

export default Header;
