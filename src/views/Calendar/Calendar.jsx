import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";

import {settingsFirebase, messages} from "variables/Variables.jsx";

import getCookie from "utils/utils.js";

import firebase from 'firebase/app';
import 'firebase/firestore';

import Calendar from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import globalize from 'globalize';

require('globalize/lib/cultures/globalize.culture.fr')

Calendar.setLocalizer(
  Calendar.globalizeLocalizer(globalize)
);

var db = firebase.firestore();
db.settings(settingsFirebase);

class CalendarClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      culture: 'fr'
    };
    this.componentWillMount = this.componentWillMount.bind(this);
  }

  componentWillMount(){
    var docBooking = db.collection("users").doc(getCookie("token")).collection("bookings");
    docBooking.get()
   .then(collection => {
      const events = collection.docs.map(doc => doc.data());
      var temp = [];

      events.forEach(function(element){
        temp.push({
          title: element.name + " ( "+ element.size +" personnes) ",
          start: new Date(element.date.seconds*1000),
          end: new Date(element.date.seconds*1000+(60*60*1000))
        });
      });

      this.setState({
        events: temp
      });
   });
  }

  render() {

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                id="listBook"
                title="Liste des réservations"
                content={
                  <Calendar
                    popup
                    culture={this.state.culture}
                    messages={messages}
                    defaultDate={new Date()}
                    defaultView="week"
                    events={this.state.events}
                    resizable
		style={{height: '80%'}}
                  />
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

  export default CalendarClass;
