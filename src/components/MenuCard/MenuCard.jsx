import React, { Component } from "react";
import FoodCard from "components/FoodCard/FoodCard";

export class MenuCard extends Component {
  constructor(props){
    super(props);

    this.state = {
      menus: []
    }
    this.componentWillMount =  this.componentWillMount.bind(this);
  }

  componentWillMount(){
    var menus = [];
    var foods = this.props.foods;

    this.props.content.forEach(function(menu){
      foods.forEach(function(food){
        if(menu === food.id){
          menus.push(
            <FoodCard
              key={food.id}
              avatar={food.picture}
              title={food.title}
            />
          );
        }
      });
    });
    this.setState({menus: menus});
  }

  render() {

    return (
      <div className="mt-2 card card-user">
        <div className="content">
          <div className="col-md-9 col-sm-9">
            <h4 className="title">
              {this.props.title}
            </h4>
          </div>
          <div className="col-md-3 col-sm-3">
            <div className="float-right" style={{fontSize: '0.9em'}}>
              <i>{this.props.price} €</i>
            </div>
          </div>
          <div className="col-md-12 col-sm-12">
            <i className="text-muted">{this.props.desc}</i>
          </div>
          <div className="col-md-12 col-sm-12">
            <hr/>
            {this.state.menus}
          </div>
        </div>
      </div>
    );
  }
}

export default MenuCard;
