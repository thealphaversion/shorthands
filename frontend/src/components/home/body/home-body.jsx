import React from "react";
import isOdd from "is-odd";

import ObjectCard from "../../cards/object-card/object-card";

import "./home-body.css";

function HomeBody(props) {
    let { organizations } = props;

    /**
     * TEST DATA
     * 
     * 
    let organizations = [];
    organizations.push({ name: "Google", users: ["a", "b"], num_shorts: 4 });
    organizations.push({
        name: "Microsoft",
        users: ["a", "b", "c"],
    });
    organizations.push({
        name: "Netflix",
        users: ["a", "b", "c", "d"],
    });
    */

    let placeholderArray = [];

    if (organizations.length > 0) {
        return (
            <div className="home-card-container">
                {organizations.map((organization, index) => {
                    let odd = false;

                    if (isOdd(organizations.length)) {
                        odd = true;
                    }

                    if (odd) {
                        if (index === organizations.length - 1) {
                            return (
                                <div className="home-card-row">
                                    <ObjectCard
                                        className="home-card-column"
                                        organization={organization}
                                    ></ObjectCard>
                                </div>
                            );
                        }
                    }

                    if (!isOdd(index)) {
                        placeholderArray.splice(0, placeholderArray.length);
                        placeholderArray.push(organization);
                    } else {
                        return (
                            <div className="home-card-row">
                                <ObjectCard
                                    className="home-card-column"
                                    organization={placeholderArray[0]}
                                ></ObjectCard>
                                <ObjectCard
                                    className="home-card-column"
                                    organization={organization}
                                ></ObjectCard>
                            </div>
                        );
                    }
                })}
            </div>
        );
    } else {
        return (
            <div className="home-card-container-empty">
                It seems like you're not part of any organizations yet!
            </div>
        );
    }
}

export default HomeBody;
