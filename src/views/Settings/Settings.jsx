import React, { Component } from "react";
import {Grid,Row} from "react-bootstrap";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state: true
    };
  }

  render() {

    return (
      <div className="content">
        <Grid fluid>
          <Row>

          </Row>
        </Grid>
      </div>
    );
  }
}

export default Settings;
