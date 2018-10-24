import React, { Component } from "react";

export class UserCard extends Component {
  render() {
    return (
      <div className="card card-user">
        <div className="content">
          <div className="col-md-3">
            <img
              className="avatar border-gray"
              src={this.props.avatar}
              alt="..."
            />
          </div>
          <div className="col-md-7">
            <h4 className="title">
              {this.props.name}
              <br />
              <small>{this.props.address}</small>
              <br />
              <small>{this.props.phone}</small>
              <br />
              <small>{this.props.mail}</small>
              <br />
            </h4>
          </div>
          <div className="col-md-2">
            <a>

            </a>
            {this.props.socials}
          </div>
        </div>
      </div>
    );
  }
}

export default UserCard;
