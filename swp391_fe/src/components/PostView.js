import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { RightPanel2 } from "./RightPanel2";
import { PostComments } from "./PostComment";
import { useQuery } from "../hooks/useQuery";
import "./PostView.css";

function PostView() {
  const query = useQuery();
  const [postId, setPostId] = useState("");
  const [starterImgUrl, setStarterImgUrl] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    const postIdQuery = query.get("id");
    if (postIdQuery) setPostId(postIdQuery);
  }, [query]);

  return (
    <div className="PostView">
      <Container fluid id="con">
        <Row id="row2">
          <Col md={8} className="PostComment">
            <PostComments
              postId={postId}
              setStarterImgUrl={setStarterImgUrl}
              setUserName={setUser}
            />
          </Col>
          <Col md={4} className="right-panel">
            <RightPanel2
              postId={postId}
              starterImgUrl={starterImgUrl}
              user={user}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PostView;
