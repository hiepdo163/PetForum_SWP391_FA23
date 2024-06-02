import React from "react";
import { useState, useEffect } from "react";
import "./PublicInformation.css";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  ProgressBar,
  Tabs,
  Tab,
  Table,
  Modal,
} from "react-bootstrap";
import {
  FaCheckCircle,
  FaStar,
  FaStarO,
  FaTruck,
  FaComment,
  FaTasks,
  FaEnvelope,
  FaEdit,
  FaCoins,
  FaExchangeAlt,
  FaArrowCircleUp,
  FaTrophy,
} from "react-icons/fa";
import {
  createFeedback,
  fetchFeedbackData,
  fetchUserProfile,
  fetchUserPublicProfile,
} from "../../api/user/userApi";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import PointsCard from "./PointsCard";
import TradeCard from "./TradeCard";
import { useQuery } from "../../hooks/useQuery";
import { convertDatetime, getTimePassed } from "../../utils/DateUtils";
import {
  CalculateRemainingPoint,
  GetMaxPoint,
} from "../../utils/CalculateRemainingPoint";
import Avatar from "../../img/default.jpg";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  styled,
} from "@mui/material";
import { UsingPointToGetUploadTurn } from "../../api/post/postApi";
import { Box, Backdrop, CircularProgress } from "@mui/material";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../api/firebase/storage";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import { Pagination, PaginationItem } from "@mui/material";
import { Carousel } from "react-bootstrap";

function UserInformation() {
  const navigate = useNavigate();
  const query = useQuery();
  const [isTabClicked, setIsTabClicked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [userProfile, setUserProfile] = useState({});
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [membershipTransactionHistory, setMembershipTransactionHistory] =
    useState({});
  const [userPosts, setUserPosts] = useState({});
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const userId = query.get("id");
    if (userId) {
      setUserId(userId);
      fetchDataFromAPI(userId);
    }
  }, [query, page, reload]);

  const fetchDataFromAPI = async (userId) => {
    try {
      const res = await fetchUserPublicProfile(userId);
      const {
        userProfile,
        transactionHistory,
        membershipTransactionHistory,
        userPosts,
      } = res;

      setUserProfile(userProfile);
      setUserPosts(userPosts);
      setTransactionHistory(transactionHistory);
      setMembershipTransactionHistory(membershipTransactionHistory);
      const response = await fetchFeedbackData(page, userId);
      setFeedbacks([...response.feedbacks]);
      setTotalPage(response.totalPages);
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleUsingPoint = async () => {
    handleCloseDialog();
    await UsingPointToGetUploadTurn()
      .then((res) => {
        fetchDataFromAPI(userId);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [feedbacks, setFeedbacks] = useState([]);
  const [show, setShow] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const IMG_INTERVAL_TRANSITION_TIME = 2500;
  const [showImg, setShowImg] = useState(false);
  const labels = {
    1: "Worst",
    2: "Bad",
    3: "Ok",
    4: "Good",
    5: "Excellent",
  };

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }
  const [hover, setHover] = useState(-1);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorMessage && selectedImages.length > 0) {
      setErrorMessage("");
    }
  }, [selectedImages]);

  const handleUpload = async () => {
    setIsLoading(true);
    var uploadedUrls = "";
    const v4Folder = v4();
    for (const image of selectedImages) {
      const name = image.name + v4();
      const imageRef = ref(storage, `images/trading-post/${v4Folder}/${name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      uploadedUrls += `,${url}`;
    }
    setSelectedImages([]);
    return uploadedUrls;
  };

  const handleImageSelection = (event) => {
    const files = event.target.files;
    const selectedFiles = Array.from(files).slice(0, 6);
    setSelectedImages(selectedFiles);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if the form is valid
    if (event.currentTarget.checkValidity()) {
      if (rating === 0) {
        setErrorMessage("Please rate this user (1-5)");
        return;
      }
      if (feedback.length === 0) {
        setErrorMessage("Please input your opinion about this user");
        return;
      }
      if (!selectedImages.length > 0) {
        setErrorMessage("Please input your pet image");
        return;
      }
      handleUpload()
        .then(async (uploadedUrls) => {
          setIsLoading(true);
          await createFeedback(
            feedback,
            rating,
            sessionStorage.getItem("userId"),
            userProfile.id,
            uploadedUrls.substring(1)
          );
          setFeedback("");
          setRating(0);
          setSelectedImages([]);
          setShow(false);
          setIsLoading(false);
          setPage(1);
          setReload(!reload);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="bootdeys" style={{ width: "100% important" }}>
      <Row id="user-profile" style={{ position: "relative" }}>
        <Col lg={3} md={4} sm={4} style={{ position: "sticky", top: "0" }}>
          <div className="main-box clearfix">
            <h2>{userProfile.firstName + " " + userProfile.lastName}</h2>
            <div class="visual">
              <svg viewBox="0 0 420 420">
                <defs>
                  <circle id="circle-clip" cx="50%" cy="50%" r="25%" />
                  <clipPath id="avatar-clip">
                    <use href="#circle-clip" />
                  </clipPath>
                </defs>

                <circle
                  cx="50%"
                  cy="50%"
                  r="25%"
                  fill="#4a785f"
                  fill-opacity="1"
                >
                  <animate
                    attributeName="r"
                    values="25%;30%"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="fill-opacity"
                    values="1;0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>

                <circle
                  cx="50%"
                  cy="50%"
                  r="25%"
                  fill="#619e7d"
                  fill-opacity="1"
                >
                  <animate
                    attributeName="r"
                    values="25%;30%"
                    dur="3s"
                    begin="1s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="fill-opacity"
                    values="1;0"
                    dur="3s"
                    begin="1s"
                    repeatCount="indefinite"
                  />
                </circle>

                <circle
                  cx="50%"
                  cy="50%"
                  r="25%"
                  fill="#4a785f"
                  fill-opacity="1"
                >
                  <animate
                    attributeName="r"
                    values="25%;30%"
                    dur="3s"
                    begin="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="fill-opacity"
                    values="1;0"
                    dur="3s"
                    begin="2s"
                    repeatCount="indefinite"
                  />
                </circle>

                <circle cx="50%" cy="50%" r="25%" fill="White" fill-opacity="1">
                  <animate
                    attributeName="r"
                    values="25%;30%"
                    dur="3s"
                    begin="3s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="fill-opacity"
                    values="1;0"
                    dur="3s"
                    begin="3s"
                    repeatCount="indefinite"
                  />
                </circle>

                <image
                  height="100%"
                  width="100%"
                  href={userProfile.imageUrl ? userProfile.imageUrl : Avatar}
                  clip-path="url(#avatar-clip)"
                />
              </svg>
            </div>
            <div className="profile-stars h4">{`${
              userProfile.role
            } || ${CalculateRemainingPoint(userProfile.membershipScore)}`}</div>
            <div className="profile-since">
              {`Since ${convertDatetime(userProfile.createdDate)}`}
            </div>
            {userProfile.id === sessionStorage.getItem("userId") ? (
              <div>
                <div
                  id="progressbar"
                  className="mt-3 d-flex flex-row justify-content-start align-item-center"
                >
                  <span className="h4">
                    <FaArrowCircleUp color="#4a785f" /> Upload Turn :{" "}
                    {userProfile.uploadQuantity}
                  </span>
                </div>
                <div
                  id="progressbar"
                  className="mt-3 d-flex flex-row justify-content-start align-item-center gap-3"
                >
                  <span className="h4">
                    <FaTrophy color="#4a785f" />: {userProfile.forumScore}
                  </span>
                  <Button
                    className="mb-2"
                    disabled={userProfile.forumScore < 100 ? true : false}
                    style={{
                      backgroundColor: "#4a785f",
                      borderColor: "unset",
                      width: "60%",
                    }}
                    onClick={() => handleOpenDialog()}
                  >{`+ 1 upload (-100 score)`}</Button>
                </div>
              </div>
            ) : (
              <>
                {sessionStorage.getItem("userId") && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      className="mb-2"
                      style={{
                        backgroundColor: "#4a785f",
                        borderColor: "unset",
                        width: "40%",
                        alignItems: "center",
                      }}
                      onClick={() => setShow(true)}
                    >
                      Feedback
                    </Button>
                    <Modal
                      show={show}
                      onHide={() => setShow(false)}
                      style={{ marginTop: "5%" }}
                      width="100%"
                      margin="0"
                      size="xl"
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Feedback User</Modal.Title>
                      </Modal.Header>
                      <Modal.Body style={{ display: "flex" }}>
                        <Col md="8">
                          <Box
                            sx={{
                              width: 200,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Rating
                              name="hover-feedback"
                              value={rating}
                              precision={1}
                              getLabelText={getLabelText}
                              onChange={(event, rate) => {
                                setRating(rate);
                              }}
                              onChangeActive={(event, hover) => {
                                setHover(hover);
                              }}
                              emptyIcon={
                                <StarIcon
                                  style={{ opacity: 0.7 }}
                                  fontSize="large"
                                />
                              }
                              size="large"
                            />
                            {rating !== null && (
                              <Box sx={{ ml: 2 }}>
                                {labels[hover !== -1 ? hover : rating]}
                              </Box>
                            )}
                          </Box>
                          <br />
                          <textarea
                            placeholder="Enter your feedback about this user"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows="4"
                            maxLength="200"
                            warp="hard"
                            spellcheck="false"
                            style={{
                              width: "100%",
                              borderRadius: "5px",
                              resize: "none",
                            }}
                          />
                        </Col>
                        <Col
                          md="3"
                          style={{
                            marginLeft: "5%",
                            display: "table-column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div style={{ border: "2px dashed #000000" }}>
                            <input
                              className="mb-2"
                              style={{
                                backgroundColor: "#4a785f",
                                borderColor: "unset",
                                width: "15%",
                                alignItems: "center",
                              }}
                              onChange={handleImageSelection}
                              type="file"
                              multiple
                              id="upload-image"
                              hidden
                              accept="image/*"
                            />
                            <label
                              for="upload-image"
                              style={{ width: "100%", height: "auto" }}
                            >
                              <AddPhotoAlternateIcon
                                style={{
                                  marginLeft: "35%",
                                  width: "30%",
                                  height: "auto",
                                }}
                              />
                            </label>
                            <h6>Click to select</h6>
                          </div>
                          <div style={{ display: "flex", width: "100%" }}>
                            {selectedImages.map((image, index) => (
                              <div
                                style={{ position: "relative", width: "40%" }}
                                key={index}
                              >
                                <img
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    objectFit: "cover",
                                    margin: "6px",
                                    border: "2px dashed #4a785f",
                                  }}
                                  src={URL.createObjectURL(image)}
                                  alt="Preview"
                                />
                                <IconButton
                                  onClick={() => handleRemoveImage(index)}
                                  style={{
                                    width: "15px",
                                    height: "15px",
                                    position: "absolute",
                                    top: "0px",
                                    left: "40px",
                                    backgroundColor: "#000",
                                    color: "#fff",
                                    opacity: "0.8",

                                    "&:hover": {
                                      backgroundColor: "#fff",
                                      color: "#000",
                                    },
                                  }}
                                >
                                  <ClearIcon />
                                </IconButton>
                              </div>
                            ))}
                          </div>
                        </Col>
                      </Modal.Body>
                      <Modal.Footer>
                        {errorMessage && (
                          <Row className="mb-2">
                            <Col>
                              <Typography variant="body1" color="error">
                                {errorMessage}
                              </Typography>
                            </Col>
                          </Row>
                        )}
                        <Button
                          className="mb-2"
                          style={{
                            backgroundColor: "#4a785f",
                            borderColor: "unset",
                            width: "15%",
                            alignItems: "center",
                          }}
                          onClick={handleSubmit}
                        >
                          Send
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                )}
              </>
            )}

            <div id="progressbar">
              <FaExchangeAlt />
              <ProgressBar
                striped
                animated
                variant="warning"
                now={userProfile.membershipScore}
                max={GetMaxPoint(userProfile.membershipScore)}
                style={{ height: "5px" }}
                id="main-box-child"
              />
              {userProfile.membershipScore}
            </div>
          </div>
        </Col>
        <Col lg={9} md={8} sm={8}>
          <div className="main-box clearfix">
            <div className="profile-header">
              <TitleTypography
                variant="h5"
                onClick={() => setIsTabClicked(false)}
              >
                <span>Member info</span>
              </TitleTypography>
            </div>
            {!isTabClicked && (
              <div className="profile-user-info">
                <Col sm={8}>
                  <div className="profile-user-details clearfix">
                    <div className="profile-user-details-label">First Name</div>
                    <div className="profile-user-details-value">
                      {userProfile.firstName}
                    </div>
                  </div>
                  <div className="profile-user-details clearfix">
                    <div className="profile-user-details-label">Last Name</div>
                    <div className="profile-user-details-value">
                      {userProfile.lastName}
                    </div>
                  </div>
                  <div className="profile-user-details clearfix">
                    <div className="profile-user-details-label">Gender</div>
                    <div className="profile-user-details-value">
                      {userProfile.gender == null
                        ? "Hey there! I haven't shared my bio yet, but I'm excited to connect with you."
                        : userProfile.gender
                        ? "Female"
                        : "Male"}
                    </div>
                  </div>
                  <div className="profile-user-details clearfix">
                    <div className="profile-user-details-label">Email</div>
                    <div className="profile-user-details-value">
                      {userProfile.email}
                    </div>
                  </div>
                  <div className="profile-user-details clearfix">
                    <div className="profile-user-details-label">Phone</div>
                    <div className="profile-user-details-value">
                      {userProfile.phone}
                    </div>
                  </div>
                  <div className="profile-user-details clearfix">
                    <div className="profile-user-details-label">Bio</div>
                    <div className="profile-user-details-value">
                      {userProfile.bio
                        ? userProfile.bio
                        : "Hey there! I haven't shared my bio yet, but I'm excited to connect with you."}
                    </div>
                  </div>
                </Col>
              </div>
            )}
            <TitleTypography
              variant="h5"
              onClick={() => setIsTabClicked(!isTabClicked)}
            >
              <span>Member activity</span>
            </TitleTypography>
            {isTabClicked && (
              <Tabs
                className="profile-tabs"
                defaultActiveKey="community-history"
                onSelect={() => setIsTabClicked(true)}
              >
                <Tab
                  eventKey="community-history"
                  title={
                    <>
                      <FaComment /> Community History
                    </>
                  }
                  className="ComHis"
                >
                  <Table responsive>
                    <tbody>
                      <tr>
                        <td className="text-center">
                          <FaComment />
                        </td>
                        <td>
                          {userProfile.firstName + " " + userProfile.lastName}{" "}
                          posted a new post{" "}
                          {userPosts.length > 0 &&
                            getTimePassed(userPosts[0].post.date)}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <PostCard
                    CommunityPosts={userPosts}
                    UserProfile={userProfile}
                  />
                </Tab>
                {userId === sessionStorage.getItem("userId") && (
                  <Tab
                    eventKey="trading-history"
                    title={
                      <>
                        <FaExchangeAlt /> Trading History
                      </>
                    }
                    className="TraHis"
                  >
                    <Tabs
                      defaultActiveKey="trading-post"
                      id="uncontrolled-tab-example"
                      className="trading-profile-tabs"
                    >
                      <Tab
                        eventKey="trading-post"
                        title={
                          <>
                            <FaExchangeAlt /> Trading Request
                          </>
                        }
                      >
                        <Table responsive>
                          <tbody>
                            <tr>
                              <td className="text-center">
                                <FaExchangeAlt />
                              </td>
                              <td>
                                {userProfile.firstName +
                                  " " +
                                  userProfile.lastName}{" "}
                                posted a new trading request{" "}
                                {transactionHistory.length > 0 &&
                                  getTimePassed(
                                    transactionHistory[0].tradingPost.publicDate
                                  )}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                        <TradeCard
                          TransactionHistory={transactionHistory}
                          UserProfile={userProfile}
                        />
                      </Tab>
                      <Tab
                        eventKey="trading-point"
                        title={
                          <>
                            <FaCoins /> Trading Point
                          </>
                        }
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <PointsCard
                          MemberShipTransaction={membershipTransactionHistory}
                        />
                      </Tab>
                    </Tabs>
                  </Tab>
                )}
              </Tabs>
            )}
          </div>

          <div className="main-box clearfix">
            <TitleTypography
              variant="h5"
              onClick={() => setShowFeedback(!showFeedback)}
            >
              <span>Feedback</span>
            </TitleTypography>
            {showFeedback && (
              feedbacks.length > 0 ? (
                <div style={{ gap: "5%", marginBottom: "15px" }}>
                {feedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    style={{
                      width: "70%",
                      display: "flex",
                      marginTop: "10px",
                      padding: "5px",
                      border: "1px solid rgba(234, 234, 234, 1)",
                      borderRadius: "5px",
                      boxShadow:
                        "rgba(0, 0, 0, 0.06) 0px 10px 36px 0px,rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
                      cursor:"pointer",
                    }}
                  >
                    <Col
                      md="2"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        src={
                          feedback.userAvatarUrl
                            ? feedback.userAvatarUrl
                            : Avatar
                        }
                        alt="ProfilePic"
                        className="ProfilePic"
                        onClick={() =>
                          navigate(`/public/profile/?id=${feedback.userId}`)
                        }
                        style={{
                          borderRadius: "1em",
                          border: "3px solid #4a785f",
                          boxShadow:
                            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                          width: "80px",
                          height: "80px",
                        }}
                      />
                    </Col>
                    <Col md="9">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ width: "20%" }}>
                          {feedback.userName}
                        </span>
                        <Rating
                          name="read-only"
                          value={feedback.stars}
                          readOnly
                        />
                      </div>
                      <div>Feedback: {feedback.content}</div>
                      {feedback &&
                        feedback.photoUrl.split(",").map((url) => (
                          !showImg ? 
                          <img
                            src={url}
                            alt="Caro"
                            style={{
                              width: "40px",
                              height: "40px",
                              margin: "10px",
                            }}
                            onClick={() => setShowImg(true)}
                          /> :
                          <img
                            className="d-block w-100"
                            src={url}
                            alt="Carousel"
                            style={{
                              width: "200px",
                              height: "200px",
                              margin: "10px",
                            }}
                            onClick={() => setShowImg(false)}
                          />
                        ))}
                    </Col>
                  </div>
                ))}
                <Pagination
                  variant="outlined"
                  shape="rounded"
                  count={totalPage}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  renderItem={(item) => (
                    <StyledPaginationItem component="div" {...item} />
                  )}
                  color="primary"
                />
              </div>
              ) : <span>There is no feedback for this user yet!!</span>
            )}
          </div>
        </Col>
      </Row>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm change</DialogTitle>
        <StyledDialogContent>
          <DialogContentText>
            Are you certain you want to spend 100 points to receive one upload
            turn?
          </DialogContentText>
        </StyledDialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            style={{
              backgroundColor: "#fff",
              color: "#4a785f",
              border: "1px solid #4a785f",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUsingPoint}
            color="primary"
            autoFocus
            style={{ backgroundColor: "#4a785f", color: "#fff" }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

const TitleTypography = styled(Typography)({
  cursor: "pointer",
  textDecoration: "underline",
  "&:hover": {
    color: "#4a785f",
  },
});

const StyledDialogContent = styled(DialogContent)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: "1rem",
});

const StyledPaginationItem = styled(PaginationItem)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: "#4a785f",
    color: "#fff",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "#578069",
  },
}));

export default UserInformation;
