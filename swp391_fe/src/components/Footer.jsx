import React from 'react';
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import Logo from "../img/fpt-university-logo.png";
import { FaFacebookF, FaGoogle, FaInstagram, FaGithub } from "react-icons/fa";
import { IconContext } from "react-icons";
import { color, shadows } from "@mui/system";
import { useSpring, animated } from 'react-spring';

//Style
//text-uppercase: in hoa; fw-bold: đậm chữ; mb-4: margin bottom kích thước 4
//me-5: thêm lề phải; d-none:display none; d-lg-block: display lage block
//mt: margin top
//mx-auto: lề trái phải auto; mb-4: lề dưới

function Footer() {
  const link = () => { };
  const [isHovered, setIsHovered] = React.useState(false);
  const props = useSpring({
    transform: isHovered ? ' translateY(0%)' : ' translateY(100%)',
  });

  return (
    <footer className="text-center text-muted w-100" style={{ zIndex: '0', backgroundColor:'#232324' }} onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <animated.section
          className="d-flex 
              justify-content-center justify-content-lg-between justify-content-sm-evenly p-2 w-70 "
          style={{
            backgroundColor: '#232324', ...props
          }}
        >
          <div className="me-3 ms-3 d-none d-lg-block c-w text-white">
            <span>Get connected with us on social networks:</span>
          </div>
          <IconContext.Provider value={{ size: "1.5rem" }}>
            <div className="" style={{ display: "flex", alignItems: "center" }}>
              <Link
                to="https://www.facebook.com/ducminh.nguyen.988"
                className="me-5  link-secondary text-white"
              >
                <FaFacebookF/>
              </Link>
              <Link to="" className="me-5  link-secondary text-white">
                <FaGoogle />
              </Link>
              <Link
                to="https://www.instagram.com/kphai_pnam/"
                className="me-5  link-secondary text-white"
              >
                <FaInstagram />
              </Link>
              <Link to="https://gitlab.com/minhnqdse2003" className=" link-secondary me-3 text-white">
                <FaGithub />
              </Link>
            </div>
          </IconContext.Provider>
        </animated.section>
      )}

      <animated.section >
        <Container className="text-center rounded-0 pt-3 text-white" style={{ zIndex: '0', backgroundColor:'#232324' }}>
          <Row>
            <Col md={4} lg={4} xl={4} className="mx-auto mb-2 dropdown">
              <h6 className="text-uppercase fw-bold mb-3">Sponser</h6>
              <Link
                to="https://daihoc.fpt.edu.vn/"
                className="w-50 link-secondary"
              >
                <Image className="w-50 link-secondary" src={Logo} alt="logo" />
              </Link>
            </Col>

            <Col md={4} lg={4} xl={4} className=" mx-auto mb-2 dropdown">
              <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
              {/* <div className='d-flex justify-content-around'> */}
                <p>
                  <Link to=" /" className="text-reset text-decoration-none link">
                    Forums
                  </Link>
                </p>
                <p>
                  <Link to="/trading-post" className="text-reset text-decoration-none link">
                    Exchange
                  </Link>
                </p>
              {/* </div> */}
              <p>
                <Link
                  to="/profile"
                  className="text-reset text-decoration-none link"
                >
                  My Account
                </Link>
              </p>
              {/* <p>
                <Link
                  to="/"
                  className="text-reset text-decoration-none link"
                ></Link>
              </p> */}
            </Col>

            <Col md={4} lg={4} xl={4} className=" mx-auto mb-2 dropdown">
              <h6 className="text-uppercase fw-bold mb-4 m">Contact</h6>
              <p >
                <i className="fas fa-home me-3 text-secondary"></i> Thu Duc
                City, HCM City, Viet Nam
              </p>
              <p >
                <i className="fas fa-envelope me-3 text-secondary"></i>{" "}
                ******.***@gmail.com
              </p>
              <p >
                <i className="fas fa-print me-3 text-secondary"></i> +84 xxxxxxxxx {" "}
              </p>
            </Col>
          </Row>
          {/* Copyright */}
          <div className="text-center pb-3 ">
            © 2023 Copyright:
            <Link
              to="/home"
              className="text-reset fw-bold text-decoration-none"
            >
              {" "}
              Pet'sForum.com
            </Link>
          </div>
        </Container>
      </animated.section>
    </footer>
  );
}

export default Footer;
