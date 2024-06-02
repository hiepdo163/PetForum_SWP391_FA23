import React from "react";
import "./Main_Signed.css";
// import { Sidebar } from "./Sidebar";
import { Tab } from "./Tab";
import { RightPanel } from "./RightPanel";
import { Post } from "./Post";
import { SideBar } from "./SideBar";

export const Main_Signed = () => {
  return (
    <>
      <div className="main-signed-state">
        <div className="overlap-wrapper">
          <div className="overlap">
            <div className="main-layout">
              <div className="content">
                <Tab />
                <Post />
              </div>
              <RightPanel />
            </div>
            {/* <Sidebar /> */}
          </div>
        </div>
        <RightPanel />
      </div>
      <SideBar />
    </>
  );
};
