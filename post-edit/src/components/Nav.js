import React from "react";
import "./Nav.css";
import { Navbar, Button } from "react-bootstrap";
import logo from "../fpt-university-logo.png";
import plus from "../plus-circle.svg";
import avt from "../anh-cua-tui.jpg";
import vector from "../Vector.svg";
import bell from "../bell.svg";
import ellipse from "../Ellipse 1.svg"

export const Navi = () => {
  return (
    <Navbar id="nav">
      <Navbar.Brand>
        <div className="Logo">
          <div className="Alemhelp">
            <span>alem</span>
            <span>help</span>
          </div>
          <div className="Icon">
            <img className="logo" src={logo} alt="logo" />
          </div>
        </div>
      </Navbar.Brand>
      <div className="TitleNav">New Question</div>
      <div className="Profile">
        <img src={avt} alt="ProfilePic" className="ProfilePic"/>
        <img src={vector} alt="more" className="arrow"/>
      </div>
      <div className="Notificatios">
        <div className="Bell">
          <img src={bell} alt="bell"/>
        </div>
        <img src={ellipse} alt="ellipse" className="Ellipse1"></img>
      </div>
      <Button className="ButtonNav">
        <div className="PlusCircle">
          <img src={plus} alt="plus"/>
        </div>
        <div className="AskAQuestion">Ask a question</div>
      </Button>
      <div className="Karma">
        <div>0</div>
      </div>
    </Navbar>
  );
};
