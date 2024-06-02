import { Container, Row, Col } from "react-bootstrap";
import "./PostEdit.css";
import { SideBar } from "./SideBar";
import { RightPanel } from "./RightPanel";
import { AskBlock } from "./AskBlock";
//import { NavBar } from "./NavBar";

function PostEdit() {
  return (
    <div className="PostEdit">
      <Container fluid>
        <Row></Row>
        <Row id="row2">
          <Col md={8} className="AskArea">
            <AskBlock />
          </Col>
          <Col md={4}>
            <RightPanel />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PostEdit;
