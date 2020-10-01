// package imports
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { faTh } from "@fortawesome/free-solid-svg-icons";
import { faThLarge } from "@fortawesome/free-solid-svg-icons";

//css imports
import "./organization-layout-buttons.css";

function OrganizationLayoutButtons(props) {
    let { view, onLayoutChange } = props;
    return (
        <div className="organization-body-layout-buttons">
            <button
                className="organization-body-layout-button"
                onClick={() => onLayoutChange(1)}
            >
                <FontAwesomeIcon icon={faSquare} size={"1x"} />
            </button>
            <button
                className="organization-body-layout-button"
                onClick={() => onLayoutChange(2)}
            >
                <FontAwesomeIcon icon={faThLarge} size={"1x"} />
            </button>
            {view === "tablet" ? (
                <div></div>
            ) : (
                <button
                    className="organization-body-layout-button"
                    onClick={() => onLayoutChange(3)}
                >
                    <FontAwesomeIcon icon={faTh} size={"1x"} />
                </button>
            )}
        </div>
    );
}

export default OrganizationLayoutButtons;
