import React from "react";
import "./RightPanel.css";
import link from "../link.svg";
import star from "../star.svg";

export const RightPanel = () => {
  return (
    <div className="RightPanel">
      <div className="PanelSection">
        <div className="PanelTitle">
          <div className="Group1">
            
            <div className="Title1">Must-read posts</div>
            <div className="Star">
              <img src={star} alt="star" />
            </div>
          </div>
          <div className="Line1"></div>
        </div>
        <ul className="Links">
          <li className="Link">
            <a href="link" className="link">
              Please read rules before you start working on a platform
            </a>
          </li>
          <li className="Link">
            <a href="link" className="link">
              Vision & Strategy of Alemhelp
            </a>
          </li>
        </ul>
      </div>
      <div className="PanelSection">
        <div className="PanelTitle">
          <div className="Group1">
            
            <div className="Title1">Featured links</div>
            <div className="LinkIcon">
              <img src={link} alt="link" />
            </div>
          </div>
          <div className="Line1"></div>
        </div>
        <ul className="Links">
          <li className="Link">
            <a href="link" className="link">
              Alemhelp source-code on GitHub
            </a>
          </li>
          <li className="Link">
            <a href="link" className="link">
              Golang best-practices
            </a>
          </li>
          <li className="Link">
            <a href="link" className="link">
              Alem.School dashboard
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
