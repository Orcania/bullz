import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import Loader from "react-loader-spinner";

import { CommentsService } from "../../services/comments.service";
import { ChallengeService } from "services/challenge.service";

import "./style.scss";
import { useHistory } from 'react-router';
import CustomAlert from "components/CustomAlert";
import EyeIcon from './../../components/Common/Icons/EyeIcon';
import { printLog } from "utils/printLog";

function OwnersComponent({ challenge, setChallenge, ...props }) {
  const loggedInUser = useSelector((state) => state.auth.userData);
  const isWeb3Connected = useSelector((state) => state.web3.web3connected);
  const network = useSelector((state) => state.web3.network);
  const commentService = new CommentsService(network.backendUrl);
  const challengeService = new ChallengeService(network.backendUrl);
  const [comments, setComments] = useState("");
  const [isloading, setIsLoading] = useState(true);

  const [comment, setComment] = useState("");
  const [commentAdding, setCommentAdding] = useState(false);
  const [isConnectWalletAlertOpen, setIsConnectWalletAlertOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    getComments();
  }, []);

  const getComments = async () => {
    const comm = await commentService.getChallengeComments(challenge.id, loggedInUser.id);
    if (comm) {
      let temp = [];
      for (let i = 0; i < comm.length; i++) {
        let item = comm[i];
        // const holderData = await userService.getUser(comm[i].holder);
        item.holderData = comm[i].user;
        item.likes = comm[i].commentLike.length;
        temp.push(item);
      }
      temp.sort(function(a, b){return b.likes - a.likes});
      setComments([...temp]);
      setIsLoading(false);
    }
  };

  function handleEnterClick(event) {
    if (event.key === "Enter") {
      postComment();
    }
  }

  const connectWallet = async (e) => {
    if (document.getElementById("connectButton")) {
      document.getElementById("connectButton").click();
    }
  };

  const postComment = async () => {
    if (isWeb3Connected) {
      if (comments && comment) {
        setCommentAdding(true);
        const obj = {
          comment,
          user: loggedInUser.id,
          challenge: challenge.id,
        };
        printLog([obj], 'success');
        let res = await commentService.addComment(obj);
        if (res) {
          setComment("");
          getComments();
          setCommentAdding(false);
          const updatedChallenge = {
            id: challenge.id,
            totalCommentCount: challenge.totalCommentCount
              ? parseInt(challenge.totalCommentCount) + 1
              : 1,
          };
          await challengeService.update(updatedChallenge);
          setChallenge((prevState) => ({
            ...prevState,
            totalCommentCount: parseInt(prevState.totalCommentCount) + 1,
          }));
        }
      }
    } else {
      // connectWallet();
      setIsConnectWalletAlertOpen(true);
    }
  };

  const likeComment = async (comm, index) => {
    printLog([comm], 'success');
    const obj = {
      comment: comm.id,
      user: loggedInUser.id,
    };
    let res = await commentService.likeUnlikeNFTComment(obj);
    if (res) {
      getComments();
    }
  };

  const parseDate = (d) => {
    const date = new Date(d).getDate();
    const month = new Date(d).getMonth() + 1;
    const year = new Date(d).getFullYear();
    return date + "/" + month + "/" + year;
  };

  const handleConnectWallet = () => {
    connectWallet();
    setIsConnectWalletAlertOpen(false);
  }

  const handleInputOnClick = (e) => {
      if(!isWeb3Connected){
        setIsConnectWalletAlertOpen(true);
        e.target.blur();
      }
  }
  printLog([comments], 'success');
  return (
    <React.Fragment>
      <>
        {!isloading ? (
          <div
            style={{
              position: "relative",
            }}
          >
            {comments.length > 0 ? (
              comments.map((comm, index) => (
                <div className="commmemt-card" key={index}>
                  <div className="d-flex justify-content-between">
                    <div className="d-flex">
                      <img
                        src={
                          comm.holderData.avatar_img
                            ? comm.holderData.avatar_img
                            : `/images/avatar.png`
                        }
                        alt="Avatar"
                        className="commmemt-avatar cursor-pointer"
                        onClick={()=> history.push(`/profile/${comm.holderData.address}`)}
                      />
                      <div className="commmemt-info">
                        <div className="d-flex align-items-center">
                        <span className="card-name mr-2 cursor-pointer" onClick={()=> history.push(`/profile/${comm.holderData.address}`)}>
                          {" "}
                          @{comm.user.username}
                        </span>
                        <span className="card-eth">
                          {parseDate(comm.updatedAt)}
                        </span>
                        </div>
                        <p className="card-eth-comment">{comm.comment}</p>
                        
                      </div>
                    </div>
                    <div className="favorite-wrapper">
                      <p className="favorite">
                        {isWeb3Connected ? (
                          <>
                            {comm.liked ? (
                              <FavoriteIcon
                                onClick={() => likeComment(comm, index)}
                              />
                            ) : (
                              <FavoriteBorderIcon
                                sx={{ fontSize: 40 }}
                                onClick={() => likeComment(comm, index)}
                              />
                            )}
                          </>
                        ) : (
                          <>
                            <FavoriteBorderIcon sx={{ fontSize: 40 }} onClick={connectWallet}/>
                          </>
                        )}
                        {comm.likes}
                      </p>
                      {/* <MoreVertIcon /> */}
                    </div>
                  </div>
                  
                </div>
              ))
            ) : (
              <div className="not-found">
                <EyeIcon />
                <p>No Comments Found.</p>
              </div>
            )}

            {/* {isWeb3Connected === true && ( */}
              <div className={`comment-footer ${!comments.length > 0 ? 'empty' : ''}`}>
                <img
                  className={"commmemt-avatar"}
                  src={
                    loggedInUser.avatar_img
                      ? loggedInUser.avatar_img
                      : `/images/smily.svg`
                  }
                  alt="Avatar"
                />
                <input
                  type="text"
                  className="input_comment"
                  placeholder="Type your comment"
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={handleEnterClick}
                  value={comment}
                  onClick={handleInputOnClick}
                />

                {commentAdding ? (
                  <Loader
                    color="#4353FF"
                    height={30}
                    width={30}
                    type={"TailSpin"}
                  />
                ) : (
                  <div onClick={postComment}>
                    <svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.5" d="M1.9498 16.8849L19.3998 9.40488C20.2098 9.05488 20.2098 7.91488 19.3998 7.56488L1.9498 0.0848801C1.2898 -0.20512 0.559805 0.28488 0.559805 0.99488L0.549805 5.60488C0.549805 6.10488 0.919805 6.53488 1.4198 6.59488L15.5498 8.48488L1.4198 10.3649C0.919805 10.4349 0.549805 10.8649 0.549805 11.3649L0.559805 15.9749C0.559805 16.6849 1.2898 17.1749 1.9498 16.8849Z" fill="black"/>
                    </svg>

                  </div>
                )}
              </div>
            {/* )} */}
          </div>
        ) : (
          <div className="w-100 d-flex justify-content-center">
            <Loader color="#4353FF" height={30} width={30} type={"TailSpin"} />
          </div>
        )}
      </>

      <CustomAlert
          type="" 
          width={514} 
          isDialogOpen={isConnectWalletAlertOpen} 
          title="You're not logged in" 
          message={"Please log in or sign up to post comment"} 
          btnText="Connect Wallet" 
          customDialogAlertClose={()=> setIsConnectWalletAlertOpen(false)} 
          doSomething={handleConnectWallet}
        />
    </React.Fragment>
  );
}

export default React.memo(OwnersComponent);
