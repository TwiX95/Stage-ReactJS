import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import {dataBar, dataSales,optionsSales,responsiveSales,legendSales,configFirebase, settingsFirebase, messages, legendMonth, optionsMonth} from "variables/Variables.jsx";
import getCookie from "utils/utils.js";

import firebase from 'firebase/app';
import 'firebase/firestore';
import Gauge from 'react-svg-gauge';

import Calendar from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import globalize from 'globalize';

firebase.initializeApp(configFirebase);

require('globalize/lib/cultures/globalize.culture.fr')

Calendar.setLocalizer(
  Calendar.globalizeLocalizer(globalize)
);

var db = firebase.firestore();
db.settings(settingsFirebase);

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      culture: 'fr',
      data: {
        labels: dataSales.labels,
        series: []
      },
      dataMonth: {
        labels: dataBar.labels,
        series: []
      },
      nbToday: 0,
      nbClientToday: 0,
      remaining: 0
    };
    this.componentWillMount = this.componentWillMount.bind(this);

  }

  componentWillMount(){
    var docRef = db.collection("users").doc(getCookie("token"));
    var Remaining = docRef.get()
    .then(doc => {
      return doc.data().max_booking
    });

    var docBooking = db.collection("users").doc(getCookie("token")).collection("bookings");
    docBooking.get()
   .then(collection => {
      const events = collection.docs.map(doc => doc.data());
      var temp = [];
      var hours = {
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0,
        16: 0,
        17: 0,
        18: 0,
        19: 0,
        20: 0,
        21: 0,
        22: 0,
        23: 0,
        0: 0
      };

      var month = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0
      };

      var number = 0;
      var clients = 0;
      events.forEach(function(element){

        var today = new Date().getDate();

        if(today === new Date(element.date.seconds*1000).getDate()){
          number++;
          clients = clients + element.size;
          hours[new Date(element.date.seconds*1000).getHours()] = element.size;
        }

        if(new Date().getYear() === new Date(element.date.seconds*1000).getYear()){
          month[new Date(element.date.seconds*1000).getMonth() + 1] = element.size;
        }

        temp.push({
          title: element.name + " ( "+ element.size +" personnes) ",
          start: new Date(element.date.seconds*1000),
          end: new Date(element.date.seconds*1000+(60*60*1000))
        });
      });

      Remaining.then(value => this.setState({remaining: value - clients}));
      this.setState({
        events: temp,
        nbToday: number,
        nbClientToday: clients,
        data: {series: [Object.values(hours)]},
        dataMonth: {series: [Object.values(month)]}
      });
   });
  }

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }

  render() {

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={4} sm={4}>
                <Gauge
                  value={10}
                  width={190}
                  height={130}
                  color="#1e8c78"
                  label="Taux de remplissage"
                  topLabelStyle={{color: "#000", fontSize: "16px"}}
                  valueLabelStyle={{fontSize: "24px"}}
                  minMaxLabelStyle={{fontSize: "16px"}}
                />
            </Col>
            <Col lg={2} sm={4}>
              <StatsCard
                statsText="Réservations journalières"
                statsValue={this.state.nbClientToday}
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Aujourd'hui"
              />
            </Col>
            <Col lg={2} sm={4}>
              <StatsCard
                statsText="Places restantes"
                statsValue={this.state.nbToday}
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Aujourd'hui"
              />
            </Col>
            <Col lg={2} sm={4}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Visites journalières"
                statsValue="23"
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="Mis à jour à l'instant"
              />
            </Col>
            <Col lg={2} sm={4}>
              <StatsCard
                bigIcon={<i className="fa fa-twitter text-info" />}
                statsText="Visites mensuelles"
                statsValue={this.state.remaining}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Mis à jour à l'instant"
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Card
              id="chartHours"
              title="Taux de remplissage par mois"
              category="Cette année"
              content={
                <div className="ct-chart">
                  <ChartistGraph
                    data={this.state.dataMonth}
                    type="Line"
                    options={optionsMonth}
                    responsiveOptions={responsiveSales}
                  />
                </div>
              }
              legend={
                <div className="legend">{this.createLegend(legendMonth)}</div>
              }
            />
            </Col>
            <Col md={6}>
              <Card
              id="chartHours"
              title="Visite par jour"
              category="Aujourd'hui"
              content={
                <div className="ct-chart">
                  <ChartistGraph
                    data={this.state.data}
                    type="Line"
                    options={optionsSales}
                    responsiveOptions={responsiveSales}
                  />
                </div>
              }
              legend={
                <div className="legend">{this.createLegend(legendSales)}</div>
              }
            />
            </Col>
          </Row>
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
			              style={{height: '60%'}}
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

  export default Dashboard;
