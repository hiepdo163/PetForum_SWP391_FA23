import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Check,
  Close,
  CheckCircle,
  Cancel,
  HourglassEmpty,
} from "@mui/icons-material";
import {
  fetchProcessingReport,
  processingReport,
} from "../../api/report/reportApi";
import { PROCESSING_STATUS } from "../../enum/Common";
import { convertDatetime } from "../../utils/DateUtils";
import { green } from "@mui/material/colors";
import SnackBarSuccess from "../SnackBarSuccess";

import {
  fetchPostDataById,
  fetchCommentById,
  fetchCommentLength,
} from "../../api/post/postApi";
import { Modal } from "react-bootstrap";
import Avatar from "../../img/anh-cua-tui.jpg";
import { Pagination, PaginationItem } from "@mui/material";
import chevron from "../../img/icon/chevrons-down.svg";

const ReportTable = ({ reportDate, processStatus }) => {
  const [filteredReports, setFilteredReports] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedReportIndex, setSelectedReportIndex] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [reportData, setReportData] = useState([
    { reportId: "", postId: "", reason: "", reportDate: "", status: null },
  ]);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProcessingReportAsync();
  }, []);

  useEffect(() => {
    filteredReportsByMonth();
  }, [reportDate, processStatus]);

  const filteredReportsByMonth = () => {
    let filtered = reportData;

    if (processStatus || processStatus === 0) {
      filtered = filtered.filter((report) => report.status === processStatus);
    }

    if (reportDate && reportDate.length > 0) {
      switch (reportDate) {
        case "today":
          var currentDate = new Date();
          filtered = filtered.filter((report) => {
            var timestampDate = new Date(report.reportDate);
            return (
              timestampDate.getDate() === currentDate.getDate() &&
              timestampDate.getMonth() === currentDate.getMonth() &&
              timestampDate.getFullYear() === currentDate.getFullYear()
            );
          });
          break;
        case "lastWeek":
          var currentDate = new Date();
          const lastWeek = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - 7
          );
          filtered = filtered.filter((report) => {
            const timestampDate = new Date(report.reportDate);
            return timestampDate <= lastWeek;
          });
          break;
        case "lastMonth":
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          filtered = filtered.filter((report) => {
            const reportedDateTime = new Date(report.reportDate);
            return reportedDateTime.getTime() <= lastMonth.getTime();
          });
          break;
        default:
          break;
      }
    }

    //console.log(filtered);
    setFilteredReports(filtered);
  };

  const fetchProcessingReportAsync = async () => {
    await fetchProcessingReport()
      .then((res) => {
        setReportData(res);
        setFilteredReports(res);
      })
      .catch((error) => {
        handleErrorFromApi(error);
      });
  };

  const postProcessingReportAsync = async (id, isAccept) => {
    await processingReport({ reportedId: id, isAccepted: isAccept })
      .then((res) => {
        setReportData(res);
        setOpenSnackBar(true);
        fetchProcessingReportAsync();
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

  const handleAcceptReport = () => {
    console.log(selectedReportId);
    setSelectedAction("accept");
    setConfirmDialogOpen(true);
  };

  const handleRejectReport = () => {
    setSelectedAction("reject");
    setConfirmDialogOpen(true);
  };

  const handleConfirmAccept = () => {
    if (selectedAction === "accept") {
      postProcessingReportAsync(selectedReportId, true);
    } else if (selectedAction === "reject") {
      postProcessingReportAsync(selectedReportId, false);
    }
    setShow(false);
    setConfirmDialogOpen(false);
    setSelectedAction(null);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  const handleOnCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

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

  const postId = postData.post.id;
  const fetchData = async (postId) => {
    try {
      const res = await fetchPostDataById(postId);
      setPostData(res);
      fetchCommentDataAsync(postId, page);
      fetchCommentLengthAsync(postId);
      setShow(true);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCommentDataAsync = async (postId, page) => {
    try {
      const res = await fetchCommentById(postId, page);
      setCommentData(res);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCommentLengthAsync = async (postId) => {
    try {
      const res = await fetchCommentLength(postId);
      setCommentSize(res);
    } catch (error) {
      console.error(error);
    }
  };

  const [page, setPage] = useState(1);
  const [commentSize, setCommentSize] = useState(0);
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchData(postId);
  }, [postId]);

  useEffect(() => {
    fetchCommentDataAsync(postId, page);
    fetchCommentLengthAsync(postId);
  }, [postId, page]);

  const [show, setShow] = useState(false);
  const handleReviewClose = () => setShow(false);
  const renderHtmlContent = (content) => {
    return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
  };
  const toggleShowReplies = (comment) => {
    comment.showReplies = !comment.showReplies;
    setCommentData([...commentData]);
  };

  return (
    <Container>
      <StyledTableContainer component={Paper} elevation={3}>
        <StyledTable aria-label="User table">
          <StyledTableHead>
            <TableRow>
              <StyledTableCell align="center" colSpan={1}>
                NO.
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={1}>
                Post Reported
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={1}>
                Reason
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={1}>
                Report Date
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={1}>
                Processing
              </StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredReports.map((report, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell align="center">{index + 1}</StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    onClick={() => {fetchData(report.postId);setSelectedStatus(report.status);setSelectedReportId(report.reportId)}}
                    variant="outlined"
                    color="primary"
                  >
                    View Post ({report.postId}){/* {console.log(postData)} */}
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {report.reason}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {convertDatetime(report.reportDate)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {report.status === PROCESSING_STATUS.ACCEPTED ? (
                    <CheckCircle />
                  ) : report.status === PROCESSING_STATUS.REJECTED ? (
                    <Cancel />
                  ) : (
                    <HourglassEmpty />
                  )}
                </StyledTableCell>
                <Modal
                  show={show}
                  onHide={handleReviewClose}
                  style={{ marginTop: "5%", height: "80%" }}
                  margin="5%"
                  size="xl"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Review Post</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="PostFull">
                      <div className="Head">
                        <img
                          className="Ava"
                          src={
                            postData.user.imgUrl ? postData.user.imgUrl : Avatar
                          }
                          alt="Avatar"
                        />
                        <div className="Group5">
                          <div className="Nikcname">@{postData.user.name}</div>
                          <div className="Time">
                            {convertDatetime(postData.post.date)}
                          </div>
                        </div>
                      </div>
                      <div className="Title">{postData.post.title}</div>
                      <div className="Content">
                        {renderHtmlContent(postData.post.content)}
                      </div>
                      <div className="Submenu mt-3 align-items-center">
                        <div className="TagsComment d-flex gap-2">
                          <div className="Tag p-2">
                            <div className="Cate">{postData.category.name}</div>
                          </div>
                          <div className="Tag p-2">
                            <div className="Cate">
                              {postData.category.parentName}
                            </div>
                          </div>
                        </div>
                        <div>{postData.reaction.vote} Votes</div>
                      </div>
                    </div>
                    <div className="Suggestions">Suggestions</div>
                    <Pagination
                      count={Math.ceil(commentSize / 5)}
                      page={page}
                      onChange={(event, newPage) =>
                        handlePageChange(event, newPage)
                      }
                      renderItem={(item) => (
                        <StyledPaginationItem component="div" {...item} />
                      )}
                    />
                    {commentData.map((comment) => (
                      <div key={comment.id} className="comment">
                        <div className="LevelComment1" id={comment.id}>
                          <div className="Content1">
                            <div className="Head1">
                              <img
                                className="Ava1"
                                src={
                                  comment.user.imgUrl
                                    ? comment.user.imgUrl
                                    : Avatar
                                }
                                alt=""
                              />
                              <div className="NameTime1">
                                <div className="Nikcname1">
                                  @
                                  {comment.user
                                    ? comment.user.name
                                    : "Unknown User"}
                                  :
                                </div>
                                <div className="Time1">
                                  {comment.comment
                                    ? convertDatetime(
                                        comment.comment.createdDate
                                      )
                                    : ""}
                                </div>
                              </div>
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
                                      <img
                                        className="ChevronsDown1"
                                        src={chevron}
                                        alt="ChevronsDown1"
                                      />
                                      <div
                                        className="ShowAllReplies1"
                                        onClick={() =>
                                          toggleShowReplies(comment)
                                        }
                                      >
                                        {comment.showReplies
                                          ? "Hide Replies"
                                          : `Show All Replies (${comment.childrenComment.length})`}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {comment.showReplies &&
                          comment.childrenComment.map((reply) => (
                            <div key={reply.id} className="reply">
                              <div className="LevelComment2" id={reply.id}>
                                {/*<div className="Indicator2" />*/}
                                <div className="Content2">
                                  <div className="Head1">
                                    <img
                                      className="Ava1"
                                      src={
                                        reply.user.imgUrl
                                          ? reply.user.imgUrl
                                          : Avatar
                                      }
                                      alt=""
                                    />
                                    <div className="NameTime1">
                                      <div className="Nikcname2">
                                        @
                                        {reply.user
                                          ? reply.user.name
                                          : "unknow"}
                                        :
                                      </div>
                                      <div className="Time1">
                                        {convertDatetime(reply.createdDate)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="Text2">
                                    <span>
                                      {renderHtmlContent(reply.content)}
                                    </span>
                                  </div>
                                  <div className="Bottom2">
                                    <div className="Line2" />
                                    <div className="Dlr2">
                                      <div className="Frame2"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}
                  </Modal.Body>
                  <Modal.Footer>
                    {selectedStatus === PROCESSING_STATUS.PENDING ? (
                      <>
                        <AcceptButton
                          variant="outlined"
                          onClick={() => handleAcceptReport()}
                        >
                          <Check />
                        </AcceptButton>
                        <RejectButton
                          variant="outlined"
                          onClick={() => handleRejectReport()}
                        >
                          <Close />
                        </RejectButton>
                      </>
                    ) : (
                      <Button onClick={handleReviewClose}>Cancel</Button>
                    )}
                  </Modal.Footer>
                </Modal>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        width="100%"
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          Are you sure you want to perform this action?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button onClick={handleConfirmAccept} color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      <SnackBarSuccess
        handleOnCloseSnackBar={handleOnCloseSnackBar}
        openSnackBar={openSnackBar}
        message={"Process Successfully"}
      />
    </Container>
  );
};

export default ReportTable;

const Container = styled("div")`
  margin-top: 20px;
`;

const StyledTableContainer = styled(TableContainer)({
  maxHeight: "400px",
  overflow: "auto",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#555",
  },
});

const StyledTable = styled(Table)`
  min-width: 650px;
`;

const StyledTableHead = styled(TableHead)`
  background-color: #f5f5f5;
`;

const StyledTableCell = styled(TableCell)`
  font-weight: bold;
  text-transform: uppercase;
`;

const StyledTableRow = styled(TableRow)`
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ActionButtonsContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AcceptButton = styled(Button)`
  background-color: #4caf50;
  color: white;
  margin-right: 5px;
  border-color: unset !important;

  &:hover {
    background-color: #45a049;
  }
`;

const RejectButton = styled(Button)`
  background-color: #f44336;
  color: white;
  border-color: unset !important;

  &:hover {
    background-color: #d32f2f;
  }
`;

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
