import React, { useState, useEffect } from "react";
import { Card, CardBody, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import "./UserProfilePage.css";
import { FaPencilAlt } from "react-icons/fa";
import { ReactComponent as ResetIcon } from "../../img/icon/reset-password.svg";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../api/user/userApi";
import FirebaseUpload from "../FireBaseUpload";

const UserProfilePage = () => {
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    bio: "who am i?",
  });
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [randomLength, setRandomLength] = useState(0);
  const [originalData, setOriginalData] = useState({ ...formData });
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      navigate("/");
      return;
    }
    fetchDataFromAPI(userId);
    generateRandomLength();
  }, []);

  const fetchDataFromAPI = async (userId) => {
    await fetchUserProfile(userId)
      .then((res) => {
        setFormData({
          id: res.id,
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          phone: res.phoneNumber,
          gender: res.gender === null ? "Don't Share" : res.gender ? "Female" : "Male",
          bio: res.bio === null ? "" : res.bio,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleEditClick = () => {
    setIsEditable(true);
  };
  const generateRandomLength = () => {
    // Tạo một số ngẫu nhiên từ 1 đến 10
    const length = Math.floor(Math.random() * 10) + 1;
    setRandomLength(length);
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNavigate = (id) => {
    navigate(`/public/profile/?id=${id}`);
  };



  const updateUser = async (userData) => {
    const userId = sessionStorage.getItem("userId");
    const response = await fetch(`https://localhost:7246/api/User/Update/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    return data;
  };

  const handleConfirmUpdate = async () => {
    if (formData.gender === "Female") {
      formData.gender = true;
    } else if (formData.gender === "Male") {
      formData.gender = false;
    } else {
      formData.gender = null;
    }
    setShowUpdateSuccess(true);
    setShowCancelSuccess(false);
    setIsEditable(false);
    setTimeout(() => {
      setShowUpdateSuccess(false);
    }, 3000);
    console.log("Dữ liệu đã được lấy ra:", formData);
    try {
      const updatedUser = await updateUser(formData);
      console.log('User updated successfully:', updatedUser);
      window.location.reload();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };
  const handleCancelUpdate = () => {
    setShowCancelSuccess(true);
    setShowUpdateSuccess(false);
    setIsEditable(false);
    setTimeout(() => {
      setShowCancelSuccess(false);
    }, 3000);
  };
  return (
    <div className="container con">
      <div className="row body-con mx-auto my-auto ">
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
          <Card h-100>
            <CardBody>
              <div className="account-settings">
                <div className="user-profile">
                  <div className="user-avatar">
                    <FirebaseUpload />
                  </div>
                  <h5 className="user-name">
                    {" "}
                    {formData.firstName + " " + formData.lastName}
                  </h5>
                </div>
                <div className="about">
                  <Form.Group>
                    <Form.Label htmlFor="bio">About</Form.Label>
                    <div className="editlink">
                      <Form.Control
                        as="textarea"
                        id="bio"
                        placeholder="Share something about you!"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        maxLength="200"
                        warp="hard"
                        spellcheck="false"
                        readOnly={!isEditable}
                        style={{ resize: 'none' }}
                      // className={isEditable ? 'editable' : ''}
                      className = {isEditable ? 'input-box': '' }
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={handleEditClick}
                        style={{
                          marginLeft: "-38px",
                          border: "none",
                          height: "13vh",
                        }}
                      >
                        <FaPencilAlt/>
                      </Button>
                    </div>
                  </Form.Group>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
          <Card h-100>
            <CardBody>
              <Row gutters gy-5>
                <Col xl={6} lg={6} md={6} sm={6} col={6}>
                  <h6 className="mb-2 text-primary">Personal Details</h6>
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} col={6} className="before-public-profile">
                  <button
                    className="btn btn-primary public-profile"
                    onClick={() => handleNavigate(formData.id)}
                  >
                    Public Profile
                  </button>
                </Col>
                <Col xl={6} lg={6} md={6} sm={12} col={12}>
                  <Form.Group>
                    <Form.Label htmlFor="firstName">First Name</Form.Label>
                    <div className="editlink">
                      <Form.Control
                        type="text"
                        id="firstName"
                        placeholder="Enter first name"
                        name="firstName"
                        value={formData.firstName}
                        readOnly={!isEditable}
                        onChange={handleChange}
                        className = {isEditable ? 'input-box': '' }
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={handleEditClick}
                        style={{ marginLeft: "-38px", border: "none" }}
                      >
                        <FaPencilAlt />
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
                <Col xl={6} lg={6} md={6} sm={12} col={12}>
                  <Form.Group>
                    <Form.Label htmlFor="lastName">Last Name</Form.Label>
                    <div className="editlink">
                      <Form.Control
                        type="text"
                        id="lastName"
                        placeholder="Enter last name"
                        name="lastName"
                        value={formData.lastName}
                        readOnly={!isEditable}
                        onChange={handleChange}
                        className = {isEditable ? 'input-box': '' }
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={handleEditClick}
                        style={{ marginLeft: "-38px", border: "none" }}
                      >
                        <FaPencilAlt />
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
                <Col xl={12} lg={12} md={12} sm={12} col={12}>
                  <Form.Group>
                    <Form.Label htmlFor="eMail">Email</Form.Label>
                    <Form.Control
                      type="email"
                      id="eMail"
                      name="email"
                      value={formData.email}
                      readOnly
                      style={{ backgroundColor: "rgba(92,99,106,0.1)" }}
                    />
                  </Form.Group>
                </Col>
                <Col xl={12} lg={12} md={12} sm={12} col={12}>
                  <Form.Group>
                    <Form.Label htmlFor="phone">Phone</Form.Label>
                    <div className="editlink">
                      <Form.Control
                        type="tel"
                        id="phone"
                        placeholder="Enter phone number"
                        name="phone"
                        maxLength="10"
                        minLength="9"
                        value={formData.phone}
                        pattern="[0-9]*"
                        readOnly={!isEditable}
                        className = {isEditable ? 'input-box': '' }
                        onChange={(event) => {
                          const { value, name } = event.target;
                          const formattedValue = value.replace(/\D/g, "");
                          handleChange({
                            target: {
                              name,
                              value: formattedValue,
                            },
                          });
                        }}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={handleEditClick}
                        style={{ marginLeft: "-38px", border: "none" }}
                      >
                        <FaPencilAlt />
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
                <Col xl={12} lg={12} md={12} sm={12} col={12}>
                  <Form.Group>
                    <Form.Label htmlFor="gender">Gender</Form.Label>
                    <div className="editlink">
                      <Form.Control
                        as="select"
                        id="gender"
                        placeholder="Choose Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        readOnly={isEditable}
                        className = {isEditable ? 'input-box': '' }
                      >
                        <option value =" " hidden >Don't Share</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Form.Control>
                      <Button
                        variant="outline-secondary"
                        onClick={handleEditClick}
                        style={{ marginLeft: "-38px", border: "none" }}
                      >
                        <FaPencilAlt />
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
                <Col xl={12} lg={12} md={12} sm={12} col={12}>
                  <Form.Group>
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <div className="editlink">
                      <Form.Control
                        type="text"
                        id="password"
                        name="password"
                        value={"*".repeat(randomLength)}
                        onFocus={generateRandomLength}
                        readOnly
                        style={{ backgroundColor: "rgba(92,99,106,0.1)" }}
                      />
                      <Button
                        variant="outline-secondary"
                        style={{ marginLeft: "10px", border: "none" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            paddingRight: "4px",
                          }}
                        >
                          <ResetIcon />
                          <div> Change_passowrd</div>
                        </div>
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
                <Col
                  xl={12}
                  lg={12}
                  md={12}
                  sm={12}
                  col={12}
                  className=" mx-auto justify-content-center"
                >
                  <div className="mt-3">
                    {isEditable && (
                      <>
                        <Button
                          type="button"
                          id="submit"
                          name="submit"
                          className="btn btn-secondary me-2 cancel-button"
                          style={{ border: "none" }}
                          onClick={handleCancelUpdate}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          id="submit"
                          name="submit"
                          className="btn btn-primary me-2 update-button"
                          style={{ backgroundColor: "#4a785f", border: "none" }}
                          onClick={handleConfirmUpdate}
                        >
                          Update
                        </Button>
                      </>
                    )}
                    {showUpdateSuccess && (
                      <Alert
                        variant="success"
                        onClose={() => setShowUpdateSuccess(false)}
                        dismissible
                      >
                        Your profile has been updated successfully!
                      </Alert>
                    )}
                    {showCancelSuccess && (
                      <Alert
                        variant="success"
                        onClose={() => setShowCancelSuccess(false)}
                        dismissible
                      >
                        Update has been canceled.
                      </Alert>
                    )}
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
