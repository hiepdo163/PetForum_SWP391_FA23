import React from "react";
import "./SideBar.css";
import search from "../search.svg";
import list from "../list.svg";
import tag from "../tag.svg";
import award from "../award.svg";
import help from "../help-circle.svg";
import mess from "../message-circle.svg";
import heart from "../heart.svg";

export const SideBar = () => {
  return (
    <div className="Sidebar">
      <div className="MenuItem">
        <div className="Search1">
          <img src={search} alt="search"/>
        </div>
        <input className="Search2" placeholder="Search"></input>
      </div>
      <div className="Sideblock1">
        <div className="Title">MENU</div>
        <div className="MenuItem">
          <div className="List">
            <img src={list} alt="question"/>
          </div>
          <div className="Questions">Questions</div>
        </div>
        <div className="MenuItem">
          <div className="Tag">
          <img src={tag} alt="tag" />
          </div>
          <div className="Tags">Tags</div>
        </div>
        <div className="MenuItem">
          <div className="Award">
          <img src={award} alt="tag" />
          </div>
          <div className="Ranking">Ranking</div>
        </div>
      </div>
      <div className="Sideblock2">
        <div className="Title">PERSONAL NAVIGATOR</div>
        <div className="MenuItem">
          <div className="HelpCircle">
          <img src={help} alt="yourquestion" />
          </div>
          <div className="YourQuestions">Your questions</div>
        </div>
        <div className="MenuItem">
          <div className="MessageCircle">
          <img src={mess} alt="mess" />
          </div>
          <div className="YourAnswers">Your answers</div>
        </div>
        <div className="MenuItem">
          <div className="Heart">
            <img src={heart} alt="heart"/>
          </div>
          <div className="YourLikesVotes">Your likes & votes</div>
        </div>
      </div>
    </div>
  );
};
