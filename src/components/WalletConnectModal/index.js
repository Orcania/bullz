import React, { useState } from 'react';
import { Dialog, DialogContent, Typography } from '@material-ui/core';
import "./style.scss";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { useDispatch, useSelector } from "react-redux";


const WalletConnectModal = () => {
    const wcPopupConfig = useSelector((state) => state.web3.wcPopupConfig);
    return (
        <Dialog
        open={wcPopupConfig.show}
        onClose={() => {
            // _setSubmissionEndedDialogOpen(false)
        }}
        className="submission-ended-modal"
      >
        <MuiDialogTitle className="wc-modal-header">
          <Typography className="main-title">{wcPopupConfig.title}</Typography>
        </MuiDialogTitle>
        <DialogContent>
          <p className="wc-modal-text">
            {wcPopupConfig.message}
          </p>
        </DialogContent>
      </Dialog>
    );
};

export default WalletConnectModal;