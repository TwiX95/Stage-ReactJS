import React, { Component } from "react";

export class DisheCard extends Component {
  render() {
    return (
      <div className="mt-2 card card-user">
        <div className="content-dishe">
          <div className="col-md-3 col-sm-3">
            <img
              className="dishe border-gray"
              src={this.props.avatar}
              alt="..."
            />
          </div>
          <div className="col-md-7 col-sm-7">
            <h4 className="title">
              {this.props.title}
            </h4>
            <i className="text-muted">{this.props.content}</i>
          </div>
          <div className="col-md-2 col-sm-2">
            <div className="float-right" style={{fontSize: '0.9em'}}>
              <i>{this.props.price} €</i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DisheCard;
