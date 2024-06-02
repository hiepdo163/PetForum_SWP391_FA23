import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { storage } from "../api/firebase/storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { useDropzone } from "react-dropzone";
import { fetchUserAvatar, postUserAvatar } from "../api/firebase/getAvatar";
import SnackBarSuccess from "./SnackBarSuccess";

const FirebaseUpload = () => {
  const [file, setFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [defaultAvatar, setDefaultAvatar] = useState(null);
  const [error, setError] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    fetchUserAvatarAsync();
  }, []);

  const fetchUserAvatarAsync = async () => {
    await fetchUserAvatar()
      .then(({ imageUrl }) => {
        setDefaultAvatar(imageUrl);
      })
      .catch((error) => {
        handleErrorFromApi(error);
      });
  };

  const postUserAvatarAsync = async (imgUrl) => {
    await postUserAvatar(imgUrl)
      .then((res) => {
        localStorage.setItem("img-url", imgUrl);
        window.dispatchEvent(new Event("storage"));
      })
      .catch((error) => {
        handleErrorFromApi(error);
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

  const handleOnDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    handleOpenDialog(true);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleOnDrop,
    accept: "image/*",
    multiple: false,
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    handleOpenDialog(true);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOnCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  const handleUpload = () => {
    handleCloseDialog();
    const name = file.name + v4();
    const imageRef = ref(storage, `images/avatar/${userId}/${name}`);
    uploadBytes(imageRef, file).then(() => {
      setDefaultAvatar(URL.createObjectURL(file));
      setOpenSnackBar(true);
      getDownloadURL(imageRef).then((url) => {
        postUserAvatarAsync(url.toString());
      });
    });
  };

  return (
    <>
      <DropzoneContainer
        isHovered={isHovered || isDragActive}
        {...getRootProps()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={defaultAvatar}
          alt="Image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
            opacity: isHovered || isDragActive ? 0.8 : 1,
          }}
        />
        <input
          {...getInputProps()}
          id="file-input"
          onChange={handleFileChange}
        />
        {(isHovered || isDragActive) && (
          <CloudUploadIcon
            fontSize="large"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "48px",
              color: "#4a785f",
            }}
          />
        )}
      </DropzoneContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Upload</DialogTitle>
        <StyledDialogContent>
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="Selected File"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          )}
          <DialogContentText>
            Are you sure you want to upload this file?
          </DialogContentText>
        </StyledDialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary" autoFocus>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      <SnackBarSuccess
        handleOnCloseSnackBar={handleOnCloseSnackBar}
        openSnackBar={openSnackBar}
        message={"Avatar update successfully"}
      />
    </>
  );
};

const StyledDialogContent = styled(DialogContent)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: "1rem",
});

const DropzoneContainer = styled("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 2px solid #bdbdbd;
  border-radius: 50%;
  cursor: pointer;
  opacity: ${(props) => (props.isHovered ? 0.8 : 1)};
`;

export default FirebaseUpload;
