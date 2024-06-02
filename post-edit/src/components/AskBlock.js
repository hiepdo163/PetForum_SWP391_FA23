import React from "react";
import "./AskBlock.css";
import { Button } from "react-bootstrap";
import image from "../image.svg";
import send from "../send.svg";
export const AskBlock = () => {
  return (
    <div className="AskBlock">
      <select className="ChooseCategories" placeholder="Choose categories">
        <option value="dogs">Dogs</option>
        <option value="cats">Cats</option>
        <option value="exchange">Exchange</option>
      </select>
      <input
        className="TypeCatchingAttentionTitle"
        type="text"
        placeholder="Type catching attention title"
      />
      <input
        className="TypeYourQuestion"
        type="text"
        placeholder="Type your question"
      ></input>
      <div className="Frame3">
        <div className="Group8">
          <Button className="Button">
            <div className="SaveAsDraft">Save as draft</div>
          </Button>
          <Button className="Button">
            <div className="Send">
              <img src={send} alt="send" />
            </div>
            <div className="Publish">Publish</div>
          </Button>
        </div>
        <Button className="Button">
          <div className="Image">
            <img src={image} alt="anh" />
          </div>
          <div className="AddImage">Add Image</div>
        </Button>
      </div>
    </div>
  );
};
