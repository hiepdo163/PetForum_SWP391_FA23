import React from "react";
import "./PostComment.css";
import { Image, Button } from "react-bootstrap";
import hulk from "../hulk-meow.jpg";
import more from "../feather_more-vertical.svg";
import up from "../arrow-up.svg";
import mess from "../message-square.svg";
import ming from "../ming.jpg";
import up1 from "../thumbs-up.svg";
import down from "../thumbs-down.svg";
import chevron from "../chevrons-down.svg";
import corner from "../corner-down-right.svg";
export const PostComments = () => {
    return (
        <div className="PostComments">
              <div className="PostFull">
                <div className="Head">
                  <div className="Group5">
                    <div className="Time">12 November 2020 19:35</div>
                    <div className="Nikcname">@Golanginya</div>
                  </div>
                  <img
                    className="Ava"
                    src={hulk}
                    alt="Avatar"
                  />
                  <div className="FeatherMoreVertical">
                    <img src={more} alt="feathermore"/>
                  </div>
                </div>
                <div className="Title">How to patch KDE on FreeBSD?</div>
                <div className="Content">
                  Mi magna sed nec nisl mattis. Magna cursus tincidunt rhoncus
                  imperdiet fermentum pretium, pharetra nisl. Euismod.
                </div>
                <div className="Code mt-3 p-3">
                  <div className="Group7 d-flex">
                    <div className="No">
                      1<br />2<br />3<br />4<br />5<br />6<br />7
                    </div>
                    <div className="Program">
                      package mian
                      <br />
                      <br />
                      import “fmt”
                      <br />
                      <br />
                      func main() {<br />} fmt.Println(“Hello, world!”){<br />}
                    </div>
                  </div>
                </div>
                <div className="Content mt-3">
                  Posuere arcu arcu consectetur turpis rhoncus tellus. Massa,
                  consectetur massa sit fames nulla eu vehicula ullamcorper.
                  Ante sit mauris elementum sollicitudin arcu sit suspendisse
                  pretium. Nisl egestas fringilla justo bibendum.
                </div>
                <div className="Submenu mt-3 d-flex align-items-center">
                  <div className="Tags d-flex gap-2">
                    <div className="Tag p-2">
                      <div className="Java">java</div>
                    </div>
                    <div className="Tag p-2">
                      <div className="Javascript">javascript</div>
                    </div>
                    <div className="Tag p-2">
                      <div className="Wtf">wtf</div>
                    </div>
                  </div>
                  <Button className="Button">
                    <div className="ArrowUp">
                      <img src={up} alt="arrow-up"/>
                    </div>
                    <div className="Vote">Vote</div>
                  </Button>
                </div>
              </div>
              <div className="Suggestions">Suggestions</div>

              <div className="SuggestBlock">
                <input
                  type="text"
                  placeholder="Type here your wise suggestion"
                  className="TypeHereYourWiseSuggestion"
                ></input>

                <div className="Frame3">
                  <Button className="ButtonSg">
                    <div className="Cancel">Cancel</div>
                  </Button>
                  <Button className="ButtonSg">
                    <div className="MessageSquare">
                      <img src={mess} alt="MessageSquare"/>
                    </div>
                    <div className="Suggest">Suggest</div>
                  </Button>
                </div>
              </div>

              <div className="LevelComment1">
                <div className="Indicator1" />
                <div className="Content1">
                  <div className="Head1">
                    <Image
                      className="Ava1"
                      src={ming}
                    />
                    <div className="NameTime1">
                      <div className="Nikcname1">@morgenshtern</div>
                      <div className="Time1">12 November 2020 19:35</div>
                    </div>
                    <div className="FeatherMoreVertical1">
                      <img src={more} alt="FeatherMore"/>
                    </div>
                  </div>
                  <div className="Text1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Ornare rutrum amet, a nunc mi lacinia in iaculis. Pharetra
                    ut integer nibh urna. Placerat ut adipiscing nulla lectus
                    vulputate massa, scelerisque. Netus nisl nulla placerat
                    dignissim ipsum arcu.
                  </div>
                  <div className="Bottom1">
                    <div className="Line1"></div>
                    <div className="Dlr1">
                      <div className="LikesDislikes1">
                        <div className="Dislikes1">
                          <div className="ThumbsUp1">
                            <img src={up1} alt="ThumbsUp1"/>
                          </div>
                          <div
                            style={{
                              left: 19,
                              top: 0,
                              position: "absolute",
                              color: "#808080",
                              fontSize: 12,
                              fontFamily: "Roboto",
                              fontWeight: "300",
                              letterSpacing: 0.24,
                              wordWrap: "break-word",
                            }}
                          >
                            256
                          </div>
                        </div>
                        <div className="Likes1">
                          <div className="ThumbsDown1">
                          <img src={down} alt="ThumbsDown1"/>
                          </div>
                          <div
                            style={{
                              left: 19,
                              top: 0,
                              position: "absolute",
                              color: "#808080",
                              fontSize: 12,
                              fontFamily: "Roboto",
                              fontWeight: "300",
                              letterSpacing: 0.24,
                              wordWrap: "break-word",
                            }}
                          >
                            43
                          </div>
                        </div>
                      </div>
                      <div className="Frame1">
                        <div className="SeeReplies1">
                          <div className="ChevronsDown1">
                            <img src={chevron} alt="ChevronsDown1"/>
                          </div>
                          <a className="ShowAllReplies1" href=".">
                            Show All Replies (21)
                          </a>
                        </div>
                        <div className="Replly1">
                          <div className="CornerDownRight1">
                            <img src={corner} alt="CornerDownRight1"/>
                          </div>
                          <a className="Reply1" href=".">Reply</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="LevelComment2">
                <div className="Indicator2" />
                <div className="Content2">
                  <div className="Text2" style={{ textAlign: "left" }}>
                    <span
                      style={{
                        color: "black",
                        fontSize: "14px",
                        fontFamily: "Roboto",
                        fontWeight: "500px",
                        lineHeight: "25px",
                        letterSpacing: "0.70px",
                        wordWrap: "break-word",
                      }}
                    >
                      @unkind,
                    </span>
                    <span
                      style={{
                        color: "black",
                        fontSize: "14px",
                        fontFamily: "Roboto",
                        fontWeight: "300px",
                        lineHeight: "25px",
                        letterSpacing: "0.70px",
                        wordWrap: "break-word",
                      }}
                    >
                      {" "}
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Ornare rutrum amet, a nunc mi lacinia in iaculis. Pharetra
                      ut integer nibh urna.
                    </span>
                  </div>
                  <div className="Bottom2">
                    <div className="Line2" />
                    <div className="Dlr2">
                      <div className="Replly2">
                        <div className="CornerDownRight2">
                          <img src={corner} alt="CornerDownRight2"/>
                        </div>
                        <a className="Reply2" href=".">Reply</a>
                      </div>
                      <div className="Frame2">
                        <div className="Nikcname2">by @lazyReplyer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    );
}