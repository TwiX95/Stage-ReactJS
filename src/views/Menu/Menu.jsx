import React, { Component } from "react";
import { Grid, Row, Col, Alert, Modal, FormControl, FormGroup, ControlLabel } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import DisheCard from "components/DisheCard/DisheCard.jsx";
import Dishe from "components/Dishe/Dishe.jsx";
import MenuCard from "components/MenuCard/MenuCard.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";

import {settingsFirebase, listOfErrors} from "variables/Variables";

import firebase from 'firebase/app';
import 'firebase/firestore';

import getCookie from "utils/utils.js";

var db = firebase.firestore();
db.settings(settingsFirebase);

function FieldGroup({ id, label, help, imagePreview, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>
        <div className="thumbnail">
          {imagePreview}
        </div>
      </ControlLabel>
      <div className="noDisplay">
        <FormControl {...props} />
      </div>
    </FormGroup>
  );
}

function CustomAlert(data){

  return (
    <Alert bsStyle="danger">
      {
        data.map((error, index) => {
          return(<p key={index}>{listOfErrors[error]}</p>)
        })
      }
    </Alert>
  );
}

function AlertSucess(data){
  return (
    <Alert bsStyle="success">
      <p>{data}</p>
    </Alert>
  );
}

class Menu extends Component {
  constructor(props){
    super(props);

    this.state = {
      foods: [],
      menus: [],
      modal: false,
      modalMenu: false,
      tag:"",
      title: "",
      desc: "",
      price: "",
      file: "",
      imagePreviewUrl: "",
      errors: [],
      success: "",
      titleMenu: "",
      tempMenu: [],
      tempDishe: "-",
      priceMenu: "",
      descMenu: ""
    }
    this.addDishe = this.addDishe.bind(this);
    this.deleteDishe = this.deleteDishe.bind(this);
    this.removeDishe = this.removeDishe.bind(this);
    this.deleteMenu = this.deleteMenu.bind(this);
    this.check = this.check.bind(this);
    this.checkMenu = this.checkMenu.bind(this);
    this.showModal = this.showModal.bind(this);
    this.showModalMenu = this.showModalMenu.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  componentWillMount(){
    var docFood = db.collection("users").doc(getCookie("token")).collection("food");
    var docMenus = db.collection("users").doc(getCookie("token")).collection("menus");

    docFood.get().then(collection => {
      const foods = collection.docs.map(doc => doc.data());
      const id = collection.docs.map(doc => doc.id);
      var temp = {};
      var array = [];
      for(var i = 0; i < foods.length; i++){
        temp = foods[i];
        temp.id = id[i];
        array.push(temp);
      }
      this.setState({foods: array});
    });

    docMenus.get().then(collection => {
      const menus = collection.docs.map(doc => doc.data());
      const id = collection.docs.map(doc => doc.id);
      var temp = {};
      var array = [];
      for(var i = 0; i < menus.length; i++){
        temp = menus[i];
        temp.id = id[i];
        array.push(temp);
      }
      this.setState({menus: array});
    });

  }

  handleChange(param, event) {
    this.setState({[param]: event.target.value});
  }

  handleSelect(event) {
    this.setState({tempDishe: event.target.value});
  }

  handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file)
  }

  showModal(e){
    if(this.state.modal){
      this.setState({
        modal: false,
        tag: ""
      });
    }else{
      this.setState({
        modal: true,
        tag: e.target.value
      });
    }
  }

  showModalMenu(e){
    if(this.state.modalMenu){
      this.setState({
        modalMenu: false
      });
    }else{
      this.setState({
        modalMenu: true
      });
    }
  }

  check(){
    var error = false;
    var listOfErrors = [];
    var regInteger = RegExp('^[0-9]{1,4}[.,]{0,1}[0-9]{0,2}$');
    var ext = ["jpg", "jpeg", "JPG", "JPEG", "png", "PNG", "bmp", "BMP", "gif", "GIF"];

    if(this.state.title.length < 2 || this.state.title.length > 80){
      error = true;
      listOfErrors.push(11);
    }
    if(this.state.desc.length < 2 || this.state.desc.length > 230){
      error = true;
      listOfErrors.push(12);
    }
    if(!regInteger.test(this.state.price)){
      error = true;
      listOfErrors.push(13);
    }
    if(parseFloat(this.state.price) > 1500){
      error = true;
      listOfErrors.push(14);
    }
    if(this.state.file.length > 0){
      var extFile = this.state.file.name.split(".");
      if(this.state.file.size > 2000000){
        error = true;
        listOfErrors.push(15);
      }
      if(this.state.file.height > 1920 || this.state.file.width > 1080){
        error = true;
        listOfErrors.push(16);
      }
      if(ext.indexOf(extFile[1]) === -1){
        error = true;
        listOfErrors.push(17);
      }
    }

    if(error){
      this.setState({
        errors: listOfErrors,
        success: ""
      });
    }else{
      var data = {
        title: this.state.title,
        desc: this.state.desc,
        tag: this.state.tag,
        price: this.state.price,
        picture: "users/default.png"
      }

      db.collection("users").doc(getCookie("token")).collection("food")
      .add(data)
      .then(doc => {

        var temp = this.state.foods;
        data.id = doc.id;
        temp.push(data);

        this.setState({
          errors: [],
          foods: temp,
          title: "",
          tag: "",
          desc: "",
          picture: "",
          price: "",
          success: "Le plat a été ajouté"
        });

        this.showModal();
      });
    }
  }

  addDishe(){
    if(this.state.tempDishe !== "-"){
      var array = this.state.tempMenu;
      var dishe = this.state.foods[this.state.tempDishe];
      array.push(dishe);
      this.setState({tempMenu: array});
    }
  }

  removeDishe(param){
    var foods = this.state.tempMenu;
    foods.map((food, index) => {
      if(food.id === param){
        foods.splice(index, 1);
      }
      return null;
    });
    this.setState({tempMenu: foods});
  }

  deleteDishe(param){
    db.collection("users").doc(getCookie("token")).collection("food").doc(param).delete();
    var foods = this.state.foods;
    foods.map((food, index) => {
      if(food.id === param){
        foods.splice(index, 1);
      }
      return null;
    });
    this.setState({
      foods: foods,
      success: "Le plat a été supprimé"
    });
  }

  deleteMenu(param){
    db.collection("users").doc(getCookie("token")).collection("menus").doc(param).delete();
    var menus = this.state.menus;
    menus.map((menu, index) => {
      if(menu.id === param){
        menus.splice(index, 1);
      }
      return null;
    });
    this.setState({
      menus: menus,
      success: "Le menu a été supprimé"
    });
  }

  checkMenu(){
    var error = false;
    var listOfErrors = [];
    var regInteger = RegExp('^[0-9]{1,4}[.,]{0,1}[0-9]{0,2}$');

    if(this.state.titleMenu.length < 2 || this.state.titleMenu.length > 80){
      error = true;
      listOfErrors.push(18);
    }
    if(this.state.descMenu.length < 2 || this.state.descMenu.length > 230){
      error = true;
      listOfErrors.push(19);
    }
    if(!regInteger.test(this.state.priceMenu)){
      error = true;
      listOfErrors.push(13);
    }
    if(parseFloat(this.state.priceMenu) > 1500){
      error = true;
      listOfErrors.push(14);
    }
    if(error){
      this.setState({errors: listOfErrors});
    }else{
      var entries = [];
      var temp = this.state.tempMenu;

      temp.forEach(function(element){
        entries.push(element.id);
      });

      var data = {
        title: this.state.titleMenu,
        desc: this.state.descMenu,
        price: this.state.priceMenu,
        entries: entries
      }

      db.collection("users").doc(getCookie("token")).collection("menus").add(data)
      .then(doc => {
        var temp = this.state.menus;
        temp.push(data);

        this.setState({
          errors: [],
          menus: temp,
          titleMenu: "",
          descMenu: "",
          priceMenu: "",
          success: "Le menu a été ajouté"
        });
        this.showModalMenu();
      });
    }

  }

  render() {

    var {imagePreviewUrl} = this.state;
    var imagePreview = null;
    if (imagePreviewUrl) {
      imagePreview = (<img alt="..." src={imagePreviewUrl} />);
    } else {
      imagePreview = (<div className="previewText"><i className="fas fa-plus fa-2x"/></div>);
    }

    let status;
    let success;

    if(this.state.success.length !== 0)
      success = AlertSucess(this.state.success);

    if(this.state.errors.length !== 0)
      status = CustomAlert(this.state.errors);

    return (
      <div className="content">
        {success}
        <Grid fluid>
          <Row>
            <Col md={6} sm={6}>
              <Card
              hCenter={true}
              title="Plats"
              content={
                <div>
                  <p>Entrées</p>
                  <Button value="starter" bsSize="small" bsStyle="success" fill block onClick={this.showModal}>Ajouter une entrée</Button>
                  {
                    this.state.foods && this.state.foods.map((food, index) => {
                      if(food.tag === "starter"){
                        return(
                          <div key={"div-"+food.id}>
                            <Button key={food.id} bsSize="xsmall" bsStyle="danger" bsClass="btn-custom" fill
                              onClick={this.deleteDishe.bind(this, food.id)}>
                              <i className="fas fa-close"/>
                            </Button>
                            <DisheCard avatar={food.picture} title={food.title}
                                price={food.price} content={food.desc}
                            />
                          </div>
                        );
                      }
                      return null;
                    })
                  }
                  <hr/>
                  <p>Plats</p>
                  <Button value="main" bsSize="small" bsStyle="success" fill block onClick={this.showModal}>Ajouter un plat</Button>
                  {
                    this.state.foods && this.state.foods.map((food, index) => {
                      if(food.tag === "main"){
                        return(
                          <div key={"div-"+food.id}>
                            <Button key={food.id} bsSize="xsmall" bsStyle="danger" bsClass="btn-custom" fill
                              onClick={this.deleteDishe.bind(this, food.id)}>
                              <i className="fas fa-close"/>
                            </Button>
                            <DisheCard avatar={food.picture} title={food.title}
                                price={food.price} content={food.desc}
                            />
                          </div>
                        );
                      }
                      return null;
                    })
                  }
                  <hr/>
                  <p>Desserts</p>
                  <Button value="dessert" bsSize="small" bsStyle="success" fill block onClick={this.showModal}>Ajouter un dessert</Button>
                  {
                    this.state.foods && this.state.foods.map((food, index) => {
                      if(food.tag === "dessert"){
                        return(
                          <div key={"div-"+food.id}>
                            <Button key={food.id} bsSize="xsmall" bsStyle="danger" bsClass="btn-custom" fill
                              onClick={this.deleteDishe.bind(this, food.id)}>
                              <i className="fas fa-close"/>
                            </Button>
                            <DisheCard avatar={food.picture} title={food.title}
                                price={food.price} content={food.desc}
                            />
                          </div>
                        );
                      }
                      return null;
                    })
                  }
                  <hr/>
                  <p>Boissons</p>
                  <Button value="drink" bsSize="small" bsStyle="success" fill block onClick={this.showModal}>Ajouter une boisson</Button>
                  {
                    this.state.foods && this.state.foods.map((food, index) => {
                      if(food.tag === "drink"){
                        return(
                          <div key={"div-"+food.id}>
                            <Button key={food.id} bsSize="xsmall" bsStyle="danger" bsClass="btn-custom" fill
                              onClick={this.deleteDishe.bind(this, food.id)}>
                              <i className="fas fa-close"/>
                            </Button>
                            <DisheCard avatar={food.picture} title={food.title}
                                price={food.price} content={food.desc}
                            />
                          </div>
                        );
                      }
                      return null;
                    })
                  }
                  <hr/>
                  <p>Autres</p>
                  <Button value="other" bsSize="small" bsStyle="success" fill block onClick={this.showModal}>Ajouter</Button>
                  {
                    this.state.foods && this.state.foods.map((food, index) => {
                      if(food.tag === "other"){
                        return(
                          <div key={"div-"+food.id}>
                            <Button key={food.id} bsSize="xsmall" bsStyle="danger" bsClass="btn-custom" fill
                              onClick={this.deleteDishe.bind(this, food.id)}>
                              <i className="fas fa-close"/>
                            </Button>
                            <DisheCard avatar={food.picture} title={food.title}
                                price={food.price} content={food.desc}
                            />
                          </div>
                        );
                      }
                      return null;
                    })
                  }
                </div>
              }
              />
            </Col>
            <Col md={6} sm={6}>
              <Card
              hCenter={true}
              title="Menus"
              content={
                <div>
                  <Button bsSize="small" bsStyle="success" fill block onClick={this.showModalMenu}>Ajouter un menu</Button>
                  {
                    this.state.menus && this.state.menus.map((menu, index) => {
                        return(
                          <div key={"menu-"+index}>
                            <Button key={menu.id} bsSize="xsmall" bsStyle="danger" bsClass="btn-custom" fill
                              onClick={this.deleteMenu.bind(this, menu.id)}>
                              <i className="fas fa-close"/>
                            </Button>
                            <MenuCard title={menu.title}
                              price={menu.price} desc={menu.desc}
                              content={menu.entries} foods={this.state.foods}
                            />
                          </div>
                        );
                    })
                  }
                </div>
              }
              />
            </Col>
          </Row>
        </Grid>
        <Modal show={this.state.modal} onHide={this.showModal}>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter un plat</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {status}
            <form>
              <Row>
                <Col md={3} sm={3}>
                  <FieldGroup
                     onChange={this.handleImageChange}
                     imagePreview={imagePreview}
                     id="formControlsFile"
                     type="file"
                     label="Photo"
                  />
                </Col>
                <Col md={9} sm={9}>
                  <FormInputs
                    ncols={["col-md-12", "col-md-12", "col-md-6", "col-md-6"]}
                    proprieties={[
                      {
                        label: "Titre",
                        type: "text",
                        bsClass: "form-control",
                        placeholder: "Titre",
                        onChange: this.handleChange.bind(this, 'title'),
                        value: this.state.title
                      },
                      {
                        label: "Description",
                        type: "text",
                        bsClass: "form-control",
                        placeholder: "Description",
                        onChange: this.handleChange.bind(this, 'desc'),
                        value: this.state.desc
                      },
                      {
                        label: "Type du plat",
                        type: "text",
                        bsClass: "form-control",
                        defaultValue: this.state.tag,
                        disabled: true,
                      },
                      {
                        label: "Prix",
                        type: "text",
                        bsClass: "form-control",
                        placeholder: "Prix en €",
                        onChange: this.handleChange.bind(this, 'price'),
                        value: this.state.price
                      }
                    ]}
                  />
                </Col>
              </Row>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="success" onClick={this.check} fill>Confirmer</Button>
            <Button bsStyle="danger" onClick={this.showModal} fill>Annuler</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.modalMenu} onHide={this.showModalMenu}>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter un menu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {status}
            <form>
              <FormInputs
                ncols={["col-md-12", "col-md-12"]}
                proprieties={[
                  {
                    label: "Titre du menu",
                    type: "text",
                    bsClass: "form-control",
                    placeholder: "Titre",
                    onChange: this.handleChange.bind(this, 'titleMenu'),
                    value: this.state.titleMenu
                  },
                  {
                    label: "Description du menu",
                    type: "text",
                    bsClass: "form-control",
                    placeholder: "Description",
                    onChange: this.handleChange.bind(this, 'descMenu'),
                    value: this.state.descMenu
                  }
                ]}
              />
              <Row>
                <Col md={8} sm={8}>
                  <FormGroup controlId="formControlsSelect">
                    <FormControl componentClass="select" placeholder="select" value={this.state.tempDishe} onChange={this.handleSelect}>
                      <option value="-">Ajouter un plat</option>
                      {
                        this.state.foods && this.state.foods.map((food, index) => {
                            return(
                              <option key={index} value={index}>{food.title}</option>
                            );
                        })
                      }
                    </FormControl>
                  </FormGroup>
                </Col>
                <Col md={4} sm={4}>
                  <Button bsStyle="success" fill block onClick={this.addDishe}>Ajouter au menu</Button>
                </Col>
              </Row>
              <FormInputs
                ncols={["col-md-4"]}
                proprieties={[
                  {
                    label: "Prix",
                    type: "text",
                    bsClass: "form-control",
                    placeholder: "Prix en €",
                    onChange: this.handleChange.bind(this, 'priceMenu'),
                    value: this.state.priceMenu
                  }
                ]}
              />
              <hr/>
              {
                this.state.tempMenu && this.state.tempMenu.map((food, index) => {
                  return(
                    <div key={index}>
                      <Button bsSize="xsmall" bsStyle="danger" bsClass="btn-custom" style={{right: "15px"}} fill
                        onClick={this.removeDishe.bind(this, food.id)}>
                        <i className="fas fa-close"/>
                      </Button>
                      <Dishe avatar={food.picture} title={food.title}/>
                    </div>
                  );
                })
              }
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="success" onClick={this.checkMenu} fill>Confirmer</Button>
            <Button bsStyle="danger" onClick={this.showModalMenu} fill>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Menu;
