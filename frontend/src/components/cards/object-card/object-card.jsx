import React from "react";
import { Card, CardActions, CardContent, Button } from "@material-ui/core";

import "./object-card.css";

function ObjectCard(props) {
    const { organization } = props;
    return (
        <div className="object-card object-card-color">
            <Card style={{ backgroundColor: "#f7efee" }}>
                <CardContent>
                    <div className="card-content">
                        Organization - Members - Shorts
                        <h3>{organization.name}</h3>
                        <div>{organization.users.length} members</div>
                        <div>{organization.num_shorts} shorts</div>
                    </div>
                    <div className="card-button">
                        <Button size="large" variant="outlined">
                            Open page
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ObjectCard;
