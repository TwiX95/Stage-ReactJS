import React, { Component } from "react";

export class Dishe extends Component {
  render() {
    return (
      <div className="mt-2 card-dishe">
        <div className="list-dishe">
          <div className="col-md-2 col-sm-2">
            <img
              className="avatar-list-dishe border-gray"
              src={this.props.avatar}
              alt="..."
            />
          </div>
          <div className="col-md-10 col-sm-10 title-dishe">
            <p>{this.props.title}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Dishe;
