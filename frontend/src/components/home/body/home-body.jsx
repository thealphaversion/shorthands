// package imports
import React from "react";

// module imports
import OrganizationCard from "../../cards/organization-card/organization-card";

// css imports
import "./home-body.css";

function HomeBody(props) {
    let { organizations } = props;

    if (organizations.length === 0) {
        return (
            <React.Fragment>
                <hr className="home-header-seperation"></hr>
                <div className="home-body-empty">
                    You aren't part of any organization yet. Ask your
                    organization to send you an invite!
                </div>
            </React.Fragment>
        );
    }

    if (organizations.length === 1) {
        return (
            <React.Fragment>
                <hr className="home-header-seperation"></hr>
                <div className="home-body-subheading">Your Organizations</div>
                <div className="home-single-org-container">
                    {organizations.map((organization, index) => {
                        return (
                            <div
                                className="home-single-grid-item home-item-color"
                                key={index}
                            >
                                <OrganizationCard
                                    organization={organization}
                                    history={props.history}
                                ></OrganizationCard>
                            </div>
                        );
                    })}
                </div>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <hr className="home-header-seperation"></hr>
            <div className="home-body-subheading">Your Organizations</div>
            <div className="home-grid-container">
                {organizations.map((organization, index) => {
                    return (
                        <div
                            className="home-grid-item home-item-color"
                            key={index}
                        >
                            <OrganizationCard
                                organization={organization}
                                history={props.history}
                            ></OrganizationCard>
                        </div>
                    );
                })}
            </div>
        </React.Fragment>
    );
}

export default HomeBody;
