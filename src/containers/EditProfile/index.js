import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

import React, { useEffect, useState } from "react";

import { useHistory } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import { useSnackbar } from "notistack";
import S3 from "react-aws-s3";
import LoadingOverlay from "react-loading-overlay";
import { networks } from "../../constants/networks";
import { UserService } from "../../services/user.service";
import { setUserData } from "../../redux/actions/authAction";
// import {
//   createUser,
//   createUserToken,
//   getUserProfile,
// } from "../../services/sociallink.service";
import {
  isInstagramLinked,
  isTwitterLinked,
  isYoutubeLinked,
  isTwitchLinked,
  isTiktokLinked,
} from "../../common/utils";
import { DebounceInput } from "react-debounce-input";

import "./style.scss";
import Dropzone from "react-dropzone";
import { S3Config } from "../../config";
import { SET_USER_DATA } from "../../redux/constants";
// import TwitterLogin from "../../components/TwitterLogin";
// import TwitchLogin from "components/TwitchLogin";
// import { InstagramLogin } from "@amraneze/react-instagram-login";
import CloseIcon from "@material-ui/icons/Close";
import { Spinner } from "react-bootstrap";
// import YoutubeButton from "components/SocialConnectPage/YoutubeButton";
// import { YouTube } from "@material-ui/icons";
import { PhylloService } from "services/phyllo.service";
import { printLog } from 'utils/printLog';

const notificationConfig = {
  preventDuplicate: true,
  vertical: "bottom",
  horizontal: "right",
};

const supportedExtForProfile = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const EditProfile = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const web3connected = useSelector((state) => state.web3.web3connected);
  const loggedInUserData = useSelector((state) => state.auth.userData);

  const [name, setName] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [url, setUrl] = useState("");
  const [bio, setBio] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [email, setEmail] = useState("");
  const [twitterAccount, setTwitterAccount] = useState("");
  const [tiktokAccount, setTiktokAccount] = useState("");
  const [instagramAccount, setInstagramAccount] = useState("");
  const [youtubeAccount, setYoutubeAccount] = useState("");
  const [avatarImage, setAvatarImg] = useState("");
  const [_isTwitterLinked, setTwitterLinked] = useState(false);

  const [_isInstagramLinked, setInstagramLinked] = useState(false);
  const [_isYoutubeLinked, setYoutubeLinked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bioWordCount, setBioWordCount] = useState(0);

  const [twitchAccount, setTwitchAccount] = useState("");
  const [_isTwitchLinked, setTwitchLinked] = useState(false);
  const [_isTiktokLinked, setTiktokLinked] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const history = useHistory();
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [verifyURL, setVerifyURL] = useState("");
  const network = useSelector((state) => state.web3.network);

  const [nameChangeChangeText, setNameChangeText] = useState(
    "Enter your display name"
  );
  const [nameChangeSuccess, setNameChangeSuccess] = useState("");
  const [isUsernameValidating, setIsUsernameValidating] = useState(false);

  const default_backend_url = network
    ? network.backendUrl
    : networks[process.env.REACT_APP_DEFAULT_NETWORK].backendUrl;

  const userService = new UserService(default_backend_url);
  const phylloService = new PhylloService(default_backend_url);

  const fetchTokenURL = default_backend_url + "/auth/twitter/request_token";
  const loginUrl = default_backend_url + "/auth/twitter/access_token";

  // const [myTimer, setMyTimer] = useState(null);

  // const onTwitterSuccess = async (response) => {
  //   response.json().then(async (twitterData) => {
  //     if (twitterData) {
  //       const tUrl = "https://twitter.com/" + twitterData.screen_name;
  //       let _user = {
  //         id: loggedInUserData.id,
  //         twitter_url: tUrl,
  //       };
  //       setIsLoading(true);
  //       let response = await userService.updateUser(_user);
  //       if (response) {
  //         setUserData((prevState) => ({
  //           ...prevState,
  //           twitter_url: tUrl,
  //         }));
  //         dispatch({
  //           type: SET_USER_DATA,
  //           payload: { ...loggedInUserData, twitter_url: tUrl },
  //         });
  //       }
  //       setIsLoading(false);
  //     }
  //   });
  // };

  // const updateYoutubeInfo = async (youtube_url) => {
  //   if (youtube_url) {
  //     let _user = {
  //       id: loggedInUserData.id,
  //       youtube_url: youtube_url,
  //     };
  //     setIsLoading(true);
  //     let response = await userService.updateUser(_user);
  //     if (response) {
  //       setUserData((prevState) => ({
  //         ...prevState,
  //         youtube_url: youtube_url,
  //       }));
  //       dispatch({
  //         type: SET_USER_DATA,
  //         payload: { ...loggedInUserData, youtube_url: youtube_url },
  //       });
  //     }
  //     setIsLoading(false);
  //   }
  // };

  // const onTwitterFailed = (error) => {
  //   showNotification(error.message);
  // };

  // const onTwitchSuccess = async (twitch_user) => {
  //   if (twitch_user) {
  //     const tUrl = "https://twitch.tv/" + twitch_user;
  //     let _user = {
  //       id: loggedInUserData.id,
  //       twitch_url: tUrl,
  //     };
  //     setIsLoading(true);
  //     let response = await userService.updateUser(_user);
  //     if (response) {
  //       setUserData((prevState) => ({
  //         ...prevState,
  //         twitch_url: tUrl,
  //       }));
  //       dispatch({
  //         type: SET_USER_DATA,
  //         payload: { ...loggedInUserData, twitch_url: tUrl },
  //       });
  //     }
  //     setIsLoading(false);
  //   }
  // };

  // const onTwitchFailed = (error) => {
  //   showNotification(error.message);
  // };

  // const instagramLogin = async (code) => {

  //   if (code.error != null) {
  //     showNotification(code.error_description);
  //     return;
  //   }

  //   const instgramData = await userService.getInstagramAccessToken({
  //     code: code,
  //     redirect_url: window.location.href,
  //   });
  //   if (instgramData) {
  //     const iUrl = "https://www.instagram.com/" + instgramData.username;
  //     let _user = {
  //       id: loggedInUserData.id,
  //       instagram_url: iUrl,
  //     };
  //     setIsLoading(true);
  //     let response = await userService.updateUser(_user);
  //     if (response) {
  //       setUserData((prevState) => ({
  //         ...prevState,
  //         instagram_url: iUrl,
  //       }));
  //       dispatch({
  //         type: SET_USER_DATA,
  //         payload: { ...loggedInUserData, instagram_url: iUrl },
  //       });
  //     }
  //     setIsLoading(false);
  //   }
  // };

  const phylloSDKConnect = async (workPlatformId = null) => {
    setIsLoading(true);
    try {
      
      // const timeStamp = new Date();

      // const userId = await createUser(loggedInUserData.username, timeStamp.getTime());
      // const token = await createUserToken(userId);

      const phylloData = await phylloService.createToken({user_id: loggedInUserData.id, platform_id: workPlatformId})

      printLog(["phylloData", phylloData], 'success');

      if(!phylloData) {
        setIsLoading(false);
        showNotification('internal error occurred.');
        return;
      }

      const env = process.env.REACT_APP_PHYLLO_ENVIRONMENT;
      const appName = process.env.REACT_APP_PHYLLO_APP_NAME;

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
          setIsLoading(false);
          getUserProfileData(accountId);
        }
      );
      phylloConnect.on(
        "accountDisconnected",
        (accountId, workplatformId, userId) => {
          setIsLoading(false);
          printLog(
            [`onAccountDisconnected: ${accountId}, ${workplatformId}, ${userId}`], 'success'
          );
        }
      );
      phylloConnect.on("tokenExpired", (userId) => {
        setIsLoading(false);
        printLog([`onTokenExpired: ${userId}`]);
      });
      phylloConnect.on("exit", (reason, userId) => {
        printLog([`onExit: ${reason}, ${userId}`]);
        setIsLoading(false);
        // showNotification(reason);
      });
      phylloConnect.on(
        "connectionFailure",
        (reason, workplatformId, userId) => {
          setIsLoading(false);
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
    let _user = {
      id: loggedInUserData.id,
      twitter_url: tUrl,
    };
    setIsLoading(true);
    let response = await userService.updateUser(_user);
    if (response) {
      setUserData((prevState) => ({
        ...prevState,
        twitter_url: tUrl,
      }));
      dispatch({
        type: SET_USER_DATA,
        payload: { ...loggedInUserData, twitter_url: tUrl },
      });
    }
    setIsLoading(false);
  };

  const onInstagram = async (iUrl) => {
    printLog(["onInstagram", iUrl], 'success');

    let _user = {
      id: loggedInUserData.id,
      instagram_url: iUrl,
    };
    setIsLoading(true);
    let response = await userService.updateUser(_user);
    if (response) {
      setUserData((prevState) => ({
        ...prevState,
        instagram_url: iUrl,
      }));
      dispatch({
        type: SET_USER_DATA,
        payload: { ...loggedInUserData, instagram_url: iUrl },
      });
    }
    setIsLoading(false);
  };

  const onTwitch = async (tUrl) => {
    printLog(["twitch_user", tUrl], 'success');
    if (tUrl) {
      let _user = {
        id: loggedInUserData.id,
        twitch_url: tUrl,
      };
      setIsLoading(true);
      let response = await userService.updateUser(_user);
      if (response) {
        setUserData((prevState) => ({
          ...prevState,
          twitch_url: tUrl,
        }));
        dispatch({
          type: SET_USER_DATA,
          payload: { ...loggedInUserData, twitch_url: tUrl },
        });
      }
      setIsLoading(false);
    }
  };

  const onYoutube = async (youtube_url) => {
    printLog(["youtube_url", youtube_url], 'success');
    if (youtube_url) {
      let _user = {
        id: loggedInUserData.id,
        youtube_url: youtube_url,
      };
      setIsLoading(true);
      let response = await userService.updateUser(_user);
      if (response) {
        setUserData((prevState) => ({
          ...prevState,
          youtube_url: youtube_url,
        }));
        dispatch({
          type: SET_USER_DATA,
          payload: { ...loggedInUserData, youtube_url: youtube_url },
        });
      }
      setIsLoading(false);
    }
  };

  const onTiktok = async (tiktok_url) => {
    printLog(["tiktok_url", tiktok_url], 'success');
    if (tiktok_url) {
      let _user = {
        id: loggedInUserData.id,
        tiktok_url: tiktok_url,
      };
      setIsLoading(true);
      let response = await userService.updateUser(_user);
      if (response) {
        setUserData((prevState) => ({
          ...prevState,
          tiktok_url: tiktok_url,
        }));
        dispatch({
          type: SET_USER_DATA,
          payload: { ...loggedInUserData, tiktok_url: tiktok_url },
        });
      }
      setIsLoading(false);
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

  const handleVerifyDialogClose = () => {
    setVerifyDialogOpen(false);
  };

  useEffect(() => {
    printLog(["loggedInUserData1", loggedInUserData], 'success');

    if (loggedInUserData && loggedInUserData.id) {
      // if (myTimer) {
      //   clearTimeout(myTimer);
      //   setMyTimer(null);
      // }
      if (!name) {
        setName(loggedInUserData.username);
      }
      setfirstname(loggedInUserData.firstname);
      setlastname(loggedInUserData.lastname);
      setUrl(loggedInUserData.url);
      if (!bio) {
        setBio(loggedInUserData.bio);
      }
      if (!portfolio) {
        setPortfolio(loggedInUserData.portfolio_url);
      }
      setEmail(loggedInUserData.email);
      setTwitterAccount(loggedInUserData.twitter_url);
      setTiktokAccount(loggedInUserData.tiktok_url);
      setInstagramAccount(loggedInUserData.instagram_url);
      setAvatarImg(loggedInUserData.avatar_img);
      setYoutubeAccount(loggedInUserData.youtube_url);
      setTwitchAccount(loggedInUserData.twitch_url);

      if (isTwitterLinked(loggedInUserData.twitter_url)) {
        setTwitterLinked(true);
      }

      if (isInstagramLinked(loggedInUserData.instagram_url)) {
        setInstagramLinked(true);
      }

      if (isYoutubeLinked(loggedInUserData.youtube_url)) {
        setYoutubeLinked(true);
      }

      if (isTwitchLinked(loggedInUserData.twitch_url)) {
        setTwitchLinked(true);
      }

      if (isTiktokLinked(loggedInUserData.tiktok_url)) {
        setTiktokLinked(true);
      }
    }
    // else {
    //   const timer = setTimeout(()=>{
    //     if (!loggedInUserData || !loggedInUserData.id) {
    //       history.push("/discover");
    //     }
    //   }, 5000);
    //   setMyTimer(timer);
    // }
  }, [loggedInUserData]);

  useEffect(() => {
    if (name && firstname && lastname && email) {
      setCanSave(true);
    } else {
      setCanSave(false);
    }
  }, [firstname, lastname, email, name]);

  useEffect(() => {
    /* eslint-disable */
    const emailRegex =
      /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (email && emailRegex.test(email)) {
      //setConfirm(true);
    }
  }, [email]);

  const handleUpdate = async () => {
    if (web3connected) {
      if (nameChangeSuccess == "failed") {
        return;
      }

      const urlRegex1 =
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
      if (twitterAccount && !urlRegex1.test(twitterAccount)) {
        showNotification("Either leave Twitter URL empty or enter valid URL.");
        return;
      } else {
        if (twitterAccount && !twitterAccount.includes("twitter.com")) {
          showNotification(
            "Either leave Twitter URL empty or enter valid URL."
          );
          return;
        }
      }

      const urlRegex2 =
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
      if (tiktokAccount && !urlRegex2.test(tiktokAccount)) {
        showNotification("Either leave Tiktok URL empty or enter valid URL.");
        return;
      } else {
        if (tiktokAccount && !tiktokAccount.includes("tiktok.com")) {
          showNotification("Either leave Tiktok URL empty or enter valid URL.");
          return;
        }
      }

      const urlRegex3 =
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
      if (instagramAccount && !urlRegex3.test(instagramAccount)) {
        showNotification(
          "Either leave Instagram URL empty or enter valid URL."
        );
        return;
      } else {
        if (instagramAccount && !instagramAccount.includes("instagram.com")) {
          showNotification(
            "Either leave Instagram URL empty or enter valid URL."
          );
          return;
        }
      }

      const urlRegex4 =
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
      printLog(["portfolio", portfolio], 'success');
      if (portfolio && !urlRegex4.test(portfolio)) {
        showNotification(
          "Either leave Portfolio URL empty or enter valid URL."
        );
        return;
      }

      let user = {
        bio: bio,
        email: email,
        firstname: firstname,
        lastname: lastname,
        portfolio_url: portfolio,
        tiktok_url: tiktokAccount,
        twitter_url: twitterAccount,
        instagram_url: instagramAccount,
        username: name,
        url: url,
        id: loggedInUserData.id,
        avatar_img: avatarImage,
      };
      setIsLoading(true);
      let response = await userService.updateUser(user);
      if (response) {
        dispatch(setUserData({ ...loggedInUserData, ...user }));
        history.push(`/profile/${loggedInUserData.address}`);
      } else {
        showNotification(
          "Something went wrong, please try after sign out and connect again."
        );
      }
      setIsLoading(false);
    }
  };

  const showNotification = (msg, variant = "") => {
    enqueueSnackbar(msg, {
      ...notificationConfig,
      variant: variant ? variant : "error",
    });
  };

  const getDropzoneImageRatio = (file, callback = () => {}) => {
    const i = new Image();
    i.src = file.preview;

    i.onload = () => {
      const ratio = i.width / i.height;
      callback(ratio);
    };
  };

  const handleFileUpload = async (files, comingFor) => {
    if (files.length > 0) {
      if (!supportedExtForProfile.includes(files[0].type)) {
        showNotification(
          "You can only select .png, .jpg, .jpeg file for profile images."
        );
        return;
      }
      if (files[0].size > 104857600) {
        showNotification("File size can be max 100MB");
        return;
      }

      getDropzoneImageRatio(files[0], (ratio) => {
        if (comingFor === "isCover" && (ratio < 2 || ratio > 4)) {
          showNotification(
            "Cover image width, height ratio should be between 2 and 4."
          );
        } else if (comingFor === "isProfile" && (ratio < 0.5 || ratio > 2)) {
          showNotification(
            "Profile avatar width, height ratio should be between .5 and 2."
          );
        } else {
          setIsLoading(true);
          let _file = files[0];
          const ReactS3Client = new S3(S3Config);
          ReactS3Client.uploadFile(_file, _file.name).then(async (data) => {
            if (data.status === 204) {
              if (comingFor === "isCover") {
                let _user = {
                  id: loggedInUserData.id,
                  back_img: data.location,
                };

                let response = await userService.updateUser(_user);
                if (response) {
                  setUserData((prevState) => ({
                    ...prevState,
                    back_img: data.location,
                  }));

                  dispatch({
                    type: SET_USER_DATA,
                    payload: { ...loggedInUserData, back_img: data.location },
                  });
                }
                setIsLoading(false);
              } else {
                setAvatarImg(data.location);
                let _user = {
                  id: loggedInUserData.id,
                  avatar_img: data.location,
                };
                let response = await userService.updateUser(_user);
                if (response) {
                  setUserData((prevState) => ({
                    ...prevState,
                    avatar_img: data.location,
                  }));
                  dispatch({
                    type: SET_USER_DATA,
                    payload: { ...loggedInUserData, avatar_img: data.location },
                  });
                }
                setIsLoading(false);
              }
            } else {
              printLog(["fail"]);
              setIsLoading(false);
            }
          });
        }
      });
    }
  };

  const handleNameChange = async (event) => { 
    let _name = event.target.value;
    _name = _name.replace(/\s/g, "").toLowerCase();
    printLog(['handleNameChange', _name], 'success');
    setName(_name);

    if (_name == loggedInUserData.username || !_name) {
      setNameChangeSuccess("success");
      setNameChangeText("Enter your display name");
    } else {
      //load spinner
      setIsUsernameValidating(true);
      const checkedUser = await userService.getUserByName(_name);
      //hide spinner
      printLog(["checkedUser", checkedUser], 'success');
      if (checkedUser) {
        setNameChangeSuccess("failed");
        setNameChangeText("Sorry, that username is not available");
        setIsUsernameValidating(false);
        //red color
      } else {
        setNameChangeSuccess("success");
        setNameChangeText("Great, that username is available");
        setIsUsernameValidating(false);
        //blue color
      }
    }
  };

  return (
    <LoadingOverlay active={isLoading} spinner text="Updating...">
      <div className="profile-page">
        <div className="profile-form">
          <div className="profile-section mb-3">
            <Dropzone
              name="file"
              className="avatar-drop-zone"
              multiple={false}
              onDrop={(value) => handleFileUpload(value, "isProfile")}
            >
              <div className="cover-wrapper">
                <div className="cover-content">
                  <img
                    className="avatar"
                    src={
                      avatarImage
                        ? avatarImage
                        : "/images/default-profile-cover.png"
                    }
                    alt="avatar"
                  />
                  {/* <img src="/images/upload-green.png" alt="" /> */}
                  <svg
                    className="avatar-drop-zone"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="10.7556"
                      cy="10.7556"
                      r="10.7556"
                      fill="#4353FF"
                    />
                    <path
                      d="M10.0373 13.4758H8.56446V12.0264C8.56289 11.205 8.89454 10.4176 9.48555 9.83908L13.3334 6.05078H13.5943C14.9838 6.05078 16.1092 7.15834 16.1092 8.52578V8.78256L12.2614 12.5693C11.6735 13.1525 10.8719 13.4789 10.0373 13.4758ZM9.82192 12.2383H10.0373C10.5387 12.2398 11.0181 12.0434 11.3717 11.6938L14.8298 8.29066C14.7323 7.79411 14.3378 7.40584 13.8332 7.30994L10.3752 10.7131C10.02 11.0611 9.82035 11.5329 9.82192 12.0264V12.2383Z"
                      fill="white"
                    />
                    <path
                      d="M13.5946 15.9516H7.30726C6.61252 15.9516 6.0498 15.3978 6.0498 14.7141V8.52656C6.0498 7.84284 6.61252 7.28906 7.30726 7.28906H9.19345V8.52656H7.30726V14.7141H13.5946V12.8578H14.852V14.7141C14.852 15.3978 14.2893 15.9516 13.5946 15.9516Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </Dropzone>

            <p className="page-title">Profile Details</p>
            <p className="page-lead">
              You can set your preferred profile details here
            </p>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="position-relative username-input">
                <DebounceInput
                  className={`form-control ${
                    nameChangeSuccess === "failed" ? "error" : ""
                  }`}
                  type="text"
                  value={name}
                  onPaste={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  minLength={2}
                  debounceTimeout={300}
                  onChange={(event) => handleNameChange(event)}
                />
                {isUsernameValidating && (
                  <div className="status">
                    <Spinner animation="border" />
                  </div>
                )}

                <span
                  className={`status ${nameChangeSuccess === "" && "d-none"}`}
                >
                  {nameChangeSuccess === "success" ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="6" cy="6" r="6" fill="#4353FF" />
                      <mask
                        id="mask0_1440_16013"
                        style={{ maskType: "alpha" }}
                        maskUnits="userSpaceOnUse"
                        x="3"
                        y="3"
                        width="6"
                        height="6"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3 3.89844H8.8V8.69844H3V3.89844Z"
                          fill="white"
                        />
                      </mask>
                      <g mask="url(#mask0_1440_16013)">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M4.01207 5.96226C3.77107 5.73466 3.39127 5.74566 3.16387 5.98646C2.93627 6.22746 2.94707 6.60726 3.18807 6.83466L4.98807 8.53466C5.24547 8.77786 5.65627 8.74626 5.87367 8.46686L8.67367 4.86686C8.87727 4.60526 8.82987 4.22826 8.56847 4.02486C8.30687 3.82146 7.92987 3.86846 7.72647 4.13006L5.33187 7.20886L4.01207 5.96226Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                  ) : nameChangeSuccess === "failed" ? (
                    <div className="icon-container">
                      <CloseIcon />
                    </div>
                  ) : null}
                </span>
              </div>

              <p
                className={`form-hint ${
                  nameChangeSuccess !== "" && nameChangeSuccess === "failed"
                    ? "error"
                    : ""
                }`}
              >
                {nameChangeChangeText}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Custom URL</label>
              <span className="prefix">bullz.nft/</span>
              <input
                className="form-control custom-url"
                type="text"
                value={name}
                readOnly
              />
            </div>

            <div className="form-group">
              <div className="d-flex align-items-center justify-content-between">
                <label className="form-label">Bio</label>
                <span className="form-hint mb-1 mt-0">
                  {bioWordCount}/{200}
                </span>
              </div>

              <textarea
                className="form-control"
                rows="3"
                value={bio}
                onChange={(e) => {
                  if (e.target.value.length <= 200) {
                    setBio(e.target.value);
                    setBioWordCount(e.target.value.length);
                  }
                }}
              />
              {bioWordCount >= 200 && (
                <p className="form-hint">Max 200 character allowed</p>
              )}
            </div>

            <div className="form-group mb-0">
              <label className="form-label">
                Personal Site or Portfolio (optional)
                <svg
                  style={{ marginLeft: 8 }}
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.25 11.7C8.25 12.1142 8.58579 12.45 9 12.45C9.41421 12.45 9.75 12.1142 9.75 11.7H8.25ZM9.75 8.325C9.75 7.91079 9.41421 7.575 9 7.575C8.58579 7.575 8.25 7.91079 8.25 8.325H9.75ZM9 5.55C8.58579 5.55 8.25 5.88579 8.25 6.3C8.25 6.71421 8.58579 7.05 9 7.05V5.55ZM9.00675 7.05C9.42096 7.05 9.75675 6.71421 9.75675 6.3C9.75675 5.88579 9.42096 5.55 9.00675 5.55V7.05ZM15 9C15 12.3137 12.3137 15 9 15V16.5C13.1421 16.5 16.5 13.1421 16.5 9H15ZM9 15C5.68629 15 3 12.3137 3 9H1.5C1.5 13.1421 4.85786 16.5 9 16.5V15ZM3 9C3 5.68629 5.68629 3 9 3V1.5C4.85786 1.5 1.5 4.85786 1.5 9H3ZM9 3C12.3137 3 15 5.68629 15 9H16.5C16.5 4.85786 13.1421 1.5 9 1.5V3ZM9.75 11.7V8.325H8.25V11.7H9.75ZM9 7.05H9.00675V5.55H9V7.05Z"
                    fill="#a0a0a0"
                  />
                </svg>
              </label>
              <input
                className="form-control"
                type="text"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
              />
              {/* <p className="form-hint">https://</p> */}
            </div>
          </div>

          <div className="profile-section  mb-4">
            <p className="page-title mt-0">Socials</p>
            <p className="page-lead">
              Link your socials to gain more trust and participate in
              challenges.
            </p>
            {/* Twitter */}
            <div className="social-wrapper-container mb-3">
              <div className={`form-group mb-0 mr-3`}>
                <div className="d-flex align-items-center justify-content-between">
                  <label
                    className={`form-label ${
                      _isTwitterLinked ? "" : "disabled-input"
                    }`}
                  >
                    Twitter
                  </label>
                </div>
                <div
                  className={`icon-input-wrapper ${
                    _isTwitterLinked ? "" : "disabled-input"
                  }`}
                >
                  <input
                    className="form-control"
                    type="text"
                    disabled={true}
                    value={twitterAccount}
                  />

                  <svg
                    className="form-icon"
                    width="16"
                    height="13"
                    viewBox="0 0 16 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.9388 0.00728525C15.245 0.496661 14.4768 0.870955 13.6639 1.11575C13.2275 0.614053 12.6476 0.25846 12.0026 0.0970684C11.3576 -0.064323 10.6786 -0.023726 10.0574 0.213369C9.43623 0.450463 8.90284 0.872616 8.5294 1.42273C8.15595 1.97285 7.96047 2.62438 7.96938 3.28922V4.01371C6.69619 4.04672 5.43459 3.76435 4.29695 3.19174C3.15931 2.61913 2.18094 1.77405 1.44898 0.731774C1.44898 0.731774 -1.44898 7.25217 5.07142 10.1501C3.57936 11.1629 1.80192 11.6708 0 11.5991C6.5204 15.2216 14.4898 11.5991 14.4898 3.26749C14.4891 3.06568 14.4697 2.86438 14.4318 2.66616C15.1712 1.93696 15.693 1.01629 15.9388 0.00728525Z"
                      fill="#a0a0a0"
                    />
                  </svg>
                </div>
              </div>
              <div className="social-status">
                {_isTwitterLinked ? (
                  <div className="connected">
                    <svg
                      width="14"
                      height="13"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 7.09091L4.66667 10L12 2"
                        stroke="white"
                        stroke-width="3"
                        stroke-linecap="round"
                      />
                    </svg>
                    <p>Connected</p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      phylloSDKConnect(
                        process.env.REACT_APP_PHYLLO_TWITTER_PLATFORM_ID
                      );
                    }}
                    className="connect-now"
                  >
                    Connect Now
                  </button>
                  // <TwitterLogin
                  //   loginUrl={loginUrl}
                  //   onFailure={onTwitterFailed}
                  //   onSuccess={onTwitterSuccess}
                  //   requestTokenUrl={fetchTokenURL}
                  //   className="connect-now"
                  // >
                  //   Connect Now
                  // </TwitterLogin>
                )}
              </div>
            </div>
            {/* Instagram */}
            <div className="social-wrapper-container mb-3">
              <div className={`form-group mb-0 mr-3`}>
                <div className="d-flex align-items-center justify-content-between">
                  <label
                    className={`form-label ${
                      _isInstagramLinked ? "" : "disabled-input"
                    }`}
                  >
                    Instagram
                  </label>
                </div>
                <div
                  className={`icon-input-wrapper ${
                    _isInstagramLinked ? "" : "disabled-input"
                  }`}
                >
                  <input
                    className="form-control"
                    type="text"
                    value={instagramAccount}
                    disabled={true}
                  />
                  <svg
                    className="form-icon"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10.2525 0H3.4175C1.53007 0 0 1.53007 0 3.4175V10.2525C0 12.1399 1.53007 13.67 3.4175 13.67H10.2525C12.1399 13.67 13.67 12.1399 13.67 10.2525V3.4175C13.67 1.53007 12.1399 0 10.2525 0ZM7.20498 4.49475C6.71937 4.42274 6.22341 4.50568 5.78765 4.73179C5.3519 4.9579 4.99853 5.31565 4.77781 5.75416C4.5571 6.19267 4.48027 6.68961 4.55827 7.1743C4.63626 7.65899 4.8651 8.10675 5.21224 8.45389C5.55937 8.80103 6.00713 9.02987 6.49182 9.10786C6.97651 9.18585 7.47346 9.10903 7.91197 8.88831C8.35048 8.6676 8.70823 8.31423 8.93434 7.87847C9.16044 7.44272 9.24339 6.94676 9.17138 6.46114C9.09793 5.9658 8.86711 5.50721 8.51301 5.15311C8.15892 4.79902 7.70033 4.5682 7.20498 4.49475ZM5.4192 4.02169C6.00431 3.71809 6.67027 3.60671 7.32233 3.7034C7.98746 3.80203 8.60324 4.11197 9.0787 4.58743C9.55416 5.06289 9.8641 5.67867 9.96273 6.3438C10.0594 6.99586 9.94804 7.66181 9.64444 8.24693C9.34083 8.83205 8.86046 9.30653 8.27164 9.6029C7.68282 9.89927 7.01555 10.0024 6.36473 9.8977C5.7139 9.79297 5.11267 9.48569 4.64655 9.01957C4.18043 8.55345 3.87315 7.95222 3.76843 7.3014C3.6637 6.65058 3.76686 5.9833 4.06323 5.39449C4.35959 4.80567 4.83408 4.3253 5.4192 4.02169ZM10.5899 2.57033C10.3138 2.57033 10.0899 2.79418 10.0899 3.07033C10.0899 3.34647 10.3138 3.57033 10.5899 3.57033H10.596C10.8721 3.57033 11.096 3.34647 11.096 3.07033C11.096 2.79418 10.8721 2.57033 10.596 2.57033H10.5899Z"
                      fill="#a0a0a0"
                    />
                  </svg>
                </div>
              </div>
              <div className="social-status">
                {_isInstagramLinked ? (
                  <div className="connected">
                    <svg
                      width="14"
                      height="13"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 7.09091L4.66667 10L12 2"
                        stroke="white"
                        stroke-width="3"
                        stroke-linecap="round"
                      />
                    </svg>
                    <p>Connected</p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      phylloSDKConnect(
                        process.env.REACT_APP_PHYLLO_INSTAGRAM_PLATFORM_ID
                      );
                    }}
                    className="connect-now"
                  >
                    Connect Now
                  </button>
                  // <InstagramLogin
                  //   clientId={process.env.REACT_APP_INSTAGRAM_CLIENT_ID}
                  //   buttonText="Login"
                  //   onSuccess={instagramLogin}
                  //   onFailure={instagramLogin}
                  //   cssClass="connect-now"
                  // >
                  //   Connect Now
                  // </InstagramLogin>
                )}
              </div>
            </div>
            {/* Youtube */}
            <div className="social-wrapper-container mb-3">
              <div className={`form-group mb-0 mr-3`}>
                <div className="d-flex align-items-center justify-content-between">
                  <label
                    className={`form-label ${
                      _isYoutubeLinked ? "" : "disabled-input"
                    }`}
                  >
                    Youtube
                  </label>
                </div>
                <div
                  className={`icon-input-wrapper ${
                    _isYoutubeLinked ? "" : "disabled-input"
                  }`}
                >
                  <svg
                    className="form-icon"
                    width="19"
                    height="14"
                    viewBox="0 0 19 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M17.9966 1.00125C18.2907 1.30452 18.4997 1.68004 18.6023 2.08989C18.8762 3.60869 19.0092 5.14956 18.9995 6.69283C19.005 8.21304 18.872 9.73059 18.6023 11.2267C18.4997 11.6365 18.2907 12.0121 17.9966 12.3153C17.7024 12.6186 17.3334 12.8389 16.9269 12.9539C15.4415 13.3511 9.5 13.3511 9.5 13.3511C9.5 13.3511 3.55849 13.3511 2.07311 12.9539C1.67484 12.8449 1.31141 12.635 1.01793 12.3446C0.724448 12.0541 0.510841 11.6929 0.397746 11.2958C0.123787 9.77698 -0.00919644 8.23611 0.000493667 6.69283C-0.00707491 5.16109 0.1259 3.63188 0.397746 2.12443C0.500331 1.71458 0.709257 1.33906 1.00342 1.0358C1.29759 0.732533 1.66658 0.512269 2.07311 0.397252C3.55849 0 9.5 0 9.5 0C9.5 0 15.4415 0 16.9269 0.362708C17.3334 0.477726 17.7024 0.69799 17.9966 1.00125ZM12.5235 6.69216L7.55781 9.51611V3.86822L12.5235 6.69216Z"
                      fill="#a0a0a0"
                    />
                  </svg>

                  <input
                    className="form-control"
                    type="text"
                    value={youtubeAccount}
                    disabled={true}
                  />
                </div>
              </div>
              <div className="social-status">
                {_isYoutubeLinked ? (
                  <div className="connected">
                    <svg
                      width="14"
                      height="13"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 7.09091L4.66667 10L12 2"
                        stroke="white"
                        stroke-width="3"
                        stroke-linecap="round"
                      />
                    </svg>
                    <p>Connected</p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      phylloSDKConnect(
                        process.env.REACT_APP_PHYLLO_YOUTUBE_PLATFORM_ID
                      );
                    }}
                    className="connect-now"
                  >
                    Connect Now
                  </button>
                  // <YoutubeButton
                  //   isConncetNow={true}
                  //   backendUrl={network?.backendUrl}
                  //   isYoutubeSelected={_isYoutubeLinked}
                  //   setIsYoutubeSelected={setYoutubeLinked}
                  //   youtubeUrl={youtubeAccount}
                  //   setYoutubeUrl={setYoutubeAccount}
                  //   updateYoutubeInfo={updateYoutubeInfo}
                  // ></YoutubeButton>
                )}
              </div>
            </div>

            {/* Twiitch */}
            <div className="social-wrapper-container mb-3">
              <div className={`form-group mb-0 mr-3`}>
                <div className="d-flex align-items-center justify-content-between">
                  <label
                    className={`form-label ${
                      _isTwitchLinked ? "" : "disabled-input"
                    }`}
                  >
                    Twitch
                  </label>
                </div>
                <div
                  className={`icon-input-wrapper ${
                    _isTwitchLinked ? "" : "disabled-input"
                  }`}
                >
                  {/* <img src="/images/twitch_icon.png" alt="" className="mr-2" /> */}

                  <svg
                    className="form-icon"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.8002 0.200195L0.200195 3.4002V16.2002H4.2002V18.6002H7.4002L9.8002 16.2002H13.0002L17.8002 11.4002V0.200195H1.8002ZM3.4002 1.8002H16.2002V10.6002L13.8002 13.0002H9.0002L6.6002 15.4002V13.0002H3.4002V1.8002ZM7.4002 4.2002V9.8002H9.0002V4.2002H7.4002ZM10.6002 4.2002V9.8002H12.2002V4.2002H10.6002Z"
                      fill="#A0A0A0"
                    />
                  </svg>

                  <input
                    className="form-control"
                    type="text"
                    value={twitchAccount}
                    disabled={true}
                  />
                </div>
              </div>
              <div className="social-status">
                {_isTwitchLinked ? (
                  <div className="connected">
                    <svg
                      width="14"
                      height="13"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 7.09091L4.66667 10L12 2"
                        stroke="white"
                        stroke-width="3"
                        stroke-linecap="round"
                      />
                    </svg>
                    <p>Connected</p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      phylloSDKConnect(
                        process.env.REACT_APP_PHYLLO_TWITCH_PLATFORM_ID
                      );
                    }}
                    className="connect-now"
                  >
                    Connect Now
                  </button>
                  // <TwitchLogin
                  //   onFailure={onTwitchFailed}
                  //   onSuccess={onTwitchSuccess}
                  //   clientId={process.env.REACT_APP_TWITCH_CLIENT_ID}
                  //   redirectUri={window.location.href}
                  //   className="connect-now"
                  // >
                  //   Connect Now
                  // </TwitchLogin>
                )}
              </div>
            </div>

            {/* Tiktok */}
            <div className="social-wrapper-container mb-3">
              <div className={`form-group mb-0 mr-3`}>
                <div className="d-flex align-items-center justify-content-between">
                  <label
                    className={`form-label ${
                      _isTiktokLinked ? "" : "disabled-input"
                    }`}
                  >
                    Tiktok
                  </label>
                </div>
                <div
                  className={`icon-input-wrapper ${
                    _isTiktokLinked ? "" : "disabled-input"
                  }`}
                >
                  <svg
                    className="form-icon"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8.84918 1.17129C8.95906 1.06162 9.10797 1.00002 9.26322 1H11.6169C11.7618 1.00008 11.9016 1.05383 12.0092 1.15086C12.1168 1.2479 12.1846 1.38135 12.1997 1.52547C12.3914 3.35173 13.8607 4.78758 15.7039 4.91982C15.8517 4.93054 15.99 4.99684 16.0908 5.10538C16.1917 5.21391 16.2478 5.35663 16.2477 5.50482V8.24205C16.2477 8.38822 16.1931 8.52913 16.0947 8.63714C15.9962 8.74515 15.8609 8.81247 15.7154 8.82591C15.5697 8.83932 15.4175 8.8488 15.2574 8.8488C14.084 8.8488 13.0213 8.41683 12.1687 7.7349V13.0388C12.1687 16.1158 9.66125 18.6232 6.58437 18.6232C3.50741 18.6232 1 16.1158 1 13.0388C1 9.96183 3.50741 7.45443 6.58437 7.45443C6.69166 7.45443 6.78444 7.46119 6.86312 7.46693C6.88671 7.46865 6.90903 7.47027 6.9301 7.4716C7.07892 7.48093 7.21859 7.54662 7.32067 7.6553C7.42276 7.76399 7.4796 7.90749 7.47961 8.05659V10.5191C7.47971 10.602 7.4622 10.684 7.42826 10.7597C7.39432 10.8353 7.34472 10.9029 7.28272 10.958C7.22072 11.0131 7.14774 11.0544 7.0686 11.0792C6.98947 11.1039 6.90597 11.1117 6.82364 11.1018C6.78033 11.0966 6.74312 11.0918 6.71142 11.0876C6.64969 11.0796 6.60882 11.0743 6.58437 11.0743C5.49193 11.0743 4.61988 11.9464 4.61988 13.0388C4.61988 14.1312 5.49193 15.0044 6.58437 15.0044C7.68559 15.0044 8.65189 14.1349 8.65189 13.0709C8.65189 13.014 8.65302 12.3311 8.65533 11.2518C8.65643 10.7338 8.65787 10.1344 8.65941 9.49266C8.66108 8.79699 8.66287 8.05167 8.66449 7.30675C8.67064 4.44256 8.67708 1.585 8.67708 1.585C8.6774 1.42975 8.73929 1.28096 8.84918 1.17129ZM4.8688 9.01728C5.30167 8.8806 5.78024 8.79324 6.30733 8.76929V8.68281C5.79993 8.71579 5.31562 8.83164 4.8688 9.01728Z"
                      fill="white"
                    />
                  </svg>
                  <input
                    className="form-control"
                    type="text"
                    value={tiktokAccount}
                    disabled={true}
                  />
                </div>
              </div>
              <div className="social-status">
                {_isTiktokLinked ? (
                  <div className="connected">
                    <svg
                      width="14"
                      height="13"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 7.09091L4.66667 10L12 2"
                        stroke="white"
                        stroke-width="3"
                        stroke-linecap="round"
                      />
                    </svg>
                    <p>Connected</p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      phylloSDKConnect(
                        process.env.REACT_APP_PHYLLO_TIKTOK_PLATFORM_ID
                      );
                    }}
                    className="connect-now"
                  >
                    Connect Now
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="edit-actions">
            <button
              className={`btn-continue ${
                canSave && nameChangeSuccess != "failed" ? "" : "disable"
              }`}
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="btn-continue cancel-button"
              onClick={() => {
                history.push("/discover");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
        <Dialog open={verifyDialogOpen} onClose={handleVerifyDialogClose}>
          <DialogTitle className="d-flex justify-content-center">
            Get Verified
          </DialogTitle>
          <DialogContent>
            <div className="verify-content">
              <p className="verify-lead">
                Please share a link to 1 of your social profiles to which we
                will contact you over direct messenger (DMs). We will contact
                you to verify your identity on BULLZ. Best link to share in your
                instagram profile.
              </p>
              <div className="form-group">
                <label className="form-label">URL</label>
                <input
                  className="form-control"
                  type="text"
                  value={verifyURL}
                  onChange={(e) => setVerifyURL(e.target.value)}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button
              className={`btn-continue mb-0 ${!!verifyURL ? "" : "disable"}`}
              onClick={handleVerifyDialogClose}
            >
              Submit
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </LoadingOverlay>
  );
};

export default EditProfile;
