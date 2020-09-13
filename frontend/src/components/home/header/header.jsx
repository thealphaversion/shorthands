import React from "react";

import "./header.css";

function Header(props) {
    const { user } = props;

    return (
        <div className="home-heading home-header-color">
            <div className="home-heading-name">{"Hi, " + user}</div>
            <div className="home-heading-title">
                <i>welcome to shorthands</i>
            </div>
        </div>
    );
}

export default Header;
