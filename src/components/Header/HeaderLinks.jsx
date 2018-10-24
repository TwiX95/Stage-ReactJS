import React, { Component } from "react";
import { NavItem, Nav } from "react-bootstrap";

class HeaderLinks extends Component {
  render() {
    return (
      <div>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">
            <i className="fab fa-whatsapp text-success" />
          </NavItem>
          <NavItem eventKey={1} href="#">
            <i className="fab fa-facebook-messenger text-primary" />
          </NavItem>
          <NavItem eventKey={1} href="#">
            <i className="fab fa-twitter text-info" />
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default HeaderLinks;
