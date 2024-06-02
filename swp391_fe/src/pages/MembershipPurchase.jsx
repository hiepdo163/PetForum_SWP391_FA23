import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  MEMBERSHIP_SCORE_WITH_PAYMENT_TYPE,
  MEMBERSHIP_PAYMENT_TYPE,
  MEMBERSHIP_UPLOAD_TURN,
} from "../enum/Common";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { useSpring, animated } from "@react-spring/web";
import { numberWithCommas } from "../utils/ArraySplitingUtils";
import LeftBanner from "../img/left-banner.jpg";
import RightBanner from "../img/right-banner.jpg";
import MiddleBammer from "../img/middle-banner.jpg";
import { CreatePaymentUrl } from "../api/VnPay/VnPayApi";
import { useQuery } from "../hooks/useQuery";

const MembershipPurchase = () => {
  const query = useQuery();
  const [onOpenDialog, setOnOpenDialog] = useState(false);
  const [isSuccessPayment, setIsSuccessPayment] = useState(false);
  const cancelAnimation = useSpring({
    from: { opacity: 0, transform: "scale(0)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { duration: 500 },
  });

  useEffect(() => {
    const userId = query.get("vnp_OrderInfo");
    const amount = query.get("vnp_Amount") / 100;
    const success = query.get("vnp_ResponseCode") === "00";
    const isParamExist = query.get("vnp_ResponseCode");
    if (validatingPram(userId, amount, success)) {
      handleOnSuccessTransaction();
    } else if (isParamExist != null) {
      handleOnFailedTransaction();
    }
  }, []);

  const handleOnClosDialog = () => {
    setOnOpenDialog(false);
  };

  const handleOnSuccessTransaction = () => {
    setOnOpenDialog(true);
    setIsSuccessPayment(true);
  };

  const handleOnFailedTransaction = () => {
    setOnOpenDialog(true);
    setIsSuccessPayment(false);
  };

  const handleOnClickSelectedPlan = async (event) => {
    const packageType = event.target.value;
    const buyerId = sessionStorage.getItem("userId");
    let sellerInfo = { userId: buyerId, amount: packageType };
    await CreatePaymentUrl(sellerInfo)
      .then((res) => {
        window.location.href = res;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const validatingPram = (userId, amount, success) => {
    const currSession = sessionStorage.getItem("userId") === userId;
    const existingAmount = () => {
      if (!MEMBERSHIP_PAYMENT_TYPE.UPLOAD_AMOUNT_10 === amount) return false;
      if (!MEMBERSHIP_PAYMENT_TYPE.UPLOAD_AMOUNT_30 === amount) return false;
      if (!MEMBERSHIP_PAYMENT_TYPE.UPLOAD_AMOUNT_60 === amount) return false;
      return true;
    };
    if (currSession && existingAmount && success) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center flex-column mb-5">
        <Typography variant="h4" className="fw-bold ">
          Membership Plans
        </Typography>
        <Typography variant="h5" className="">
          Choose the plan that suits you best
        </Typography>
      </div>

      <Grid container spacing={4} marginBottom={6} height={"70vh"}>
        <Grid item xs={4}>
          <LeftPricingCard>
            <GridItem className="left">
              <CardContent>
                <Price variant="h2">
                  {`💵 ${numberWithCommas(
                    MEMBERSHIP_PAYMENT_TYPE.UPLOAD_AMOUNT_10
                  )} ₫`}
                </Price>
                <div className="hidden-content">
                  <div>
                    <Typography variant="h4" className="">
                      {`•${MEMBERSHIP_UPLOAD_TURN.UPLOAD_AMOUNT_10} more upload turn`}
                    </Typography>
                    <Typography variant="h4" className="">
                      {`•${MEMBERSHIP_SCORE_WITH_PAYMENT_TYPE.UPLOAD_AMOUNT_10} score`}
                    </Typography>
                  </div>

                  <SelectedPlanButton
                    variant="contained"
                    color="primary"
                    className="font-monospace text-center position-absolute bottom-50 left-0 w-50"
                    value={MEMBERSHIP_PAYMENT_TYPE.UPLOAD_AMOUNT_10}
                    onClick={handleOnClickSelectedPlan}
                  >
                    Selected Plan
                  </SelectedPlanButton>
                </div>
              </CardContent>
            </GridItem>
          </LeftPricingCard>
        </Grid>

        <Grid item xs={4}>
          <MiddlePricingCard>
            <GridItem className="center">
              <CardContent>
                <Price variant="h2">
                  {`💵 ${numberWithCommas(
                    MEMBERSHIP_PAYMENT_TYPE.UPLOAD_AMOUNT_30
                  )} ₫`}
                </Price>
                <div className="hidden-content">
                  <Typography variant="h4" className="">
                    {`•${MEMBERSHIP_UPLOAD_TURN.UPLOAD_AMOUNT_30} more upload turn`}
                  </Typography>
                  <Typography variant="h4" className="">
                    {`•${MEMBERSHIP_SCORE_WITH_PAYMENT_TYPE.UPLOAD_AMOUNT_30} score`}
                  </Typography>
                  <SelectedPlanButton
                    variant="contained"
                    color="primary"
                    className="font-monospace text-center position-absolute bottom-50 left-0 w-50"
                    value={MEMBERSHIP_PAYMENT_TYPE.UPLOAD_AMOUNT_30}
                    onClick={handleOnClickSelectedPlan}
                  >
                    Selected Plan
                  </SelectedPlanButton>
                </div>
              </CardContent>
            </GridItem>
          </MiddlePricingCard>
        </Grid>

        <Grid item xs={4}>
          <RightPricingCard>
            <GridItem className="right">
              <CardContent>
                <Price variant="h2">
                  {`💵 ${numberWithCommas(
                    MEMBERSHIP_PAYMENT_TYPE.UPLOAD_AMOUNT_60
                  )} ₫`}
                </Price>
                <div className="hidden-content">
                  <Typography variant="h4" className="">
                    {`•${MEMBERSHIP_UPLOAD_TURN.UPLOAD_AMOUNT_60} more upload turn`}
                  </Typography>
                  <Typography variant="h4" className="">
                    {`•${MEMBERSHIP_SCORE_WITH_PAYMENT_TYPE.UPLOAD_AMOUNT_60} score`}
                  </Typography>
                  <SelectedPlanButton
                    variant="contained"
                    color="primary"
                    className="font-monospace text-center position-absolute bottom-50 left-0 w-50"
                    value={MEMBERSHIP_PAYMENT_TYPE.UPLOAD_AMOUNT_60}
                    onClick={handleOnClickSelectedPlan}
                  >
                    Selected Plan
                  </SelectedPlanButton>
                </div>
              </CardContent>
            </GridItem>
          </RightPricingCard>
        </Grid>
      </Grid>

      <Container>
        <StyledDialog open={onOpenDialog}>
          <DialogTitle>Your payment have been verify</DialogTitle>
          <DialogContent dividers>
            <animated.div
              style={{
                ...cancelAnimation,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {!isSuccessPayment ? (
                <CancelIcon className="cancel-icon" />
              ) : (
                <CheckIcon className="check-icon" />
              )}
            </animated.div>
            <ConfirmationMessage>
              Your payment have been successfully with please check the
              increasing score and your upload balance
            </ConfirmationMessage>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOnClosDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </StyledDialog>
      </Container>
    </>
  );
};

const PricingCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "100%",
}));

const LeftPricingCard = styled(PricingCard)(({ theme }) => ({
  position: "relative",

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${LeftBanner})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 1,
  },
  "&:hover::after": {
    filter: "blur(3px)",
  },
}));

const MiddlePricingCard = styled(PricingCard)(({ theme }) => ({
  position: "relative",
  boxShadow:
    "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",

  border: "1px solid #ccc",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${MiddleBammer})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 0,
  },
  "&:hover::after": {
    filter: "blur(3px)",
  },
}));

const RightPricingCard = styled(PricingCard)(({ theme }) => ({
  position: "relative",

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${RightBanner})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 1,
  },
  "&:hover::after": {
    filter: "blur(3px)",
  },
}));

const Price = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const GridItem = styled(Grid)(({ theme }) => ({
  width: "100%",
  position: "absolute",
  bottom: 0,
  left: 0,
  "&:hover": {
    boxShadow: theme.shadows[2],
    cursor: "pointer",
    transition: "transform 1s cubic-bezier(0.19, 1, 0.22, 1)",
    height: "100%",
    transform: "unset",
    justifyContent: "flex-start",
    color: "#000",
    backgroundColor: theme.palette.grey[100],
    "& .hidden-content": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "start",
      flexDirection: "column",
    },
    opacity: 0.8,
  },
  transform: "skew(-10deg, 16deg)",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignItems: "center",
  zIndex: 3,
  backgroundColor: theme.palette.grey[800],
  color: "#fff",
  opacity: 0.5,
  "& .hidden-content": {
    display: "none",
  },
}));

const SelectedPlanButton = styled(Button)({
  backgroundColor: "#4a785f",
  padding: "1em",
  "&:hover": {
    transition: "padding .5s ease",
    padding: "1.5em",
  },
});

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
`;

const Status = styled("h2")`
  font-size: 24px;
  margin-bottom: 16px;
`;

const StyledDialog = styled(Dialog)`
  .MuiDialogTitle-root {
    text-align: center;
  }

  .MuiDialogContent-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 24px;
  }
`;

const CancelIcon = styled(Cancel)`
  color: #f44336;
  font-size: 8rem;
`;

const CheckIcon = styled(CheckCircle)`
  color: #4caf50;
  font-size: 8rem;
`;

const ConfirmationMessage = styled(Typography)`
  text-align: center;
`;

export default MembershipPurchase;
