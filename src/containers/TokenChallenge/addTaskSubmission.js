import { DialogContent, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import React, { useState } from "react";
import S3 from "react-aws-s3";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Dropzone from "react-dropzone";
import { Spinner } from "react-bootstrap";
import { S3Config } from "../../config";
import { ChallengeService } from "../../services/challenge.service";
import "./style.scss";
import CustomLoader from "components/CustomLoader/CustomLoader";
import { printLog } from "utils/printLog";

const notificationConfig = {
  preventDuplicate: true,
  vertical: "bottom",
  horizontal: "right",
};

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(3),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography {...other} className={classes.root}>
      <Typography variant="h6">{children}</Typography>
    </MuiDialogTitle>
  );
});

const AddTaskSubmission = ({ closeSumbission, ...props }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [nftUrl, setNftUrl] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [collectionFile, setCollectionFile] = useState(null);
  const [collectionPreview, setCollectionPreview] = useState(null);

  const [inProcess, setInProcess] = useState(false);
  const [isIncorrectUrl, setIncorrectUrl] = useState(false);

  const showNotification = (msg) => {
    enqueueSnackbar(msg, {
      ...notificationConfig,
      variant: "error",
    });
  };

  const onUploadFile = async (e, fileType) => {
    let _file = e;
    let newFileName = new Date().getTime() + _file.name;
    const ReactS3Client = new S3(S3Config);
    let res = await ReactS3Client.uploadFile(_file, newFileName)
      .then((data) => {
        if (data.status === 204) {
          if (fileType === "image") {
            // setImagePreview(data.location);
            return data.location;
          } else {
            // setAudioFile({ name: newFileName, url: data.location });
            return data.location;
          }
        } else {
          return false;
        }
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });

    return res;
  };

  const onAddFile = async (value) => {
    setFileLoading(true);
    let res = await onUploadFile(value[0], "image");
    if (res) {
      setCollectionFile(value[0]);
      setCollectionPreview(res);
    }
    setFileLoading(false);
  };

  const removeFile = async () => {
    setCollectionFile(null);
    setCollectionPreview(null);
  };

  const handleCollectionFileDropped = (value) => {
    if (
      value[0] &&
      (value[0].type === "image/png" ||
        value[0].type === "image/jpeg" ||
        value[0].type === "image/jpg" ||
        value[0].type === "image/gif" ||
        value[0].type === "image/webp" ||
        value[0].type === "video/mp4" ||
        value[0].type === "audio/mp3" ||
        value[0].type === "audio/mpeg" ||
        value[0].type === "video/mov") &&
      value[0].size <= 31457280
    ) {
      onAddFile(value);
    }
  };

  async function handleSubmit() {
    if (nftUrl !== "" && collectionFile !== null) {
      const urlRegex =
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
      if (!urlRegex.test(nftUrl)) {
        // showNotification("Incorrect URL");
        setIncorrectUrl(true);
        return;
      }

      setIncorrectUrl(false);
      if (
        new Date().getTime() >=
        new Date(parseInt(props.challenge.expiresAt)).getTime()
      ) {
        closeSumbission();
        showNotification("Submission time has been ended");
        return;
      } else if (
        props.challenge.submissionLimit > 0 &&
        props.submissions.length === props.challenge.submissionLimit
      ) {
        closeSumbission();
        showNotification("Submission limit has been reached");
        return;
      }
      setInProcess(true);
      await props.saveSubmit({
        external_url: nftUrl,
        file_url: collectionPreview ? collectionPreview : "",
      });
      setInProcess(false);
      closeSumbission();
    } else {
      showNotification("Please fill up the required fields.");
    }
  }
  return (
    <>
      <Dialog open={true} onClose={closeSumbission} className="submit-modal">
        <DialogTitle onClose={closeSumbission}>Submit to Challenge</DialogTitle>
        <DialogContent>
          <div className="upload-item">
            <Dropzone
              name="file"
              className="drop-zone"
              multiple={false}
              onDrop={handleCollectionFileDropped}
            >
              {collectionFile && (
                <img
                  className="upload-icon"
                  src="/images/upload-green.png"
                  alt=""
                />
              )}

              {collectionFile === null ? (
                !fileLoading ? (
                  <div className="dropify-modal">
                    <img
                      className="icon"
                      src="/images/upload-icon.svg"
                      alt=""
                    />
                    <p className="title">Upload Proof of Work</p>
                    <p className="subtitle">PNG, JPEG or MP4</p>
                  </div>
                ) : (
                  <div className="dropify-message" style={{ width: "100%" }}>
                    <CustomLoader size={20} />
                    <p className="title">Uploading...</p>
                    <p className="subtitle">
                      Please wait. File is being uploaded
                    </p>
                  </div>
                )
              ) : (
                <div className="d-flex justify-content-center">
                  {collectionFile !== null &&
                  (collectionFile.type === "video/mp4" ||
                    collectionFile.type === "video/mov" ||
                    collectionFile.type === "audio/mp3" ||
                    collectionFile.type === "audio/mpeg") ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <p className="m-0 text-white">{collectionFile.name}</p>
                    </div>
                  ) : (
                    <>
                      <img
                        src={collectionFile.preview}
                        className="banner-image"
                        alt="File"
                      />
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="delete-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                      >
                        <circle
                          cx="19.5556"
                          cy="19.5556"
                          r="19.5556"
                          fill="#FF4343"
                        />
                        <path
                          d="M11 13.8008H12.9H28.1"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M26.2004 13.8V27.1C26.2004 27.6039 26.0002 28.0872 25.6439 28.4435C25.2876 28.7998 24.8043 29 24.3004 29H14.8004C14.2965 29 13.8132 28.7998 13.4569 28.4435C13.1006 28.0872 12.9004 27.6039 12.9004 27.1V13.8M15.7504 13.8V11.9C15.7504 11.3961 15.9506 10.9128 16.3069 10.5565C16.6632 10.2002 17.1465 10 17.6504 10H21.4504C21.9543 10 22.4376 10.2002 22.7939 10.5565C23.1502 10.9128 23.3504 11.3961 23.3504 11.9V13.8"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M17.6504 18.5508V24.2508"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M21.4502 18.5508V24.2508"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </div>
              )}
            </Dropzone>
          </div>
          <div className="form-group" style={{ marginTop: 20 }}>
            <span className="drop-title">Enter URL to Post</span>
            <input
              type="text"
              value={nftUrl}
              onChange={(e) => setNftUrl(e.target.value)}
              placeholder="Enter the URL to the post"
            />
            {isIncorrectUrl && <small className="err-msg">Incorrect URL</small>}
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <button
              className="btn-continue mb-3 mt-4"
              disabled={inProcess}
              onClick={() => handleSubmit()}
            >
              {inProcess ? <Spinner animation="border" size="sm" /> : "Submit"}
            </button>

            <button className="btn-cancel" onClick={closeSumbission}>
              CANCEL
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTaskSubmission;
