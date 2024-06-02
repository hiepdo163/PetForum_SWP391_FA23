import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  FloatingLabel,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Login.css";
import { loginUser } from "../../api/user/userApi";
import StyledCircularProgress from "../StyledCircularProgress";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { ROLE_ENUM } from "../../enum/Common";
import SnackBarSuccess from "../SnackBarSuccess";

const onSuccessUrlAdmin = "/admin/dashboard";
const onSuccessUrlStaff = "/manage/trading-post";
const onSuccessUrlMember = "/";

const Login = ({ setIsLogin, isLogin }) => {
  const [email, setEmail] = useState(""); // Trạng thái cho trường email
  const [password, setPassword] = useState(""); // Trạng thái cho trường password
  const [emailError, setEmailError] = useState(false); // Trạng thái lỗi cho trường email
  const [passwordError, setPasswordError] = useState(false); // Trạng thái lỗi cho trường password
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const existingUser = sessionStorage.getItem("userRole");
    if (existingUser !== null) {
      handleNavigateUrl(existingUser);
    }
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(null);
    setEmailError(false); // Đặt lại trạng thái lỗi khi người dùng thay đổi giá trị
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(null);
    setPasswordError(false); // Đặt lại trạng thái lỗi khi người dùng thay đổi giá trị
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra xem hai ô đã nhập giá trị chưa
    if (email.trim() === "") {
      setEmailError(true);
    }
    if (password.trim() === "") {
      setPasswordError(true);
    }

    if (email.trim() !== "" && password.trim() !== "") {
    }

    const loginReq = {
      emailAddress: email,
      password: password,
    };
    onSubmit(loginReq);
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

  const onSubmit = async (loginReq) => {
    setIsLoading(true);
    setError(null);
    await loginUser(loginReq)
      .then((res) => {
        handleNavigateUrl(sessionStorage.getItem("userRole"));
        setIsLogin(true);
        setOpenSnackBar(true);
      })
      .catch((error) => {
        handleErrorFromApi(error);
        setIsLoading(false);
      });
  };

  const handleNavigateUrl = (existingUser) => {
    if (!isLogin) {
      setTimeout(() => {
        if (existingUser === ROLE_ENUM.Admin) {
          navigate(onSuccessUrlAdmin);
        } else if (existingUser === ROLE_ENUM.Member) {
          navigate(onSuccessUrlMember);
        } else if (existingUser === ROLE_ENUM.Staff) {
          navigate(onSuccessUrlStaff);
        }
      }, 1500);
    } else {
      if (existingUser === ROLE_ENUM.Admin) {
        navigate(onSuccessUrlAdmin);
      } else if (existingUser === ROLE_ENUM.Member) {
        navigate(onSuccessUrlMember);
      } else if (existingUser === ROLE_ENUM.Staff) {
        navigate(onSuccessUrlStaff);
      }
    }
  };

  const handleOnCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  return (
    <>
      <Container style={{ height: "70vh" }} className="mb-5">
        <Row className="login-container">
          <Row>
            {/* <Col md={12} className="login-navbar"> <NavBar/></Col> */}
            <Col md={4} className="left_side-login">
              <h1 id="title-text">We've Miss You!</h1>
              <h5 id="title-text">Forum is waiting for your reply!</h5>
              <Form className="main_login" onSubmit={handleSubmit}>
                <Form.Group controlId="formCompany" className="mb-5">
                  <FloatingLabel controlId="floatingInput" label="Email">
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={email}
                      onClick={() => {
                        setError(null);
                      }}
                      onChange={handleEmailChange}
                      isInvalid={emailError} // Áp dụng lỗi cho ô nếu cần
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter an email.
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-5">
                  <FloatingLabel controlId="floatingInput" label="Password">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onClick={() => {
                        setError(null);
                      }}
                      onChange={handlePasswordChange}
                      isInvalid={passwordError} // Áp dụng lỗi cho ô nếu cần
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a password.
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                {error && <ErrorMessage>{error}</ErrorMessage>}

                {isLoading ? (
                  <LoadingDialogContainer>
                    <StyledCircularProgress />
                  </LoadingDialogContainer>
                ) : (
                  <Button
                    variant="primary"
                    type="submit"
                    className="submit_button"
                  >
                    Sign in
                  </Button>
                )}

                <Link
                  to="/signup"
                  style={{ textDecoration: "none", marginTop: "10px" }}
                >
                  {" "}
                  Doesn't have an account?
                </Link>
              </Form>
            </Col>

            <Col md={8} className="right_side-login custom-hover">
              {/* Phần hiển thị hình ảnh */}
            </Col>
          </Row>
        </Row>
      </Container>
      <SnackBarSuccess
        handleOnCloseSnackBar={handleOnCloseSnackBar}
        openSnackBar={openSnackBar}
        message={"Login Successfully"}
      />
    </>
  );
};

const LoadingDialogContainer = styled("div")({
  height: "5rem",
});

const ErrorMessage = styled("div")`
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 10px;
  margin-bottom: 12px;
`;

export default Login;
