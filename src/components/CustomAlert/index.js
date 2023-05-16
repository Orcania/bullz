import React from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import "./style.scss";
import { useMediaQuery } from '@material-ui/core';
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { renderIcon } from './../../containers/CreateNFT/createNFT';

//socialHandle possible values twitter, instagram, telegram etc check renderIcon function for more details

const CustomAlert = ({type = "success", title, message, btnText = "Ok", isDialogOpen, customDialogAlertClose, width = 287, doSomething= undefined, showCloseIcon=false, socialHandle=""}) => {
    const isMobile = useMediaQuery('(min-width:340px) and (max-width:600px)');
    return (
        <Dialog
            open={isDialogOpen}
            onClose={customDialogAlertClose}
            className="custom-alert-modal"
            >
                {
                    showCloseIcon && <MuiDialogTitle className="share-modal-header">
                    <IconButton
                      aria-label="close"
                      onClick={customDialogAlertClose}
                      className="close_button"
                    >
                      <CloseIcon />
                    </IconButton>
                  </MuiDialogTitle>
                }
            <DialogContent style={{width: isMobile ? 287 : width}}>
                {
                    type && <div className={`icon ${type === "success" ? "success" : type === "scan" ? "" : "error"}`}>
                        {type === "success" ? <DoneIcon/> : type === "scan" ? <img src="/images/scan-icon.svg" alt="scan-icon" /> : <CloseIcon/>}
                    </div>
                }

                {
                    socialHandle && (
                        <div className='custom-alert-icon'>
                            {renderIcon(socialHandle)}
                        </div>
                    )
                }
                
                <p className="custom-alert-modal-title">
                    {title}
                </p>
                <p className="modal-text">
                    {message}
                </p>
                <button className="btn-continue" onClick={doSomething || customDialogAlertClose}>{socialHandle && <span>{renderIcon(socialHandle)}</span>} {btnText}</button>
            </DialogContent>
        </Dialog>
    );
};

export default CustomAlert;