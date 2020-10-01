// package imports
import React from "react";

// component imports
import OrganizationBodySeparator from "../body/organization-body-separator/organization-body-separator";
import OrganizationLayoutButtons from "../body/organization-layout-buttons/organization-layout-buttons";
import OrganizationBodyGrid from "../body/organization-body-grid/organization-body-grid";

//css imports
import "./organization-body.css";

function OrganizationBody(props) {
    let { shorts, searchString, view, columns, onLayoutChange } = props;

    if (!shorts.length === 0) {
        return (
            <div>
                <OrganizationBodySeparator
                    searchString={searchString}
                ></OrganizationBodySeparator>
                <div className="organization-body-empty">
                    {!searchString ? (
                        "This organization has no shorts yet!"
                    ) : (
                        <div className="organization-body-search-result-empty">
                            <div>No shorts found matching the search query</div>
                            <div>
                                <button className="all-shorts-button">
                                    See all shorts
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    } else {
        return (
            <React.Fragment>
                <OrganizationBodySeparator
                    searchString={searchString}
                ></OrganizationBodySeparator>
                {view === "mobile" ? (
                    <div></div>
                ) : (
                    <OrganizationLayoutButtons
                        onLayoutChange={onLayoutChange}
                        view={view}
                    ></OrganizationLayoutButtons>
                )}
                <OrganizationBodyGrid
                    columns={columns}
                    shorts={shorts}
                ></OrganizationBodyGrid>
            </React.Fragment>
        );
    }
}

export default OrganizationBody;
