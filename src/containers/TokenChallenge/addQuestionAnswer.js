import { DialogContent, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { Spinner } from "react-bootstrap";
import "./style.scss";

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

const AddQuestionAnswer = ({ closeSumbission, ...props }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [answer, setAnswer] = useState("");

  const [inProcess, setInProcess] = useState(false);

  const showNotification = (msg) => {
    enqueueSnackbar(msg, {
      ...notificationConfig,
      variant: "error",
    });
  };
  

  async function handleSubmit() {
    if (answer !== "") {
      

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
      await props.submitAnswer({
        answer_text: answer,
      })
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
          <div className="form-group" style={{ marginTop: 20 }}>
            <span className="drop-title">Your Answer</span>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer"
            />
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <button
              className="btn-continue mb-3 mt-4"
              disabled={inProcess}
              onClick={() => handleSubmit()}
            >
              {inProcess ? <Spinner animation="border" size="sm" /> : props.buttonText}
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

export default AddQuestionAnswer;
