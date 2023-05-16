import React, { useState } from "react";
import { DialogContent, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import { ChatService } from "services/chat.service";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { DialogActions } from "@mui/material";
import CustomAlert from "components/CustomAlert";

const UserChatRequestDialogButton = ({
  userData,
  showNotification,
  isSelectedProfileUser,
  isSmall
}) => {
  const [chatMessage, setChatMessage] = useState("");
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);
  // for chat request
  const [isChatRequestOpen, setIsChatRequestOpen] = useState(false);
  const loggedInUserData = useSelector((state) => state.auth.userData);
  const isWeb3Connected = useSelector((state) => state.web3.web3connected);
  const history = useHistory();
  const [requestBoxCharacterCount, setRequestBoxCharacterCount] = useState(0);
  const [isConnectWalletAlertOpen, setIsConnectWalletAlertOpen] = useState(false);


  const network = useSelector((state) => state.web3.network);

  const chatService = new ChatService(network.chatUrl);

  const handleMessageRequestSubmit = async () => {
    if (chatMessage) {
      const payload = {
        nft_id: 0,
        nft_uuid: "direct-chat",
        sender_id: loggedInUserData.id,
        receiver_id: userData.id,
        start_message: chatMessage,
      };

      const result = await chatService.createRoom(payload);
      if (result) {
        setIsRequestSubmitted(true);
        setChatMessage("");
      }
    } else {
      showNotification("Empty message not allowed.");
    }
  };

  const getRoomDetails = async () => {
    const roomDetails = await chatService.getChatRoomDetailsForUser(loggedInUserData.id, userData.id);
    if(roomDetails){
      if(roomDetails.accepted){
        history.push({
          pathname: `/messaging/${roomDetails.id}`,
          tabIndex: 0,
        })
      }else{
        if(roomDetails.sender_id === loggedInUserData.id){
          showNotification("User request is pending");
        }else{
          history.push({
            pathname: `/messaging/${roomDetails.id}`,
            tabIndex: 1,
          })
        }
      }
    }else{
      setIsChatRequestOpen(true);
    }
}

  const startDirectChat = async (e) =>{
    e.preventDefault();
    if(isWeb3Connected){
      if(isSelectedProfileUser){
        history.push("/messaging")
      }else{
        getRoomDetails()
      }
    }else{
      // showNotification("Please login to send message.")
      // connectWallet();
      setIsConnectWalletAlertOpen(true);
    }
  }

  const connectWallet = async (e) => {
    if (document.getElementById("connectButton")) {
      document.getElementById("connectButton").click();
    }
  };

  const handleConnectWallet = () => {
    connectWallet();
    setIsConnectWalletAlertOpen(false);
  }

  return (
    <>
    <Link to="/messaging" onClick={ startDirectChat }>
      {
        isSmall ? (
          <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.75957 0.5H13.3596C13.5452 0.5 13.7233 0.576091 13.8545 0.711534C13.9858 0.846977 14.0596 1.03068 14.0596 1.22222V12.7778C14.0596 12.9693 13.9858 13.153 13.8545 13.2885C13.7233 13.4239 13.5452 13.5 13.3596 13.5H0.75957C0.573919 13.5 0.395871 13.4239 0.264596 13.2885C0.13332 13.153 0.0595703 12.9693 0.0595703 12.7778V1.22222C0.0595703 1.03068 0.13332 0.846977 0.264596 0.711534C0.395871 0.576091 0.573919 0.5 0.75957 0.5ZM7.10157 6.77106L2.61317 2.83856L1.70667 3.93922L7.11067 8.67339L12.4174 3.93561L11.5018 2.84289L7.10227 6.77106H7.10157Z" />
                  </svg>
        ) :  <img src="/images/involve.png" alt="action" />
      }
      
    </Link>
    <Dialog
      open={isChatRequestOpen}
      onClose={() => [setIsChatRequestOpen(false)]}
      className="chat-request-modal"
    >
      <DialogContent>
        {
          isRequestSubmitted 
            ? <div className="status-content">
              {/* for success */}
              <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="27" cy="27" r="27" fill="#3333FF"/>
                <path d="M16 29L22 35L39 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <p className="title">Message request sent!</p>
              <p className="subtitle">Your message has been sent succesfully!</p>

              {/* for error */}
              {/* <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="27" cy="27" r="27" fill="#FC4237"/>
                <path d="M27.0004 24.2883L36.4879 14.8008L39.1981 17.5109L29.7106 26.9984L39.1981 36.486L36.4879 39.1961L27.0004 29.7086L17.5129 39.1961L14.8027 36.486L24.2902 26.9984L14.8027 17.5109L17.5129 14.8008L27.0004 24.2883Z" fill="white"/>
              </svg>
              <p className="title">Something went wrong</p>
              <p className="subtitle">There was a problem sending your message request. Please try again.</p> */}
            </div>
            : <div className="chat-request-content">
            <div className="chat-request-modal-header">
              <p className="main-title">
                Connect with other users
              </p>
              <p className="subtitle">
                Please type your message below to request a chat with @
                {userData.username}
              </p>
            </div>
            <div className="inner-container">
            <div className="users-container">
              <div className="user">
                <img src={loggedInUserData.avatar_img} alt="" />
                <p>You</p>
              </div>
  
              <div
                className="line"
                // style={{ top: isRequestSubmitted ? "50%" : "36%" }}
              ></div>
              <IconButton
                aria-label="close"
                className="plus_icon"
                // style={{ top: isRequestSubmitted ? "45%" : "32%" }}
              >
                <AddIcon />
              </IconButton>
              <div className="user">
                <img src={userData.avatar_img} alt="" />
                <p>{userData.username}</p>
              </div>
            </div>
            {!isRequestSubmitted && (
              <div>
  
                <textarea
                  rows={8}
                  type="text"
                  value={chatMessage}
                  onChange={(e) => {
                    setRequestBoxCharacterCount(e.target.value.length);
                    setChatMessage(e.target.value);
                  }}
                  className={`input-message ${requestBoxCharacterCount > 300 ? "error" : ""}`}
                  placeholder="Type your message here."
                />
                {
                  requestBoxCharacterCount > 300 
                    ? <p className="count error">Characters limit exceeded</p>
                    : <p className="count">Characters {requestBoxCharacterCount}/300</p>
                }
                
              </div>
            )}
  
            </div>
  
            
          </div>
        }
        
      </DialogContent>
      <DialogActions>
      {isRequestSubmitted ? (
            <button
              className={`btn-continue`}
              style={{ marginBottom: 32}}
              onClick={() => [
                setIsChatRequestOpen(false),
                setIsRequestSubmitted(false),
              ]}
            >
              Okay
            </button>
          ) : (
            <>
              <button
                disabled={chatMessage === "" || requestBoxCharacterCount > 300}
                className={`btn-continue ${
                  chatMessage === "" || requestBoxCharacterCount > 300 ? "btn-inactive" : ""
                }`}
                onClick={handleMessageRequestSubmit}
              >
                Request To Chat
              </button>
              <p
                className="btn-continue btn-cancel"
                onClick={() => setIsChatRequestOpen(false)}
              >
                CANCEL
              </p>
            </>
          )}
      </DialogActions>
    </Dialog>

    <CustomAlert
          type="" 
          width={514} 
          isDialogOpen={isConnectWalletAlertOpen} 
          title="You're not logged in" 
          message={"Please log in or sign up"} 
          btnText="Connect Wallet" 
          customDialogAlertClose={()=> setIsConnectWalletAlertOpen(false)} 
          doSomething={handleConnectWallet}
        />
    </>
    
    
  );
};

export default UserChatRequestDialogButton;
