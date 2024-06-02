import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { useSpring, animated } from "@react-spring/web";
import { styled } from "@mui/material/styles";
import axios from "axios";

// Styled components
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

function OTPInput() {
  const { token } = useParams();
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const successMessage = "Your email has been confirmed!";
  const failedMessage =
    "The confirmation token has expired. Please login to re-send the email confirmation.";

  useEffect(() => {
    const apiEndpoint = "https://localhost:7246/api/Authenticate/Confirm/Email";

    const confirmToken = async () => {
      try {
        const response = await axios.post(apiEndpoint, { token: token });
        if (response.data && response.status === 200) {
          setConfirmationMessage(successMessage);
          setOpenDialog(true);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 400) {
          setConfirmationMessage(failedMessage);
          setLoading(false);
          setOpenDialog(true);
        }
      }
    };
    confirmToken();
  }, [token]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const cancelAnimation = useSpring({
    from: { opacity: 0, transform: "scale(0)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { duration: 500 },
  });

  return (
    <Container>
      <StyledDialog open={openDialog}>
        <DialogTitle>Confirmation Token Expired</DialogTitle>
        <DialogContent dividers>
          {isLoading ? (
            <CircularProgress color="primary" size={40} />
          ) : (
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
              {confirmationMessage === failedMessage ? (
                <CancelIcon className="cancel-icon" />
              ) : (
                <CheckIcon className="check-icon" />
              )}
            </animated.div>
          )}
          <ConfirmationMessage>{confirmationMessage}</ConfirmationMessage>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </StyledDialog>
    </Container>
  );
}

export default OTPInput;
