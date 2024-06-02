import React from "react";
import "./SignUp.css";
import signup_intro from "../img/signuplayout.jpg";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { postSignUp } from "../api/user/userApi";
import StyledCircularProgress from "./StyledCircularProgress";
import { styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

const onSuccessUrl = "/login";

export const SignUp = () => {
  //check if the password is matches
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordMatch(confirmPassword === event.target.value);
    handleClearError();
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setPasswordMatch(event.target.value === password);
    handleClearError();
  };

  const triggerEndPoint = async (data) => {
    setIsLoading(true);
    await postSignUp(data)
      .then((res) => {
        handleRoutingActionOnSuccess();
        setIsLoading(false);
      })
      .catch((error) => {
        setValidated(false);
        handleErrorFromApi(error);
        setIsLoading(false);
      });
  };

  const handleErrorFromApi = (error) => {
    if (error.status === 401) {
      setError("Unauthorize");
    } else if (error.status === 400) {
      setError(error.message);
    } else {
      setError("It appears that there is a server error.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      const signupData = {
        firstName: form.elements.firstName.value,
        lastName: form.elements.lastName.value,
        phoneNumber: form.elements.phone.value,
        emailAddress: form.elements.email.value,
        password: form.elements.password.value,
      };

      triggerEndPoint(signupData);
    }
  };

  const handleClearError = () => {
    setError("");
  };

  const handleRoutingActionOnSuccess = () => {
    navigate(onSuccessUrl);
  };

  return (
    <div className="register">
      <div className="frame">
        <div className="join-alem-community">Join Alem Community</div>
        <p className="p">
          Get more features and priviliges by joining to the most helpful
          community
        </p>
        <div className="frame-2">
          <Form
            className="right-side-signup"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <div className="mb-3 name">
              <Form.Group className="" id="firstName">
                {/* <Form.Label>First Name</Form.Label> */}
                <Form.Control
                  className="text-wrapper-5"
                  placeholder="First Name"
                  required
                  type="text"
                  id="firstName"
                  onChange={handleClearError}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide first name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="" id="lastName">
                {/* <Form.Label>Last Name</Form.Label> */}
                <Form.Control
                  className="text-wrapper-5"
                  placeholder="Last Name"
                  required
                  type="text"
                  id="lastName"
                  onChange={handleClearError}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide last name.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <Form.Group className="mb-3 " id="phone">
              {/* <Form.Label>Phone</Form.Label> */}
              <Form.Control
                className="text-wrapper-5"
                placeholder="Phone"
                required
                type="text"
                id="phone"
                onChange={handleClearError}
              />
              <Form.Control.Feedback type="invalid">
                Please provide phone number.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3 " id="email">
              {/* <Form.Label>Email address</Form.Label> */}
              <Form.Control
                className="text-wrapper-5"
                placeholder="Email address"
                required
                type="email"
                id="email"
                onChange={handleClearError}
              />
              <Form.Control.Feedback type="invalid">
                Please provide email.
              </Form.Control.Feedback>
            </Form.Group>

            {/* <CheckPassword/> */}

            <Form.Group className="mb-3" id="password">
              {/* <Form.Label>Password</Form.Label> */}
              <Form.Control
                className="text-wrapper-5"
                placeholder="Password"
                required
                type="password"
                value={password}
                onChange={handlePasswordChange}
                id="password"
              />
              <Form.Control.Feedback type="invalid">
                Please provide password.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" id="confirmPassword">
              {/* <Form.Label>Confirm Password</Form.Label> */}
              <Form.Control
                className="text-wrapper-5"
                placeholder="Confirm Password"
                required
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                id="confirmPassword"
              />
              {!passwordMatch && (
                <p
                  style={{
                    color: "var(--bs-form-invalid-color)",
                    fontSize: "0.875em",
                    margin: "0",
                  }}
                >
                  Passwords do not match!
                </p>
              )}
            </Form.Group>

            {error && <p>Error: {error}</p>}
            {isLoading ? (
              <LoadingDialogContainer>
                <StyledCircularProgress />
              </LoadingDialogContainer>
            ) : (
              <Button className="button-resize text-wrapper-7" type="submit">
                REGISTER
              </Button>
            )}
          </Form>
        </div>
      </div>
      <div className="img-container">
        <img className="image" alt="Avatar" src={signup_intro} />
      </div>
    </div>
  );
};

const LoadingDialogContainer = styled("div")({
  height: "5rem",
});
