import { Typography, DialogContent} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import React, { useState, useEffect } from "react";

import { useHistory } from "react-router";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { Spinner } from "react-bootstrap";

import ReactPaginate from "react-paginate";

import { capitalize, scrollToTop } from "common/utils";

import { useSnackbar } from 'notistack';

import { UserService } from "../../services/user.service";
import FollowCard from "../../components/Common/FollowCard/index";

import "./style.scss";
import CustomTooltip from './../../components/Common/Tooltip/CustomTooltip';
import { SET_REPORT_USERS } from "redux/constants";
import AddIcon from '@material-ui/icons/Add';
import UserChatRequestDialogButton from "containers/Profile/userChatRequestDialogButton";
import { ChatService } from 'services/chat.service';
import { ReportService } from "services/report.service";
import { ShareService } from "services/share.service";
import { printLog } from "utils/printLog";

const notificationConfig = {
  preventDuplicate: true,
  vertical: "bottom",
  horizontal: "right",
};

const Profile = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const metaMaskAddress = useSelector((state) => state.web3.metaMaskAddress);
  const loggedInUserData = useSelector((state) => state.auth.userData);

  const network = useSelector((state) => state.web3.network);
  const pathname = useSelector((state) => state.router.location.pathname);

  const isWeb3Connected = useSelector((state) => state.web3.web3connected);

  const userService = new UserService(network.backendUrl);
  const chatService = new ChatService(network.chatUrl);
  const reportService = new ReportService(network.backendUrl);
  const shareService = new ShareService(network.backendUrl);

  const [userData, setUserData] = useState("");
  const [nfts, setNfts] = useState([]);

  const [nftsLoading, setNftsLoading] = useState(true);

  const [limit, setLimit] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [isSelectedProfileUser, setIsSelectedProfileUser] = useState(false);

  const [isUserFollowed, setIsUserFollowed] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [copied, setCopied] = useState(false);

  // for report
  const reportUsers = useSelector((state) => state.profile.reportUsers);

  const url = window.location.href;

  useEffect(() => {
    if (userData) {
      getUserNFT();
    }
  }, [selectedPage, loggedInUserData, userData, pathname]);

  useEffect(() =>{
    scrollToTop();
  },[selectedPage])

  useEffect(() => {
    getUser();
  }, [metaMaskAddress]);

  useEffect(() => {
    if (userData && Object.keys(loggedInUserData).length !== 0) {
      checkForLoggedInUserFollowed(loggedInUserData.id, userData.id);
    }
  }, [userData, loggedInUserData]);

  const getUser = async () => {
    userService
      .getUser(props.match.params.id.toLowerCase())
      .then((res) => {
        printLog(["res after getting user", res], 'success');
        if (res) {
          const actualAccountUserConnected =
            metaMaskAddress &&
            metaMaskAddress.toLowerCase() === res.address.toLowerCase();
          setUserData(res);
          setIsSelectedProfileUser(actualAccountUserConnected);
        } else {
          setUserData("no user found");
        }
      })
      .catch((err) => {
        printLog([err]);
      });
  };

  const getUserNFT = async () => {
    setNftsLoading(true);
    let arr = [];
    let response;
    if (history.location.pathname.includes("/follower")) {
      response = await userService.getUserFollowers(userData.id);
    } else {
      response = await userService.getUserFollowings(userData.id);
    }
    if (response) {
      setTotalCount(response.length);
      for (let i = (selectedPage - 1) * limit; i < selectedPage * limit; i++) {
        let item = response[i];
        if (item) {
          let followResponse = false;
          if (loggedInUserData.id === item.id) {
            followResponse = "currentUser";
          } else if (Object.keys(loggedInUserData).length !== 0) {
            followResponse = await checkForUserFollowed(
              loggedInUserData.id,
              item.id
            );
          }

          // let followResponse = true
          arr.push({ ...item, followResponse: followResponse });
        }
      }
    }
    setNfts(arr.length > 0 ? arr : []);
    setNftsLoading(false);
  };

  const checkForUserFollowed = async (currentUser, profileUser) => {
    let res = await userService.checkForUserFollowed(currentUser, profileUser);
    return res;
  };

  const checkForLoggedInUserFollowed = async (currentUser, profileUser) => {
    let res = await userService.checkForUserFollowed(currentUser, profileUser);
    setIsUserFollowed(res);
  };

  const goToEditProfile = () => {
    history.push("/edit-profile");
  };

  const handlePageClick = (page) => {
    setSelectedPage(page.selected + 1);
  };

  const handleSocialLinks = (type) => {
    if (userData[type]) {
      window.open(userData[type]);
    }else{
      showNotification("User did not added the url for this.");
    }
  };

  const handleCopyAddress = () => {
    var copyText = document.getElementById("address");
    var textArea = document.createElement("textarea");
    textArea.value = copyText.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const followUnfollowUser = async () => {
    let res = await userService.followUnfollowUser(
      loggedInUserData.id,
      userData.id
    );
    printLog([res], 'success');
    if (res === "Followed/Unfollowed Successfully") {
      getUser();
      setIsUserFollowed((prevState) => !prevState);
    }
  };


  const followUnfollowUserList = async (userObj) => {
    printLog([userObj], 'success')
    if(Object.keys(loggedInUserData).length !== 0){
      let res = await userService.followUnfollowUser(
        loggedInUserData.id,
        userObj.id
      );
      printLog([res], 'success');
      if (res === "Followed/Unfollowed Successfully") {
        getUser();
        getUserNFT()
      }
    }
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
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            className={classes.closeButton}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const showNotification = (msg, variant = "") => {
    enqueueSnackbar(msg, {
      ...notificationConfig,
      variant: variant? variant : "error",
    });
  };

  const handleReportSubmit = async () => {
     if (message) {
        if(!reportUsers.includes(userData.address)){
          const reportData = {
            report_for: 'user',
            reporter_id: loggedInUserData.id,
            reported_id: userData.id,
            report_list: [message]
          };
          const addReport = await reportService.saveReport(reportData).then(res =>{
            printLog([res.data], 'success');
            return res.data;
          }).catch(function (error) {
            if (error.response) {
              showNotification(error.response?.data?.message ? error.response?.data?.message : error.response?.data?.error, "error");
            } else if (error.request) {
              showNotification("request error", "error");
            } else {
              showNotification(error.message, "error");
            }
          });
          if (addReport) {
            dispatch({
              type: SET_REPORT_USERS,
              payload: [...reportUsers, userData.address],
            })
            showNotification("Your report has been submitted.", "success");
            setIsReportOpen(false);
            setIsMoreOpen(false);
            setMessage("");
          }          
        }else{
          showNotification("You have already reported this user.", "error");
        }
      } else {
        showNotification("Please write something.");
      }
  };

  const emailShareClicked = async () => {
    const shareData = {
      shared_by: loggedInUserData.address,
      link: url,
      share_on: 'email'
    }
    await shareService.addShare(shareData);
  }
  

  const hadleOnShareClick = async (type) => {
    let extUrl = "";
    if(type === "twitter"){
      extUrl = `http://twitter.com/share?text=Check this awesome nft collection&url=${url}`
    }else if(type === "facebook"){
      extUrl = `https://www.facebook.com/sharer.php?display=page&u=${url}`
    }else if(type === "telegram"){
      extUrl = `https://telegram.me/share/url?url=${url}&text=Checkout this awesome nft collection`
    } else if (type === "instagram") {
      showNotification('Instagram sharing is not supported yet');
      return;
    }
    const shareData = {
      shared_by: loggedInUserData.address,
      link: extUrl,
      share_on: type
    }
    await shareService.addShare(shareData);
    setIsShareOpen(false);
    window.open(extUrl, "_blank")
  }

  const handleReportClick = () => {
    if(!isSelectedProfileUser){
      setIsReportOpen(true);
    }else{
      showNotification("You can't report yourself.")
    }
  }

  const onProfileUrlClick = (url) => {
    const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
    const test = urlRegex.test(url);

    if(url){
      if(test && !url.includes(" ")){
        if(url.includes("http://") || url.includes("https://")){
          window.open(url, "_blank");
        }else{
          window.open(`http://${url}`, "_blank");
        }
      }else{
        showNotification("This is not a valid URL.")
      }
    }
  }

  printLog(["================>", totalCount, limit], 'success');
  return (
    <>
      <div className="photo-profile-page">
        {userData && userData !== "no user found" ? (
          <>
            <div className="banner container">
              <div className="banner-content">
              <img
                  src={
                    userData.back_img
                      ? userData.back_img
                      : "/images/yiki_bg.png"
                  }
                  alt="banner"
                  className="banner-image"
                />
              </div>
              <div className="bannerAvatar">
              <img
                  src={
                    userData.avatar_img
                      ? userData.avatar_img
                      : "/images/yiki.png"
                  }
                  alt="avatar"
                />
                <div className="social-wrapper-new">
                  <img
                    src="/images/instagram.png"
                    alt="social"
                    onClick={() => {
                      handleSocialLinks("instagram_url");
                    }}
                    style={{
                      cursor: userData["instagram_url"] ? "pointer" : "",
                    }}
                  />
                  <img
                    src="/images/tiktok.png"
                    alt="social"
                    onClick={() => {
                      handleSocialLinks("tiktok_url");
                    }}
                    style={{
                      cursor: userData["tiktok_url"] ? "pointer" : "",
                    }}
                  />
                  <img
                    src="/images/twitter.png"
                    alt="social"
                    onClick={() => {
                      handleSocialLinks("twitter_url");
                    }}
                    style={{
                      cursor: userData["twitter_url"] ? "pointer" : "",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="profile-content">
              <div className="container position-relative">
                <div className="floating-actions1">
                  <div className="mobile-view">
                    {/* chat request dialog button */}
                    <UserChatRequestDialogButton 
                      userData ={userData} 
                      showNotification={showNotification}
                      isSelectedProfileUser={isSelectedProfileUser}
                    />
                    <img
                      src="/images/arrow-up.png"
                      alt="action"
                      onClick={() => setIsShareOpen(true)}
                    />
                    {
                      !isSelectedProfileUser && <img
                      src="/images/more.png"
                      alt="action"
                      onClick={() => handleReportClick()}
                    />
                    }
                    
                  </div>
                  {isSelectedProfileUser && (
                    <button
                      className="btn-edit-profile"
                      onClick={goToEditProfile}
                    >
                      My Settings
                    </button>
                  )}
                  {metaMaskAddress && !isSelectedProfileUser && (
                    <button
                      onClick={followUnfollowUser}
                      className="btn-edit-profile"
                    >
                      {isUserFollowed ? "Unfollow" : "Follow"}
                    </button>
                  )}
                  <div className="mobile-show">
                    <img
                      src="/images/more.png"
                      alt="action"
                      onClick={() => setIsMoreOpen(true)}
                    />
                  </div>
                </div>
                <div className="profile-info1">
                  <div className="profile-desc">
                    <CustomTooltip
                      title={`@${userData.username}`}
                      placement={"top"}
                    >
                      <p className="info-lead">
                        @{userData.username}
                      </p>
                    </CustomTooltip>

                    <CustomTooltip
                      title={`${capitalize(userData.username)}`}
                      placement={"top"}
                    >
                      <p className="hex-name">@{userData.username}</p>
                    </CustomTooltip>
                    
                    <div className="hex-group" onClick={handleCopyAddress}>
                      <p className="info-sub-lead" id={"address"}>
                        {`${userData.address.slice(
                          0,
                          10
                        )}...${userData.address.slice(-5)}`}
                      </p>
                      <img src="/images/rectangle.png" alt="rect" />
                    </div>
                    {copied && (
                      <p
                        style={{
                          color: "#4353FF",
                          borderRadius: 2,
                          fontSize: 12,
                          fontWeight: "bold",
                          marginLeft: 10,
                          marginBottom: 0
                        }}
                      >
                        Copied
                      </p>
                    )}
                  </div>
                  <p className="info-sub-lead" style={{height: 45}}>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    {userData.bio}
                  </p>
                  <p className="info-sub-lead" style={{height: 22.5, cursor: 'pointer'}} onClick={()=>onProfileUrlClick(userData.portfolio_url)}>{userData.portfolio_url}</p>
                  <div className="follower-group">
                    <p
                      className="info-lead1"
                      style={{
                        cursor: "pointer",
                        color: history.location.pathname.includes("/follower")
                          ? "#4353FF"
                          : "",
                      }}
                      onClick={() =>
                        history.push(`/follower/${userData.address}`)
                      }
                    >
                      {userData.follower.length} Followers
                    </p>
                    <p
                      className="info-lead"
                      style={{
                        cursor: "pointer",
                        color: history.location.pathname.includes("/following")
                          ? "#4353FF"
                          : "",
                      }}
                      onClick={() =>
                        history.push(`/following/${userData.address}`)
                      }
                    >
                      {userData.following.length} Following
                    </p>
                  </div>
                  
                </div>

                <div className="follow-content">
                  <div className="row">
                    {nftsLoading ? (
                      <div className="spinnerStyle">
                        <Spinner animation="border" />
                      </div>
                    ) : nfts.length > 0 ? (
                      nfts.map((nft, index) => (
                        <div className="col-md-6 col-lg-3" key={index}>
                          <FollowCard info={nft} 
                          followUnfollowUserList={followUnfollowUserList}
                          />
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                          // height: "100vh",
                          display: "flex",
                        }}
                      >
                        <div className="no-items">
                          <p className="no-items-title">No Items Found</p>
                          <p className="no-items-lead">
                            Browse our marketplace to discover challenges
                          </p>
                          <button className="btn-continue" onClick={()=>history.push("/discover")}>
                            Browse Marketplace
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!nftsLoading && totalCount > limit && (
                  <ReactPaginate
                    previousLabel={<svg style={{height: 25, width: 25}} width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 17.5L10.5 13L15 8.5" stroke="white" stroke-linecap="round"/>
                    </svg>}
                    nextLabel={<svg style={{height: 25, width: 25}} width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 17.5L14.5 13L10 8.5" stroke="white" stroke-linecap="round"/>
                    </svg>      }
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={totalCount / limit}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    forcePage={selectedPage - 1}
                    activeClassName={"active"}
                  />
                )}
              </div>
            </div>
          </>
        ) : userData === "no user found" ? (
          <div className="profile-content">
            <div className="container position-relative">
              <div className="no-items">
                <p className="no-items-title">No Items Found</p>
                <p className="no-items-lead">
                  Browse our marketplace to discover challenges
                </p>
                <button className="btn-continue" onClick={()=>history.push("/discover")}>Browse Marketplace</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="spinnerStyle">
            <Spinner animation="border" />
          </div>
        )}
      </div>

      <Dialog open={isMoreOpen} onClose={() => setIsMoreOpen(false)}>
        <DialogTitle onClose={() => setIsMoreOpen(false)}></DialogTitle>
        <DialogContent style={{ marginTop: -35 }}>
          <div className="d-flex align-items-center modal-menu">
           {/* chat request dialog button */}
           <UserChatRequestDialogButton
              userData ={userData} 
              showNotification={showNotification}
              isSelectedProfileUser={isSelectedProfileUser}
              isSmall={true}
            />

            <span className="text-modal">Message</span>
          </div>
          <div className="d-flex align-items-center modal-menu">
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.91171 2.57804V10.7755H4.56478V2.57804L0.952286 6.19053L0 5.23824L5.23825 0L10.4765 5.23824L9.52421 6.19053L5.91171 2.57804Z"
                fill="white"
              />
            </svg>

            <span className="text-modal">Share</span>
          </div>
          <div className="d-flex align-items-center modal-menu">
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="10.8281" height="11.2148" fill="white" />
            </svg>

            <span className="text-modal">TikTok</span>
          </div>
          <div className="d-flex align-items-center modal-menu">
            <svg
              width="13"
              height="11"
              viewBox="0 0 13 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.9994 1.30582C12.5125 1.52995 11.9961 1.67715 11.4675 1.74254C12.0247 1.39571 12.4418 0.849859 12.6409 0.206713C12.118 0.530605 11.5446 0.757594 10.9471 0.880381C10.5457 0.433423 10.0136 0.136999 9.43364 0.037191C8.85367 -0.062617 8.25825 0.0397836 7.73997 0.328473C7.22168 0.617163 6.80956 1.07597 6.56768 1.63356C6.32579 2.19115 6.2677 2.81628 6.40242 3.41178C5.34191 3.35646 4.30442 3.06965 3.35733 2.56997C2.41023 2.07029 1.5747 1.3689 0.904974 0.511357C0.667915 0.935104 0.543339 1.41681 0.544005 1.90714C0.544005 2.86953 1.01467 3.71974 1.73023 4.21752C1.30677 4.20365 0.892623 4.08464 0.522321 3.8704V3.90492C0.522449 4.54586 0.735567 5.16704 1.12554 5.66313C1.51551 6.15922 2.05834 6.49968 2.66199 6.6268C2.26889 6.73766 1.8567 6.754 1.45663 6.67459C1.62683 7.22629 1.95855 7.70878 2.40535 8.05452C2.85215 8.40025 3.39166 8.59191 3.94834 8.60267C3.39508 9.05487 2.76159 9.38916 2.08411 9.5864C1.40662 9.78365 0.698423 9.84 0 9.75222C1.2192 10.5682 2.63845 11.0014 4.08801 11C8.99426 11 11.6773 6.77016 11.6773 3.10182C11.6773 2.98236 11.6741 2.86156 11.669 2.74342C12.1912 2.35061 12.642 1.86401 13 1.30648L12.9994 1.30582Z"
                fill="white"
              />
            </svg>

            <span className="text-modal">Twitter</span>
          </div>
          <div className="d-flex align-items-center modal-menu">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="-1.27295"
                y="-1.27441"
                width="15.292"
                height="14.9735"
                fill="white"
              />
            </svg>
            <span className="text-modal">Instagram</span>
          </div>
          <div className="d-flex align-items-center modal-menu">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6Z"
                fill="white"
              />
              <path
                d="M10.909 5.99991C10.909 8.71113 8.71113 10.909 5.99991 10.909C3.2887 10.909 1.09082 8.71113 1.09082 5.99991C1.09082 3.2887 3.2887 1.09082 5.99991 1.09082C8.71113 1.09082 10.909 3.2887 10.909 5.99991Z"
                fill="#1B1B1B"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.3638 2.7278L2.72744 10.3642L1.95605 9.59277L9.59242 1.95641L10.3638 2.7278Z"
                fill="white"
              />
            </svg>

            <span className="text-modal">Report</span>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        className="s-modal"
      >
        <MuiDialogTitle className="share-modal-header">
          <Typography className="main-title">
            Share a link to this page
          </Typography>

          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setIsShareOpen(false)}
            className="close_button"
          >
            <path
              d="M4.5 3.50016L8.00016 0L9 0.999843L5.49984 4.5L9 8.00016L8.00016 9L4.5 5.49984L0.999843 9L0 8.00016L3.50016 4.5L0 0.999843L0.999843 0L4.5 3.50016Z"
              fill="#D2D2D2"
            />
          </svg>
        </MuiDialogTitle>
        <DialogContent>
          <div
            className="d-flex align-items-center"
            style={{ marginBottom: 5 }}
          >
            <div className="d-flex flex-column align-items-center modal-share">
              <a
                onClick={() => hadleOnShareClick("twitter")}
                rel="noopener noreferrer"
                className="social-share-anchor">
                <svg
                  width="21"
                  height="17"
                  viewBox="0 0 21 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.383 1.96745C19.6196 2.30514 18.81 2.52692 17.981 2.62545C18.8548 2.10288 19.5087 1.28046 19.821 0.31145C19.001 0.79945 18.102 1.14145 17.165 
					1.32645C16.5356 0.653029 15.7014 0.206413 14.792 0.0560348C13.8826 -0.0943437 12.9489 0.0599411 12.1363 0.494903C11.3236 0.929865 10.6774 1.62113 10.2981 
					2.46124C9.91884 3.30135 9.82775 4.24323 10.039 5.14045C8.37611 5.0571 6.74933 4.62497 5.26429 3.87211C3.77924 3.11925 2.46913 2.0625 1.419 0.77045C1.04729 
					1.4089 0.851955 2.13468 0.853 2.87345C0.853 4.32345 1.591 5.60445 2.713 6.35445C2.04901 6.33355 1.39963 6.15423 0.819 5.83145V5.88345C0.8192 6.84915 1.15337 
					7.78507 1.76485 8.53251C2.37633 9.27995 3.22748 9.79293 4.174 9.98445C3.55761 10.1515 2.91131 10.1761 2.284 10.0564C2.55087 10.8877 3.07101 11.6146 3.77159 
					12.1356C4.47218 12.6565 5.31813 12.9452 6.191 12.9614C5.32348 13.6428 4.33018 14.1464 3.26788 14.4436C2.20558 14.7408 1.09513 14.8257 0 14.6934C1.9117 15.9229 
					4.1371 16.5756 6.41 16.5734C14.103 16.5734 18.31 10.2005 18.31 4.67345C18.31 4.49345 18.305 4.31145 18.297 4.13345C19.1159 3.54162 19.8226 2.80847 20.384 
					1.96845L20.383 1.96745Z"
                  />
                </svg>
                <span className="text-modal-share">Twitter</span>
              </a>
            </div>
            <div className="d-flex flex-column align-items-center modal-share">
              <a
                onClick={() => hadleOnShareClick("facebook")}
                rel="noopener noreferrer"
                className="social-share-anchor"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 0C4.477 0 0 4.477 0 10C0 14.991 3.657 19.128 8.438 19.879V12.89H5.898V10H8.438V7.797C8.438 5.291 9.93 3.907 12.215 3.907C13.309 3.907 14.453 4.102 14.453 4.102V6.562H13.193C11.95 6.562 11.563 7.333 11.563 8.124V10H14.336L13.893 12.89H11.563V19.879C16.343 19.129 20 14.99 20 10C20 4.477 15.523 0 10 0Z" />
                </svg>

                <span className="text-modal-share">Facebook</span>
              </a>
            </div>
            <div className="d-flex flex-column align-items-center modal-share">
              <a
                onClick={() => hadleOnShareClick("telegram")}
                rel="noopener noreferrer"
                className="social-share-anchor"
              >
                <svg
                  width="20"
                  height="17"
                  viewBox="0 0 20 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5.25485 9.96563L0.712904 8.53332C-0.268942 8.22994 -0.274397 7.54596 0.93291 7.05504L18.6298 0.141703C19.6571 -0.281188 20.2389 0.25386 19.9062 1.59424L16.8934 15.9725C16.6824 16.9966 16.0733 17.2412 15.2279 16.7686L10.5895 13.2973L8.42766 15.408C8.20584 15.625 8.02583 15.8107 7.68401 15.8567C7.344 15.9045 7.06399 15.8015 6.85853 15.2315L5.27667 9.95276L5.25485 9.96563Z" />
                </svg>

                <span className="text-modal-share">Telegram</span>
              </a>
            </div>
            <div className="d-flex flex-column align-items-center modal-share">
              <a
                href={` mailto:?to=&body=Checkout this awesome nft collection ${url}&subject=Checkout this awesome nft collection`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-share-anchor"
              >
                <svg
                  width="20"
                  height="18"
                  viewBox="0 0 20 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={emailShareClicked}
                >
                  <path d="M1 0H19C19.2652 0 19.5196 0.105357 19.7071 0.292893C19.8946 0.48043 20 0.734784 20 1V17C20 17.2652 19.8946 17.5196 19.7071 17.7071C19.5196 17.8946 19.2652 18 19 18H1C0.734784 18 0.48043 17.8946 0.292893 17.7071C0.105357 17.5196 0 17.2652 0 17V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0ZM10.06 8.683L3.648 3.238L2.353 4.762L10.073 11.317L17.654 4.757L16.346 3.244L10.061 8.683H10.06Z" />
                </svg>

                <span className="text-modal-share">Email</span>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        className="s-modal report"
      >
        <MuiDialogTitle className="share-modal-header">
          <div className="d-flex flex-column">
            <Typography className="main-title">
              Why are you reporting?
            </Typography>
            <Typography className="share-subtitle">
              Tell us how this user violates the rules of this site
            </Typography>
          </div>
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setIsReportOpen(false)}
            className="close_button"
          >
            <path
              d="M4.5 3.50016L8.00016 0L9 0.999843L5.49984 4.5L9 8.00016L8.00016 9L4.5 5.49984L0.999843 9L0 8.00016L3.50016 4.5L0 0.999843L0.999843 0L4.5 3.50016Z"
              fill="#D2D2D2"
            />
          </svg>
        </MuiDialogTitle>
        <DialogContent>
          <div className="d-flex flex-column p-20">
            <label className="message-title">Message</label>
            <textarea
              rows={4}
              type="text"
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= 250) {
                  setMessage(e.target.value);
                } else {
                  showNotification("You exeeds max limit 250 character.");
                }
              }}
              className="input-message"
              placeholder="Tell us some details max 250 character."
            />
            <button 
              className={`btn-report ${
                message === "" ? "" : "btn-active"
              }`}
              onClick={handleReportSubmit}
            >
              Report
            </button>
            <p className="btn-cancel" onClick={() => setIsReportOpen(false)}>
            CANCEL
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;
