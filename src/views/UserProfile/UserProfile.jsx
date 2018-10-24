import React, { Component } from "react";
import {Grid,Row,Col, Alert, Modal, FormGroup, ControlLabel, FormControl} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import {Week} from "components/Week/Week.jsx";
import {settingsFirebase, listOfErrors, schedule} from "variables/Variables";
import getCookie from "utils/utils.js";

import avatar from "assets/img/faces/face-3.jpg";

import firebase from 'firebase/app';
import 'firebase/firestore';

var db = firebase.firestore();
db.settings(settingsFirebase);

function CustomAlert(data){

  const errors = [];

  data.forEach(function(element){
    errors.push(<p key={element}>{listOfErrors[element]}</p>);
  });

  return (
    <Alert bsStyle="danger">
      {errors}
    </Alert>
  );
}

function AlertSuccess(){
  return (
    <Alert bsStyle="success">
      Les modifications ont été effectuées.
    </Alert>
  );
}

function CustomButton(click){
  return (
    <Button onClick={click} bsStyle="info" pullRight fill>
      Modifier
    </Button>
  );
}

function ValidateButton(click, cancel){
  return (
    <div>
      <Button onClick={cancel} bsStyle="danger" pullRight fill>
        Annuler
      </Button>
      <Button onClick={click} bsStyle="success" pullRight fill>
        Valider
      </Button>
  </div>
  );
}

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state: true,
      openDays: [],
      name: "",
      address: "",
      postalCode: "",
      city: "",
      averageTime: "",
      country: "",
      phone:"",
      email:"",
      minBooking: 1,
      maxBooking: 10,
      errors: [],
      modal: false,
      success: false
    };
    this.componentWillMount = this.componentWillMount.bind(this);
    this.onClick = this.onClick.bind(this);
    this.check = this.check.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showModal = this.showModal.bind(this);

  }

  componentWillMount(){
    var docRef = db.collection("users").doc(getCookie("token"));
    docRef.get()
    .then(doc => this.setState({
      openDays: doc.data().open_days,
      name: doc.data().name,
      address: doc.data().address,
      postalCode: doc.data().postal_code,
      city: doc.data().city,
      averageTime: doc.data().avg_duration,
      country: doc.data().country,
      phone: doc.data().phone,
      email: doc.data().email,
      minBooking: doc.data().min_booking,
      maxBooking: doc.data().max_booking
    }));
  }

  handleChange(param, event) {
    this.setState({[param]: event.target.value});
  }

  isEnable(state){
    return (state ? "disabled" : false);
  }

  onClick(param){
    if(this.state.state){
      this.setState({state: false});
    }else{
      this.setState({state: true});
    }
  }

  showModal(param){
    if(this.state.modal){
      this.setState({modal: false});
    }else{
      this.setState({modal: true});
    }
  }

  check(){
    var error = false;
    var listOfErrors = [];
    var regAddress = RegExp('^[0-9]{1,}[a-zA-Z ]{2,}');
    var regCode = RegExp('^[0-9]{5}$');
    var regPhone = RegExp('(0|(\\+33)|(0033))[1-9][0-9]{8}');
    var regEmail = RegExp('^[^\\W][a-zA-Z0-9_]+(\\.[a-zA-Z0-9_]+)*\\@[a-zA-Z0-9_]+(\\.[a-zA-Z0-9_]+)*\\.[a-zA-Z]{2,4}$');
    var regInteger = RegExp('^[0-9]{1,}$');

    if(this.state.name.length < 2){
      error = true;
      listOfErrors.push(1);
    }

    if(this.state.address.length < 2){
      error = true;
      listOfErrors.push(2);
    }

    if(!regAddress.test(this.state.address)){
      error = true;
      listOfErrors.push(3);
    }

    if(this.state.city.length < 2){
      error = true;
      listOfErrors.push(4);
    }

    if(!regCode.test(this.state.postalCode)){
      error = true;
      listOfErrors.push(5);
    }

    if(this.state.country.length < 2){
      error = true;
      listOfErrors.push(6);
    }

    if(!regEmail.test(this.state.email)){
      error = true;
      listOfErrors.push(7);
    }

    if(!regPhone.test(this.state.phone)){
      error = true;
      listOfErrors.push(8);
    }

    if(!regInteger.test(this.state.minBooking)){
      error = true;
      listOfErrors.push(9);
    }

    if(!regInteger.test(this.state.maxBooking)){
      error = true;
      listOfErrors.push(10);
    }

    if(error){
      this.setState({errors: listOfErrors});
      this.showModal(this.state.modal);
    }else{
      this.setState({errors: []});
      var docRef = db.collection("users").doc(getCookie("token"));
      docRef.update({
          name: this.state.name,
          address: this.state.address,
          postal_code: this.state.postalCode,
          city: this.state.city,
          avg_duration: this.state.averageTime,
          country: this.state.country,
          phone: this.state.phone,
          email: this.state.email,
          min_booking: this.state.minBooking,
          max_booking: this.state.maxBooking

      })
      .then(function() {
          console.log("Document successfully updated!");
      });
      this.setState({success: true});
      this.showModal(this.state.modal);
      this.onClick(this.state.state);
    }
  }

  render() {

    const listOfHours = [];

    for(var j = 0; j < 6; j++ ){
      for(var k = 0; k < schedule.minutes.length; k++ ){
        listOfHours.push(
          <option key={schedule.hours[j] + schedule.minutes[k]} value={schedule.hours[j] + schedule.minutes[k]}>{schedule.hours[j] + "h" +schedule.minutes[k]}</option>
        );

      }
    }

    let status;
    let button;

    if(this.state.state){
      button = CustomButton(this.onClick);
    }else{
      button = ValidateButton(this.showModal, this.onClick);
    }

    if(this.state.errors.length !== 0){
      status = CustomAlert(this.state.errors);
    }

    if(this.state.success){
      status = AlertSuccess();
    }

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <UserCard
                avatar={avatar}
                name={this.state.name}
                address={this.state.address+ " " + this.state.postalCode+ " "+  this.state.city}
                phone={this.state.phone}
                mail={this.state.email}
                socials={
                    <Button simple bsClass="btn btn-primary float-right">
                      <i className="fab fa-facebook-square fa-3x" />
                    </Button>
                }
              />
            </Col>
            <Col md={12}>
              <div>{status}</div>
              <Card
                title="Informations du restaurant"
                content={
                  <form>
                    <FormInputs
                      ncols={["col-md-5"]}
                      proprieties={[
                        {
                          label: "Nom du restaurant",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Nom",
                          autoComplete: "name",
                          value: this.state.name,
                          onChange: this.handleChange.bind(this, 'name'),
                          disabled: this.isEnable(this.state.state)
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-12"]}
                      proprieties={[
                        {
                          label: "Adresse",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Adresse",
                          autoComplete:"address-line1",
                          value: this.state.address,
                          onChange: this.handleChange.bind(this, 'address'),
                          disabled: this.isEnable(this.state.state)
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-4", "col-md-4", "col-md-4"]}
                      proprieties={[
                        {
                          label: "Ville",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Ville",
                          autoComplete:"address-level2",
                          value: this.state.city,
                          onChange: this.handleChange.bind(this, 'city'),
                          disabled: this.isEnable(this.state.state)
                        },
                        {
                          label: "Code postal",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "Code postal",
                          autoComplete:"postal-code",
                          value: this.state.postalCode,
                          onChange: this.handleChange.bind(this, 'postalCode'),
                          disabled: this.isEnable(this.state.state)
                        },
                        {
                          label: "Pays",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Pays",
                          value: this.state.country,
                          onChange: this.handleChange.bind(this, 'country'),
                          disabled: this.isEnable(this.state.state)
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-6","col-md-6"]}
                      proprieties={[
                        {
                          label: "Email",
                          type: "email",
                          bsClass: "form-control",
                          placeholder: "Email",
                          autoComplete:"email",
                          value: this.state.email,
                          onChange: this.handleChange.bind(this, 'email'),
                          disabled: this.isEnable(this.state.state)
                        },
                        {
                          label: "Téléphone",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Téléphone",
                          autoComplete:"phone",
                          value: this.state.phone,
                          onChange: this.handleChange.bind(this, 'phone'),
                          disabled: this.isEnable(this.state.state)
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-6","col-md-6"]}
                      proprieties={[
                        {
                          label: "Nombre de réservation minimum",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "minimum",
                          value: this.state.minBooking,
                          onChange: this.handleChange.bind(this, 'minBooking'),
                          disabled: this.isEnable(this.state.state)
                        },
                        {
                          label: "Nombre de réservation maximum",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Maximum",
                          value: this.state.maxBooking,
                          onChange: this.handleChange.bind(this, 'maxBooking'),
                          disabled: this.isEnable(this.state.state)
                        }
                      ]}
                    />
                    <FormGroup bsClass="col-md-12" controlId="formControlsSelect">
                      <ControlLabel>Temps moyen par table</ControlLabel>
                      <FormControl componentClass="select" placeholder="select" value={this.state.averageTime} onChange={this.handleChange.bind(this, 'averageTime')}  disabled={this.isEnable(this.state.state)}>
                        {listOfHours}
                      </FormControl>
                    </FormGroup>
                    <Week data={this.state.openDays} state={this.state.state}/>
                    <div className="clearfix" />
                    {button}
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
          </Row>
        </Grid>
        <Modal show={this.state.modal} onHide={this.showModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation des modifications</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Confirmez-vous les modifications effectuées ?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="success" onClick={this.check} fill>Confirmer</Button>
            <Button bsStyle="danger" onClick={this.showModal} fill>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default UserProfile;
