import { Container, Row, Col } from "react-bootstrap";
import "./PostView.css";
import { SideBar } from "./SideBar";
import { Navi } from "./Nav";
import { RightPanel2 } from "./RightPanel2";
import { PostComments } from "./PostComment";

function PostView() {
  return (
    <div className="PostView">
      <Container fluid id="con">
        <Row>
          <Navi />
        </Row>

        <Row id="row2">
          <Col sm={3} className="SideBar">
            <SideBar />
          </Col>

          <Col className="MainLayout">
            <PostComments/>
            <RightPanel2/>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PostView;
