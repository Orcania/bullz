import {
  Checkbox,
  DialogContent,
  FormControlLabel,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import { Select, Menu, MenuItem } from "@material-ui/core";

import React, { useState, useEffect, useRef } from "react";

import Dropzone from "react-dropzone";

import { useHistory } from "react-router";

import { useSnackbar } from "notistack";

import S3 from "react-aws-s3";

import { useDispatch, useSelector } from "react-redux";

import { Spinner } from "react-bootstrap";

import ReactPaginate from "react-paginate";

import { Link } from "react-router-dom";

import { isYoutubeLinked, scrollToTop, isInstagramLinked, isTwitterLinked, isTwitchLinked, isTiktokLinked } from "common/utils";

import CustomTooltip from "components/Common/Tooltip/CustomTooltip";

import { S3Config } from "../../config";
import {
  SET_PROFILE_NFTS,
  SET_USER_DATA,
  SET_EXPLORE_NFTS,
  SET_SELECTED_PAGE,
  SET_SELECTED_PAGE_PROFILE,
  SET_SELECTED_TYPE_PROFILE,
  SET_REPORT_USERS,
} from "../../redux/constants";
import { ChatService } from "../../services/chat.service";
import { CollectionService } from "../../services/collection.service";
import { NftService } from "../../services/nft.service";
import { UserService } from "../../services/user.service";
import { ReportService } from "services/report.service";
import SubFilters from "../../components/SubFilters/subFiltersNew";
import NftCard from "../../components/Common/ExploreCard/index";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { NftScannerService } from "services/nft-scanner.service";

import "./style.scss";
import UserChatRequestDialogButton from "./userChatRequestDialogButton";

import CustomAlert from "components/CustomAlert";
import { YouTube } from "@material-ui/icons";
import { ShareService } from "services/share.service";
import { printLog } from "utils/printLog";

const supportedExtForProfile = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const mainFilters = [
  { key: "sale", value: "Live" },
  { key: "collectibles", value: "Owned" },
  { key: "created", value: "Created" },
  { key: "liked", value: "Liked" },
];

const notificationConfig = {
  preventDuplicate: true,
  vertical: "bottom",
  horizontal: "right",
};

const Profile = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  // const nfts = useSelector((state) => state.profile.profileNfts);
  const web3Object = useSelector((state) => state.web3.web3object);
  const metaMaskAddress = useSelector((state) => state.web3.metaMaskAddress);
  const loggedInUserData = useSelector((state) => state.auth.userData);

  const network = useSelector((state) => state.web3.network);

  const userService = new UserService(network.backendUrl);
  const nftService = new NftService(network.backendUrl);
  const reportService = new ReportService(network.backendUrl);
  const collectionService = new CollectionService(network.backendUrl);
  const nftScannerService = new NftScannerService(network.backendUrl);
  const chatService = new ChatService(network.chatUrl);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isShowingFilter, setIsShowingFilter] = useState(false);
  const shareService = new ShareService(network.backendUrl);

  const isWeb3Connected = useSelector((state) => state.web3.web3connected);
  // const [lastScanned, setLastScanned] = useState('')

  // const [selectedSubFilter, setSelectedSubFilter] = useState({
  //   key: "all",
  //   value: "all",
  // });

  const [selectedSubFilter, setSelectedSubFilter] = useState({
    sortBy: "all",
  });

  // const [selectedPage, setSelectedPage] = useState(
  //   selectedPageReducer ? selectedPageReducer : 1
  // );

  const [selectedPage, setSelectedPage] = useState(1);

  const [limit, setLimit] = useState(8);
  const [totalCount, setTotalCount] = useState(0);

  const [recordsFrom, setRecordsFrom] = useState(0);
  const [recordsTo, setRecordsTo] = useState(0);

  const [userData, setUserData] = useState("");
  const [nfts, setNfts] = useState([]);

  const [nftsLoading, setNftsLoading] = useState(true);

  const [selectedFilter, setSelectedFilter] = useState("sale");

  const [isSelectedProfileUser, setIsSelectedProfileUser] = useState(false);

  const [isUserFollowed, setIsUserFollowed] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMoreOptionOpen, setIsMoreOptionOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [selectedFollowFilter, setSelectedFollowFilter] = useState("");
  const [followUsers, setFollowUsers] = useState([]);
  const [followingUserList, setFollowingUserList] = useState([]);
  const [followerUSerList, setFollowerUSerList] = useState([]);

  const [copied, setCopied] = useState(false);
  const moreDropdownRef = useRef(null);
  const [isMoreWalletOpen, setIsMoreWalletOpen] = useState(false);
  const [reportValues, setReportValues] = useState({});
  const [isFirstTime, setFirstTime] = useState(true);
  const [isConnectWalletAlertOpen, setIsConnectWalletAlertOpen] = useState(false);

  const isMobile = useMediaQuery('(min-width:350px) and (max-width:1023px)');

  // for report
  const reportUsers = useSelector((state) => state.profile.reportUsers);

  const url = window.location.href;

  useEffect(() => {
    scrollToTop();
  }, [selectedPage]);

  useEffect(() => {
    if (selectedPage !== 0 && userData) {
      getUserNFT();
    }
  }, [selectedPage, userData]);

  useEffect(() => {
    if (userData) {
      getUserNFT();
    }
  }, [selectedSubFilter]);

  // const getScanningData = async () => {
  //   const scanningData = await nftScannerService.getScanningStatus(loggedInUserData.address);
  //   if (scanningData) {
  //     setLastScanned(scanningData.last_updated);
  //   }
  // }

  // useEffect(() => {
  //   if (userData?.address?.toLowerCase() == loggedInUserData?.address?.toLowerCase()) {
  //     getScanningData();
  //   }
  // }, [loggedInUserData]);

  // const startScanning = async () => {
  //   const scan = await nftScannerService.startScanning({user : loggedInUserData.address})
  //   if (scan) {
  //     showNotification('Scanning started, it will take few minutes.', 'success');
  //   } else {
  //     showNotification('Wait at least 10 minutes between two calls.');
  //   }
  // }

  // useEffect(() => {
  //   getUserNFT();
  // }, [selectedFilter]);

  const onChangeMainFilter = (filter) => {
    setSelectedFilter(filter.key);
    setSelectedPage(0);
    setTotalCount(0);
    setTimeout(() => {
      setSelectedPage(1);
    }, 20);
  };

  const handleChangeSubFilter = (filter) => {
    setSelectedSubFilter(filter);
    printLog("selectedsub", selectedSubFilter);
    setSelectedPage(0);
    setTotalCount(0);
    setTimeout(() => {
      setSelectedPage(1);
    }, 20);
  };

  const setSelectedSubFilterFun = (obj) => {
    printLog([obj], 'success');
    setSelectedSubFilter({ ...obj });
    setSelectedPage(1);
  };

  useEffect(() => {
    getUser();
  }, [metaMaskAddress]);

  useEffect(() => {
    if (userData && Object.keys(web3Object).length !== 0) {
      checkForUserFollowed(loggedInUserData.id, userData.id);
    }
    getFollowingData();
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

  async function getUserNFT() {
    setNftsLoading(true);

    let queryString = "";
    let liked = false;
    let live = false;
    printLog(["selectedSubFilter", selectedSubFilter], 'success');
    printLog(["selectedFilter", selectedFilter], 'success');
    printLog(["isFirstTime", isFirstTime], 'success');

    
    if (selectedFilter === "sale") {
      // if (
      //   selectedSubFilter.hasOwnProperty("isForSell") ||
      //   selectedSubFilter.hasOwnProperty("isForAuction")
      // ) {
      //   queryString = `&holder=${userData.address.toLowerCase()}`;
      // } else {
      //   queryString = `&isForSell=true&holder=${userData.address.toLowerCase()}`;
      // }
      live = true;
      queryString = `&holder=${userData.address.toLowerCase()}`;
    } else if (selectedFilter === "collectibles") {
      queryString = `&holder=${userData.address.toLowerCase()}`;
    } else if (selectedFilter === "created") {
      queryString = `&creator=${userData.address.toLowerCase()}`;
    } else if (selectedFilter === "liked") {
      liked = true;
    }


    if(userData.id && loggedInUserData.id) {
      if(userData.address.toLowerCase() == loggedInUserData.address.toLowerCase()){
        queryString = queryString + '&statusCheck=false';
      } else {
        queryString = queryString + '&statusCheck=true';
      }
    } else {
      queryString = queryString + '&statusCheck=true';
    }
   

    for (const property in selectedSubFilter) {
      if (property !== "sortBy") {
        printLog([`${property}: ${selectedSubFilter[property]}`], 'success');
        if (selectedSubFilter[property] !== "") {
          queryString =
            queryString + `&${property}=${selectedSubFilter[property]}`;
        }
      }
    }

    printLog(["queryString", queryString], 'success');

    const response = await nftService.getProfileNftWithFilter(
      limit,
      selectedPage,
      selectedSubFilter.sortBy,
      queryString,
      userData.address.toLowerCase(),
      liked,
      live
    );
    let arr = [];
    if (response) {
      let nftss = response.data;
      setTotalCount(response.totalCount);
      setRecordsFrom((selectedPage - 1) * limit + 1);
      setRecordsTo((selectedPage - 1) * limit + response.data.length);

      for (let i = 0; i < nftss.length; i++) {
        let item = nftss[i];
        let hash = item.uri.split("/ipfs/")[1];
        const holderData = await userService.getUser(item.holder);
        const collectionType = await collectionService.getCollectionsByAddress(
          item.collectionType
        );
        item.holderData = holderData;
        item.collectionType = collectionType ? collectionType : "";
        arr.push(item);
      }

      setNfts(arr.length > 0 ? arr : []);
      setNftsLoading(false);

      if (arr.length == 0 && setSelectedFilter != 'created' && isFirstTime) {
        setSelectedFilter('created');
        setFirstTime(false);
        getCreatedNFT();
        return;        
      }
    } else {
      setNfts([]);
      setNftsLoading(false);
    }
    printLog(["nftss", arr], 'success');
    dispatch({
      type: SET_EXPLORE_NFTS,
      payload: arr.length ? arr : null,
    });

    dispatch({
      type: SET_SELECTED_PAGE,
      payload: selectedPage,
    });

    setNftsLoading(false);
  }

 const getCreatedNFT = async () => {
  setNftsLoading(true);

  let queryString = "";
  let liked = false;
  let live = false;
  printLog(["selectedSubFilter1", selectedSubFilter], 'success');
  printLog(["selectedFilter1", selectedFilter], 'success');
  printLog(["isFirstTime1", isFirstTime], 'success');
  queryString = `&creator=${userData.address.toLowerCase()}`;

  if(userData.id && loggedInUserData.id) {
    
    
    if(userData.address.toLowerCase() == loggedInUserData.address.toLowerCase()){
      queryString = queryString + '&statusCheck=false';
    } else {
      queryString = queryString + '&statusCheck=true';
    }
  } else {
    
    queryString = queryString + '&statusCheck=true';
  }
  
  for (const property in selectedSubFilter) {
    if (property !== "sortBy") {
      printLog([`${property}: ${selectedSubFilter[property]}`], 'success');
      if (selectedSubFilter[property] !== "") {
        queryString =
          queryString + `&${property}=${selectedSubFilter[property]}`;
      }
    }
  }

  printLog(["queryString", queryString], 'success');

  const response = await nftService.getProfileNftWithFilter(
    limit,
    selectedPage,
    selectedSubFilter.sortBy,
    queryString,
    userData.address.toLowerCase(),
    liked,
    live
  );
  let arr = [];
  if (response) {
    let nftss = response.data;
    setTotalCount(response.totalCount);
    setRecordsFrom((selectedPage - 1) * limit + 1);
    setRecordsTo((selectedPage - 1) * limit + response.data.length);

    for (let i = 0; i < nftss.length; i++) {
      let item = nftss[i];
      let hash = item.uri.split("/ipfs/")[1];
      const holderData = await userService.getUser(item.holder);
      const collectionType = await collectionService.getCollectionsByAddress(
        item.collectionType
      );
      item.holderData = holderData;
      item.collectionType = collectionType ? collectionType : "";
      arr.push(item);
    }

    setNfts(arr.length > 0 ? arr : []);
    setNftsLoading(false);

  } else {
    setNfts([]);
    setNftsLoading(false);
  }
  dispatch({
    type: SET_EXPLORE_NFTS,
    payload: arr.length ? arr : null,
  });

  dispatch({
    type: SET_SELECTED_PAGE,
    payload: selectedPage,
  });

  setNftsLoading(false);
 }


  const checkForUserFollowed = async (currentUser, profileUser) => {
    printLog(["currentUser", currentUser, "profileUser", profileUser], 'success');
    let res = await userService.checkForUserFollowed(currentUser, profileUser);
    printLog(["currentUser", res], 'success');
    setIsUserFollowed(res);
    return res;
  };

  const showNotification = (msg, variant = "") => {
    enqueueSnackbar(msg, {
      ...notificationConfig,
      variant: variant ? variant : "error",
    });
  };

  const goToEditProfile = () => {
    history.push("/edit-profile");
  };

  const handlePageClick = (page) => {
    setSelectedPage(page.selected + 1);
  };

  const handleChangeLimit = (e) => {
    setSelectedPage(0);
    setLimit(e.target.value);
    setTotalCount(0);
    setTimeout(() => {
      setSelectedPage(1);
    }, 20);
  };

  const handleSocialLinks = (type) => {
    if (userData[type]) {
      window.open(userData[type]);
    } else {
      showNotification("User did not added the url for this.");
    }
  };

  const handleCopyAddress = () => {
    var textArea = document.createElement("textarea");
    textArea.value = userData.address;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
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
          let _file = files[0];
          const ReactS3Client = new S3(S3Config);
          ReactS3Client.uploadFile(_file, _file.name).then(async (data) => {
            if (data.status === 204) {
              if (comingFor === "isCover") {
                let _user = {
                  id: userData.id,
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
              } else {
                let _user = {
                  id: userData.id,
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
              }
            } else printLog(["fail"]);
          });
        }
      });
    }
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

  const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      top: "0px !important",
      right: "0px !important",
      fontSize: "9px",
      color: theme.palette.grey[500],

      "& svg": {
        fontSize: 16,
      },
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
            className={[classes.closeButton, "close_button"]}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const likeNFT = async (nft) => {
    if (isWeb3Connected) {
      const body = {
        assetId: nft.id,
        user_id: userData.id,
      };
      let res = await nftService.likeUnlikeNFT(body);
      if (res) {
        printLog([res], 'success');
        let tempNfts = [...nfts];
        let found = tempNfts.find((item) => item.id === nft.id);
        let foundIndex = tempNfts.findIndex((item) => item.id === nft.id);

        let updatedNft = {
          ...found,
          likes: res.data.likes,
        };
        tempNfts[foundIndex] = updatedNft;
        dispatch({
          type: SET_PROFILE_NFTS,
          payload: [...tempNfts],
        });
      }
      let likedUpdatedUserData = { ...userData };
      likedUpdatedUserData.likes = [...res.data.likedUpdated.likes];
      dispatch({
        type: SET_USER_DATA,
        payload: { ...likedUpdatedUserData },
      });
    }
  };

  const handleReportSubmit = async () => {
    if (Object.values(reportValues).find((item) => item === true)) {
      if (!reportUsers.includes(userData.address)) {
        let feedbacks = [];
        for (const [key, value] of Object.entries(reportValues)) {
          if (value) {
            feedbacks.push(key);
          }
        }
        const reportData = {
          report_for: 'user',
          reporter_id: loggedInUserData.id,
          reported_id: userData.id,
          report_list: feedbacks
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
          });
          showNotification("Your report has been submitted.", "success");
          setIsMoreOpen(false);
          setIsReportOpen(false);          
        }
      } else {
        showNotification("You have already reported this user.", "error");
      }
    } else {
      showNotification("Please select an option");
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
    if (type === "twitter") {
      extUrl = `http://twitter.com/share?text=Check this awesome creator on BULLZ&url=${url}`;
    } else if (type === "facebook") {
      extUrl = `https://www.facebook.com/sharer.php?display=page&u=${url}`
    } else if (type === "telegram") {
      extUrl = `https://telegram.me/share/url?url=${url}&text=Check out this awesome creator on BULLZ`;
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
    window.open(extUrl, "_blank");
  };

  const handleReportClick = () => {
    if (!isSelectedProfileUser) {
      setIsReportOpen(true);
    } else {
      showNotification("You can't report yourself.");
    }
  };

  const onProfileUrlClick = (url) => {
    printLog([userData], 'success');
    const urlRegex =
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    const test = urlRegex.test(url);

    if (url) {
      if (test && !url.includes(" ")) {
        if (url.includes("http://") || url.includes("https://")) {
          window.open(url, "_blank");
        } else {
          window.open(`http://${url}`, "_blank");
        }
      } else {
        showNotification("This is not a valid URL.");
      }
    }
  };

  const handleMoreOptionClose = async () => {
    setAnchorEl(null);
    setIsMoreOptionOpen(false);
  };

  const onOutsideMoreClick = (e) => {
    if (
      moreDropdownRef.current &&
      !moreDropdownRef.current.contains(e.target)
    ) {
      setIsMoreWalletOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", onOutsideMoreClick);
    return () => document.removeEventListener("mousedown", onOutsideMoreClick);
  });

  const getFollowingData = async () => {
    const followingList = await getFollowUser("following");
    setFollowingUserList(followingList);
    const followerList = await getFollowUser("follower");
    setFollowerUSerList(followerList);

    printLog(["followingList", followingList], 'success');
    printLog(["followerList", followerList], 'success');

    if (selectedFollowFilter === "following") {
      setFollowUsers(followingList);
    } else if (selectedFollowFilter === "follower") {
      setFollowUsers(followerList);
    }
  };

  const getFollowUser = async (type) => {
    if (!userData || !userData.id) {
      return;
    }
    let arr = [];
    let response;
    if (type === "follower") {
      response = await userService.getUserFollowers(userData.id);
    } else {
      response = await userService.getUserFollowings(userData.id);
    }
    if (response) {
      for (let i = 0; i < response.length; i++) {
        let item = response[i];
        if (item) {
          let followResponse = false;
          if (loggedInUserData.id === item.id) {
            followResponse = "currentUser";
          } else if (Object.keys(loggedInUserData).length !== 0) {
            followResponse = await userService.checkForUserFollowed(
              loggedInUserData.id,
              item.id
            );
            printLog(["followResponse", followResponse], 'success');
          }
          arr.push({ ...item, followResponse: followResponse });
        }
      }
    }
    return arr;
  };

  const setSelectedFollow = (type) => {
    if (type === "following") {
      setFollowUsers(followingUserList);
    } else {
      setFollowUsers(followerUSerList);
    }
    setSelectedFollowFilter(type);
  };

  const followUnfollowUserList = async (userObj) => {
    if (Object.keys(loggedInUserData).length !== 0) {
      let res = await userService.followUnfollowUser(
        loggedInUserData.id,
        userObj.id
      );
      printLog(["res", res], 'success');
      if (res === "Followed/Unfollowed Successfully") {
        getUser();
        getFollowingData();
      }
    }
  };

  const handleReportCheckboxChange = (e) => {
    setReportValues({ ...reportValues, [e.target.name]: e.target.checked });
  };

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
      <div className="photo-profile-page profile">
      
        {userData && userData !== "no user found" ? (
          <>
          <div className="step-crumb-mobile cursor-pointer" onClick={() => history.goBack()}>
                <KeyboardBackspaceIcon
                  style={{ color: "white", marginRight: 10 }}
                />
                <p className="step-lead">Back</p>
              </div>
            <div className="top-content">
              
                {isSelectedProfileUser ? (
                  <Dropzone
                    name="file"
                    className="avatar-drop-zone"
                    multiple={false}
                    onDrop={(value) => handleFileUpload(value, "isProfile")}
                  >
                    {/* <img src="/images/upload-green.png" alt="" className="dropzone-image" /> */}
                    <div className="avatar-wrapper">
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

                    <img
                  className="avatar-img"
                  src={
                    userData?.avatar_img
                      ? userData.avatar_img
                      : "/images/default-profile-cover.png"
                  }
                  alt=""
                />

                    </div>
                  </Dropzone>
                ) : 
                <div className="avatar-wrapper">
                    <img
                      className="avatar-img"
                      src={
                        userData?.avatar_img
                          ? userData.avatar_img
                          : "/images/default-profile-cover.png"
                      }
                      alt=""
                    />
                </div>}
                
              <div className="header">
                <div className="content">
                  <CustomTooltip
                    title={`@${userData.username}`}
                    placement={"top"}
                  >
                    <p className="username">
                      @{userData.username}
                    </p>
                  </CustomTooltip>

                  <div className="info">
                    <p className="address" onClick={handleCopyAddress}>
                      {userData.address.slice(0, 15) +
                        "..." +
                        userData.address.slice(-4)}
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M1.59091 0C0.712274 0 0 0.712274 0 1.59091V8.40909C0 9.28773 0.712276 10 1.59091 10H3.5V10.75C3.5 11.8546 4.39543 12.75 5.5 12.75H10.8333C11.9379 12.75 12.8333 11.8546 12.8333 10.75V4.5C12.8333 3.39543 11.9379 2.5 10.8333 2.5H9V1.59091C9 0.712274 8.28773 0 7.40909 0H1.59091ZM8 2.5V1.59091C8 1.26456 7.73544 1 7.40909 1H1.59091C1.26456 1 1 1.26456 1 1.59091V8.40909C1 8.73544 1.26456 9 1.59091 9H3.5V4.5C3.5 3.39543 4.39543 2.5 5.5 2.5H8ZM4.5 4.5C4.5 3.94772 4.94772 3.5 5.5 3.5H10.8333C11.3856 3.5 11.8333 3.94772 11.8333 4.5V10.75C11.8333 11.3023 11.3856 11.75 10.8333 11.75H5.5C4.94772 11.75 4.5 11.3023 4.5 10.75V4.5Z"
                        />
                      </svg>
                    </p>

                    {/* <div className="more-address" onClick={() => setIsMoreWalletOpen(!isMoreWalletOpen)}>
                      <span className="mr-1">
                        +1
                      </span>
                      <span>
                        More
                      </span>
                      <ArrowDropDownIcon />
                      {
                        isMoreWalletOpen && (
                          <div className="more-dropdown" onClick={onOutsideMoreClick} ref={moreDropdownRef}>
                            <div className="wallet-content">
                              <img src="/images/default-profile-cover.png" alt="" />
                              <div className="wallet-info">
                                <p className="network-name">Polygon</p>
                                <div className="address">
                                  <p className="wallet-address">
                                    {userData.address.slice(0, 5) + "..." + userData.address.slice(-4)}
                                    <ArrowDropDownIcon />
                                  </p>
                                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.59091 0.125C0.712274 0.125 0 0.837274 0 1.71591V8.53409C0 9.41273 0.712276 10.125 1.59091 10.125H3.5V10.875C3.5 11.9796 4.39543 12.875 5.5 12.875H10.8333C11.9379 12.875 12.8333 11.9796 12.8333 10.875V4.625C12.8333 3.52043 11.9379 2.625 10.8333 2.625H9V1.71591C9 0.837274 8.28773 0.125 7.40909 0.125H1.59091ZM8 2.625V1.71591C8 1.38956 7.73544 1.125 7.40909 1.125H1.59091C1.26456 1.125 1 1.38956 1 1.71591V8.53409C1 8.86044 1.26456 9.125 1.59091 9.125H3.5V4.625C3.5 3.52043 4.39543 2.625 5.5 2.625H8ZM4.5 4.625C4.5 4.07272 4.94772 3.625 5.5 3.625H10.8333C11.3856 3.625 11.8333 4.07272 11.8333 4.625V10.875C11.8333 11.4273 11.3856 11.875 10.8333 11.875H5.5C4.94772 11.875 4.5 11.4273 4.5 10.875V4.625Z" fill="white" />
                                  </svg>

                                </div>
                              </div>
                            </div>

                            <p className="manage-wallet">Manage Wallet</p>
                          </div>
                        )
                      }

                    </div> */}
                  </div>
                  {copied && (
                    <p
                      style={{
                        color: "#4353FF",
                        borderRadius: 2,
                        fontSize: 12,
                        fontWeight: "bold",
                        marginLeft: 10,
                        marginBottom: 0,
                      }}
                    >
                      Copied
                    </p>
                  )}
                </div>
                <div className="account-options">
                  {userData.portfolio_url && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => onProfileUrlClick(userData.portfolio_url)}
                    >
                      <path d="M9.77183 7.88469L8.82916 6.94202L9.77183 5.99935C10.0195 5.75172 10.2159 5.45775 10.3499 5.1342C10.4839 4.81066 10.5529 4.46389 10.5529 4.11369C10.5529 3.76349 10.4839 3.41671 10.3499 3.09317C10.2159 2.76963 10.0195 2.47565 9.77183 2.22802C9.5242 1.98039 9.23022 1.78396 8.90668 1.64994C8.58314 1.51593 8.23637 1.44695 7.88616 1.44695C7.53596 1.44695 7.18919 1.51593 6.86565 1.64994C6.54211 1.78396 6.24813 1.98039 6.0005 2.22802L5.05783 3.17069L4.11516 2.22802L5.05783 1.28535C5.81004 0.545298 6.8242 0.132455 7.87942 0.136752C8.93463 0.141049 9.9454 0.562136 10.6916 1.30829C11.4377 2.05445 11.8588 3.06522 11.8631 4.12043C11.8674 5.17565 11.4546 6.18981 10.7145 6.94202L9.77183 7.88469ZM7.88583 9.77069L6.94316 10.7134C6.57284 11.0898 6.13167 11.3891 5.64507 11.5942C5.15848 11.7992 4.63611 11.9059 4.10808 11.908C3.58006 11.9102 3.05684 11.8078 2.56859 11.6067C2.08035 11.4056 1.63674 11.1099 1.26337 10.7365C0.889997 10.3631 0.594244 9.91951 0.39317 9.43126C0.192096 8.94302 0.08968 8.41979 0.09183 7.89177C0.0939801 7.36374 0.200653 6.84137 0.405697 6.35478C0.610741 5.86819 0.910097 5.42701 1.2865 5.05669L2.22916 4.11402L3.17183 5.05669L2.22916 5.99935C1.98153 6.24698 1.7851 6.54096 1.65109 6.8645C1.51707 7.18805 1.4481 7.53482 1.4481 7.88502C1.4481 8.23522 1.51707 8.58199 1.65109 8.90554C1.7851 9.22908 1.98153 9.52306 2.22916 9.77069C2.47679 10.0183 2.77077 10.2147 3.09432 10.3488C3.41786 10.4828 3.76463 10.5518 4.11483 10.5518C4.46503 10.5518 4.8118 10.4828 5.13535 10.3488C5.45889 10.2147 5.75287 10.0183 6.0005 9.77069L6.94316 8.82802L7.88583 9.77069ZM7.88583 3.17069L8.82916 4.11402L4.11516 8.82735L3.17183 7.88469L7.88583 3.17135V3.17069Z" />
                    </svg>
                  )}

                  {isInstagramLinked(userData.instagram_url) && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => onProfileUrlClick(userData.instagram_url)}
                    >
                      <path d="M10.5 0H3.5C1.567 0 0 1.567 0 3.5V10.5C0 12.433 1.567 14 3.5 14H10.5C12.433 14 14 12.433 14 10.5V3.5C14 1.567 12.433 0 10.5 0Z" />
                      <path
                        d="M9.79823 6.55726C9.88462 7.13983 9.78511 7.73481 9.51386 8.25757C9.24261 8.78033 8.81343 9.20425 8.28737 9.46903C7.76131 9.73381 7.16515 9.82597 6.58368 9.73241C6.00222 9.63884 5.46506 9.36431 5.04862 8.94787C4.63217 8.53142 4.35764 7.99427 4.26408 7.41281C4.17051 6.83134 4.26268 6.23518 4.52746 5.70912C4.79224 5.18306 5.21616 4.75388 5.73892 4.48263C6.26168 4.21138 6.85666 4.11187 7.43923 4.19826C8.03348 4.28638 8.58363 4.56328 9.00842 4.98807C9.43321 5.41286 9.71011 5.96301 9.79823 6.55726Z"
                        stroke="black"
                        stroke-width="0.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10.8457 3.14453H10.8534"
                        stroke="black"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  )}

                  {isTwitterLinked(userData.twitter_url) && (
                    <svg
                      width="18"
                      height="14"
                      viewBox="0 0 18 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => onProfileUrlClick(userData.twitter_url)}
                    >
                      <path d="M17.06 0.0507665C16.3174 0.574569 15.4952 0.975193 14.6251 1.23721C14.158 0.700218 13.5374 0.31961 12.847 0.146866C12.1566 -0.0258792 11.4298 0.0175736 10.7649 0.271347C10.1 0.525121 9.52913 0.976971 9.12941 1.56579C8.7297 2.1546 8.52046 2.85197 8.53 3.56358V4.33903C7.16724 4.37437 5.8169 4.07213 4.59923 3.45924C3.38156 2.84634 2.33436 1.94182 1.55091 0.826221C1.55091 0.826221 -1.55091 7.80531 5.42818 10.9071C3.83115 11.9912 1.92868 12.5348 0 12.458C6.97909 16.3353 15.5091 12.458 15.5091 3.54031C15.5084 3.32431 15.4876 3.10884 15.4471 2.89668C16.2385 2.11618 16.797 1.13075 17.06 0.0507665Z" />
                    </svg>
                  )}

                  {isYoutubeLinked(userData.youtube_url) && (
                    <svg onClick={() => onProfileUrlClick(userData.youtube_url)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.9966 6.00125C21.2907 6.30452 21.4997 6.68004 21.6023 7.08989C21.8762 8.60869 22.0092 10.1496 21.9995 11.6928C22.005 13.213 21.872 14.7306 21.6023 16.2267C21.4997 16.6365 21.2907 17.0121 20.9966 17.3153C20.7024 17.6186 20.3334 17.8389 19.9269 17.9539C18.4415 18.3511 12.5 18.3511 12.5 18.3511C12.5 18.3511 6.55849 18.3511 5.07311 17.9539C4.67484 17.8449 4.31141 17.635 4.01793 17.3446C3.72445 17.0541 3.51084 16.6929 3.39775 16.2958C3.12379 14.777 2.9908 13.2361 3.00049 11.6928C2.99293 10.1611 3.1259 8.63188 3.39775 7.12443C3.50033 6.71458 3.70926 6.33906 4.00342 6.0358C4.29759 5.73253 4.66658 5.51227 5.07311 5.39725C6.55849 5 12.5 5 12.5 5C12.5 5 18.4415 5 19.9269 5.36271C20.3334 5.47773 20.7024 5.69799 20.9966 6.00125ZM15.5235 11.6922L10.5578 14.5161V8.86822L15.5235 11.6922Z" fill="white"/>
                    </svg>
                  )}

                  {isTwitchLinked(userData.twitch_url) && (
                    <svg onClick={() => onProfileUrlClick(userData.twitch_url)} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.29995 3.2002L3.69995 6.4002V19.2002H7.69995V21.6002H10.9L13.3 19.2002H16.5L21.3 14.4002V3.2002H5.29995ZM6.89995 4.8002H19.7V13.6002L17.3 16.0002H12.5L10.1 18.4002V16.0002H6.89995V4.8002ZM10.9 7.2002V12.8002H12.5V7.2002H10.9ZM14.1 7.2002V12.8002H15.7V7.2002H14.1Z" fill="white"/>
                    </svg>
                  )}

                  {isTiktokLinked(userData.tiktok_url) && (
                    <svg onClick={() => onProfileUrlClick(userData.tiktok_url)} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8.84918 1.17129C8.95906 1.06162 9.10797 1.00002 9.26322 1H11.6169C11.7618 1.00008 11.9016 1.05383 12.0092 1.15086C12.1168 1.2479 12.1846 1.38135 12.1997 1.52547C12.3914 3.35173 13.8607 4.78758 15.7039 4.91982C15.8517 4.93054 15.99 4.99684 16.0908 5.10538C16.1917 5.21391 16.2478 5.35663 16.2477 5.50482V8.24205C16.2477 8.38822 16.1931 8.52913 16.0947 8.63714C15.9962 8.74515 15.8609 8.81247 15.7154 8.82591C15.5697 8.83932 15.4175 8.8488 15.2574 8.8488C14.084 8.8488 13.0213 8.41683 12.1687 7.7349V13.0388C12.1687 16.1158 9.66125 18.6232 6.58437 18.6232C3.50741 18.6232 1 16.1158 1 13.0388C1 9.96183 3.50741 7.45443 6.58437 7.45443C6.69166 7.45443 6.78444 7.46119 6.86312 7.46693C6.88671 7.46865 6.90903 7.47027 6.9301 7.4716C7.07892 7.48093 7.21859 7.54662 7.32067 7.6553C7.42276 7.76399 7.4796 7.90749 7.47961 8.05659V10.5191C7.47971 10.602 7.4622 10.684 7.42826 10.7597C7.39432 10.8353 7.34472 10.9029 7.28272 10.958C7.22072 11.0131 7.14774 11.0544 7.0686 11.0792C6.98947 11.1039 6.90597 11.1117 6.82364 11.1018C6.78033 11.0966 6.74312 11.0918 6.71142 11.0876C6.64969 11.0796 6.60882 11.0743 6.58437 11.0743C5.49193 11.0743 4.61988 11.9464 4.61988 13.0388C4.61988 14.1312 5.49193 15.0044 6.58437 15.0044C7.68559 15.0044 8.65189 14.1349 8.65189 13.0709C8.65189 13.014 8.65302 12.3311 8.65533 11.2518C8.65643 10.7338 8.65787 10.1344 8.65941 9.49266C8.66108 8.79699 8.66287 8.05167 8.66449 7.30675C8.67064 4.44256 8.67708 1.585 8.67708 1.585C8.6774 1.42975 8.73929 1.28096 8.84918 1.17129ZM4.8688 9.01728C5.30167 8.8806 5.78024 8.79324 6.30733 8.76929V8.68281C5.79993 8.71579 5.31562 8.83164 4.8688 9.01728Z"
                      fill="white"
                    />
                    </svg>
                  )}

                  <UserChatRequestDialogButton
                    userData={userData}
                    showNotification={showNotification}
                    isSelectedProfileUser={isSelectedProfileUser}
                    isSmall={true}
                  />
                  {!isSelectedProfileUser && (
                    <svg
                      className="mr-0"
                      width="13"
                      height="4"
                      viewBox="0 0 13 4"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                        setIsMoreOptionOpen(true);
                      }}
                    >
                      <path d="M1.40651 0.652344C0.665693 0.652344 0.0595703 1.25847 0.0595703 1.99928C0.0595703 2.7401 0.665693 3.34622 1.40651 3.34622C2.14733 3.34622 2.75345 2.7401 2.75345 1.99928C2.75345 1.25847 2.14733 0.652344 1.40651 0.652344ZM10.8351 0.652344C10.0943 0.652344 9.48814 1.25847 9.48814 1.99928C9.48814 2.7401 10.0943 3.34622 10.8351 3.34622C11.5759 3.34622 12.182 2.7401 12.182 1.99928C12.182 1.25847 11.5759 0.652344 10.8351 0.652344ZM6.12079 0.652344C5.37998 0.652344 4.77386 1.25847 4.77386 1.99928C4.77386 2.7401 5.37998 3.34622 6.12079 3.34622C6.86161 3.34622 7.46773 2.7401 7.46773 1.99928C7.46773 1.25847 6.86161 0.652344 6.12079 0.652344Z" />
                    </svg>
                  )}

                  <div className="more-options">
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={isMoreOptionOpen}
                      onClose={handleMoreOptionClose}
                      // MenuListProps={{
                      //   'aria-labelledby': 'basic-button',
                      // }}
                      className="more-menu"
                      style={{ top: 40, left: isMobile? -10 : -156 }}
                    >
                      <MenuItem
                        className="more-item"
                        onClick={async () => {
                          handleMoreOptionClose();
                          if (isWeb3Connected) {
                            setIsShareOpen(true);
                          } else {
                            // connectWallet();
                            setIsConnectWalletAlertOpen(true);
                          }
                        }}
                      >
                        Share
                      </MenuItem>
                      <MenuItem
                        className="more-item"
                        onClick={async () => {
                          if (isWeb3Connected) {
                            setIsReportOpen(true);
                          } else {
                            await handleMoreOptionClose();
                            // connectWallet();
                            setIsConnectWalletAlertOpen(true);
                          }
                        }}
                      >
                        Report
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              </div>
              <div className="profile-info">
                <p className="description">{userData?.bio}</p>
                {isSelectedProfileUser && (
                  <>
                    {/* <div>
                    <button
                      className="btn-continue"
                      onClick={startScanning}
                      >
                      Scan Token 
                    </button>
                    <p style={{color: "#ffffff", fontSize: '12px'}}>{lastScanned ? `last scanned at ${lastScanned}` : ''}</p>
                    </div> */}
                    
                    <button
                      className="btn-continue edit-profile"
                      onClick={goToEditProfile}
                    >
                      Edit Profile
                    </button>

                    
                  </>
                )}
                {metaMaskAddress && !isSelectedProfileUser && (
                  <button
                    onClick={followUnfollowUser}
                    className={`btn-continue ${
                      isUserFollowed ? "btn-unfolow" : ""
                    }`}
                  >
                    {isUserFollowed ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>
              <div className="follow-heading">
                <p
                  className="title"
                  onClick={() => {
                    setSelectedFollow("following");
                    setIsFollowModalOpen(true);
                    printLog([userData.following], 'success');
                  }}
                >
                  {userData.following.length}
                  <span> Followings</span>
                </p>
                <p
                  className="title"
                  onClick={() => {
                    setSelectedFollow("follower");
                    setIsFollowModalOpen(true);
                    printLog([userData.follower], 'success');
                  }}
                >
                  {userData.follower.length}
                  <span> Followers</span>
                </p>
              </div>
            </div>
            {/* <div className="banner container">
              <div className="banner-content">
                {isSelectedProfileUser && (
                  <div className="banner-hover">
                    <p className="banner-lead">
                      PNG or JPEG Max 100MB <br /> Recommended width,
                      height ratio 2 to 4
                    </p>
                    <Dropzone
                      name="file"
                      className="drop-zone"
                      multiple={false}
                      onDrop={(value) => handleFileUpload(value, "isCover")}
                    >
                      <button className="btn-sign">
                        {userData.back_img ? "Edit Image" : "Choose Image"}
                      </button>
                    </Dropzone>
                  </div>
                )}

                <img
                  src={
                    userData.back_img
                      ? userData.back_img
                      : "/images/yiki_bg.png"
                  }
                  // src={"/images/yiki_bg.png"}
                  alt="banner"
                  className="banner-image"
                  style={{objectFit: "cover"}}
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
                {isSelectedProfileUser && (
                  <Dropzone
                    name="file"
                    className="avatar-drop-zone"
                    multiple={false}
                    onDrop={(value) => handleFileUpload(value, "isProfile")}
                  >
                    <button className="btn-sign" style={{ width: 89 }}>
                      Edit
                    </button>
                  </Dropzone>
                )}
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
            </div> */}
            <div className="profile-content">
              <div className="position-relative">
                {/* <div className="floating-actions1">
                  <div className="mobile-view">
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
                      className="btn-continue btn-follow"
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
                      title={`${capitalize(userData.firstname)} ${capitalize(
                        userData.lastname
                      )}`}
                      placement={"top"}
                    >
                      <p className="info-lead">
                        {userData.firstname + " " + userData.lastname}
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

                  <p className="info-sub-lead" style={{ height: 45 }}>
                    {userData.bio ? userData.bio : ""}
                  </p>
                  <p className="info-sub-lead" style={{ height: 22.5, cursor: 'pointer' }} onClick={()=>onProfileUrlClick(userData.portfolio_url)}>
                    {userData.portfolio_url ? userData.portfolio_url : ""}
                  </p>
                  <div className="follower-group">
                    <p
                      className="info-lead1"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        history.push(`/follower/${userData.address}`)
                      }
                    >
                      {userData.follower.length} Followers
                    </p>
                    <p
                      className="info-lead"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        history.push(`/following/${userData.address}`)
                      }
                    >
                      {userData.following.length} Following
                    </p>
                  </div>
                </div> */}

                <div className="togglebar-container">
                  <div className="profile-nav-menu1">
                    {mainFilters.map((filter, index) => (
                      <div
                        key={index}
                        className={`nav-menu ${
                          selectedFilter === filter.key ? "active" : ""
                        }`}
                        onClick={() => onChangeMainFilter(filter)}
                      >
                        {filter.value}
                      </div>
                    ))}
                  </div>
                  <div
                    className="filter-wrapper"
                    onClick={() => setIsShowingFilter(!isShowingFilter)}
                  >
                    <p>Filter</p>
                    {isShowingFilter ? (
                      <ArrowDropUpIcon />
                    ) : (
                      <ArrowDropDownIcon />
                    )}
                  </div>
                </div>

                <>
                  
                    <div className="position-relative">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mobile-filter-btn" onClick={() => setIsShowingFilter(!isShowingFilter)}>
                            <rect x="0.5" y="0.5" width="39" height="39" rx="3.5" fill="black" stroke="#373737"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.9746 14.4423C18.9746 12.5412 20.5158 11 22.4169 11C24.0605 11 25.435 12.1519 25.7773 13.6924L28.6991 13.6924C29.1133 13.6924 29.4491 14.0282 29.4491 14.4424C29.4491 14.8566 29.1133 15.1924 28.6991 15.1924L25.7773 15.1924C25.4349 16.7328 24.0604 17.8846 22.4169 17.8846C20.5158 17.8846 18.9746 16.3434 18.9746 14.4423ZM22.4169 12.5C21.3442 12.5 20.4746 13.3696 20.4746 14.4423C20.4746 15.515 21.3442 16.3846 22.4169 16.3846C23.4896 16.3846 24.3592 15.515 24.3592 14.4423C24.3592 13.3696 23.4896 12.5 22.4169 12.5ZM10.75 13.6923C10.3358 13.6923 10 14.0281 10 14.4423C10 14.8565 10.3358 15.1923 10.75 15.1923H16.1346C16.5488 15.1923 16.8846 14.8565 16.8846 14.4423C16.8846 14.0281 16.5488 13.6923 16.1346 13.6923H10.75ZM10.75 25.9609H12.7733C13.1156 27.5013 14.4902 28.6532 16.1337 28.6532C18.0348 28.6532 19.576 27.112 19.576 25.2109C19.576 23.3097 18.0348 21.7686 16.1337 21.7686C14.4902 21.7686 13.1156 22.9204 12.7733 24.4609H10.75C10.3358 24.4609 10 24.7966 10 25.2109C10 25.6251 10.3358 25.9609 10.75 25.9609ZM16.1337 27.1532C15.0715 27.1532 14.2085 26.3006 14.1917 25.2424C14.1921 25.2319 14.1923 25.2214 14.1923 25.2109C14.1923 25.2003 14.1921 25.1898 14.1917 25.1793C14.2085 24.1212 15.0715 23.2686 16.1337 23.2686C17.2064 23.2686 18.076 24.1382 18.076 25.2109C18.076 26.2836 17.2064 27.1532 16.1337 27.1532ZM22.416 24.4609C22.0018 24.4609 21.666 24.7967 21.666 25.2109C21.666 25.6252 22.0018 25.9609 22.416 25.9609H28.6981C29.1123 25.9609 29.4481 25.6252 29.4481 25.2109C29.4481 24.7967 29.1123 24.4609 28.6981 24.4609H22.416Z" fill="white"/>
                          </svg>
                          {isShowingFilter && (
                      <SubFilters
                        setSelectedSubFilterFun={setSelectedSubFilterFun}
                        nftTypeFilter={false}
                        collectionTypeFilter={true}
                        saleTypeFilter={true}
                        priceRangeFilter={true}
                        currencyTypeFilter={true}
                        sortByFilter={false}
                        sortByTime={true}
                        submissionCountFilter={false}
                        sortByNetwork={true}
                      />
                      )}
                   </div>
                  

                  <div className="row items-row position-relative">
                  
                    {nftsLoading ? (
                      <div className="spinnerStyle">
                        <Spinner animation="border" />
                      </div>
                    ) : nfts && nfts.length > 0 ? (
                      <>
                        {nfts.map((nft, index) => (
                          <div key={index} className="explore-item">
                            <NftCard
                              item={nft}
                              key={index}
                              user={nft.holderData}
                              loggedInUser={loggedInUserData}
                              likeNFT={likeNFT}
                              showMenu={true}
                            />
                          </div>
                        ))}

                        {!nftsLoading && totalCount > 8 && (
                          <div className="pagination-wrapper">
                            <span className="result-info">
                              {`Results: ${recordsFrom} - ${recordsTo} of ${totalCount}`}
                            </span>
                            {totalCount > limit && (
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
                            <Select value={limit} onChange={handleChangeLimit}>
                              <MenuItem value={8}>8</MenuItem>
                              <MenuItem value={12}>12</MenuItem>
                              <MenuItem value={16}>16</MenuItem>
                            </Select>
                          </div>
                        )}
                      </>
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
                            Browse our marketplace to discover <br />{" "}
                            Challenges or create your own Challenge!
                          </p>
                          <button
                            className="btn-continue"
                            onClick={() => history.push("/discover")}
                          >
                            Browse
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
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
                <button
                  className="btn-continue"
                  onClick={() => history.push("/discover")}
                >
                  Browse Marketplace
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="spinnerStyle">
            <Spinner animation="border" />
          </div>
        )}
      </div>

      <Dialog
        open={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        className="mobile-root-modal"
      >
        <DialogTitle onClose={() => setIsMoreOpen(false)}></DialogTitle>
        <DialogContent style={{ marginTop: -35 }}>
          <div className="d-flex align-items-center modal-menu">
            {/* chat request dialog button */}
            <UserChatRequestDialogButton
              userData={userData}
              showNotification={showNotification}
              isSelectedProfileUser={isSelectedProfileUser}
              isSmall={true}
            />

            <span className="text-modal">Message</span>
          </div>
          <div
            className="d-flex align-items-center modal-menu"
            onClick={() => setIsShareOpen(true)}
          >
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
          <div
            className="d-flex align-items-center modal-menu"
            onClick={() => {
              handleSocialLinks("tiktok_url");
            }}
          >
            <img src="/images/tiktok1.png" alt="Item" />
            <span className="text-modal">TikTok</span>
          </div>
          <div
            className="d-flex align-items-center modal-menu"
            onClick={() => {
              handleSocialLinks("twitter_url");
            }}
          >
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
          <div
            className="d-flex align-items-center modal-menu"
            onClick={() => {
              handleSocialLinks("instagram_url");
            }}
          >
            <img src="/images/insta-inner.png" alt="Item" width={15} />
            <span className="text-modal">Instagram</span>
          </div>
          {!isSelectedProfileUser && (
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
              <span
                className="text-modal"
                onClick={() => setIsReportOpen(true)}
              >
                Report
              </span>
            </div>
          )}
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
            className="share-modal-menu"
            style={{ marginBottom: 5 }}
          >
            <div className="d-flex flex-column align-items-center modal-share">
              <a
                onClick={() => hadleOnShareClick("twitter")}
                rel="noopener noreferrer"
                className="social-share-anchor"
              >
                <svg
                  width="28"
                  height="23"
                  viewBox="0 0 28 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M27.7622 2.67972C26.7223 3.13966 25.6196 3.44173 24.4906 3.57593C25.6806 2.86418 26.5713 1.74402 26.9967 0.424203C25.8798 1.08887 24.6554 1.55468 23.3792 1.80666C22.5219 0.889441 21.3856 0.28114 20.147 0.0763208C18.9084 -0.128498 17.6368 0.0816412 16.5299 0.67407C15.423 1.2665 14.5429 2.20802 14.0263 3.35227C13.5097 4.49652 13.3856 5.77938 13.6734 7.00142C11.4085 6.8879 9.19276 6.29933 7.17009 5.27391C5.14742 4.2485 3.36301 2.80917 1.93271 1.04937C1.42644 1.91896 1.16038 2.90748 1.16181 3.91371C1.16181 5.88865 2.16698 7.6334 3.69517 8.65492C2.7908 8.62645 1.90633 8.38221 1.1155 7.94258V8.0134C1.11577 9.32871 1.57092 10.6035 2.40377 11.6215C3.23662 12.6395 4.39591 13.3382 5.68509 13.5991C4.84556 13.8266 3.96527 13.8601 3.11087 13.6971C3.47434 14.8293 4.18279 15.8194 5.137 16.5289C6.09122 17.2384 7.24342 17.6317 8.4323 17.6538C7.25071 18.5818 5.89781 19.2678 4.45093 19.6726C3.00406 20.0773 1.49159 20.193 0 20.0128C2.60378 21.6874 5.63483 22.5763 8.73058 22.5734C19.2086 22.5734 24.9387 13.8933 24.9387 6.36536C24.9387 6.12019 24.9319 5.8723 24.921 5.62986C26.0363 4.82377 26.9989 3.8252 27.7635 2.68108L27.7622 2.67972Z" />
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
                  width="27"
                  height="26"
                  viewBox="0 0 27 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"                  
                >
                  <path d="M13.0183 0C5.82827 0 0 5.82828 0 13.0183C0 19.5157 4.76078 24.9013 10.9848 25.879V16.7805H7.67817V13.0183H10.9848V10.1503C10.9848 6.88796 12.9271 5.08623 15.9018 5.08623C17.326 5.08623 18.8153 5.34009 18.8153 5.34009V8.54258H17.175C15.5568 8.54258 15.053 9.54629 15.053 10.576V13.0183H18.663L18.0863 16.7805H15.053V25.879C21.2757 24.9026 26.0365 19.5144 26.0365 13.0183C26.0365 5.82828 20.2082 0 13.0183 0Z" />
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
                  width="28"
                  height="23"
                  viewBox="0 0 28 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.1095 13.4829L0.964517 11.5451C-0.363862 11.1346 -0.371242 10.2092 1.26217 9.54505L25.205 0.191715C26.5949 -0.38043 27.382 0.343457 26.9319 2.15691L22.8557 21.6099C22.5704 22.9955 21.7463 23.3263 20.6024 22.687L14.327 17.9904L11.4021 20.8462C11.102 21.1397 10.8585 21.391 10.396 21.4531C9.93599 21.5178 9.55716 21.3785 9.27919 20.6074L7.13902 13.4655L7.1095 13.4829Z" />
                </svg>

                <span className="text-modal-share">Telegram</span>
              </a>
            </div>
            <div className="d-flex flex-column align-items-center modal-share">
              <a
                onClick={() => hadleOnShareClick("instagram")}
                rel="noopener noreferrer"
                className="social-share-anchor"
              >
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.25 0H5.75C2.57436 0 0 2.57436 0 5.75V17.25C0 20.4256 2.57436 23 5.75 23H17.25C20.4256 23 23 20.4256 23 17.25V5.75C23 2.57436 20.4256 0 17.25 0Z" />
                  <path
                    d="M16.0975 10.7729C16.2394 11.73 16.076 12.7075 15.6303 13.5663C15.1847 14.4251 14.4796 15.1215 13.6154 15.5565C12.7511 15.9915 11.7717 16.143 10.8165 15.9892C9.86121 15.8355 8.97874 15.3845 8.29458 14.7004C7.61042 14.0162 7.15941 13.1337 7.00569 12.1785C6.85198 11.2232 7.00339 10.2438 7.43839 9.37955C7.87339 8.5153 8.56983 7.81022 9.42865 7.36459C10.2875 6.91897 11.2649 6.75549 12.222 6.89742C13.1983 7.04218 14.1021 7.4971 14.8 8.19497C15.4978 8.89284 15.9527 9.79666 16.0975 10.7729Z"
                    stroke="black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17.8184 5.16602H17.8315"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span className="text-modal-share">Instagram</span>
              </a>
            </div>
            <div className="d-flex flex-column align-items-center modal-share">
              <a
                href={` mailto:?to=&body=Check out this awesome creator on BULLZ NFT ${url}&subject=Check out this awesome creator on BULLZ NFT`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-share-anchor"
              >
                <svg
                  width="27"
                  height="24"
                  viewBox="0 0 27 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={emailShareClicked}
                >
                  <path d="M1.33333 0H25.3333C25.687 0 26.0261 0.140476 26.2761 0.390524C26.5262 0.640573 26.6667 0.979711 26.6667 1.33333V22.6667C26.6667 23.0203 26.5262 23.3594 26.2761 23.6095C26.0261 23.8595 25.687 24 25.3333 24H1.33333C0.979711 24 0.640573 23.8595 0.390524 23.6095C0.140476 23.3594 0 23.0203 0 22.6667V1.33333C0 0.979711 0.140476 0.640573 0.390524 0.390524C0.640573 0.140476 0.979711 0 1.33333 0ZM13.4133 11.5773L4.864 4.31733L3.13733 6.34933L13.4307 15.0893L23.5387 6.34267L21.7947 4.32533L13.4147 11.5773H13.4133Z" />
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
          <div className="report-content">
            <div className="report-item">
              <FormControlLabel
                control={
                  <Checkbox
                    checkedIcon={
                      <svg
                        className="checkbox-checked-icon"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z"
                          fill="#3445FF"
                        />
                        <path
                          d="M5 10.2L7.07692 12L14 6"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    }
                    checked={reportValues?.doesNotFollowRequirements}
                    name="doesNotFollowRequirements"
                    onChange={handleReportCheckboxChange}
                  />
                }
                label="Does not follow the requirements"
              />
            </div>
            <div className="report-item">
              <FormControlLabel
                control={
                  <Checkbox
                    checkedIcon={
                      <svg
                        className="checkbox-checked-icon"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z"
                          fill="#3445FF"
                        />
                        <path
                          d="M5 10.2L7.07692 12L14 6"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    }
                    checked={reportValues?.copyright}
                    name="copyright"
                    onChange={handleReportCheckboxChange}
                  />
                }
                label="Copyright infringement"
              />
            </div>
            <div className="report-item">
              <FormControlLabel
                control={
                  <Checkbox
                    checkedIcon={
                      <svg
                        className="checkbox-checked-icon"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z"
                          fill="#3445FF"
                        />
                        <path
                          d="M5 10.2L7.07692 12L14 6"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    }
                    checked={reportValues?.poorQuality}
                    name="poorQuality"
                    onChange={handleReportCheckboxChange}
                  />
                }
                label="Poor quality"
              />
            </div>
            <div className="report-item">
              <FormControlLabel
                control={
                  <Checkbox
                    checkedIcon={
                      <svg
                        className="checkbox-checked-icon"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z"
                          fill="#3445FF"
                        />
                        <path
                          d="M5 10.2L7.07692 12L14 6"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    }
                    checked={reportValues?.inappropriate}
                    name="inappropriate"
                    onChange={handleReportCheckboxChange}
                  />
                }
                label="Inappropriate"
              />
            </div>
            <div className="report-item">
              <FormControlLabel
                control={
                  <Checkbox
                    checkedIcon={
                      <svg
                        className="checkbox-checked-icon"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z"
                          fill="#3445FF"
                        />
                        <path
                          d="M5 10.2L7.07692 12L14 6"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    }
                    checked={reportValues?.other}
                    name="other"
                    onChange={handleReportCheckboxChange}
                  />
                }
                label="Other"
              />
            </div>

            <div className="actions">
              <button
                disabled={
                  !Object.values(reportValues).find((item) => item === true)
                }
                className={`btn-report ${
                  !Object.values(reportValues).find((item) => item === true)
                    ? ""
                    : "btn-active"
                }`}
                onClick={handleReportSubmit}
              >
                Submit
              </button>
              <button
                className={`btn-continue btn-cancel`}
                onClick={() => setIsReportOpen(false)}
              >
                CANCEL
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog
        open={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
        className="s-modal follow-modal"
      >
        <DialogContent>
          <div className="follow-modal-content">
            <div className="profile-nav-menu1">
              <div
                className={`nav-menu ${
                  selectedFollowFilter === "follower" ? "active" : ""
                }`}
                onClick={() => setSelectedFollow("follower")}
              >
                Followers
              </div>
              <div
                className={`nav-menu ${
                  selectedFollowFilter === "following" ? "active" : ""
                }`}
                onClick={() => setSelectedFollow("following")}
              >
                Following
              </div>
            </div>
            <div className="follow-items">
              {followUsers.length ? (
                <>
                  {followUsers.map((info, index) => (
                    <>
                      <div className="follow-item">
                        <div
                          className="content cursor-pointer"
                          onClick={() =>
                            history.push(`/profile/${info.address}`)
                          }
                        >
                          <div className="image-container">
                            <img src={info.avatar_img} alt="" />
                          </div>
                          <p className="username">@{info.username}</p>
                        </div>

                        {info.followResponse &&
                          info.followResponse !== "currentUser" && (
                            <button
                              className="btn-continue btn-unfollow"
                              onClick={() => followUnfollowUserList(info)}
                            >
                              Unfollow
                            </button>
                          )}
                        {!info.followResponse &&
                          info.followResponse !== "currentUser" && (
                            <button
                              className="btn-continue"
                              onClick={() => followUnfollowUserList(info)}
                            >
                              Follow
                            </button>
                          )}
                      </div>
                    </>
                  ))}
                </>
              ) : (
                <div className="no-follow-content">
                  {selectedFollowFilter === "follower" ? (
                    <p>{isSelectedProfileUser ? "You have no followers yet." : "This profile has no follower yet."}</p>
                  ) : (
                    <p>{isSelectedProfileUser ? "You are not following anyone yet." : "This profile is not following anyone yet."}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
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

export default Profile;
