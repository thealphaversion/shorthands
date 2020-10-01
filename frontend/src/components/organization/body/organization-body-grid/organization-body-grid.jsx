// package imports
import React from "react";
import Masonry from "react-masonry-css";

// component imports
import ShorthandCard from "../../../cards/shorthand-card/shorthand-card";

//css imports
import "./organization-body-grid.css";

function OrganizationBodyGrid(props) {
    let { shorts, columns } = props;
    return (
        <Masonry
            breakpointCols={columns}
            className="organization-body-container"
            columnClassName="organization-body-item-column"
        >
            {shorts.map((short, index) => {
                return (
                    <ShorthandCard short={short} key={index}></ShorthandCard>
                );
            })}
        </Masonry>
    );
}

export default OrganizationBodyGrid;
