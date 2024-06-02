import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./PostComment.css";
import { Link } from "react-router-dom";
import { Image, Button, Form, Modal } from "react-bootstrap";
import Avatar from "../img/default.jpg";
import more from "../img/icon/feather_more-vertical.svg";
import up from "../img/icon/arrow-up.svg";
import mess from "../img/icon/message-square.svg";
import chevron from "../img/icon/chevrons-down.svg";
import corner from "../img/icon/corner-down-right.svg";
import {
  fetchPostDataById,
  fetchCommentById,
  fetchCommentLength,
  createComment,
  deleteComment,
  updateComment,
  getPostVote,
  updatePostVote,
  deletePost,
  reportPost,
} from "../api/post/postApi";

import { useEffect } from "react";
import { convertDatetime } from "../utils/DateUtils";
import { Pagination, PaginationItem, styled } from "@mui/material";
import StyledCircularProgress from "./StyledCircularProgress";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
const LoadingDialogContainer = styled("div")({
  height: "5rem",
});

export const PostComments = ({ postId, setStarterImgUrl, setUserName }) => {
  const [isloading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [postData, setPostData] = useState({
    user: {},
    post: {},
    category: {},
    reaction: {},
    reactionUser: {
      users: [],
    },
  });

  const [commentData, setCommentData] = useState([
    {
      id: "",
      user: {},
      comment: {},
      childrenComment: [],
    },
  ]);

  const fetchData = async () => {
    if (!postId) return;
    setIsLoading(true);
    try {
      const res = await fetchPostDataById(postId);
      const { user } = res;
      setPostData(res);
      setStarterImgUrl(user.imgUrl);
      setUserName(user);
      fetchCommentDataAsync(postId, page);
      fetchCommentLengthAsync(postId);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const fetchCommentDataAsync = async (postId, page) => {
    setIsLoading(true);
    try {
      const res = await fetchCommentById(postId, page);
      setCommentData(res);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const fetchCommentLengthAsync = async (postId) => {
    setIsLoading(true);
    try {
      const res = await fetchCommentLength(postId);
      setCommentSize(res);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const [page, setPage] = useState(1);
  const [commentSize, setCommentSize] = useState(0);
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchData();
    fetchCommentDataAsync();
    fetchCommentLengthAsync();
  }, []);

  useEffect(() => {
    fetchData();
    fetchCommentDataAsync(postId, page);
    fetchCommentLengthAsync(postId);
  }, [postId, page]);

  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        const voteData = await getPostVote(postId);
        if (voteData) {
          setVotes(voteData.count);
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchVoteData();
  }, [postId]);

  // Vote
  const [votes, setVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  const hasUserVoted = () => {
    if (hasVoted) {
      const userId = sessionStorage.getItem("userId");
      return hasVoted.some(
        (vote) => vote.userId === userId && vote.postId === postId
      );
    }
    return false;
  };

  const handleUpvote = async () => {
    if (!hasUserVoted()) {
      setVotes(votes + 1);
      try {
        await updatePostVote(sessionStorage.getItem("userId"), postId);
        const newVote = { userId: sessionStorage.getItem("userId"), postId };
        setHasVoted([...hasVoted, newVote]);
      } catch (error) {
        console.error("Error: ", error);
        setVotes(votes);
      }
    }
    fetchData();
  };

  //Reply comment
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = async () => {
    setIsLoading(true);
    if (newComment) {
      try {
        const res = await createComment(
          sessionStorage.getItem("userId"),
          postId,
          null,
          newComment
        );
        if (res) {
          fetchCommentDataAsync(postId, page);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error creating comment:", error);
        setIsLoading(false);
      }
    }
    setNewComment("");
    fetchData();
  };

  const handleReplySubmit = async (parentComment, comment) => {
    setIsLoading(true);
    if (comment.replyText) {
      try {
        await createComment(
          sessionStorage.getItem("userId"),
          postId,
          parentComment.id,
          comment.replyText
        );
        fetchCommentDataAsync();
      } catch (error) {
        console.error("Error creating reply:", error);
      }
    }
    setIsLoading(false);
    fetchData();
  };

  //feathermore post
  const feathermorePost = (postData) => {
    postData.feathermoreVisible = !postData.feathermoreVisible;
    setPostData({ ...postData });
  };

  //report post
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const handleReasonChange = (e) => {
    setReportReason({ ...reportReason, reason: e.target.value });
  };

  const handleDetailChange = (e) => {
    setReportReason({ ...reportReason, detail: e.target.value });
  };
  const handleReportPost = async () => {
    setIsLoading(true);
    try {
      const res = await reportPost(
        sessionStorage.getItem("userId"),
        postId,
        reportReason
      );
      console.log(res);
    } catch (error) {
      console.error("Error reporting post:", error);
    }
    postData.isReported = true;
    setIsLoading(false);
    // setReportReason({ reason: "", detail: "" });
    setReportReason(reportReason);
    setIsPopupOpen(false);
  };

  //delete post
  const [show, setShow] = useState(false);
  const handleDeleteClose = () => setShow(false);
  const handleDeleteShow = () => setShow(true);
  const handlePostDelete = async (postId) => {
    setIsLoading(true);

    try {
      await deletePost(postId);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
    navigate("/");
    fetchData();
    setIsLoading(false);
  };

  //feathermore
  const toggleFeathermore = (comment) => {
    comment.feathermoreVisible = !comment.feathermoreVisible;
    setCommentData([...commentData]);
  };

  //show replies or not
  const toggleShowReplies = (comment) => {
    comment.showReplies = !comment.showReplies;
    setCommentData([...commentData]);
  };

  //render HTML content
  const renderHtmlContent = (content) => {
    return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
  };

  //delete Comment
  const handleCommentDelete = async (commentId) => {
    setIsLoading(true);

    try {
      await deleteComment(commentId);
      const updatedComments = commentData.filter((cmt) => cmt.id !== commentId);
      setCommentData(updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
    fetchData();
    setIsLoading(false);
  };

  //update comment
  const handleCommentUpdate = async (commentId, updatedContent) => {
    setIsLoading(true);
    try {
      const res = await updateComment(commentId, updatedContent);
      if (res) {
        fetchCommentDataAsync(postId, page);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      setIsLoading(false);
    }
  };

  const toggleUpdate = (comment) => {
    comment.showUpdateForm = true;
    setCommentData([...commentData]);
  };

  const handleOnNavigate = (id) => {
    navigate(`/public/profile/?id=${id}`);
  };

  //render replies
  const renderReplies = (parentComment, comment) => {
    return (
      <>
        {parentComment.showReplies &&
          parentComment.childrenComment.map((reply) => (
            <div key={reply.id} className="reply">
              {reply.showUpdateForm ? (
                <Form
                  className="ReplyForm"
                  onSubmit={() =>
                    handleCommentUpdate(reply.id, reply.replyText)
                  }
                >
                  <Editor
                    initialValue={reply.content}
                    apiKey="kcs3ndks7bh89cmc6uij715q9qqu59333nww541fv1zs6pke"
                    onEditorChange={(content) => {
                      reply.replyText = content;
                      setCommentData([...commentData]);
                    }}
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
                  <Button
                    onClick={() => {
                      handleCommentUpdate(reply.id, reply.replyText);
                      setCommentData([...commentData]);
                    }}
                    className="btn-hover"
                    style={{ margin: "0 1em" }}
                  >
                    Submit
                  </Button>
                  <Button
                    className="btn-hover"
                    style={{ margin: "0 1em" }}
                    onClick={() => {
                      reply.feathermoreVisible = false;
                      reply.showUpdateForm = false;
                      setCommentData([...commentData]);
                    }}
                  >
                    Cancel
                  </Button>
                </Form>
              ) : (
                <div className="LevelComment2" id={reply.id}>
                  {/*<div className="Indicator2" />*/}
                  <div className="Content2">
                    <div className="Head1">
                      <Image
                        className="Ava1"
                        src={reply.user.imgUrl ? reply.user.imgUrl : Avatar}
                      />
                      <div className="NameTime1">
                        <div className="Nikcname2">
                          @{reply.user ? reply.user.name : "unknow"}:
                        </div>
                        <div className="Time1">
                          {convertDatetime(reply.createdDate)}
                        </div>
                      </div>
                      {reply.user.id === sessionStorage.getItem("userId") && (
                        <Image
                          className="FeatherMoreVertical1"
                          src={more}
                          alt="FeatherMore"
                          onClick={() => toggleFeathermore(reply)}
                        />
                      )}
                      {reply.feathermoreVisible && (
                        <div className="Menu">
                          {reply.user.id ===
                          sessionStorage.getItem("userId") ? (
                            <>
                              <div
                                className="delete-button"
                                onClick={() => {
                                  handleCommentDelete(reply.id);
                                }}
                              >
                                Delete
                              </div>
                              <div
                                className="update2-button"
                                onClick={() => toggleUpdate(reply)}
                              >
                                Edit
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </div>
                    <div className="Text2">
                      <span>{renderHtmlContent(reply.content)}</span>
                    </div>
                    <div className="Bottom2">
                      <div className="Line2" />
                      <div className="Dlr2">
                        <div className="Frame2">
                          <div className="Replly2">
                            <Image
                              src={corner}
                              alt="CornerDownRight2"
                              className="CornerDownRight2"
                            />
                            <div
                              className="Reply2"
                              onClick={() => {
                                reply.showReplyForm = !reply.showReplyForm;
                                setCommentData([...commentData]);
                              }}
                            >
                              Reply
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {reply.showReplyForm && (
                <Form
                  className="ReplyForm"
                  onSubmit={() => handleReplySubmit(parentComment, reply)}
                >
                  <Editor
                    initialValue={`<a style="color: black;
  font-size: 1em;
  font-weight: 500;
  letter-spacing: 0.07em;
  word-wrap: break-word;" href="#${reply.id}">Reply to @${reply.user.name}: </a><p>  </p>`}
                    apiKey="kcs3ndks7bh89cmc6uij715q9qqu59333nww541fv1zs6pke"
                    onEditorChange={(content) => {
                      reply.replyText = content;
                      setCommentData([...commentData]);
                    }}
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
                  <Button
                    onClick={() => {
                      handleReplySubmit(parentComment, reply);
                      setCommentData([...commentData]);
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={() => {
                      reply.showReplyForm = false;
                      reply.replyText = "";
                      setCommentData([...commentData]);
                    }}
                  >
                    Cancel
                  </Button>
                </Form>
              )}
            </div>
          ))}
      </>
    );
  };

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  return (
    <div className="PostComments">
      <div className="PostFull">
        <div className="Head">
          <Image
            className="Ava"
            src={postData.user.imgUrl ? postData.user.imgUrl : Avatar}
            alt="Avatar"
          />
          <div className="Group5">
            <div
              className="Nikcname"
              onClick={() => handleOnNavigate(postData.user.id)}
            >
              @{postData.user.name}
            </div>
            <div
              className="Time"
              onClick={() => handleOnNavigate(postData.user.id)}
            >
              {convertDatetime(postData.post.date)}
            </div>
          </div>
          <Image
            src={more}
            alt="feathermore"
            className="FeatherMoreVertical"
            onClick={() => feathermorePost(postData)}
          />
          {postData.feathermoreVisible && (
            <div className="Menu">
              {postData.user.id !== sessionStorage.getItem("userId") && (
                <div
                  className="feathermore-button"
                  onClick={() => setIsPopupOpen(true)}
                >
                  {postData.isReported ? "Reported" : "Report"}
                </div>
              )}

              {isPopupOpen && (
                <Modal
                  show={isPopupOpen}
                  onHide={() => setIsPopupOpen(false)}
                  className="centered-modal mx-auto"
                  style={{ top: "25%" }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Report Post</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {/* <select value={reportReason.reason} onChange={handleReasonChange}>
                      <option value="">--Please choose a reason--</option>
                      <option value="spam">Spam</option>
                      <option value="harassment">Harassment</option>
                      <option value="inappropriate">Inappropriate Content</option>
                    </select> */}
                    <textarea
                      placeholder="Enter detail for your reason for reporting"
                      value={reportReason}
                      // onChange={handleDetailChange}
                      onChange={(e) => setReportReason(e.target.value)}
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
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      onClick={handleReportPost}
                      style={{ backgroundColor: "#4a785f" }}
                    >
                      Submit
                    </Button>
                    <Button onClick={() => setIsPopupOpen(false)}>
                      Cancel
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}

              <>
                {postData.user.id === sessionStorage.getItem("userId") ? (
                  <>
                    <div className="delete-button" onClick={handleDeleteShow}>
                      Delete
                    </div>
                    <div
                      className="update2-button"
                      onClick={() =>
                        navigate(`/post/upload`, { state: postData })
                      }
                    >
                      Edit
                    </div>
                  </>
                ) : (
                  ""
                )}

                <Modal
                  show={show}
                  onHide={handleDeleteClose}
                  style={{ marginTop: "25%" }}
                  width="90%"
                  margin="0"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Delete confirm</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Are you sure to delete this post</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteClose}>
                      Cancle
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handlePostDelete(postId);
                        handleDeleteClose();
                      }}
                      style={{ backgroundColor: "#4a785f" }}
                    >
                      Delete
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            </div>
          )}
        </div>
        <div className="Title">{postData.post.title}</div>
        <div className="Content">
          {renderHtmlContent(postData.post.content)}
        </div>
        <div className="Submenu mt-3 align-items-center">
          <div className="TagsComment d-flex gap-2">
            <div className="Tag p-2">
              <div
                to="Java"
                className="Cate"
                onClick={() => navigate(`/`, { state: postData.category.id })}
              >
                {postData.category.name}
              </div>
            </div>
            <div className="Tag p-2">
              <div
                to="Java"
                className="Cate"
                onClick={() =>
                  navigate(`/`, { state: postData.category.parentId })
                }
              >
                {postData.category.parentName}
              </div>
            </div>
          </div>
          {sessionStorage.getItem("userId") && (
            <Button className="Button VoteButton" onClick={handleUpvote}>
              {hasUserVoted() ? (
                <>
                  <Image className="ArrowUp" src={up} alt="arrow-up" />
                  <div className="Vote">Voted</div>
                </>
              ) : (
                <>
                  <Image className="ArrowUp" src={up} alt="arrow-up" />
                  <div className="Vote">Vote</div>
                </>
              )}
            </Button>
          )}
          <div>{postData.reaction.vote} Votes</div>
        </div>
      </div>
      <div className="Suggestions">Suggestions</div>

      {sessionStorage.getItem("userId") ? (
        <Form id="SuggestBlock" onSubmit={handleCommentSubmit}>
          <Editor
            value={newComment}
            apiKey="kcs3ndks7bh89cmc6uij715q9qqu59333nww541fv1zs6pke"
            onEditorChange={(content) => setNewComment(content)}
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

          <div className="Frame3">
            {isloading ? (
              <LoadingDialogContainer>
                <StyledCircularProgress />
              </LoadingDialogContainer>
            ) : (
              <Button className="ButtonSg" onClick={handleCommentSubmit}>
                <div className="Suggest">
                  <Image
                    className="MessageSquare"
                    src={mess}
                    alt="MessageSquare"
                  />
                  Suggest
                </div>
              </Button>
            )}
          </div>
        </Form>
      ) : (
        <span className="ctrl-reply">
          You must be logged in to reply, <a href="/login">Login here</a>
        </span>
      )}

      <Pagination
        count={Math.ceil(commentSize / 5)}
        page={page}
        onChange={(event, newPage) => handlePageChange(event, newPage)}
        renderItem={(item) => (
          <StyledPaginationItem component="div" {...item} />
        )}
      />
      {commentData.map((comment) => (
        <div key={comment.id} className="comment">
          {comment.showUpdateForm ? (
            <Form
              className="ReplyForm"
              onSubmit={() =>
                handleCommentUpdate(comment.id, comment.replyText)
              }
            >
              <Editor
                initialValue={comment.comment.content}
                apiKey="kcs3ndks7bh89cmc6uij715q9qqu59333nww541fv1zs6pke"
                onEditorChange={(content) => {
                  comment.replyText = content;
                  setCommentData([...commentData]);
                }}
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
              <Button
                onClick={() => {
                  handleCommentUpdate(comment.id, comment.replyText);
                  setCommentData([...commentData]);
                }}
                className="btn-hover"
                style={{ margin: "0 1em" }}
              >
                Submit
              </Button>
              <Button
                className="btn-hover"
                style={{ margin: "0 1em" }}
                onClick={() => {
                  comment.feathermoreVisible = false;
                  comment.showUpdateForm = false;
                  setCommentData([...commentData]);
                }}
              >
                Cancel
              </Button>
            </Form>
          ) : (
            <div className="LevelComment1" id={comment.id}>
              {/*<div className="Indicator1" />*/}
              <div className="Content1">
                <div className="Head1">
                  <Image
                    className="Ava1"
                    src={comment.user.imgUrl ? comment.user.imgUrl : Avatar}
                  />
                  <div className="NameTime1">
                    <div className="Nikcname1">
                      @{comment.user ? comment.user.name : "Unknown User"}:
                    </div>
                    <div className="Time1">
                      {comment.comment
                        ? convertDatetime(comment.comment.createdDate)
                        : ""}
                    </div>
                  </div>
                  {comment.user.id === sessionStorage.getItem("userId") && (
                    <Image
                      className="FeatherMoreVertical1"
                      src={more}
                      alt="FeatherMore"
                      onClick={() => toggleFeathermore(comment)}
                    />
                  )}
                  {comment.feathermoreVisible && (
                    <div className="Menu">
                      {comment.user.id === sessionStorage.getItem("userId") && (
                        <>
                          <div
                            className="delete-button"
                            onClick={() => {
                              setConfirmDialogOpen(true);
                            }}
                          >
                            Delete
                          </div>
                          <Dialog
                            open={confirmDialogOpen}
                            onClose={() => setConfirmDialogOpen(false)}
                            width="100%"
                          >
                            <DialogTitle>Confirm Action</DialogTitle>
                            <DialogContent>
                              Are you sure you want to delete this comment?
                            </DialogContent>
                            <DialogActions>
                              <Button
                                onClick={() => setConfirmDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => {
                                  handleCommentDelete(comment.id);
                                  setConfirmDialogOpen(false);
                                }}
                                color="primary"
                              >
                                Delete
                              </Button>
                            </DialogActions>
                          </Dialog>
                          <div
                            className="update2-button"
                            onClick={() => {
                              toggleUpdate(comment);
                            }}
                          >
                            Edit
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="Text1">
                  {comment.comment &&
                    renderHtmlContent(comment.comment.content)}
                </div>
                <div className="Bottom1">
                  <div className="Line1"></div>
                  <div className="Dlr1">
                    <div className="Frame1">
                      {comment.childrenComment.length > 0 && (
                        <div className="SeeReplies1">
                          <Image
                            className="ChevronsDown1"
                            src={chevron}
                            alt="ChevronsDown1"
                          />
                          <div
                            className="ShowAllReplies1"
                            onClick={() => toggleShowReplies(comment)}
                          >
                            {comment.showReplies
                              ? "Hide Replies"
                              : `Show All Replies (${comment.childrenComment.length})`}
                          </div>
                        </div>
                      )}
                      {sessionStorage.getItem("userId") && (
                        <div className="Replly1">
                          <Image
                            className="CornerDownRight1"
                            src={corner}
                            alt="CornerDownRight1"
                          />

                          <div
                            className="Reply1"
                            onClick={() => {
                              comment.showReplyForm = !comment.showReplyForm;
                              setCommentData([...commentData]);
                            }}
                          >
                            Reply
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {comment.showReplyForm && (
            <Form
              className="ReplyForm"
              onSubmit={() => handleReplySubmit(comment, comment)}
            >
              <Editor
                initialValue={`<a style="color: black;
  font-size: 1em;
  font-weight: 500;
  letter-spacing: 0.07em;
  word-wrap: break-word;" href="#${comment.id}">Reply to @${comment.user.name}:</a> <p>  </p>`}
                apiKey="kcs3ndks7bh89cmc6uij715q9qqu59333nww541fv1zs6pke"
                onEditorChange={(content) => {
                  comment.replyText = content;
                  setCommentData([...commentData]);
                }}
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
              <Button
                onClick={() => {
                  handleReplySubmit(comment, comment);
                  setCommentData([...commentData]);
                }}
                className="btn-hover"
                style={{ margin: "0 1em" }}
              >
                Submit
              </Button>
              <Button
                className="btn-hover"
                style={{ margin: "0 1em" }}
                onClick={() => {
                  comment.showReplyForm = false;
                  comment.replyText = "";
                  setCommentData([...commentData]);
                }}
              >
                Cancel
              </Button>
            </Form>
          )}
          {renderReplies(comment, comment)}
        </div>
      ))}
    </div>
  );
};

const StyledPaginationItem = styled(PaginationItem)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: "#4a785f",
    color: "#fff",
  },
  "&.Mui-selected:hover": {
    color: "#4a785f",
    backgroundColor: "#fff",
  },
}));
