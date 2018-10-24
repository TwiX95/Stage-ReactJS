import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import {Grid,Row,Col} from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";

import dashboardRoutes from "routes/dashboard.jsx";

import firebase from 'firebase/app';
import 'firebase/firestore';

import {settingsFirebase} from "variables/Variables";

var db = firebase.firestore();
db.settings(settingsFirebase);

function setCookie(value, days) {
  var d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = "token=" + value + ";" + expires + ";path=/";
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLog: false,
      email: "",
      password:"",
      token: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleChange(param, event) {
    this.setState({[param]: event.target.value});
  }

  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }

  onSubmit(){
    var result = db.collection('users')
    .where("email", "==", this.state.email)
    .where("password", "==", this.state.password)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            setCookie(doc.id, 2);
            return doc.id;
        });
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });

    result.then(value => this.setState({
      isLog: true,
      token: value
    }));
  }

  render() {
    if(this.state.isLog){
      return (
        <div className="wrapper">
          <Sidebar {...this.props} />
          <div id="main-panel" className="main-panel" ref="mainPanel">
            <Header {...this.props} />
            <Switch>
              {dashboardRoutes.map((prop, key) => {
                if (prop.redirect)
                  return <Redirect from={prop.path} to={prop.to} key={key} />;
                return (
                  <Route path={prop.path} component={prop.component} key={key} />
                );
              })}
            </Switch>
            <Footer />
          </div>
        </div>
      );
    }else{
      return (
        <div className="wrapper">
          <Header {...this.props}/>
          <div className="content">
            <Grid fluid>
              <Row>
                <Col md={8} mdOffset={2}>
                  <Card
                    title="Se connecter"
                    content={
                      <form onSubmit={this.onSubmit}>
                        <FormInputs
                          ncols={["col-md-12"]}
                          proprieties={[
                            {
                              label: "Adresse mail",
                              type: "email",
                              bsClass: "form-control",
                              placeholder: "Email",
                              autoComplete: "email",
                              value: this.state.email,
                              onChange: this.handleChange.bind(this, 'email')

                            }
                          ]}
                        />
                        <FormInputs
                          ncols={["col-md-12"]}
                          proprieties={[
                            {
                              label: "Mot de passe",
                              type: "password",
                              bsClass: "form-control",
                              placeholder: "Mot de passe",
                              autoComplete: "password",
                              value: this.state.password,
                              onChange: this.handleChange.bind(this, 'password')
                            }
                          ]}
                        />
                        <Button bsStyle="success" pullRight fill type="submit">
                          Se connecter
                        </Button>
                        <div className="clearfix" />
                      </form>
                    }
                  />
                </Col>
              </Row>
            </Grid>
          </div>
          <Footer/>
        </div>
      );
    }

  }
}

export default Dashboard;
