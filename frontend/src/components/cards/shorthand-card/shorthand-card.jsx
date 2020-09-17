// package imports
import React from "react";

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
        </div>
    );
}

export default ShorthandCard;
