// package imports
import React from "react";

function Footer() {
    const date = new Date();
    const currentYear = date.getFullYear();

    return (
        <footer className="m-3 justify-content-center">
            Copyright &copy; Aditya Chakraborti, {currentYear}. All rights
            reserved.
        </footer>
    );
}

export default Footer;
