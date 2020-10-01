// package imports
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

// css imports
import "./shorthand-card.css";

function ShorthandCard(props) {
    const { short } = props;

    return (
        <div className="shorthand-card">
            <div className="shorthand-card-indicator">
                <i>shorthand</i>
            </div>
            <div className="shorthand-card-title">{short.shorthand}</div>
            <div className="shorthand-card-description">
                {short.description}
            </div>
            <div className="shorthand-card-vote-button-container">
                <button className="shorthand-card-icon-btn-up">
                    <FontAwesomeIcon icon={faArrowUp} size={"1x"} />
                </button>
                0
                <button className="shorthand-card-icon-btn-down">
                    <FontAwesomeIcon icon={faArrowDown} size={"1x"} />
                </button>
                0
            </div>
        </div>
    );
}

export default ShorthandCard;
