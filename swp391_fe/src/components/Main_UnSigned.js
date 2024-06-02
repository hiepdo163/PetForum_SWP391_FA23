import React from "react";
import "./Main_UnSigned.css";

//pages
import { SideBar } from "./SideBar";
import { RightPanel } from "./RightPanel";
import { Post } from "./Post";

export const MainUnsigned = () => {
  return (
    <div className="main-layout">
      <div className="content">
        <Post />
      </div>
      <RightPanel />
    </div>
  );
};
