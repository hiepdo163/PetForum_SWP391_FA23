import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {
  fetchPendingTradingPost,
  processingPendingTradingPostAction,
} from "../../api/post/postApi";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

const TradingPostManagement = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uniqueCategoryNames, setUniqueCategoryNames] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleOnChangeFilteredCategory();
  }, [posts]);

  const fetchData = async () => {
    await fetchPendingTradingPost()
      .then((res) => {
        setPosts(res);
        setFilteredPosts(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAccept = (id) => {
    const post = posts.find((post) => post.id === id);
    setSelectedPost({ id: post.id, isAccepted: true });
    setShowConfirmation(true);
  };

  const handleReject = (id) => {
    const post = posts.find((post) => post.id === id);
    setSelectedPost({ id: post.id, isAccepted: false });
    setShowConfirmation(true);
  };

  const handleConfirmation = async (isAccepted) => {
    const model = {
      postId: selectedPost.id,
      isAccepted: isAccepted,
    };
    await processingPendingTradingPostAction(model)
      .then(async (res) => {
        setShowConfirmation(false);
        setSelectedPost(null);
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOnViewPostDetails = (id) => {
    navigate(`/trading-post/details/?id=${id}`);
  };

  const handleOnChangeFilteredCategory = () => {
    let result = [];
    if (posts.length > 0) {
      result = [...new Set(posts.map(({ category }) => category))];
      console.log(result);
      setUniqueCategoryNames(result);
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  useEffect(() => {
    let tempFilteredPosts =
      filterStatus === "All"
        ? posts
        : posts.filter((post) => post.category === filterStatus);

    setFilteredPosts(tempFilteredPosts);
  }, [filterStatus]);

  return (
    <div>
      <Typography variant="h4" className="mb-5">
        Trading Post Management
      </Typography>
      <Form.Group controlId="filterStatus" className="mb-3 w-50">
        <Form.Label>Filter by Status:</Form.Label>
        <Form.Control
          as="select"
          value={filterStatus}
          onChange={handleFilterChange}
          style={{ border: "1px solid #4a785f" }}
        >
          <option value="All">All</option>
          {uniqueCategoryNames.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Breed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post) => (
            <tr key={post.id}>
              <td>
                <Button
                  className="w-50"
                  onClick={() => handleOnViewPostDetails(post.id)}
                  style={{ backgroundColor: "#4a785f", border: "unset" }}
                >{`Post ID: ${post.id}`} <br></br> Post Title: {post.title} </Button>
              </td>
              <td>{post.name}</td>
              <td>
                {!post.status && (
                  <Button
                    variant="primary"
                    onClick={() => handleAccept(post.id)}
                    className="ms-3"
                    style={{ backgroundColor: "#4a785f", border: "unset" }}
                  >
                    Accept
                  </Button>
                )}
                {!post.status && (
                  <Button
                    variant="danger"
                    className="ms-3"
                    onClick={() => handleReject(post.id)}
                  >
                    Reject
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to{" "}
          {selectedPost && selectedPost.isAccepted ? "accept" : "reject"} this
          post?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmation(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              handleConfirmation(
                selectedPost && selectedPost.isAccepted ? true : false
              )
            }
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TradingPostManagement;
