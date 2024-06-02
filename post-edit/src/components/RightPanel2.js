import React from "react";
import "./RightPanel2.css";
import { Image } from "react-bootstrap";
import github from "../github.svg";
import ins from "../instagram.svg";
import fb from "../facebook.svg";
import hulk from "../hulk-meow.jpg";
import award from "../award-light.svg";
export const RightPanel2 = () => {
    return (
        <div className="RightPanel">
              <Image
                className="Rectangle1"
                src={hulk}
              />
              <div className="Golanginya">@Golanginya</div>
              <div className="Line3"></div>
              <div className="Group9">
                <div className="Eight">125 [ 8 ]</div>
                <div className="AwardR">
                  <img src={award} alt="award"/>
                </div>
              </div>
              <div className="Line4"></div>
              <div className="Social">
                <div className="Instagram">
                  <img src={ins} alt="instagram"/>
                </div>
                <div className="Facebook">
                  <img src={fb} alt="facebook"/>
                </div>
                <div className="Github">
                  <img src={github} alt="github"/>
                </div>
              </div>
            </div>
    );
}