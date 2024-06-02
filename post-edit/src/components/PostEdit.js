import { Container, Row, Col } from "react-bootstrap";
import "./PostEdit.css";
import { SideBar } from "./SideBar";
import { RightPanel } from "./RightPanel";
import { AskBlock } from "./AskBlock";
import {Navi} from "./Nav";

function PostEdit() {
  return (
    <div className="PostEdit">
      <Container fluid id="con">
        <Row>
          <Navi/>
        </Row>
        <Row id="row2">
          <Col sm={3} className="SideBar">
            <SideBar />
          </Col>
          <Col className="MainLayout">
            <AskBlock />
            <RightPanel />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PostEdit;
