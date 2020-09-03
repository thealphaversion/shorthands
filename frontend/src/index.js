// pacakge imports
import React from "react";
import ReactDOM from "react-dom";

// module imports
import Root from "./pages/root";

// css imports
import "./assets/fonts/fonts.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

ReactDOM.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>,
    document.getElementById("root")
);
