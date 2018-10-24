import React, { Component } from "react";

export class FoodCard extends Component {

  render() {

    return (
      <div className="row">
        <div className="content-food">
          <div className="col-md-3 col-sm-3">
            <img
              className="food border-gray"
              src={this.props.avatar}
              alt="..."
            />
          </div>
          <div className="col-md-9 col-sm-9">
            <h5 className="title">
              {this.props.title}
            </h5>
          </div>
        </div>
      </div>
    );
  }
}

export default FoodCard;
