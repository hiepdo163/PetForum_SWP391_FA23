import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./AskBlock.css";
import { Button, Form, Image } from "react-bootstrap";
//import image from "../img/icon/image.svg";
import send from "../img/icon/send.svg";
import {
  fetchMainCategory,
  fetchChildCategory,
  createPost,
  updatePost,
} from "../api/post/postApi";
import { styled } from "@mui/material";
import StyledCircularProgress from "./StyledCircularProgress";
import { useNavigate, useLocation } from "react-router-dom";
export const AskBlock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const LoadingDialogContainer = styled("div")({
    height: "5rem",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePostSubmit = async () => {
    setIsLoading(true);
    if (category && title && content) {
      try {
        if (isUpdating) {
          const postIdToUpdate = location.state.post.id;
          const res = await updatePost(
            postIdToUpdate,
            title,
            content,
            category
          );
          if (res) {
            navigate(`/post/?id=${res.id}`);
            setIsLoading(false);
          }
        } else {
          const res = await createPost(
            sessionStorage.getItem("userId"),
            title,
            content,
            category
          );
          if (res) {
            //link den trang member/postId
            navigate(`/post/?id=${res.id}`);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error creating post:", error);
        setIsLoading(false);
      }
    }
    setSelectedMainCategory("");
    setCategory("");
    setTitle("");
    setContent("");
    fetchData();
  };

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [mainCategories, setMainCategories] = useState([
    {
      id: "",
      name: "",
      description: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [childCategories, setChildCategories] = useState([
    {
      id: "",
      name: "",
      description: "",
    },
  ]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchMainCategory();
      if (res) {
        setMainCategories(res);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchChildByMainCategory = async (mainCategoryId) => {
    setIsLoading(true);
    try {
      const res = await fetchChildCategory(mainCategoryId);
      if (res) {
        setChildCategories(res);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (selectedMainCategory) {
      fetchChildByMainCategory(selectedMainCategory);
    }
  }, [selectedMainCategory]);

  useEffect(() => {
    if (location.state !== null) {
      setIsUpdating(true);
      setSelectedMainCategory(location.state.category.parentId);
      setCategory(location.state.category.id);
      setTitle(location.state.post.title);
      setContent(location.state.post.content);
    }
  }, [location.state]);

  console.log(location.state);

  return (
    <div className="AskBlock">
      <Form onSubmit={() => handlePostSubmit()}>
        <div className="mb-2">
          <Form.Select
            className="Main-Categories"
            value={selectedMainCategory}
            onChange={(e) => setSelectedMainCategory(e.target.value)}
          >
            <option value="">==========Please choose Category==========</option>
            {mainCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </div>
        <Form.Select
          className="Child-Categories"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value=""></option>
          {selectedMainCategory &&
            childCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
        </Form.Select>

        <br />
        <Form.Control
          className="TypeCatchingAttentionTitle"
          required
          type="text"
          placeholder="Type catching attention title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <Editor
          value={content}
          apiKey="kcs3ndks7bh89cmc6uij715q9qqu59333nww541fv1zs6pke"
          onEditorChange={(content) => setContent(content)}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "link",
              "image",
              "charmap",
              "print",
              "preview",
              "anchor",
              "texcolor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "paste",
              "code",
              "help",
              "wordcount",
              "lists",
            ],
            toolbar:
              "undo redo | fontfamily fontsize | bold underline italic backcolor forecolor | image link | alignleft aligncenter alignright alignjustify | subscript superscript | removeformat |" +
              "| outdent indent | bullist numlist |",
          }}
        />

        <div className="Frame">
          {/* <Button className="ButtonAsk">
            <Image className="Image" src={image} alt="anh" />
            <div className="AddImage">
              <label htmlFor="imageInput">Add Image</label>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                style={{ display: "none", width: "100%", height: "5.6vh" }}
              />
            </div>
          </Button> */}
          <div className="Group8">
            {/*<Button className="ButtonAsk">
              <div className="SaveAsDraft">Save as draft</div>
            </Button>*/}
            {isLoading ? (
              <LoadingDialogContainer>
                <StyledCircularProgress />
              </LoadingDialogContainer>
            ) : (
              <Button
                className="ButtonAsk"
                onClick={() => handlePostSubmit()}
                style={{ margin: "0 1em" }}
              >
                <Image className="Send" src={send} alt="send" />
                <div className="Publish">
                  {isUpdating ? "Update" : "Publish"}
                </div>
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};
