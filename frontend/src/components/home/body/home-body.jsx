// package imports
import React from "react";

// module imports
import OrganizationCard from "../../cards/organization-card/organization-card";

// css imports
import "./home-body.css";

function HomeBody(props) {
    let { organizations } = props;

    return (
        <React.Fragment>
            <hr className="home-header-seperation"></hr>
            <div className="home-body-subheading">
                Organizations you are associated with
            </div>
            <div className="home-grid-container">
                {organizations.map((organization, index) => {
                    return (
                        <div
                            className="home-grid-item home-item-color"
                            key={index}
                        >
                            <OrganizationCard
                                organization={organization}
                            ></OrganizationCard>
                        </div>
                    );
                })}
            </div>
        </React.Fragment>
    );
}

export default HomeBody;
