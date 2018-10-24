import React, { Component } from "react";
import {FormGroup,ControlLabel,FormControl} from "react-bootstrap";

import {schedule} from "variables/Variables";

export class Week extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps({ data }) {
    var temp= [];
    var array = [];
    for (var i = 0; i < schedule.day.length; i++) {
      var hours = ["-", "-", "-", "-"];
        switch(data[i].length){
          case 9:
            temp = data[i].split("-");
            hours[0] = temp[0];
            hours[1] = temp[1];
            break;
          case 19:
            temp = data[i].split(";");
            var a = temp[0].split("-");
            var b = temp[1].split("-");
            hours[0] = a[0];
            hours[1] = a[1];
            hours[2] = b[0];
            hours[3] = b[1];
            break;
          default:
            break;
        }
        array.push(hours);
      }
    this.setState({ data: array });
  }

  handleChange(line, column, event) {
    const data = this.state.data;
    data[line][column] = event.target.value;

    if(column !== 3){
      if(parseInt(data[line][column], 2) > data[line][column+1]){
        data[line][column+1] = parseInt(event.target.value, 2) + 100;
      }
    }
    if(column !== 0){
      if(parseInt(data[line][column], 2) < data[line][column-1]){
        data[line][column-1] = parseInt(event.target.value, 2) - 100;
      }
    }

    this.setState({ data });
  }

  render() {
    const week = [];
    var temp = [];

    const listOfHours = [];
    listOfHours.push(<option key={0} value="-">-</option>);

    for(var j = 0; j < schedule.hours.length; j++ ){
      for(var k = 0; k < schedule.minutes.length; k++ ){
        listOfHours.push(
          <option key={schedule.hours[j] + schedule.minutes[k]} value={schedule.hours[j] + schedule.minutes[k]}>{schedule.hours[j] + "h" +schedule.minutes[k]}</option>
        );

      }
    }

    if(this.props.data.length !== 0){
      for (var i = 0; i < schedule.day.length; i++) {
        var hours = [];
          switch(this.props.data[i].length){
            case 9:
              temp = this.props.data[i].split("-");
              hours[0] = temp[0];
              hours[1] = temp[1];
              break;
            case 19:
              temp = this.props.data[i].split(";");
              var a = temp[0].split("-");
              var b = temp[1].split("-");
              hours[0] = a[0];
              hours[1] = a[1];
              hours[2] = b[0];
              hours[3] = b[1];
              break;
            default:
              break;
          }

        week.push(
            <FormGroup key={schedule.day[i]}>
                <div className="col-md-12">
                  <h5>{schedule.day[i]}</h5>
                </div>
                <div className="col-md-3">
                  <FormGroup bsClass="col-md-12" controlId="formControlsSelect">
                    <ControlLabel>Ouverture</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" value={this.state.data[i][0]} onChange={this.handleChange.bind(this, i, 0)} disabled={this.props.state}>
                      {listOfHours}
                    </FormControl>
                  </FormGroup>
                </div>
                <div className="col-md-3">
                  <FormGroup bsClass="col-md-12" controlId="formControlsSelect">
                    <ControlLabel>Fermeture</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" value={this.state.data[i][1]} onChange={this.handleChange.bind(this, i, 1)} disabled={this.props.state}>
                      {listOfHours}
                    </FormControl>
                  </FormGroup>
                </div>
                <div className="col-md-3">
                  <FormGroup bsClass="col-md-12" controlId="formControlsSelect">
                    <ControlLabel>Ouverture</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" value={this.state.data[i][2]} onChange={this.handleChange.bind(this, i, 2)} disabled={this.props.state}>
                      {listOfHours}
                    </FormControl>
                  </FormGroup>
                </div>
                <div className="col-md-3">
                  <FormGroup bsClass="col-md-12" controlId="formControlsSelect">
                    <ControlLabel>Fermeture</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" value={this.state.data[i][3]} onChange={this.handleChange.bind(this, i, 3)} disabled={this.props.state}>
                      {listOfHours}
                    </FormControl>
                  </FormGroup>
                </div>
            </FormGroup>
        );
      }
    }
    return week;
  }
}

export default Week;
