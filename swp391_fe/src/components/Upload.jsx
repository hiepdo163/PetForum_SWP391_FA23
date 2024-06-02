import "../components/Upload.css";
import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Backdrop,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Card, CardBody, Col, FormControl, Row } from "react-bootstrap";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Form from "react-bootstrap/Form";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { ProvincesData } from "../factory/ProvincesData";
import IconButton from "@mui/material/IconButton";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { FaCrown, FaTrophy } from "react-icons/fa";
import {
  fetchChildCategory,
  fetchMainCategory,
  uploadTradingPost,
} from "../api/post/postApi";
import { PET_AGE } from "../enum/Common";
import FireBaseMultipleUpload from "./FireBaseMultipleUpload";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../api/firebase/storage";
import { useNavigate } from "react-router-dom";
import { getRemainingUploadQuantity } from "../api/user/userApi";

const Upload = () => {
  const [formValidated, setFormValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingUploadQuantity, setRemainingUploadQuantity] = useState(null);

  const [mainBreed, setMainBreed] = useState([]);
  const [subBreed, setSubBreed] = useState([]);
  const [selectedMainBreed, setSelectedMainBreed] = useState("");
  const [selectedSubBreed, setSelectedSubBreed] = useState({
    id: "",
    name: "",
  });
  const [selectedAge, setSelectedAge] = useState(0);
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  const [selectedProvinces, setSelectedProvinces] = useState(null);
  const [selectedDistricts, setSelectedDistricts] = useState(null);
  const [selectedWards, setSelectedWards] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  //GET provinces from factory
  const provinces = ProvincesData;
  //Location state
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [localAddress, setLocalAddress] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  const [location, setLoaction] = useState("");

  //open modal dialog
  useEffect(() => {
    fetchMainCategoryAsync();
  }, []);

  const navigate = useNavigate();

  const [isOpenDialog, setIsOpenDialog] = React.useState(false);
  const onOpenDialog = () => setIsOpenDialog(true);

  const fetchMainCategoryAsync = async () => {
    await fetchMainCategory()
      .then((res) => {
        setMainBreed(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRemainingUploadQuantityAsync = async () => {
    await getRemainingUploadQuantity()
      .then((res) => setRemainingUploadQuantity(res))
      .catch((err) => console.log(err));
  };

  const handleOnClickScoreBtn = () => {
    const userId = sessionStorage.getItem("userId");
    navigate(`/public/profile/?id=${userId}`);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    const uploadedUrls = [];
    const v4Folder = v4();
    for (const image of selectedImages) {
      const name = image.name + v4();
      const imageRef = ref(storage, `images/trading-post/${v4Folder}/${name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      uploadedUrls.push(url);
    }
    setSelectedImages([]);
    return uploadedUrls;
  };

  const onCloseDialog = () => {
    setIsOpenDialog(false);
    onConvertLocalAddress();
  };

  const clearAllOptions = () => {
    setSelectedProvinces(null);
    setSelectedDistricts(null);
    setSelectedWards(null);
    setLocalAddress("");
    setLocationOptions([]);
    setLoaction("");
  };

  const handleMainBreedOptionChange = (event) => {
    const selectedMainBreedIndex = event.target.selectedIndex;
    const selectedMainBreedId = !selectedMainBreedIndex
      ? null
      : mainBreed[selectedMainBreedIndex - 1].id;
    const selectedMainBreedValue = event.target.value;
    setSelectedMainBreed(selectedMainBreedValue);

    if (selectedMainBreedValue) {
      fetchChildCategoryAsync(selectedMainBreedId);
    }
    setSelectedSubBreed({ id: "", name: "" });
  };

  const handleSubBreedOptionChange = (event) => {
    const selectedSubBreedIndex = event.target.selectedIndex;
    const selectedSubBreedId = !selectedSubBreedIndex
      ? null
      : subBreed[selectedSubBreedIndex - 1].id;
    const selectedSubBreedValue = event.target.value;

    if (selectedSubBreedValue) {
      setSelectedSubBreed({
        id: selectedSubBreedId,
        name: selectedSubBreedValue,
      });
    }
  };

  const handleAgeOptionChange = (event) => {
    setSelectedAge(event.target.value);
  };

  const handlePriceChange = (event) => {
    const { value } = event.target;
    const formattedValue = value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setPrice(formattedValue);
  };

  const convertPriceToNumber = (price) => {
    return parseInt(price.replace(/,/g, ""));
  };

  const fetchChildCategoryAsync = async (id) => {
    await fetchChildCategory(id)
      .then((res) => {
        setSubBreed(res);
        setSelectedSubBreed("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchDistrictsByProvince = (code) => {
    let [{ districts }] = provinces.filter((item) => {
      if (item.code === code) return item.districts;
    });
    setDistricts(districts);
  };

  const fetchWardsByDistricts = (code) => {
    let [{ wards }] = districts.filter((item) => {
      if (item.code === code) return item.wards;
    });
    setWards(wards);
  };

  const handelOnChangeProvinces = (event, value) => {
    setSelectedProvinces(value);
    let [{ code }] = provinces.filter((item) => {
      if (item.name.includes(value)) return item.code;
    });
    fetchDistrictsByProvince(code);
    handleOnChangeLocalAddress_Provinces(value);
  };

  const handelOnChangeDistricts = (event, value) => {
    setSelectedDistricts(value);
    let [{ code }] = districts.filter((item) => {
      if (item.name.includes(value)) return item.code;
    });
    fetchWardsByDistricts(code);
    handleOnChangeLocalAddress_Districts(value);
  };

  const handelOnChangeWards = (event, value) => {
    setSelectedWards(value);
    let [{ code }] = wards.filter((item) => {
      if (item.name.includes(value)) return item.code;
    });
    handleOnChangeLocalAddress_Wards(value);
  };

  const handleOnChangeLocalAddress = (event) => {
    setLocalAddress(event.target.value);
    handleOnChangeLocalAddress_LocalAddress(event.target.value);
  };

  const handleOnChangeLocalAddress_Provinces = (value) => {
    const updatedOptions = [...locationOptions];
    updatedOptions[3] = value;
    setLocationOptions(updatedOptions);
  };

  const handleOnChangeLocalAddress_Districts = (value) => {
    const updatedOptions = [...locationOptions];
    updatedOptions[2] = value;
    setLocationOptions(updatedOptions);
  };

  const handleOnChangeLocalAddress_Wards = (value) => {
    const updatedOptions = [...locationOptions];
    updatedOptions[1] = value;
    setLocationOptions(updatedOptions);
  };

  const onConvertLocalAddress = () => {
    let result = "";

    if (locationOptions[0]) {
      result += locationOptions[0];
    }
    if (locationOptions[1]) {
      result += ", " + locationOptions[1];
    }
    if (locationOptions[2]) {
      result += ", " + locationOptions[2];
    }
    if (locationOptions[3]) {
      result += ", " + locationOptions[3] + ".";
    }

    setLoaction(result);
  };

  const handleOnChangeLocalAddress_LocalAddress = (value) => {
    const updatedOptions = [...locationOptions];
    updatedOptions[0] = value;
    setLocationOptions(updatedOptions);
  };

  //
  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if the form is valid
    if (event.currentTarget.checkValidity()) {
      if (!selectedImages.length > 0) {
        setFormValidated(false);
        setErrorMessage("Please input your pet image");
        return;
      }
      const userId = sessionStorage.getItem("userId");
      handleUpload()
        .then(async (uploadedUrls) => {
          var postModel = {
            userId: userId,
            categoryId: selectedSubBreed.id,
            title: title,
            age: parseInt(selectedAge),
            location: location,
            price: !price ? 0 : convertPriceToNumber(price),
            description: description,
            isFree: isFree,
            urls: uploadedUrls,
          };
          await uploadTradingPost(postModel)
            .then(() => {
              setIsLoading(false);
              navigate(`/trading-post`);
            })
            .catch((err) => {
              setIsLoading(false);
            });
        })
        .catch((err) => {
          setIsLoading(false);
        });

      // Reset the form validation state
      setFormValidated(false);
    } else {
      // Mark the form as validated to show the validation errors
      setFormValidated(true);
    }
  };

  useEffect(() => {
    if (errorMessage && selectedImages.length > 0) {
      setErrorMessage("");
    }
  }, [selectedImages]);

  useEffect(() => {
    getRemainingUploadQuantityAsync();
  }, []);
  return (
    <div className="d-flex w-100">
      {remainingUploadQuantity > 0 ? (
        <div className="detail col-md-8 mb-5">
          <Card>
            <CardBody>
              <Form
                noValidate
                validated={formValidated}
                onSubmit={handleSubmit}
              >
                <Row>
                  <Col xl={12} lg={12} md={12} sm={12} col={12}>
                    <h3>Details</h3>
                  </Col>
                  <Col xl={12} lg={12} md={12} sm={12} col={12}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        className="breed"
                        placeholder="Breed"
                        required
                        type="text"
                        id="breed"
                        as="select"
                        value={selectedMainBreed}
                        onChange={handleMainBreedOptionChange}
                      >
                        <option value="">Select a Breed</option>
                        {mainBreed &&
                          mainBreed.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  {selectedMainBreed && (
                    <Col xl={12} lg={12} md={12} sm={12} col={12}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          className="breed"
                          placeholder="Breed"
                          required
                          type="text"
                          id="breed"
                          as="select"
                          value={selectedSubBreed.name}
                          onChange={handleSubBreedOptionChange}
                        >
                          <option value="">Select a specific breed</option>
                          {subBreed &&
                            subBreed.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  )}

                  <Col xl={12} lg={12} md={12} sm={12} col={12}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        className="age"
                        placeholder="Age"
                        required
                        as="select"
                        id="age"
                        value={selectedAge}
                        onChange={handleAgeOptionChange}
                      >
                        <option value={PET_AGE.LOWER_THAN_THREE_MONTH}>
                          Pet age lower than 3 months
                        </option>
                        <option value={PET_AGE.LOWER_THAN_ONE_YEAR}>
                          Pet age lower than 1 year
                        </option>
                        <option value={PET_AGE.GREATER_THAN_ONE_YEAR}>
                          Pet age greater than 1 year
                        </option>
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  <Col xl={12} lg={12} md={12} sm={12} col={12}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="status"
                        label="Free"
                        checked={isFree}
                        onChange={(event) => setIsFree(event.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                  {!isFree && (
                    <Col xl={12} lg={12} md={12} sm={12} col={12}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          className="price"
                          placeholder="Price"
                          required
                          type="text"
                          id="price"
                          onChange={handlePriceChange}
                          value={price}
                        />
                      </Form.Group>
                    </Col>
                  )}
                </Row>

                <Row>
                  <Col xl={12} lg={12} md={12} sm={12} col={12}>
                    <h3>Post Title and Detailed Description</h3>
                  </Col>

                  <Col xl={12} lg={12} md={12} sm={12} col={12}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        className="title"
                        placeholder="Post Title"
                        required
                        type="text"
                        id="title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col xl={12} lg={12} md={12} sm={12} col={12}>
                    <Form.Group className="mb-3">
                      <label htmlFor="description">Detailed Description</label>
                      <Form.Control
                        className="description"
                        placeholder="It is recommended to write outstanding information:
                                                -Animal breeds
                                                -Month old
                                                - Vaccinations and births"
                        required
                        as="textarea"
                        id="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <h3>Seller Information</h3>
                  </Col>
                  <Col></Col>
                </Row>

                <Row className="h-50">
                  <div className="mb-3 address">
                    <StyledTextField
                      placeholder="Location"
                      inputProps={{ style: styles.input }}
                      onClick={onOpenDialog}
                      value={location}
                      className="w-100"
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={onOpenDialog}>
                            <LocationOnIcon />
                          </IconButton>
                        ),
                      }}
                    />

                    <Modal open={isOpenDialog} onClose={onCloseDialog}>
                      <StyledBox>
                        <p>Seller address</p>
                        <StyledAuto
                          style={{ width: "100%" }}
                          id="city"
                          disableClearable
                          options={provinces.map((option) => option.name)}
                          value={selectedProvinces}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="City"
                              InputProps={{
                                ...params.InputProps,
                                type: "search",
                              }}
                            />
                          )}
                          onChange={handelOnChangeProvinces}
                        />
                        <StyledAuto
                          style={{ width: "100%" }}
                          disabled={selectedProvinces ? false : true}
                          id="city"
                          disableClearable
                          options={districts.map((option) => option.name)}
                          value={selectedDistricts}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Districts"
                              InputProps={{
                                ...params.InputProps,
                                type: "search",
                              }}
                            />
                          )}
                          onChange={handelOnChangeDistricts}
                        />
                        <StyledAuto
                          style={{ width: "100%" }}
                          disabled={selectedDistricts ? false : true}
                          id="city"
                          disableClearable
                          options={wards.map((option) => option.name)}
                          value={selectedWards}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Wards"
                              InputProps={{
                                ...params.InputProps,
                                type: "search",
                              }}
                            />
                          )}
                          onChange={handelOnChangeWards}
                        />
                        <StyledTextField
                          style={{
                            width: "100%",
                            paddingBottom: "1em",
                          }}
                          label="Seller address"
                          value={localAddress}
                          onChange={handleOnChangeLocalAddress}
                        />
                        <div className="btn-modal">
                          <StyleBtn onClick={clearAllOptions}>Clear</StyleBtn>
                          <StyleBtn onClick={onCloseDialog}>Close</StyleBtn>
                        </div>
                      </StyledBox>
                    </Modal>
                  </div>
                </Row>
                {errorMessage && (
                  <Row className="mb-2">
                    <Col>
                      <Typography variant="body1" color="error">
                        {errorMessage}
                      </Typography>
                    </Col>
                  </Row>
                )}

                <Row>
                  <Col>
                    <Button
                      className="mb-3"
                      style={{
                        width: "100%",
                        variant: "container",
                        backgroundColor: "#4a785f",
                        color: "#fff",
                      }}
                      type="submit"
                    >
                      Post
                    </Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </div>
      ) : (
        <div
          className="col-md-8 mb-5 d-flex flex-column justify-content-evenly align-item-center mb-4"
          style={{ backgroundColor: "#fff", padding: "2em" }}
        >
          <Typography
            variant="h5"
            className="w-100 text-center mb-2"
            style={{ height: "10%" }}
          >
            You have no more upload turns available.
          </Typography>
          <Button
            className="d-flex align-item-center gap-2 pd-2 "
            style={{
              backgroundColor: "#4a785f",
              color: "#fff",
              width: "100%",
              height: "20%",
            }}
            onClick={() => {
              navigate(`/membership/purchase`);
            }}
          >
            <FaCrown />
            Get your plan
          </Button>
          <Button
            className="d-flex align-item-center gap-2 pd-2"
            style={{
              backgroundColor: "#fff",
              color: "#4a785f",
              width: "100%",
              border: "1px solid #4a785f",
              height: "20%",
            }}
            onClick={() => handleOnClickScoreBtn()}
          >
            <FaTrophy />
            Using Your Score
          </Button>
        </div>
      )}

      <div className="col-md-4 mb-5">
        <FireBaseMultipleUpload
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          onChange={() => setErrorMessage("")}
        />
      </div>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Upload;

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  backgroundColor: "white",
  border: "none",
  borderRadius: "0.3rem",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  fontSize: "28px",
  fontWeight: "bold",
  padding: "1em",
}));

const StyledAuto = styled(Autocomplete)(({ theme }) => ({
  width: "100%",
  paddingBottom: "1em",
  "& .MuiInputLabel-root": {
    color: "#4a785f",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#4a785f",
  },
}));

const StyleBtn = styled(Button)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "#4a785f",
    color: "white",
  },
  variant: "container",
  color: "#4a785f",
}));

const StyledTextField = styled(TextField)({
  "& .MuiInputLabel-root": {
    color: "#4a785f",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#4a785f",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#4a785f",
    },
  },
});

const styles = {
  input: {
    caretColor: "transparent",
    "&:focus": {
      caretColor: "transparent",
    },
  },
};
