import React, { useState, useEffect } from "react";
import { Modal, Row } from "react-bootstrap";
import "./style.scss";
import { InstagramLogin } from '@amraneze/react-instagram-login';
import { useHistory, useLocation } from "react-router-dom";
// import {
//   createUser,
//   createUserToken,
//   getUserProfile,
// } from "../../../services/sociallink.service";
// import { isInstagramLinked, isTwitterLinked } from "../../../common/utils";
import { useDispatch, useSelector } from "react-redux";
import { UserService } from "../../../services/user.service";
import { setUserData } from "../../../redux/actions/authAction";
// import InstagramIcon from '@material-ui/icons/Instagram';
// import TwitterLogin from '../../../components/TwitterLogin';
import { useSnackbar } from "notistack";
// import YoutubeButton from "components/SocialConnectPage/YoutubeButton";
// import TwitchLogin from "components/TwitchLogin";
import { PhylloService } from "services/phyllo.service";
import { printLog } from 'utils/printLog';
const notificationConfig = {
  preventDuplicate: true,
  vertical: "bottom",
  horizontal: "left",
};
function SubmitSocialConnect() {
  const history = useHistory();
  const [show] = useState(false);
  const [continueDisabled, setcontinueDisabled] = useState(false);
  const [isInstagramSelected, setIsInstagramSelected] = useState(false);
  const [isTwitterSelected, setInTwitterSelected] = useState(false);
  const [twitterUrl, setTwitterUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isYoutubeSelected, setIsYoutubeSelected] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isTwitterNeeded, setTwitterNeeded] = useState(true);
  const [isInstagramNeeded, setInstagramNeeded] = useState(true);
  const [isYoutubeNeeded, setYoutubeNeeded] = useState(true);
  const userData = useSelector((state) => state.auth.userData);
  const network = useSelector((state) => state.web3.network);
  const userService = new UserService(network.backendUrl);
  const phylloService = new PhylloService(network.backendUrl);
  const nftId = history?.location?.state?.nftId;
  const _isTwitterNeeded = history?.location?.state?.isTwitterNeeded;
  const _isInstagramNeeded = history.location?.state?.isInstagramNeeded;
  const _isYoutubeNeeded = history.location?.state?.isYoutubeNeeded;

  const [isTwitchSelected, setIsTwitchSelected] = useState(false);
  const [twitchUrl, setTwitchUrl] = useState("");
  const [isTwitchNeeded, setTwitchNeeded] = useState(true);
  const _isTwitchNeeded = history.location?.state?.isTwitchNeeded;

  const fetchTokenURL = network.backendUrl + "/auth/twitter/request_token";
  const loginUrl = network.backendUrl + "/auth/twitter/access_token";
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [isTiktokSelected, setIsTiktokSelected] = useState(false);
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [isTiktokNeeded, setTiktokNeeded] = useState(true);
  const _isTiktokNeeded = history.location?.state?.isTiktokNeeded;

  
  useEffect(() => {
    if (nftId) {
      localStorage.setItem("TempNFTId", nftId);
      setInstagramNeeded(_isInstagramNeeded);
      setTwitterNeeded(_isTwitterNeeded);
      setYoutubeNeeded(_isYoutubeNeeded);
      setTwitchNeeded(_isTwitchNeeded);
      setTiktokNeeded(_isTiktokNeeded);
    }
  }, [nftId])  

  useEffect(() => {
    setcontinueDisabled(
      (isTwitterNeeded && !isTwitterSelected) 
      || (isInstagramNeeded && !isInstagramSelected) 
      || (isYoutubeNeeded && !isYoutubeSelected) 
      || (isTwitchNeeded && !isTwitchSelected)
      || (isTiktokNeeded && !isTiktokSelected));
  });

  const showNotification = (msg, variant = "") => {
    enqueueSnackbar(msg, {
      ...notificationConfig,
      variant: variant ? variant : "error",
    });
  };
  // const instagramLogin = async (code) => {
  //     if (code.error != null) {
  //       showNotification(code.error_description);
  //       return;
  //     }    

  //     const mainUrl = window.location.href.split('?')[0]
  //     const instgramData = await userService.getInstagramAccessToken(
  //         {
  //             code: code,
  //             redirect_url: mainUrl,
  //         });
  //     if (instgramData) {
      
    
        
  //       if(instgramData) {
  //         setIsInstagramSelected(true);
  //         const iUrl = 'https://www.instagram.com/' + instgramData.username;
  //         setInstagramUrl(iUrl);
  //         userData.instagram_url = iUrl;
  //         await userService.updateUser(userData);
  //         dispatch(setUserData(userData))
  //       }
  //     }
  // }

  // const updateYoutubeInfo = async (youtubeUrl) => {
  //   userData.youtube_url = youtubeUrl;
  //   await userService.updateUser(userData);
  //   dispatch(setUserData(userData));
  // }

  // const onTwitchSuccess = async (twitch_user) => {

  //   if(twitch_user) {
  //     setIsTwitchSelected(true);
  //     const tUrl = 'https://twitch.tv/' + twitch_user;
  //     setTwitchUrl(tUrl);
  //     userData.twitch_url = tUrl;
  //     await userService.updateUser(userData);
  //     dispatch(setUserData(userData))
  //   }
  // }

  // const onTwitchFailed = (error) => {
  //     showNotification(error.message)
  // }
  // const onTwitterSuccess = async (response) => {
  //   response.json().then( async twitterData => {
  //       if(twitterData) {
  //         setInTwitterSelected(true);
  //         const tUrl = 'https://twitter.com/' + twitterData.screen_name;
  //         setTwitterUrl(tUrl);
  //         userData.twitter_url = tUrl;
  //         await userService.updateUser(userData);
  //         dispatch(setUserData(userData))
  //       }
  //   });
  // }

  // const onTwitterFailed = (error) => {
  //     showNotification(error.message)
  // }

  const submitContinue = () => {
    localStorage.setItem('addSubmission', 'true');
    history.push({pathname: `/token-challenge/${localStorage.getItem("TempNFTId")}`})
  }

  const phylloSDKConnect = async (workPlatformId = null) => {
    try {
      // const timeStamp = new Date();

      // const userId = await createUser(userData.username, timeStamp.getTime());
      // const token = await createUserToken(userId);

      const phylloData = await phylloService.createToken({user_id: userData.id, platform_id: workPlatformId})

      printLog(["phylloData", phylloData], 'success');

      if(!phylloData) {
        showNotification('internal error occurred.');
        return;
      }
      const appName = process.env.REACT_APP_PHYLLO_APP_NAME;
      const env = process.env.REACT_APP_PHYLLO_ENVIRONMENT;

      const config = {
        clientDisplayName: appName,
        environment: env,
        userId: phylloData.phyllo_user_id,
        token: phylloData.token,
        redirect: false,
        workPlatformId: phylloData.platform_id,
        // redirectURL : window.location.href
      };

      printLog(["config", config], 'success');

      const phylloConnect = window.PhylloConnect.initialize(config);

      phylloConnect.on(
        "accountConnected",
        (accountId, workplatformId, userId) => {
          printLog(
            [`onAccountConnected: ${accountId}, ${workplatformId}, ${userId}`], 'success'
          );
          getUserProfileData(accountId);
        }
      );
      phylloConnect.on(
        "accountDisconnected",
        (accountId, workplatformId, userId) => {
          printLog(
            [`onAccountDisconnected: ${accountId}, ${workplatformId}, ${userId}`, 'success']
          );
        }
      );
      phylloConnect.on("tokenExpired", (userId) => {
        printLog([`onTokenExpired: ${userId}`]);
      });
      phylloConnect.on("exit", (reason, userId) => {
        printLog([`onExit: ${reason}, ${userId}`]);
        // showNotification(reason);
      });
      phylloConnect.on(
        "connectionFailure",
        (reason, workplatformId, userId) => {
          printLog(
            [`onConnectionFailure: ${reason}, ${workplatformId}, ${userId}`], 'success'
          );
          showNotification(reason);
        }
      );
      phylloConnect.open();
    } catch (err) {
      printLog([err]);
    }
  };

  const onTwitter = async (tUrl) => {
    if(tUrl) {
      setInTwitterSelected(true);
      setTwitterUrl(tUrl);
      userData.twitter_url = tUrl;
      await userService.updateUser(userData);
      dispatch(setUserData(userData))
    }
  };

  const onInstagram = async (iUrl) => {
    printLog(["onInstagram", iUrl], 'success');

    if(iUrl) {
      setIsInstagramSelected(true);
      setInstagramUrl(iUrl);
      userData.instagram_url = iUrl;
      await userService.updateUser(userData);
      dispatch(setUserData(userData))
    }
  };

  const onTwitch = async (tUrl) => {
    printLog(["twitch_user", tUrl], 'success');
    if(tUrl) {
      setIsTwitchSelected(true);
      setTwitchUrl(tUrl);
      userData.twitch_url = tUrl;
      await userService.updateUser(userData);
      dispatch(setUserData(userData))
    }
  };

  const onYoutube = async (youtube_url) => {
    printLog(["youtube_url", youtube_url], 'success');
    if (youtube_url) {
      setYoutubeUrl(youtube_url);
      setIsYoutubeSelected(true);
      userData.youtube_url = youtube_url;
      await userService.updateUser(userData);
      dispatch(setUserData(userData));
    }
  };

  const onTiktok = async (tiktok_url) => {
    printLog(["tiktok_url", tiktok_url], 'success');
      if (tiktok_url) {
        setTiktokUrl(tiktok_url);
        setIsTiktokSelected(true);
        userData.tiktok_url = tiktok_url;
        await userService.updateUser(userData);
        dispatch(setUserData(userData));
      }
  };

  const getUserProfileData = async (account_id) => {
    printLog(["account_id", account_id], 'success');
    const _userData = await phylloService.getUserProfile(account_id)
    printLog(["userData", _userData], 'success');
    if (_userData.length > 0) {
      const user = _userData[0];
      printLog(["loggedInUserData2", user], 'success');
      if (user.work_platform?.name === "Twitter") {
        onTwitter(user.url);
      } else if (user.work_platform?.name === "Instagram") {
        onInstagram(user.url);
      } else if (user.work_platform?.name === "Twitch") {
        onTwitch(user.url);
      } else if (user.work_platform?.name === "YouTube") {
        onYoutube(user.url);
      } else if (user.work_platform?.name === "TikTok") {
        onTiktok(user.url);
      }
    }
  };

  return (
    <>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={!show}
        // onHide={() => props.hideShow()}
        dialogClassName="dialog-container"
      >
        <Modal.Body>
        <Row>
          <div className="social-connect-container-challenge">
            <p className="subtitle">Submit to Challenge</p>
            <p className="title">
              {isInstagramSelected && isTwitterSelected && isYoutubeSelected && isTwitchSelected && isTiktokSelected
                ? "You have successfully connected your social! Let’s continue to submit to the challenge."
                : "This challenge requires you to connect your social media profile for credibility. Please connect to continue to submit."}
            </p>
            <div className="social-items-container">
              {isTwitterNeeded && (
                <>
                  {isTwitterSelected ? (
                    <div className="social-input">
                      {/* <img src="/images/twitter.png" alt="" /> */}
                      <svg style={{ marginRight: 8 }} width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.9388 0.00728525C15.245 0.496661 14.4768 0.870955 13.6639 1.11575C13.2275 0.614053 12.6476 0.25846 12.0026 0.0970684C11.3576 -0.064323 10.6786 -0.023726 10.0574 0.213369C9.43623 0.450463 8.90284 0.872616 8.5294 1.42273C8.15595 1.97285 7.96047 2.62438 7.96938 3.28922V4.01371C6.69619 4.04672 5.43459 3.76435 4.29695 3.19174C3.15931 2.61913 2.18094 1.77405 1.44898 0.731774C1.44898 0.731774 -1.44898 7.25217 5.07142 10.1501C3.57936 11.1629 1.80192 11.6708 0 11.5991C6.5204 15.2216 14.4898 11.5991 14.4898 3.26749C14.4891 3.06568 14.4697 2.86438 14.4318 2.66616C15.1712 1.93696 15.693 1.01629 15.9388 0.00728525Z" fill="white"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="Enter your Twitter url"
                        value={twitterUrl}
                      />
                      <svg
                        width="17"
                        height="15"
                        viewBox="0 0 17 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 8.36364L5.46667 12L15 2"
                          stroke="#3333FF"
                          stroke-width="3"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <button
                    onClick={() => {
                      phylloSDKConnect(
                        process.env.REACT_APP_PHYLLO_TWITTER_PLATFORM_ID
                      );
                    }}
                    className="btn-continue btn-insta"
                  >
                    <svg style={{ marginRight: 8 }} width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.9388 0.00728525C15.245 0.496661 14.4768 0.870955 13.6639 1.11575C13.2275 0.614053 12.6476 0.25846 12.0026 0.0970684C11.3576 -0.064323 10.6786 -0.023726 10.0574 0.213369C9.43623 0.450463 8.90284 0.872616 8.5294 1.42273C8.15595 1.97285 7.96047 2.62438 7.96938 3.28922V4.01371C6.69619 4.04672 5.43459 3.76435 4.29695 3.19174C3.15931 2.61913 2.18094 1.77405 1.44898 0.731774C1.44898 0.731774 -1.44898 7.25217 5.07142 10.1501C3.57936 11.1629 1.80192 11.6708 0 11.5991C6.5204 15.2216 14.4898 11.5991 14.4898 3.26749C14.4891 3.06568 14.4697 2.86438 14.4318 2.66616C15.1712 1.93696 15.693 1.01629 15.9388 0.00728525Z" fill="white"/>
                    </svg>
                    Connect Twitter
                  </button>     
                  )}
                </>
              )}

              {isInstagramNeeded && (
                <>
                  {isInstagramSelected ? (
                    <div className="social-input">
                      {/* <img src="/images/instagram.png" alt="" /> */}
                      <svg
                      style={{ marginRight: 8 }}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.2525 5H8.4175C6.53007 5 5 6.53007 5 8.4175V15.2525C5 17.1399 6.53007 18.67 8.4175 18.67H15.2525C17.1399 18.67 18.67 17.1399 18.67 15.2525V8.4175C18.67 6.53007 17.1399 5 15.2525 5ZM12.205 9.49475C11.7194 9.42274 11.2234 9.50568 10.7877 9.73179C10.3519 9.9579 9.99853 10.3156 9.77781 10.7542C9.5571 11.1927 9.48027 11.6896 9.55827 12.1743C9.63626 12.659 9.8651 13.1068 10.2122 13.4539C10.5594 13.801 11.0071 14.0299 11.4918 14.1079C11.9765 14.1859 12.4735 14.109 12.912 13.8883C13.3505 13.6676 13.7082 13.3142 13.9343 12.8785C14.1604 12.4427 14.2434 11.9468 14.1714 11.4611C14.0979 10.9658 13.8671 10.5072 13.513 10.1531C13.1589 9.79902 12.7003 9.5682 12.205 9.49475ZM10.4192 9.02169C11.0043 8.71809 11.6703 8.60671 12.3223 8.7034C12.9875 8.80203 13.6032 9.11197 14.0787 9.58743C14.5542 10.0629 14.8641 10.6787 14.9627 11.3438C15.0594 11.9959 14.948 12.6618 14.6444 13.2469C14.3408 13.832 13.8605 14.3065 13.2716 14.6029C12.6828 14.8993 12.0155 15.0024 11.3647 14.8977C10.7139 14.793 10.1127 14.4857 9.64655 14.0196C9.18043 13.5535 8.87315 12.9522 8.76843 12.3014C8.6637 11.6506 8.76686 10.9833 9.06323 10.3945C9.35959 9.80567 9.83408 9.3253 10.4192 9.02169ZM15.5899 7.57033C15.3138 7.57033 15.0899 7.79418 15.0899 8.07033C15.0899 8.34647 15.3138 8.57033 15.5899 8.57033H15.596C15.8721 8.57033 16.096 8.34647 16.096 8.07033C16.096 7.79418 15.8721 7.57033 15.596 7.57033H15.5899Z"
                        fill="white"
                      />
                    </svg>
                      <input
                        type="text"
                        placeholder="Enter your Instagram url"
                        value={instagramUrl}
                      />
                      <svg
                        width="17"
                        height="15"
                        viewBox="0 0 17 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 8.36364L5.46667 12L15 2"
                          stroke="#3333FF"
                          stroke-width="3"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <button
                    onClick={() => {
                      phylloSDKConnect(
                        process.env.REACT_APP_PHYLLO_INSTAGRAM_PLATFORM_ID
                      );
                    }}
                    className="btn-continue btn-insta"
                  >
                    <svg style={{marginRight: "0.5rem"}} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7525 5H8.9175C7.03007 5 5.5 6.53007 5.5 8.4175V15.2525C5.5 17.1399 7.03007 18.67 8.9175 18.67H15.7525C17.6399 18.67 19.17 17.1399 19.17 15.2525V8.4175C19.17 6.53007 17.6399 5 15.7525 5ZM12.705 9.49475C12.2194 9.42274 11.7234 9.50568 11.2877 9.73179C10.8519 9.9579 10.4985 10.3156 10.2778 10.7542C10.0571 11.1927 9.98027 11.6896 10.0583 12.1743C10.1363 12.659 10.3651 13.1068 10.7122 13.4539C11.0594 13.801 11.5071 14.0299 11.9918 14.1079C12.4765 14.1859 12.9735 14.109 13.412 13.8883C13.8505 13.6676 14.2082 13.3142 14.4343 12.8785C14.6604 12.4427 14.7434 11.9468 14.6714 11.4611C14.5979 10.9658 14.3671 10.5072 14.013 10.1531C13.6589 9.79902 13.2003 9.5682 12.705 9.49475ZM10.9192 9.02169C11.5043 8.71809 12.1703 8.60671 12.8223 8.7034C13.4875 8.80203 14.1032 9.11197 14.5787 9.58743C15.0542 10.0629 15.3641 10.6787 15.4627 11.3438C15.5594 11.9959 15.448 12.6618 15.1444 13.2469C14.8408 13.832 14.3605 14.3065 13.7716 14.6029C13.1828 14.8993 12.5155 15.0024 11.8647 14.8977C11.2139 14.793 10.6127 14.4857 10.1466 14.0196C9.68043 13.5535 9.37315 12.9522 9.26843 12.3014C9.1637 11.6506 9.26686 10.9833 9.56323 10.3945C9.85959 9.80567 10.3341 9.3253 10.9192 9.02169ZM16.0899 7.57033C15.8138 7.57033 15.5899 7.79418 15.5899 8.07033C15.5899 8.34647 15.8138 8.57033 16.0899 8.57033H16.096C16.3721 8.57033 16.596 8.34647 16.596 8.07033C16.596 7.79418 16.3721 7.57033 16.096 7.57033H16.0899Z" fill="white"/>
                    </svg>
                    <span>Connect Instagram</span>
                  </button>
                  // <InstagramLogin
                  //         clientId={process.env.REACT_APP_INSTAGRAM_CLIENT_ID}
                  //         buttonText="Login"
                  //         onSuccess={instagramLogin}
                  //         onFailure={instagramLogin}
                  //         cssClass="btn-continue btn-twitter"
                  //     >
                  //       {/* <InstagramIcon style={{marginRight: "0.5rem"}}/> */}
                  //       <svg style={{marginRight: "0.5rem"}} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  //           <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7525 5H8.9175C7.03007 5 5.5 6.53007 5.5 8.4175V15.2525C5.5 17.1399 7.03007 18.67 8.9175 18.67H15.7525C17.6399 18.67 19.17 17.1399 19.17 15.2525V8.4175C19.17 6.53007 17.6399 5 15.7525 5ZM12.705 9.49475C12.2194 9.42274 11.7234 9.50568 11.2877 9.73179C10.8519 9.9579 10.4985 10.3156 10.2778 10.7542C10.0571 11.1927 9.98027 11.6896 10.0583 12.1743C10.1363 12.659 10.3651 13.1068 10.7122 13.4539C11.0594 13.801 11.5071 14.0299 11.9918 14.1079C12.4765 14.1859 12.9735 14.109 13.412 13.8883C13.8505 13.6676 14.2082 13.3142 14.4343 12.8785C14.6604 12.4427 14.7434 11.9468 14.6714 11.4611C14.5979 10.9658 14.3671 10.5072 14.013 10.1531C13.6589 9.79902 13.2003 9.5682 12.705 9.49475ZM10.9192 9.02169C11.5043 8.71809 12.1703 8.60671 12.8223 8.7034C13.4875 8.80203 14.1032 9.11197 14.5787 9.58743C15.0542 10.0629 15.3641 10.6787 15.4627 11.3438C15.5594 11.9959 15.448 12.6618 15.1444 13.2469C14.8408 13.832 14.3605 14.3065 13.7716 14.6029C13.1828 14.8993 12.5155 15.0024 11.8647 14.8977C11.2139 14.793 10.6127 14.4857 10.1466 14.0196C9.68043 13.5535 9.37315 12.9522 9.26843 12.3014C9.1637 11.6506 9.26686 10.9833 9.56323 10.3945C9.85959 9.80567 10.3341 9.3253 10.9192 9.02169ZM16.0899 7.57033C15.8138 7.57033 15.5899 7.79418 15.5899 8.07033C15.5899 8.34647 15.8138 8.57033 16.0899 8.57033H16.096C16.3721 8.57033 16.596 8.34647 16.596 8.07033C16.596 7.79418 16.3721 7.57033 16.096 7.57033H16.0899Z" fill="white"/>
                  //       </svg>
                  //       <span>Connect Instagram</span>
                  //     </InstagramLogin>
                  )}
                </>
              )}

              {isYoutubeNeeded && (
                <>
                  {isYoutubeSelected ? (
                    <div className="social-input">
                      {/* <img src="/images/instagram.png" alt="" /> */}
                      <svg style={{ marginRight: "8px" }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.9966 6.00125C21.2907 6.30452 21.4997 6.68004 21.6023 7.08989C21.8762 8.60869 22.0092 10.1496 21.9995 11.6928C22.005 13.213 21.872 14.7306 21.6023 16.2267C21.4997 16.6365 21.2907 17.0121 20.9966 17.3153C20.7024 17.6186 20.3334 17.8389 19.9269 17.9539C18.4415 18.3511 12.5 18.3511 12.5 18.3511C12.5 18.3511 6.55849 18.3511 5.07311 17.9539C4.67484 17.8449 4.31141 17.635 4.01793 17.3446C3.72445 17.0541 3.51084 16.6929 3.39775 16.2958C3.12379 14.777 2.9908 13.2361 3.00049 11.6928C2.99293 10.1611 3.1259 8.63188 3.39775 7.12443C3.50033 6.71458 3.70926 6.33906 4.00342 6.0358C4.29759 5.73253 4.66658 5.51227 5.07311 5.39725C6.55849 5 12.5 5 12.5 5C12.5 5 18.4415 5 19.9269 5.36271C20.3334 5.47773 20.7024 5.69799 20.9966 6.00125ZM15.5235 11.6922L10.5578 14.5161V8.86822L15.5235 11.6922Z" fill="white"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="Enter your Youtube url"
                        value={youtubeUrl}
                      />
                      <svg
                        width="17"
                        height="15"
                        viewBox="0 0 17 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 8.36364L5.46667 12L15 2"
                          stroke="#3333FF"
                          stroke-width="3"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <button
                    onClick={() => {
                      phylloSDKConnect(
                        process.env.REACT_APP_PHYLLO_YOUTUBE_PLATFORM_ID
                      );
                    }}
                    className="btn-continue btn-insta"
                  >
                    <svg style={{ marginRight: "8px" }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M20.9966 6.00125C21.2907 6.30452 21.4997 6.68004 21.6023 7.08989C21.8762 8.60869 22.0092 10.1496 21.9995 11.6928C22.005 13.213 21.872 14.7306 21.6023 16.2267C21.4997 16.6365 21.2907 17.0121 20.9966 17.3153C20.7024 17.6186 20.3334 17.8389 19.9269 17.9539C18.4415 18.3511 12.5 18.3511 12.5 18.3511C12.5 18.3511 6.55849 18.3511 5.07311 17.9539C4.67484 17.8449 4.31141 17.635 4.01793 17.3446C3.72445 17.0541 3.51084 16.6929 3.39775 16.2958C3.12379 14.777 2.9908 13.2361 3.00049 11.6928C2.99293 10.1611 3.1259 8.63188 3.39775 7.12443C3.50033 6.71458 3.70926 6.33906 4.00342 6.0358C4.29759 5.73253 4.66658 5.51227 5.07311 5.39725C6.55849 5 12.5 5 12.5 5C12.5 5 18.4415 5 19.9269 5.36271C20.3334 5.47773 20.7024 5.69799 20.9966 6.00125ZM15.5235 11.6922L10.5578 14.5161V8.86822L15.5235 11.6922Z" fill="white"/>
                </svg>
                <span>Connect Youtube</span>
                  </button>
                  )}
                </>
              )}

              {isTwitchNeeded && (
                <>
                  {isTwitchSelected ? (
                    <div className="social-input">
                      {/* <img src="/images/twitch_icon.png" alt="" /> */}
                      <svg style={{marginRight: '8px'}} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.29995 3.2002L3.69995 6.4002V19.2002H7.69995V21.6002H10.9L13.3 19.2002H16.5L21.3 14.4002V3.2002H5.29995ZM6.89995 4.8002H19.7V13.6002L17.3 16.0002H12.5L10.1 18.4002V16.0002H6.89995V4.8002ZM10.9 7.2002V12.8002H12.5V7.2002H10.9ZM14.1 7.2002V12.8002H15.7V7.2002H14.1Z" fill="white"/>
                      </svg>

                      <input
                        type="text"
                        placeholder="Enter your Twitch url"
                        value={twitchUrl}
                      />
                      <svg
                        width="17"
                        height="15"
                        viewBox="0 0 17 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 8.36364L5.46667 12L15 2"
                          stroke="#3333FF"
                          stroke-width="3"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <button
                    onClick={() => {
                      phylloSDKConnect(
                        process.env.REACT_APP_PHYLLO_TWITCH_PLATFORM_ID
                      );
                    }}
                    className="btn-continue btn-insta"
                  >
                    <svg style={{marginRight: '8px'}} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.29995 3.2002L3.69995 6.4002V19.2002H7.69995V21.6002H10.9L13.3 19.2002H16.5L21.3 14.4002V3.2002H5.29995ZM6.89995 4.8002H19.7V13.6002L17.3 16.0002H12.5L10.1 18.4002V16.0002H6.89995V4.8002ZM10.9 7.2002V12.8002H12.5V7.2002H10.9ZM14.1 7.2002V12.8002H15.7V7.2002H14.1Z" fill="white"/>
                    </svg>
                    Connect Twitch
                  </button>     
                  )}
                </>
              )}

              {isTiktokNeeded && (
                <>
                  {isTiktokSelected ? (
                    <div className="social-input">
                      <svg style={{marginRight: '8px'}} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M8.84918 1.17129C8.95906 1.06162 9.10797 1.00002 9.26322 1H11.6169C11.7618 1.00008 11.9016 1.05383 12.0092 1.15086C12.1168 1.2479 12.1846 1.38135 12.1997 1.52547C12.3914 3.35173 13.8607 4.78758 15.7039 4.91982C15.8517 4.93054 15.99 4.99684 16.0908 5.10538C16.1917 5.21391 16.2478 5.35663 16.2477 5.50482V8.24205C16.2477 8.38822 16.1931 8.52913 16.0947 8.63714C15.9962 8.74515 15.8609 8.81247 15.7154 8.82591C15.5697 8.83932 15.4175 8.8488 15.2574 8.8488C14.084 8.8488 13.0213 8.41683 12.1687 7.7349V13.0388C12.1687 16.1158 9.66125 18.6232 6.58437 18.6232C3.50741 18.6232 1 16.1158 1 13.0388C1 9.96183 3.50741 7.45443 6.58437 7.45443C6.69166 7.45443 6.78444 7.46119 6.86312 7.46693C6.88671 7.46865 6.90903 7.47027 6.9301 7.4716C7.07892 7.48093 7.21859 7.54662 7.32067 7.6553C7.42276 7.76399 7.4796 7.90749 7.47961 8.05659V10.5191C7.47971 10.602 7.4622 10.684 7.42826 10.7597C7.39432 10.8353 7.34472 10.9029 7.28272 10.958C7.22072 11.0131 7.14774 11.0544 7.0686 11.0792C6.98947 11.1039 6.90597 11.1117 6.82364 11.1018C6.78033 11.0966 6.74312 11.0918 6.71142 11.0876C6.64969 11.0796 6.60882 11.0743 6.58437 11.0743C5.49193 11.0743 4.61988 11.9464 4.61988 13.0388C4.61988 14.1312 5.49193 15.0044 6.58437 15.0044C7.68559 15.0044 8.65189 14.1349 8.65189 13.0709C8.65189 13.014 8.65302 12.3311 8.65533 11.2518C8.65643 10.7338 8.65787 10.1344 8.65941 9.49266C8.66108 8.79699 8.66287 8.05167 8.66449 7.30675C8.67064 4.44256 8.67708 1.585 8.67708 1.585C8.6774 1.42975 8.73929 1.28096 8.84918 1.17129ZM4.8688 9.01728C5.30167 8.8806 5.78024 8.79324 6.30733 8.76929V8.68281C5.79993 8.71579 5.31562 8.83164 4.8688 9.01728Z" fill="white"/>
                      </svg>

                      <input
                        type="text"
                        placeholder="Enter your Tiktok url"
                        value={tiktokUrl}
                      />
                      <svg
                        width="17"
                        height="15"
                        viewBox="0 0 17 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 8.36364L5.46667 12L15 2"
                          stroke="#3333FF"
                          stroke-width="3"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <button
                    onClick={() => {
                      phylloSDKConnect(
                        process.env.REACT_APP_PHYLLO_TIKTOK_PLATFORM_ID
                      );
                    }}
                    className="btn-continue btn-insta"
                  >
                    <svg style={{marginRight: '8px'}} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.84918 1.17129C8.95906 1.06162 9.10797 1.00002 9.26322 1H11.6169C11.7618 1.00008 11.9016 1.05383 12.0092 1.15086C12.1168 1.2479 12.1846 1.38135 12.1997 1.52547C12.3914 3.35173 13.8607 4.78758 15.7039 4.91982C15.8517 4.93054 15.99 4.99684 16.0908 5.10538C16.1917 5.21391 16.2478 5.35663 16.2477 5.50482V8.24205C16.2477 8.38822 16.1931 8.52913 16.0947 8.63714C15.9962 8.74515 15.8609 8.81247 15.7154 8.82591C15.5697 8.83932 15.4175 8.8488 15.2574 8.8488C14.084 8.8488 13.0213 8.41683 12.1687 7.7349V13.0388C12.1687 16.1158 9.66125 18.6232 6.58437 18.6232C3.50741 18.6232 1 16.1158 1 13.0388C1 9.96183 3.50741 7.45443 6.58437 7.45443C6.69166 7.45443 6.78444 7.46119 6.86312 7.46693C6.88671 7.46865 6.90903 7.47027 6.9301 7.4716C7.07892 7.48093 7.21859 7.54662 7.32067 7.6553C7.42276 7.76399 7.4796 7.90749 7.47961 8.05659V10.5191C7.47971 10.602 7.4622 10.684 7.42826 10.7597C7.39432 10.8353 7.34472 10.9029 7.28272 10.958C7.22072 11.0131 7.14774 11.0544 7.0686 11.0792C6.98947 11.1039 6.90597 11.1117 6.82364 11.1018C6.78033 11.0966 6.74312 11.0918 6.71142 11.0876C6.64969 11.0796 6.60882 11.0743 6.58437 11.0743C5.49193 11.0743 4.61988 11.9464 4.61988 13.0388C4.61988 14.1312 5.49193 15.0044 6.58437 15.0044C7.68559 15.0044 8.65189 14.1349 8.65189 13.0709C8.65189 13.014 8.65302 12.3311 8.65533 11.2518C8.65643 10.7338 8.65787 10.1344 8.65941 9.49266C8.66108 8.79699 8.66287 8.05167 8.66449 7.30675C8.67064 4.44256 8.67708 1.585 8.67708 1.585C8.6774 1.42975 8.73929 1.28096 8.84918 1.17129ZM4.8688 9.01728C5.30167 8.8806 5.78024 8.79324 6.30733 8.76929V8.68281C5.79993 8.71579 5.31562 8.83164 4.8688 9.01728Z" fill="white"/>
                    </svg>
                    Connect TikTok
                  </button>     
                  )}
                </>
              )}
            </div>
            <button
              className={`btn-continue ${continueDisabled ? "disabled" : ""}`}
              onClick={() => {
                submitContinue();
              }}
              disabled={continueDisabled}
            >
              Continue
            </button>

            <button
              className="btn-continue btn-later"
              onClick={() => {
                history.goBack();
              }}
            >
              CANCEL
            </button>
          </div>
        </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default React.memo(SubmitSocialConnect);
