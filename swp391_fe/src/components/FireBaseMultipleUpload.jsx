import React, { useState } from "react";
import { storage } from "../api/firebase/storage";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { styled } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Image,
} from "@mui/icons-material";

const FireBaseMultipleUpload = ({ selectedImages, setSelectedImages }) => {
  const [dragging, setDragging] = useState(false);

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

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    const selectedFiles = Array.from(files).slice(0, 6);
    setSelectedImages(selectedFiles);
  };

  return (
    <Container>
      <InputContainer
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={dragging ? "dragging" : ""}
      >
        <InputFile
          type="file"
          multiple
          onChange={handleImageSelection}
          id="upload-input"
        />
        <label htmlFor="upload-input">
          <StyleIconButton component="span">
            <StyledAddIcon className="add-icon" />
            <StyledAddImageIcon className="add-icon" />
          </StyleIconButton>
        </label>
        <Typography className="input-content" variant="subtitle1">
          {dragging
            ? "Drop files here"
            : "Drag and drop files or click to select (1-6)"}
        </Typography>
        <PreviewContainer>
          {selectedImages.map((image, index) => (
            <PreviewImageWrapper key={index}>
              <PreviewImage src={URL.createObjectURL(image)} alt="Preview" />
              <DeleteIconButton onClick={() => handleRemoveImage(index)}>
                <DeleteIcon />
              </DeleteIconButton>
            </PreviewImageWrapper>
          ))}
        </PreviewContainer>
      </InputContainer>
    </Container>
  );
};

export default FireBaseMultipleUpload;

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px",
});

const InputContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "16px",
  border: "3px dashed #4a785f",
  padding: "16px",
  borderRadius: "4px",
  cursor: "pointer",
  opacity: "1",
  transition: "background-color 0.3s ease",
  width: "30rem",
  height: "auto",

  "&:hover": {
    backgroundColor: "#e0e0e0",
    "& .input-content": {
      color: "#055 !important",
    },
    "& .add-icon": {
      color: "#055 !important",
    },
  },

  "& .input-content": {
    color: "#4a785f !important",
  },
  "& .add-icon": {
    color: "#4a785f !important",
  },

  "&.dragging": {
    backgroundColor: "#e0e0e0",
  },
});

const InputFile = styled("input")({
  display: "none",
});

const PreviewContainer = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: "16px",
  width: "100%",
  height: "auto",
});

const UploadButton = styled(Button)({
  marginTop: "16px",
});

const PreviewImageWrapper = styled("div")({
  position: "relative",
});

const PreviewImage = styled("img")({
  width: "100px",
  height: "100px",
  objectFit: "cover",
  margin: "12px",
  border: "2px dashed #4a785f",
});

const DeleteIconButton = styled(IconButton)({
  position: "absolute",
  top: "0px",
  right: "-4px",
  backgroundColor: "#000",
  color: "#fff",
  opacity: "0.8",

  "&:hover": {
    backgroundColor: "#fff",
    color: "#000",
  },
});

const StyleIconButton = styled(IconButton)({
  position: "relative",
  width: "150px",
  height: "150px",
  "&:hover": {
    backgroundColor: "unset",
  },
});

const StyledAddImageIcon = styled(Image)({
  width: "100%",
  height: "100%",
  objectFit: "contain",
});

const StyledAddIcon = styled(AddIcon)({
  position: "absolute",
  top: "0",
  right: "0",
});
