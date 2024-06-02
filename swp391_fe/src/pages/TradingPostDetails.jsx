import { useEffect, useState } from "react";
import { useQuery } from "../hooks/useQuery";
import { styled } from "@mui/material/styles";
import Carousel from "react-bootstrap/Carousel";
import { PostSkeleton } from "../components/skeletonloading/PostSkeleton";
import { confirmPostAsSold, fetchTradingPostDetail } from "../api/post/postApi";
import { fetchUserPublicProfile } from "../../src/api/user/userApi";
import defaultAvatar from "../img/default.jpg";
import { useNavigate } from "react-router-dom";
import PermPhoneMsgIcon from "@mui/icons-material/PermPhoneMsg";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EmailIcon from "@mui/icons-material/Email";
import PetsIcon from "@mui/icons-material/Pets";
import CakeIcon from "@mui/icons-material/Cake";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { debounce } from "@mui/material";
import SnackBarSuccess from "../components/SnackBarSuccess";
import { numberWithCommas } from "../utils/ArraySplitingUtils";
import axios from "axios";
import { TradingPostManagement } from "../components/Admin/TradingPostManagement";
import { PET_AGE } from "../enum/Common";
import { Post } from "../components/Post";

const TradingPostDetails = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const [tradingPostId, setTradingPostId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Data
  const [posts, setPosts] = useState([]);
  const [petInfo, setPetInfo] = useState();
  const [petCategory, setPetCategory] = useState();
  const [sellerInfo, setSellerInfo] = useState();
  const [userProfile, setUserProfile] = useState({});


  // Other state
  const [isShowFullPhoneNumber, setIsShowFullPhoneNumber] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const IMG_INTERVAL_TRANSITION_TIME = 2500;

  const [hover, setHover] = useState(false);
  const [hoverReject, setHoverReject] = useState(false);


  const acceptstyle = {
    borderRadius: '5px',
    backgroundColor: hover ? '#fff' : '#4a785f',
    color: hover ? '#4a785f' : '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  };
  const rejectstyle = {
    borderRadius: '5px',
    backgroundColor: hoverReject ? '#fff' : 'red',
    color: hoverReject ? 'red' : '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  };


  useEffect(() => {
    const tradingPostIdQuery = query.get("id");
    if (tradingPostIdQuery) {
      setTradingPostId(tradingPostIdQuery);
    }
  }, [query]);



  const userId = sessionStorage.getItem("userId");
  useEffect(() => {
    fetchDataFromAPI(userId);
  }, []);
  const fetchDataFromAPI = async (userId) => {
    try {
      const res = await fetchUserPublicProfile(userId);
      const {
        userProfile,
      } = res;

      setUserProfile(userProfile);
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // useEffect(() => {
  //   console.log(userProfile);
  //   console.log(userProfile.role);
  // }, [userProfile]);


  const handleAccept = async (tradingPostId) => {

    try {
      const response = await fetch('https://localhost:7246/api/TradingPost/trading-TradePost/processing-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: tradingPostId,
          isAccepted: true
        }),
      });
      console.log("Đã Chấp nhận");
      navigate(`/Manage/trading-post`);
      if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
    }
  };

  const handleReject = async (tradingPostId) => {
    try {
      const response = await fetch('https://localhost:7246/api/TradingPost/trading-TradePost/processing-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: tradingPostId,
          isAccepted: false
        }),
      });
      console.log("Đã Từ Chối");

      if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
      }

      const data = await response.json();
      console.log(data);
      navigate(`/Manage/trading-post`);
    } catch (error) {
    }
  };



  useEffect(() => {
    console.log(tradingPostId);
    if (!tradingPostId) return;
    fetchTradingPostDetails();
  }, [tradingPostId]);

  const fetchTradingPostDetails = async () => {
    setIsLoading(true);
    await fetchTradingPostDetail(tradingPostId)
      .then((res) => {
        const { category, user, ...petInfo } = res;

        setPetCategory(category);
        setSellerInfo(user);
        setPetInfo(petInfo);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };


  const hidePhoneNumber = (phoneNumber) => {
    return phoneNumber.slice(0, 7) + "***";
  };

  const getAgeText = () => {
    switch (petInfo.age) {
      case PET_AGE.LOWER_THAN_THREE_MONTH:
        return "Lower than three months";
      case PET_AGE.LOWER_THAN_ONE_YEAR:
        return "Lower than one year";
      case PET_AGE.GREATER_THAN_ONE_YEAR:
        return "Greater than one year";
      case PET_AGE.OTHER:
        return "Unknown";
    }
  };

  const onSellerDetailBtnClick = (id) => {
    navigate(`/public/profile/?id=${id}`);
  };

  const onConfirmAsSold = async (id) => {
    await confirmPostAsSold(id)
      .then((res) => {
        navigate(`/trading-post`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onPhoneNumberBtnClick = debounce(() => {
    if (!isShowFullPhoneNumber) {
      setIsShowFullPhoneNumber(true);
      return;
    } else {
      navigator.clipboard.writeText(sellerInfo.phone);
      setOpenSnackbar(true);
    }
  }, 300);

  const onEmailBtnClick = debounce(() => {
    navigator.clipboard.writeText(sellerInfo.email);
    setOpenSnackbar(true);
  }, 300);

  return (
    <>
      {isLoading ? (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : (
        <div className="d-flex justify-content-center">
          <MainContainer className="col-8 d-flex">
            <ContentContainer className="col-8">
              <Carousel style={{ padding: "0 4rem" }}>
                {petInfo &&
                  petInfo.imageUrls.map((url) => (
                    <Carousel.Item interval={IMG_INTERVAL_TRANSITION_TIME}>
                      <CarouselImage
                        className="d-block w-100"
                        src={url}
                        alt="Carousel Image"
                      />
                    </Carousel.Item>
                  ))}
              </Carousel>
              <PetInfoContainer>
                {petInfo && (
                  <>
                    <h3>{petInfo.title}</h3>
                    <div
                      className="d-flex align-items-center mt-3 mb-3"
                      style={{ color: "red" }}
                    >
                      <AttachMoneyIcon />
                      {`${numberWithCommas(petInfo.price)} VND`}
                    </div>
                    <div className="mb-3">{petInfo.description}</div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="col-4 d-flex align-items-center gap-2">
                        <PetsIcon />
                        <strong>Breed</strong>: {petCategory.name}
                      </div>
                      <div className="col-8 d-flex align-items-center gap-2">
                        <CakeIcon />
                        <strong>Age</strong>: {getAgeText()}
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4>Address</h4>
                      <div className="d-flex align-items-center gap-2">
                        <LocationOnIcon />
                        <strong>{petInfo.location}</strong>
                      </div>
                    </div>
                  </>
                )}
              </PetInfoContainer>
            </ContentContainer>
            <SellerInfoContainer className="col-4">
              {sellerInfo && (
                <>
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <AvatarFrame
                        src={sellerInfo.imgUrl || defaultAvatar}
                        alt="avatar"
                      />
                      <div className="fw-bolder">{sellerInfo.name}</div>
                    </div>
                    <SellerDetailBtn
                      onClick={() => onSellerDetailBtnClick(sellerInfo.id)}
                    >
                      View Profile
                    </SellerDetailBtn>
                  </div>

                  <div className="d-flex flex-column gap-3 mt-3">
                    <PhoneNumberBtn onClick={() => onPhoneNumberBtnClick()}>
                      <div
                        className={`d-flex position-relative ${isShowFullPhoneNumber && "w-100"
                          }`}
                      >
                        <PermPhoneMsgIcon
                          style={{ position: "absolute", top: 0 }}
                        />
                        <div
                          className={
                            !isShowFullPhoneNumber
                              ? "ps-5"
                              : "w-100 text-center"
                          }
                        >
                          {isShowFullPhoneNumber
                            ? sellerInfo.phone
                            : hidePhoneNumber(sellerInfo.phone)}
                        </div>
                      </div>
                      {!isShowFullPhoneNumber && (
                        <div>Click for fully show</div>
                      )}
                    </PhoneNumberBtn>
                    <EmailNumberBtn>
                      <EmailIcon onClick={() => onEmailBtnClick()} />
                      <a style={{ textDecoration: 'none', color: '#4a785f' }} href={`mailto:${sellerInfo.email}`}>{sellerInfo.email}</a>
                    </EmailNumberBtn>
                    {sellerInfo.id == sessionStorage.getItem("userId") &&
                      !petInfo.isSold &&
                      petInfo.publicDate && (
                        <SellerDetailBtn
                          className="w-100"
                          onClick={() => onConfirmAsSold(petInfo.id)}
                        >
                          Mark The Item As Sold
                        </SellerDetailBtn>
                      )}
                      {userProfile &&  (userProfile.role === 'Staff' || userProfile.role === 'Admin') && petInfo.isAccepted ===false && (
                      <>
                        <div style={{marginTop:'20px'}}>Trading Post Management</div>
                        <button
                          style={acceptstyle}
                          onMouseEnter={() => setHover(true)}
                          onMouseLeave={() => setHover(false)}
                          onClick={() => handleAccept(tradingPostId)}
                        >
                          Accept
                        </button>
                        <button
                          style={rejectstyle}
                          onMouseEnter={() => setHoverReject(true)}
                          onMouseLeave={() => setHoverReject(false)}
                          onClick={() => handleReject(tradingPostId)}
                        >
                          Reject
                        </button>
                      </>
                    )}


                  </div>
                </>
              )}
            </SellerInfoContainer>
          </MainContainer>
        </div>
      )}

      <SnackBarSuccess
        openSnackBar={openSnackbar}
        handleOnCloseSnackBar={() => setOpenSnackbar(false)}
        message={"Copy to clipboard!"}
      />
    </>
  );
};

export default TradingPostDetails;
const MainContainer = styled("div")`
  padding-bottom: 3rem;
`;
const ContentContainer = styled("div")`
  overflow: hidden;
  width: 70%;
  border-radius: 10px 0 0 0;
  border-top: 1px solid #ccc;
  & .carousel-indicators {
    button {
      width: 15px;
      height: 15px;
      border: 0;
      border-radius: 5px;
    }
  }

  & .carousel-control-prev {
    max-width: 4rem;
    background: linear-gradient(120deg, transparent, #bbb);
    border-left: 1px solid #ccc;

    & .carousel-control-prev-icon {
      border: 1px solid #ccc;
      background-color: #b1b1b1;
      padding: 4px 0;
      height: 10%;
      width: 100%;
    }
  }

  & .carousel-control-next {
    max-width: 4rem;
    background: linear-gradient(120deg, transparent, #bbb);
    border-right: 1px solid #ccc;
    & .carousel-control-next-icon {
      border: 1px solid #ccc;
      background-color: #b1b1b1;
      height: 10%;
      width: 100%;
    }
  }
`;
const PetInfoContainer = styled("div")`
  margin-top: 1.5em;
  background-color: transparent;
  padding: 0.5em;
`;
const CarouselImage = styled("img")`
  width: 100%;
  height: 50vh;
  object-fit: contain;
  background-color: #ccc;
`;
const SellerInfoContainer = styled("div")`
  padding: 8px;
  height: 50vh;
  border-top-right-radius: 10px;
  border: 1px solid #cfcfcf;
  border-left: none;
`;
const AvatarFrame = styled("img")`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;
const SellerDetailBtn = styled("button")`
  width: fit-content;
  padding: 10px;
  text-wrap: wrap;
  border-radius: 10px;
  outline: none;
  color: #4a785f;
  border: 1px solid #4a785f;
  background-color: white;
  transition: 0.2s;
  &:hover {
    color: white;
    background-color: #4a785f;
  }
`;
const PhoneNumberBtn = styled("button")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  width: 100%;
  text-align: center;
  font-weight: bold;
  border-radius: 10px;
  padding: 10px;
  background-color: #4a785f;
  color: white;
  border: 1px solid transparent;
  outline: none;
  transition: 0.2s;
  &:hover {
    color: #4a785f;
    background-color: white;
    border: 1px solid #4a785f;
  }
`;
const EmailNumberBtn = styled("button")`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  text-align: center;
  font-weight: bold;
  border-radius: 10px;
  padding: 10px;
  background-color: white;
  color: #4a785f;
  border: 1px solid #4a785f;
  outline: none;
  transition: 0.2s;
  &:hover {
    color: white;
    background-color: #4a785f;
  }
`;
const CopyToClipboardBtn = styled("button")`
border-radius: 10px;
border: none;
&:hover {
  color: #4a785f;
  font-weight: bold;
  background-color: white;
}
`;