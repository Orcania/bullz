import MoreVertIcon from "@material-ui/icons/MoreVert";
import InstagramIcon from "@material-ui/icons/Instagram";
import {
  Checkbox,
  DialogContent,
  FormControlLabel,
  Menu,
  MenuItem,
  Typography,
  DialogTitle,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import LoadingOverlay from "react-loading-overlay";
import { Spinner } from "react-bootstrap";
import { useSnackbar } from "notistack";
import ReactPlayer from "react-player/lazy";
import CustomTooltip from "components/Common/Tooltip/CustomTooltip";
import { getNetworkByChainId, isYoutubeLinked, isTwitchLinked, isTiktokLinked } from "../../common/utils";
import { useFetchTokens } from "../../data/useFetchTokens";
import { SET_REPORT_CHALLENGES, SET_REPORT_NFTS, SET_USER_DATA } from "../../redux/constants";
import { ChallengeService } from "../../services/challenge.service";
import { CollectionService } from "../../services/collection.service";
import { NftService } from "../../services/nft.service";
import { UserService } from "../../services/user.service";
import AddChallengeSubmission from "./addChallengeSubmission";
import CommentsList from "./commentsList";
import "./style.scss";
import SubmissionsList from "./submissionsList";
import WinnersList from "./winnersList";
import { useLocation } from "react-router-dom";
import ChallengeDetails from "./ChallengeDetails";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import Lightbox from "react-image-lightbox";
import CloseIcon from "@material-ui/icons/Close";
import { isInstagramLinked, isTwitterLinked } from "../../common/utils";
import { ReportService } from "services/report.service";
import { NftScannerService } from "services/nft-scanner.service";
import parse from "html-react-parser";
import { setNetworkSwitchConfig } from "redux/actions/web3action";
import CustomAlert from "components/CustomAlert";
import { YouTube } from "@material-ui/icons";
import { ShareService } from "services/share.service";
import CopyIcon from "components/Common/Icons/CopyIcon";
import { createTasks } from './../../data/createTasks';
import EyeIcon from "components/Common/Icons/EyeIcon";
import InfoIcon from "components/Common/Icons/InfoIcon";
import CustomAccordion from './../../components/CustomAccordion/index';
import _ from "lodash";
import TaskBody from "./TaskBody";
import { TasksService } from "services/tasks.service";
import ChallengeCountDown from "components/ChallengeTimmer/challengeTimmer";
import { printLog } from "utils/printLog";

var Big = require("big.js");

const notificationConfig = {
  preventDuplicate: true,
  vertical: "bottom",
  horizontal: "right",
};

const Art = (props) => {
  // let _nft = props.history.location.state.nft;
  // let _challenge = props?.history?.location?.state?.challenge;

  let dispatch = useDispatch();
  let history = useHistory();

  const { enqueueSnackbar } = useSnackbar();
  const [nftNetwork, setNftNetwork] = useState(null);
  const tokens = useFetchTokens(nftNetwork);
  const userData = useSelector((state) => state.auth.userData);
  const web3Object = useSelector((state) => state.web3.web3object);
  const metaMaskAddress = useSelector((state) => state.web3.metaMaskAddress);
  const network = useSelector((state) => state.web3.network);
  const isWeb3Connected = useSelector((state) => state.web3.web3connected);
  const wcPopupConfig = useSelector((state) => state.web3.wcPopupConfig);
  const wcProvider = useSelector((state) => state.web3.wcProvider);
  const networkSwitchConfig = useSelector(
    (state) => state.web3.networkSwitchConfig
  );
  const userService = new UserService(network.backendUrl);
  const nftService = new NftService(network.backendUrl);
  const collectionService = new CollectionService(network.backendUrl);
  const challengeService = new ChallengeService(network.backendUrl);
  const reportService = new ReportService(network.backendUrl);
  const nftScannerService = new NftScannerService(network.backendUrl);
  const shareService = new ShareService(network.backendUrl);
  const taskService = new TasksService(network.backendUrl);

  const [selectedTab, setSelectedTab] = useState("submissions");
  const [nft, setSelectedNft] = useState("");
  const [loading, setLoading] = useState(false);

  const [isUserOwner, setIsOwner] = useState(false);
  const [addSubmission, setAddSumbission] = useState(false);

  const [challenge, setChallenge] = useState("");

  const [submissions, setSubmissions] = useState("");
  const [isloading, setIsLoading] = useState(true);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(true);

  const [userNFTData, setUserNFTData] = useState("");
  const currentTimeM = Math.round(new Date().getTime());
  const currentTimeS = currentTimeM / 1000;

  const url = window.location.href;

  const [isTwitterNeeded, setTwitterNeeded] = useState(false);
  const [isInstagramNeeded, setInstagramNeeded] = useState(false);
  const [isYoutubeNeeded, setYoutubeNeeded] = useState(false);
  const [isTwitchNeeded, setTwitchNeeded] = useState(false);
  const [isTiktokNeeded, setTiktokNeeded] = useState(false);
  const search = useLocation().search;
  const [isOpenLightBox, setIsOpenLightbox] = useState(false);
  const [submissionEndedDialogOpen, setSubmissionEndedDialogOpen] =
    useState(false);
  const [endModalText, setEndModalText] = useState("EndModalText");
  const [endModalTitle, setEndModalTitle] = useState("EndModalTitle");
  const [reportValues, setReportValues] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElMobile, setAnchorElMobile] = React.useState(null);
  const [threeDotsOptionOpen, setThreeDotsOptionOpen] = useState(false);
  const [purchaseSuccessModalOpen, setPurchaseSuccessModalOpen] =
    useState(false);
  const [successModalText, setSuccessModalText] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);
  // for report
  const reportChallenges = useSelector((state) => state.profile.reportChallenges);
  const [isConnectWalletAlertOpen, setIsConnectWalletAlertOpen] = useState(false);
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState("");
  const [submissionFailedMessage, setSubmissionFailedMessage] = useState('There was a problem submitting to the NFT Challenge. Please try again or contact our support team. We are sorry for inconvenience.');
  const [isAllTaskCompleted, setAllTaskCompleted] = useState(false);

  const [taskList, setTaskList] = useState(false);
  const [selectedTask, setSelectedTask] = useState(-1);

  useEffect(() => {
    setNftNetwork(getNetworkByChainId(challenge.chain_id));
  }, [challenge?.chain_id]);

  async function loadNftData() {

    try {
      let _challenge = await challengeService.getChallengeById(
        props.match.params.challengeId
      );
      printLog(["_challenge", _challenge], 'success');
      if (_challenge) {
        if (_challenge.asset_type == 1) {
          let item = await _challenge.nft;
          const holderData = await userService.getUser(item.holder);
          const creatorData = await userService.getUser(item.creator);
          const collectionType =
            await collectionService.getCollectionsByAddress(
              item.collectionType
            );
          item.holderData = holderData;
          item.creatorData = creatorData;
          item.collectionType = collectionType ? collectionType : "";
          _challenge.nft = item;
          setSelectedNft(item);
          let userRelatedNftData = await nftService.userNFTData(
            item.holderData.address
          );
          if (userRelatedNftData) {
            setUserNFTData(userRelatedNftData);
          }
        }

        if (
          metaMaskAddress &&
          metaMaskAddress.toLowerCase() ===
          _challenge.creator.address.toLowerCase()
        ) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
        setSelectedTab("submissions");
        setChallenge(_challenge);

      } else {
        history.push(`/discover`);
      }
    } catch (error) {
      printLog(["error", error]);
      history.push(`/discover`);
    }
  }

  async function getDetailsAfterConnect() {
    if (nft) {
      if (
        metaMaskAddress &&
        metaMaskAddress.toLowerCase() === nft.holder.toLowerCase()
      ) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    }
  }

  useEffect(() => {
    const _addSubmission = localStorage.getItem("addSubmission", false);
    if (_addSubmission == "true") {
      setAddSumbission(_addSubmission);
      localStorage.setItem("addSubmission", "false");
    }
  }, []);

  useEffect(() => {
    loadNftData();

    // setting task list
    
  }, []);

  useEffect(() => {
    if (nft) {
      getDetailsAfterConnect();
    }
  }, [metaMaskAddress, nft]);

  const connectWallet = async (e) => {
    if (document.getElementById("connectButton")) {
      document.getElementById("connectButton").click();
    }
  };

  const isTimePassed = (startTime) => {
    var launchDate = new Date(parseInt(startTime)).getTime();
    var currDate = new Date().getTime();
    return launchDate < currDate;
  };

  const showNotification = (msg, variant = "") => {
    enqueueSnackbar(msg, {
      ...notificationConfig,
      variant: variant ? variant : "error",
    });
  };

  const handleAddSubmission = async () => {

    if (!isAllTaskCompleted) return;

    if (!isWeb3Connected) {
      // connectWallet();
      setIsConnectWalletAlertOpen(true)
      return;
    }
    if (
      challenge &&
      challenge.creator.address.toLowerCase() === metaMaskAddress.toLowerCase()
    ) {
      showNotification("You can't add a submission on your own challenge.");
      return;
    }

    if (
      submissions &&
      challenge.submissionLimit > 0 &&
      submissions.length === challenge.submissionLimit
    ) {
      showNotification(
        "You are not able to submit as the limit was reached out"
      );
      return;
    }
    let alreadySubmitted = submissions?.find(
      (sub) => sub.user.address.toLowerCase() === metaMaskAddress.toLowerCase()
    );
    if (alreadySubmitted) {
      showNotification("You have already added a submission.");
      return;
    }

    if (
      new Date().getTime() >= new Date(parseInt(challenge.expiresAt)).getTime()
    ) {
      showNotification("Submission time has been ended.");
      return;
    }

    let obj = {
      challenge_id: challenge.id,
      user_id: userData.id,
      // link: nftUrl,
      // linkPreview: collectionPreview ? collectionPreview : ""        
    };
    setLoading(true)
    
    let res = await challengeService.addSubmission(obj);
    if (res && res.success) {
      getSubmissionsList();
      setIsSubmissionSuccess("success");
      await updateTasks(res.data.id);

    } else {
      setSubmissionFailedMessage(res.data);
      setIsSubmissionSuccess("failed");
    }
    setLoading(false);
  };

  const updateTasks = async (submitId) => {
    const task_id_list = [];
    Object.keys(taskList).map(key => {
      const item = taskList[key];
      item.map(innerItem => {
        task_id_list.push(innerItem.submittedTask.id);
      });
    });
    const obj = {
      submit: submitId,
      task_id_list: JSON.stringify(task_id_list),
    };

    await taskService.updateSubmit(obj);
  }

  useEffect(() => {
    if (challenge && userData.id) {
      if (challenge.isInstagram && !isInstagramLinked(userData.instagram_url)) {
        printLog(["setInstagramNeeded"], 'success');
        setInstagramNeeded(true);
      }

      if (challenge.isTwitter && !isTwitterLinked(userData.twitter_url)) {
        setTwitterNeeded(true);
        printLog(["setTwitterNeeded"], 'success');
      }

      if (challenge.isYoutube && !isYoutubeLinked(userData.youtube_url)) {
        setYoutubeNeeded(true);
        printLog(["setYoutubeNeeded"], 'success');
      }

      if (challenge.isTwitch && !isTwitchLinked(userData.twitch_url)) {
        setTwitchNeeded(true);
        printLog(["setTwitchNeeded"], 'success');
      }


      if (challenge.isTiktok && !isTiktokLinked(userData.tiktok_url)) {
        setTiktokNeeded(true);
        printLog(["setTiktokNeeded"], 'success');
      }
    }
  }, [challenge, userData]);

  useEffect(() => {
    if (challenge) {
      getSubmissionsList();
      if (challenge.challenge_tasks?.length > 0) {
        setTaskList(_.groupBy(challenge.challenge_tasks, 'task_template.social_name'))
      }
      
    }
  }, [challenge]);

  const getSubmissionsList = async () => {
    const owner = await challengeService.getSubmissions(challenge.id);
    if (owner.data) {
      let temp = [];
      for (let i = 0; i < owner.data.length; i++) {
        let item = owner.data[i];
        temp.push(item);
      }
      setSubmissions([...temp]);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const likedByUser = (nft) => {
    return userData.likes && userData.likes.length > 0
      ? userData.likes.find((like) => like.assetId === nft.id)
      : undefined;
  };

  const likeNFT = async () => {
    if (isWeb3Connected && nft && userData) {
      const body = {
        assetId: nft.id,
        user_id: userData.id,
      };
      let res = await nftService.likeUnlikeNFT(body);
      if (res) {
        let likedUpdatedUserData = { ...userData };
        likedUpdatedUserData.likes = [...res.data.likedUpdated.likes];
        dispatch({
          type: SET_USER_DATA,
          payload: { ...likedUpdatedUserData },
        });
        setSelectedNft((prevState) => ({
          ...prevState,
          likes: res.data.likes,
        }));
      }
    }
  };

  const getUrl = (url) => {
    if (url.startsWith("https://") || url.startsWith("http://")) {
      return url;
    }
    return `https://${url}`;
  };

  const handleReportSubmit = async () => {
    if (Object.values(reportValues).find((item) => item === true)) {
      if (!reportChallenges.includes(challenge.id)) {
        let feedbacks = [];
        for (const [key, value] of Object.entries(reportValues)) {
          if (value) {
            feedbacks.push(key);
          }
        }

        const reportData = {
          report_for: "challenge",
          reporter_id: userData.id,
          reported_id: challenge.id,
          report_list: feedbacks,
        };
        const addReport = await reportService.saveReport(reportData).then(res => {
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
            type: SET_REPORT_CHALLENGES,
            payload: [...reportChallenges, challenge.id],
          });
          showNotification("Your report has been submitted.", "success");
          setIsMoreOpen(false);
          setReportValues({});
        }
      } else {
        showNotification("you already submitted report for this challenge.");
      }
    } else {
      showNotification("Please select an option.");
    }
  };

  const handleNftTypeClick = () => {
    history.push(`/challenges`);
  };

  const handleReportCheckboxChange = (e) => {
    setReportValues({ ...reportValues, [e.target.name]: e.target.checked });
  };

  const handleMoreOptionClose = () => {
    setAnchorEl(null);
    setAnchorElMobile(null);
    setThreeDotsOptionOpen(false);
  };

  const refreshMetadata = async () => {
    setLoading(true);
    const refresh = await nftScannerService.refreshMetadata({
      owner: nft.holderData.address,
      address: nft.collectionType.address,
      tokenId: nft.assetId,
      chain_id: nft.chain_id,
    });
    if (refresh) {
      if (refresh.metadataError) {
        showNotification("Metadata not found");
      } else {
        loadNftData();
        showNotification("Metadata updated.", "success");
      }
    }
    setLoading(false);
  };

  const getIconByChainId = (chainId, large = false) => {
    if (!chainId) return;

    const nftNetwork = getNetworkByChainId(parseInt(chainId));
    const width = large ? "52" : "24";
    const height = large ? "52" : "25";
    const icon =
      nftNetwork.chainName === "Binance Smart Chain" ? (
        <svg
          className="mr-0"
          width={width}
          height={width}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="12" fill="#191A1B" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.5666 13.2105L16.0599 14.7035L12.0004 18.7695L7.94512 14.7035L9.43849 13.2105L12.0004 15.7792L14.5666 13.2105ZM12.0004 10.6374L13.5152 12.1563L12.0004 13.6751L10.4899 12.1606V12.1563L10.7559 11.8895L10.8847 11.7604L12.0004 10.6374ZM6.89376 10.659L8.38713 12.1563L6.89376 13.6493L5.40039 12.152L6.89376 10.659ZM17.107 10.659L18.6004 12.1563L17.107 13.6493L15.6137 12.152L17.107 10.659ZM12.0004 5.53876L16.0557 9.6048L14.5623 11.1021L12.0004 8.52913L9.43849 11.0978L7.94512 9.6048L12.0004 5.53876Z"
            fill="white"
          />
        </svg>
      ) : nftNetwork.chainName === "Polygon" ? (
        <svg
          className="mr-0"
          width={width}
          height={height}
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="12" cy="12.5" rx="12" ry="11.7" fill="#191A1B" />
          <path
            d="M15.6354 9.49364C15.3792 9.35257 15.0516 9.35257 14.7618 9.49364L12.7208 10.6545L11.3349 11.3921L9.33168 12.5489C9.0755 12.69 8.74793 12.69 8.45816 12.5489L6.89169 11.634C6.63551 11.4929 6.45493 11.2107 6.45493 10.8963V9.13894C6.45493 8.85679 6.60191 8.57867 6.89169 8.40132L8.45816 7.52262C8.71433 7.38154 9.04191 7.38154 9.33168 7.52262L10.8981 8.43759C11.1543 8.57867 11.3349 8.86082 11.3349 9.17522V10.3361L12.7208 9.56217V8.36907C12.7208 8.08692 12.5738 7.8088 12.284 7.63145L9.36948 5.97885C9.1133 5.83778 8.78573 5.83778 8.49595 5.97885L5.51001 7.66773C5.22023 7.8088 5.07324 8.09095 5.07324 8.36907V11.6702C5.07324 11.9524 5.22023 12.2305 5.51001 12.4079L8.46236 14.0605C8.71853 14.2015 9.04611 14.2015 9.33588 14.0605L11.3391 12.9359L12.725 12.162L14.7282 11.0374C14.9844 10.8963 15.312 10.8963 15.6018 11.0374L17.1682 11.9161C17.4244 12.0572 17.605 12.3393 17.605 12.6537V14.4111C17.605 14.6933 17.458 14.9714 17.1682 15.1487L15.6396 16.0274C15.3834 16.1685 15.0558 16.1685 14.766 16.0274L13.1954 15.1487C12.9392 15.0077 12.7586 14.7255 12.7586 14.4111V13.2866L11.3727 14.0605V15.2213C11.3727 15.5034 11.5197 15.7816 11.8095 15.9589L14.7618 17.6115C15.018 17.7526 15.3456 17.7526 15.6354 17.6115L18.5877 15.9589C18.8439 15.8178 19.0245 15.5357 19.0245 15.2213V11.8839C19.0245 11.6017 18.8775 11.3236 18.5877 11.1462L15.6354 9.49364Z"
            fill="white"
          />
        </svg>
      ) : nftNetwork.chainName === "ETH" ? (
        <svg
          className="mr-0"
          width={width}
          height={height}
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="12" cy="12.5" rx="12" ry="11.7" fill="#191A1B" />
          <g clip-path="url(#clip0_1869_12923)">
            <path
              d="M8.13477 13.0285L12.0487 6.63599L15.9627 13.0285L12.0487 15.3086L8.13477 13.0285Z"
              fill="white"
            />
            <path
              d="M12.0489 16.0269L15.8375 13.6748L12.0489 19.0613L8.1709 13.6748L12.0489 16.0269Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_1869_12923">
              <rect
                width="13.9512"
                height="13.9512"
                fill="white"
                transform="translate(5.07324 5.87305)"
              />
            </clipPath>
          </defs>
        </svg>
      ) : nftNetwork.chainName === "Avalanche C-CHAIN" ? (
        <svg className="avax-svg" width="20" height="20" viewBox="0 0 81 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40.5 80C62.5914 80 80.5 62.0914 80.5 40C80.5 17.9086 62.5914 0 40.5 0C18.4086 0 0.5 17.9086 0.5 40C0.5 62.0914 18.4086 80 40.5 80Z" fill="black" />
          <path d="M51.4538 39.9307C52.5296 38.0805 54.2656 38.0805 55.3414 39.9307L62.0408 51.6404C63.1167 53.4906 62.2365 55 60.0848 55H46.5882C44.461 55 43.5808 53.4906 44.6321 51.6404L51.4538 39.9307ZM38.4951 17.3876C39.5709 15.5375 41.2824 15.5375 42.3582 17.3876L43.8497 20.0655L47.3706 26.2247C48.2263 27.9775 48.2263 30.0468 47.3706 31.7996L35.561 52.176C34.4852 53.8315 32.7003 54.8783 30.7198 55H20.9152C18.7635 55 17.8833 53.515 18.9592 51.6404L38.4951 17.3876Z" fill="white" />
        </svg>
      ) : nftNetwork.chainName === "Arbitrum One" ? (
        <svg style={{marginRight: 0}} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 124.983 140.32">
          <g id="symbol" transform="translate(-177.491 -53.193)">
            <path id="Path_153" data-name="Path 153" d="M266.978,128.665l10.305-17.485,27.776,43.262.013,8.3-.091-57.131a4.3,4.3,0,0,0-1.99-3.428L252.984,73.42a4.408,4.408,0,0,0-3.821.018,4.352,4.352,0,0,0-.448.259l-.174.11L200,101.935l-.189.085a4.417,4.417,0,0,0-.717.418,4.29,4.29,0,0,0-1.729,2.731,4.419,4.419,0,0,0-.062.505l.076,46.556,25.872-40.1c3.257-5.317,10.354-7.03,16.942-6.937l7.732.2-45.56,73.064,5.371,3.092,46.106-76.083,20.379-.074-45.987,78L247.4,194.422l2.29,1.317a4.4,4.4,0,0,0,3.087.061l50.71-29.387-9.7,5.618Zm3.932,56.627-19.356-30.379,11.815-20.049,25.42,40.066Z" transform="translate(-11.186 -11.178)" fill="#2d374b"/>
            <path id="Path_154" data-name="Path 154" d="M321.883,235.122,341.239,265.5l17.88-10.362L333.7,215.073Z" transform="translate(-81.515 -91.387)" fill="#28a0f0"/>
            <path id="Path_155" data-name="Path 155" d="M395.4,212.248l-.013-8.3-27.776-43.262L357.3,178.169l26.814,43.366,9.7-5.618a4.3,4.3,0,0,0,1.587-3.129Z" transform="translate(-101.511 -60.683)" fill="#28a0f0"/>
            <path id="Path_156" data-name="Path 156" d="M177.491,212.312l13.691,7.889,45.56-73.064-7.732-.2c-6.588-.093-13.685,1.619-16.942,6.937l-25.872,40.1-8.7,13.373v4.969Z" transform="translate(0 -52.917)" fill="#fff"/>
            <path id="Path_157" data-name="Path 157" d="M287.75,147.406l-20.378.074-46.106,76.083,16.115,9.279,4.382-7.433Z" transform="translate(-24.713 -53.187)" fill="#fff"/>
            <path id="Path_158" data-name="Path 158" d="M302.474,94.114a12.98,12.98,0,0,0-6.093-10.435L245.719,54.545a13.178,13.178,0,0,0-11.624,0c-.423.213-49.268,28.542-49.268,28.542a13.016,13.016,0,0,0-1.94,1.148,12.881,12.881,0,0,0-5.4,9.854v60.338l8.7-13.373L186.12,94.5a4.325,4.325,0,0,1,1.791-3.236c.23-.165,49.909-28.921,50.067-29a4.408,4.408,0,0,1,3.821-.018l50.007,28.765a4.3,4.3,0,0,1,1.99,3.428v57.672a4.2,4.2,0,0,1-1.495,3.129l-9.7,5.618-5,2.9-17.88,10.362-18.133,10.509a4.395,4.395,0,0,1-3.087-.061l-21.453-12.339-4.382,7.432,19.28,11.1c.638.362,1.206.684,1.672.946.722.4,1.214.675,1.387.759a12.528,12.528,0,0,0,5.118,1.053,12.89,12.89,0,0,0,4.72-.888l52.667-30.5a12.876,12.876,0,0,0,4.962-9.7Z" transform="translate(-0.001)" fill="#96bedc"/>
          </g>
        </svg>
      )  : null;

    return icon;
  };
  const renderNetwork = (chainId) => {
    if (!chainId) return;

    const nftNetwork = getNetworkByChainId(parseInt(chainId));

    return (
      <p className="network-name">
        <CustomTooltip
          title={`This Challenge is on ${nftNetwork.chainName} blockchain`}
          placement="top-start"
        >
          {getIconByChainId(chainId)}
        </CustomTooltip>
        <span className="ml-1">Blockchain</span>
      </p>
    );
  };

  const handleConnectWallet = () => {
    connectWallet();
    setIsConnectWalletAlertOpen(false);
  }

  const emailShareClicked = async () => {
    const shareData = {
      shared_by: userData.address,
      link: url,
      share_on: 'email'
    }
    await shareService.addShare(shareData);
  }

  const hadleOnShareClick = async (type) => {
    let extUrl = "";
    if (type === "twitter") {
      extUrl = `http://twitter.com/share?text=Check this awesome challenge on BULLZ&url=${url}`;
    } else if (type === "facebook") {
      extUrl = `https://www.facebook.com/sharer.php?display=page&u=${url}`
    } else if (type === "telegram") {
      extUrl = `https://telegram.me/share/url?url=${url}&text=Check out this awesome challenge on BULLZ`;
    } else if (type === "instagram") {
      showNotification('Instagram sharing is not supported yet');
      return;
    }
    const shareData = {
      shared_by: userData.address,
      link: extUrl,
      share_on: type
    }
    await shareService.addShare(shareData);
    setIsShareOpen(false);
    window.open(extUrl, "_blank");
  };

  // Rendering icon
  const renderIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'twitter':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.9388 6.00729C19.245 6.49666 18.4768 6.87096 17.6639 7.11575C17.2275 6.61405 16.6476 6.25846 16.0026 6.09707C15.3576 5.93568 14.6786 5.97627 14.0574 6.21337C13.4362 6.45046 12.9028 6.87262 12.5294 7.42273C12.156 7.97285 11.9605 8.62438 11.9694 9.28922V10.0137C10.6962 10.0467 9.43459 9.76435 8.29695 9.19174C7.15931 8.61913 6.18094 7.77405 5.44898 6.73177C5.44898 6.73177 2.55102 13.2522 9.07142 16.1501C7.57936 17.1629 5.80192 17.6708 4 17.5991C10.5204 21.2216 18.4898 17.5991 18.4898 9.26749C18.4891 9.06568 18.4697 8.86438 18.4318 8.66616C19.1712 7.93696 19.693 7.01629 19.9388 6.00729V6.00729Z" fill="white" />
        </svg>
      case 'instagram':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M15.2525 5H8.4175C6.53007 5 5 6.53007 5 8.4175V15.2525C5 17.1399 6.53007 18.67 8.4175 18.67H15.2525C17.1399 18.67 18.67 17.1399 18.67 15.2525V8.4175C18.67 6.53007 17.1399 5 15.2525 5ZM12.205 9.49475C11.7194 9.42274 11.2234 9.50568 10.7877 9.73179C10.3519 9.9579 9.99853 10.3156 9.77781 10.7542C9.5571 11.1927 9.48027 11.6896 9.55827 12.1743C9.63626 12.659 9.8651 13.1068 10.2122 13.4539C10.5594 13.801 11.0071 14.0299 11.4918 14.1079C11.9765 14.1859 12.4735 14.109 12.912 13.8883C13.3505 13.6676 13.7082 13.3142 13.9343 12.8785C14.1604 12.4427 14.2434 11.9468 14.1714 11.4611C14.0979 10.9658 13.8671 10.5072 13.513 10.1531C13.1589 9.79902 12.7003 9.5682 12.205 9.49475ZM10.4192 9.02169C11.0043 8.71809 11.6703 8.60671 12.3223 8.7034C12.9875 8.80203 13.6032 9.11197 14.0787 9.58743C14.5542 10.0629 14.8641 10.6787 14.9627 11.3438C15.0594 11.9959 14.948 12.6618 14.6444 13.2469C14.3408 13.832 13.8605 14.3065 13.2716 14.6029C12.6828 14.8993 12.0155 15.0024 11.3647 14.8977C10.7139 14.793 10.1127 14.4857 9.64655 14.0196C9.18043 13.5535 8.87315 12.9522 8.76843 12.3014C8.6637 11.6506 8.76686 10.9833 9.06323 10.3945C9.35959 9.80567 9.83408 9.3253 10.4192 9.02169ZM15.5899 7.57033C15.3138 7.57033 15.0899 7.79418 15.0899 8.07033C15.0899 8.34647 15.3138 8.57033 15.5899 8.57033H15.596C15.8721 8.57033 16.096 8.34647 16.096 8.07033C16.096 7.79418 15.8721 7.57033 15.596 7.57033H15.5899Z" fill="white" />
        </svg>
      case 'tiktok':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.8492 3.17129C11.9591 3.06162 12.108 3.00002 12.2632 3H14.6169C14.7618 3.00008 14.9016 3.05383 15.0092 3.15086C15.1168 3.2479 15.1846 3.38135 15.1997 3.52547C15.3914 5.35173 16.8607 6.78758 18.7039 6.91982C18.8517 6.93054 18.99 6.99684 19.0908 7.10538C19.1917 7.21391 19.2478 7.35663 19.2477 7.50482V10.2421C19.2477 10.3882 19.1931 10.5291 19.0947 10.6371C18.9962 10.7452 18.8609 10.8125 18.7154 10.8259C18.5697 10.8393 18.4175 10.8488 18.2574 10.8488C17.084 10.8488 16.0213 10.4168 15.1687 9.7349V15.0388C15.1687 18.1158 12.6613 20.6232 9.58437 20.6232C6.50741 20.6232 4 18.1158 4 15.0388C4 11.9618 6.50741 9.45443 9.58437 9.45443C9.69166 9.45443 9.78444 9.46119 9.86312 9.46693C9.88671 9.46865 9.90903 9.47027 9.9301 9.4716C10.0789 9.48093 10.2186 9.54662 10.3207 9.6553C10.4228 9.76399 10.4796 9.90749 10.4796 10.0566V12.5191C10.4797 12.602 10.4622 12.684 10.4283 12.7597C10.3943 12.8353 10.3447 12.9029 10.2827 12.958C10.2207 13.0131 10.1477 13.0544 10.0686 13.0792C9.98947 13.1039 9.90597 13.1117 9.82364 13.1018C9.78033 13.0966 9.74312 13.0918 9.71142 13.0876C9.64969 13.0796 9.60882 13.0743 9.58437 13.0743C8.49193 13.0743 7.61988 13.9464 7.61988 15.0388C7.61988 16.1312 8.49193 17.0044 9.58437 17.0044C10.6856 17.0044 11.6519 16.1349 11.6519 15.0709C11.6519 15.014 11.653 14.3311 11.6553 13.2518C11.6564 12.7338 11.6579 12.1344 11.6594 11.4927C11.6611 10.797 11.6629 10.0517 11.6645 9.30675C11.6706 6.44256 11.6771 3.585 11.6771 3.585C11.6774 3.42975 11.7393 3.28096 11.8492 3.17129ZM7.8688 11.0173C8.30167 10.8806 8.78024 10.7932 9.30733 10.7693V10.6828C8.79993 10.7158 8.31562 10.8316 7.8688 11.0173Z" fill="white" />
          <path d="M12.2632 3V2.85H12.2632L12.2632 3ZM11.8492 3.17129L11.9551 3.27746L11.9551 3.27746L11.8492 3.17129ZM14.6169 3L14.617 2.85H14.6169V3ZM15.0092 3.15086L14.9087 3.26226L15.0092 3.15086ZM15.1997 3.52547L15.0505 3.54101L15.0505 3.54113L15.1997 3.52547ZM18.7039 6.91982L18.7148 6.77022L18.7146 6.77021L18.7039 6.91982ZM19.0908 7.10538L18.981 7.2075H18.981L19.0908 7.10538ZM19.2477 7.50482L19.0977 7.50473V7.50482H19.2477ZM19.2477 10.2421H19.0977V10.2421L19.2477 10.2421ZM18.7154 10.8259L18.7291 10.9753L18.7291 10.9753L18.7154 10.8259ZM15.1687 9.7349L15.2624 9.61776L15.0187 9.42286V9.7349H15.1687ZM9.58437 20.6232V20.4732V20.6232ZM9.86312 9.46693L9.85221 9.61653L9.85222 9.61653L9.86312 9.46693ZM9.9301 9.4716L9.92069 9.6213L9.92071 9.6213L9.9301 9.4716ZM10.3207 9.6553L10.2113 9.758L10.3207 9.6553ZM10.4796 10.0566H10.6296V10.0566L10.4796 10.0566ZM10.4796 12.5191H10.3296V12.5192L10.4796 12.5191ZM10.2827 12.958L10.1831 12.8459L10.1831 12.8459L10.2827 12.958ZM10.0686 13.0792L10.1134 13.2223H10.1134L10.0686 13.0792ZM9.82364 13.1018L9.80577 13.2507L9.80578 13.2507L9.82364 13.1018ZM9.71142 13.0876L9.73075 12.9389H9.73075L9.71142 13.0876ZM11.6553 13.2518L11.5053 13.2514V13.2514L11.6553 13.2518ZM11.6594 11.4927L11.5094 11.4923L11.6594 11.4927ZM11.6645 9.30675L11.8145 9.30707V9.30707L11.6645 9.30675ZM11.6771 3.585L11.8271 3.58533V3.5853L11.6771 3.585ZM9.30733 10.7693L9.31414 10.9191L9.45733 10.9126V10.7693H9.30733ZM7.8688 11.0173L7.81125 10.8788L7.91396 11.1603L7.8688 11.0173ZM9.30733 10.6828H9.45733V10.5227L9.29759 10.5331L9.30733 10.6828ZM12.2632 2.85C12.0682 2.85002 11.8812 2.92738 11.7432 3.06512L11.9551 3.27746C12.0369 3.19585 12.1477 3.15001 12.2632 3.15L12.2632 2.85ZM14.6169 2.85H12.2632V3.15H14.6169V2.85ZM15.1096 3.03947C14.9745 2.9176 14.799 2.85011 14.617 2.85L14.6169 3.15C14.7247 3.15006 14.8287 3.19005 14.9087 3.26226L15.1096 3.03947ZM15.3488 3.50993C15.33 3.32893 15.2448 3.16133 15.1096 3.03947L14.9087 3.26226C14.9888 3.33447 15.0393 3.43377 15.0505 3.54101L15.3488 3.50993ZM18.7146 6.77021C16.9444 6.6432 15.533 5.26425 15.3488 3.50981L15.0505 3.54113C15.2497 5.4392 16.777 6.93196 18.6932 7.06944L18.7146 6.77021ZM19.2007 7.00325C19.074 6.86694 18.9004 6.78368 18.7148 6.77022L18.693 7.06943C18.803 7.07741 18.9059 7.12674 18.981 7.2075L19.2007 7.00325ZM19.3977 7.5049C19.3978 7.3188 19.3274 7.13956 19.2007 7.00325L18.981 7.2075C19.056 7.28827 19.0977 7.39447 19.0977 7.50473L19.3977 7.5049ZM19.3977 10.2421V7.50482H19.0977V10.2421H19.3977ZM19.2055 10.7382C19.3292 10.6026 19.3977 10.4256 19.3977 10.242L19.0977 10.2421C19.0977 10.3509 19.0571 10.4557 18.9838 10.5361L19.2055 10.7382ZM18.7291 10.9753C18.9119 10.9584 19.0818 10.8739 19.2055 10.7382L18.9838 10.5361C18.9105 10.6165 18.8099 10.6665 18.7016 10.6765L18.7291 10.9753ZM18.2574 10.9988C18.4234 10.9988 18.5804 10.989 18.7291 10.9753L18.7016 10.6765C18.559 10.6897 18.4116 10.6988 18.2574 10.6988V10.9988ZM15.075 9.85205C15.951 10.5526 17.046 10.9988 18.2574 10.9988V10.6988C17.122 10.6988 16.0917 10.281 15.2624 9.61776L15.075 9.85205ZM15.3187 15.0388V9.7349H15.0187V15.0388H15.3187ZM9.58437 20.7732C12.7441 20.7732 15.3187 18.1986 15.3187 15.0388H15.0187C15.0187 18.0329 12.5784 20.4732 9.58437 20.4732V20.7732ZM3.85 15.0388C3.85 18.1986 6.42456 20.7732 9.58437 20.7732V20.4732C6.59025 20.4732 4.15 18.0329 4.15 15.0388H3.85ZM9.58437 9.30443C6.42456 9.30443 3.85 11.879 3.85 15.0388H4.15C4.15 12.0447 6.59025 9.60443 9.58437 9.60443V9.30443ZM9.87403 9.31732C9.79544 9.31159 9.69773 9.30443 9.58437 9.30443V9.60443C9.68559 9.60443 9.77343 9.61079 9.85221 9.61653L9.87403 9.31732ZM9.93952 9.32189C9.91933 9.32062 9.89778 9.31905 9.87402 9.31732L9.85222 9.61653C9.87564 9.61824 9.89874 9.61992 9.92069 9.6213L9.93952 9.32189ZM10.43 9.55261C10.3018 9.41612 10.1264 9.33361 9.93949 9.32189L9.92071 9.6213C10.0314 9.62825 10.1354 9.67713 10.2113 9.758L10.43 9.55261ZM10.6296 10.0566C10.6296 9.86932 10.5582 9.6891 10.43 9.55261L10.2113 9.758C10.2873 9.83887 10.3296 9.94565 10.3296 10.0566L10.6296 10.0566ZM10.6296 12.5191V10.0566H10.3296V12.5191H10.6296ZM10.5651 12.8211C10.6078 12.726 10.6297 12.623 10.6296 12.5189L10.3296 12.5192C10.3297 12.581 10.3167 12.642 10.2914 12.6983L10.5651 12.8211ZM10.3823 13.0702C10.4602 13.001 10.5225 12.9161 10.5651 12.8211L10.2914 12.6983C10.2661 12.7546 10.2292 12.8049 10.1831 12.8459L10.3823 13.0702ZM10.1134 13.2223C10.2128 13.1912 10.3045 13.1393 10.3823 13.0702L10.1831 12.8459C10.137 12.8868 10.0827 12.9176 10.0238 12.936L10.1134 13.2223ZM9.80578 13.2507C9.90919 13.2631 10.014 13.2534 10.1134 13.2223L10.0238 12.936C9.96489 12.9545 9.90276 12.9602 9.84149 12.9528L9.80578 13.2507ZM9.6921 13.2364C9.72379 13.2405 9.76165 13.2454 9.80577 13.2507L9.8415 12.9529C9.799 12.9478 9.76245 12.943 9.73075 12.9389L9.6921 13.2364ZM9.58437 13.2243C9.59643 13.2243 9.6244 13.2276 9.6921 13.2364L9.73075 12.9389C9.67497 12.9316 9.62122 12.9243 9.58437 12.9243V13.2243ZM7.76988 15.0388C7.76988 14.0292 8.57477 13.2243 9.58437 13.2243V12.9243C8.40908 12.9243 7.46988 13.8635 7.46988 15.0388H7.76988ZM9.58437 16.8544C8.57488 16.8544 7.76988 16.0485 7.76988 15.0388H7.46988C7.46988 16.214 8.40897 17.1544 9.58437 17.1544V16.8544ZM11.5019 15.0709C11.5019 16.0411 10.6141 16.8544 9.58437 16.8544V17.1544C10.757 17.1544 11.8019 16.2286 11.8019 15.0709H11.5019ZM11.5053 13.2514C11.503 14.3307 11.5019 15.0138 11.5019 15.0709H11.8019C11.8019 15.0143 11.803 14.3315 11.8053 13.2521L11.5053 13.2514ZM11.5094 11.4923C11.5079 12.134 11.5064 12.7335 11.5053 13.2514L11.8053 13.2521C11.8064 12.7342 11.8079 12.1347 11.8094 11.493L11.5094 11.4923ZM11.5145 9.30642C11.5129 10.0513 11.5111 10.7966 11.5094 11.4923L11.8094 11.493C11.8111 10.7974 11.8129 10.052 11.8145 9.30707L11.5145 9.30642ZM11.6771 3.585C11.5271 3.58466 11.5271 3.58467 11.5271 3.58469C11.5271 3.58471 11.5271 3.58475 11.5271 3.58479C11.5271 3.58488 11.5271 3.58501 11.5271 3.58518C11.5271 3.58553 11.5271 3.58605 11.5271 3.58674C11.5271 3.58813 11.5271 3.5902 11.5271 3.59294C11.527 3.59844 11.527 3.60664 11.527 3.61745C11.527 3.63908 11.5269 3.67117 11.5268 3.71304C11.5266 3.79677 11.5263 3.91958 11.526 4.07591C11.5253 4.38856 11.5243 4.83526 11.5231 5.37147C11.5207 6.44389 11.5176 7.87433 11.5145 9.30642L11.8145 9.30707C11.8176 7.87498 11.8207 6.44455 11.8231 5.37214C11.8243 4.83593 11.8253 4.38923 11.826 4.07658C11.8263 3.92026 11.8266 3.79744 11.8268 3.71371C11.8269 3.67185 11.827 3.63975 11.827 3.61813C11.827 3.60731 11.827 3.59911 11.8271 3.59362C11.8271 3.59087 11.8271 3.5888 11.8271 3.58742C11.8271 3.58672 11.8271 3.5862 11.8271 3.58586C11.8271 3.58568 11.8271 3.58555 11.8271 3.58547C11.8271 3.58542 11.8271 3.58539 11.8271 3.58537C11.8271 3.58535 11.8271 3.58533 11.6771 3.585ZM11.7432 3.06512C11.6052 3.20285 11.5275 3.38971 11.5271 3.58469L11.8271 3.5853C11.8273 3.46978 11.8734 3.35907 11.9551 3.27746L11.7432 3.06512ZM9.30052 10.6194C8.7609 10.644 8.2694 10.7335 7.82363 10.8742L7.91396 11.1603C8.33393 11.0277 8.79957 10.9425 9.31414 10.9191L9.30052 10.6194ZM9.15733 10.6828V10.7693H9.45733V10.6828H9.15733ZM7.92634 11.1558C8.35808 10.9764 8.82625 10.8644 9.31706 10.8325L9.29759 10.5331C8.77361 10.5672 8.27316 10.6869 7.81125 10.8788L7.92634 11.1558Z" fill="white" />
        </svg>
      case 'discord':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.0947 6.17273C17.8649 5.62451 16.5497 5.22677 15.1745 5C15.0053 5.29036 14.8086 5.68174 14.672 5.99258C13.2107 5.78347 11.7627 5.78347 10.3281 5.99258C10.1922 5.68174 9.99037 5.29036 9.82041 5C8.44366 5.22677 7.12704 5.62593 5.89725 6.17556C3.41688 9.74391 2.74447 13.2232 3.08068 16.6538C4.72609 17.8237 6.32029 18.5337 7.88851 18.9986C8.27593 18.4913 8.62104 17.9523 8.91792 17.3843C8.35163 17.1794 7.8091 16.9265 7.29625 16.6333C7.43207 16.5373 7.56492 16.4369 7.69406 16.3338C10.8201 17.7255 14.2171 17.7255 17.306 16.3338C17.4359 16.4369 17.5688 16.5373 17.7038 16.6333C17.1895 16.9279 16.6455 17.1809 16.0792 17.3857C16.3768 17.9523 16.7204 18.4928 17.1086 19C18.6776 18.5351 20.274 17.8244 21.9194 16.6538C22.3135 12.6771 21.2448 9.2296 19.0947 6.17273ZM9.34318 14.5436C8.40507 14.5436 7.63543 13.71 7.63543 12.6941C7.63543 11.6782 8.38874 10.8432 9.34318 10.8432C10.2984 10.8432 11.068 11.6768 11.0509 12.6941C11.0532 13.71 10.2984 14.5436 9.34318 14.5436ZM15.6562 14.5436C14.718 14.5436 13.9484 13.71 13.9484 12.6941C13.9484 11.6782 14.7017 10.8432 15.6562 10.8432C16.6113 10.8432 17.381 11.6768 17.3639 12.6941C17.3639 13.71 16.6106 14.5436 15.6562 14.5436Z" fill="white" />
        </svg>
      case 'telegram':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.20388 13.207L4.57032 12.0274C3.78485 11.7776 3.78048 11.2143 4.74633 10.81L18.9038 5.1167C19.7257 4.76843 20.1911 5.20906 19.9249 6.3129L17.5147 18.1538C17.346 18.9972 16.8587 19.1986 16.1823 18.8095L12.4716 15.9507L10.7421 17.689C10.5647 17.8676 10.4207 18.0206 10.1472 18.0584C9.8752 18.0978 9.65119 18.013 9.48682 17.5436L8.22133 13.1964L8.20388 13.207Z" fill="white" />
        </svg>
      case 'youtube':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M20.9966 6.00125C21.2907 6.30452 21.4997 6.68004 21.6023 7.08989C21.8762 8.60869 22.0092 10.1496 21.9995 11.6928C22.005 13.213 21.872 14.7306 21.6023 16.2267C21.4997 16.6365 21.2907 17.0121 20.9966 17.3153C20.7024 17.6186 20.3334 17.8389 19.9269 17.9539C18.4415 18.3511 12.5 18.3511 12.5 18.3511C12.5 18.3511 6.55849 18.3511 5.07311 17.9539C4.67484 17.8449 4.31141 17.635 4.01793 17.3446C3.72445 17.0541 3.51084 16.6929 3.39775 16.2958C3.12379 14.777 2.9908 13.2361 3.00049 11.6928C2.99293 10.1611 3.1259 8.63188 3.39775 7.12443C3.50033 6.71458 3.70926 6.33906 4.00342 6.0358C4.29759 5.73253 4.66658 5.51227 5.07311 5.39725C6.55849 5 12.5 5 12.5 5C12.5 5 18.4415 5 19.9269 5.36271C20.3334 5.47773 20.7024 5.69799 20.9966 6.00125ZM15.5235 11.6922L10.5578 14.5161V8.86822L15.5235 11.6922Z" fill="white" />
        </svg>
      case 'visit website':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.5002 13.3324V18.3325C17.5002 18.7746 17.3246 19.1985 17.012 19.511C16.6995 19.8236 16.2755 19.9992 15.8335 19.9992H6.66669C6.22466 19.9992 5.80073 19.8236 5.48816 19.511C5.1756 19.1985 5 18.7746 5 18.3325V9.16571C5 8.72368 5.1756 8.29975 5.48816 7.98719C5.80073 7.67462 6.22466 7.49902 6.66669 7.49902H11.6668" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15 5H20.0001V10.0001" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M10.832 14.1668L19.9988 5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      case 'question & answer':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9707 21 21 16.9707 21 12C21 7.0293 16.9707 3 12 3C7.0293 3 3 7.0293 3 12C3 16.9707 7.0293 21 12 21ZM11.0226 13.1484C10.947 13.6524 11.3754 14.0682 11.8848 14.0682H12.3078C12.428 14.0682 12.5436 14.0224 12.6313 13.9402C12.7189 13.8579 12.7718 13.7453 12.7794 13.6254C12.8307 13.152 13.0341 12.738 13.3878 12.3843L13.9548 11.8263C14.3976 11.3808 14.7072 10.9767 14.8845 10.614C15.0618 10.2459 15.15 9.8562 15.15 9.4449C15.15 8.5404 14.8773 7.8411 14.3319 7.3479C13.7865 6.8493 13.0197 6.6 12.0315 6.6C11.0523 6.6 10.2792 6.861 9.7095 7.3839C9.37228 7.69669 9.12572 8.09468 8.9958 8.5359C8.8302 9.0795 9.3198 9.5538 9.8868 9.5538C10.3674 9.5538 10.7265 9.1623 11.0604 8.7978C11.1072 8.7465 11.1531 8.6952 11.199 8.6466C11.4096 8.4243 11.6868 8.3136 12.0315 8.3136C12.7587 8.3136 13.1223 8.7222 13.1223 9.5394C13.1223 9.8103 13.0521 10.0695 12.9126 10.3161C12.7731 10.5582 12.4905 10.875 12.0666 11.2665C11.6472 11.6535 11.3583 12.0486 11.199 12.45C11.1207 12.6489 11.0622 12.882 11.0226 13.1484ZM11.0739 15.4983C10.8642 15.7062 10.7589 15.9726 10.7589 16.2966C10.7589 16.6161 10.8615 16.8798 11.0667 17.0886C11.2764 17.2956 11.5518 17.4 11.892 17.4C12.2322 17.4 12.504 17.2956 12.7101 17.0877C12.9198 16.8798 13.0251 16.6161 13.0251 16.2966C13.0251 15.9726 12.9171 15.7062 12.7029 15.4983C12.4932 15.285 12.2223 15.1788 11.892 15.1788C11.5608 15.1788 11.289 15.285 11.0739 15.4983Z" fill="white" />
        </svg>
      case 'expand':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M18.4762 10.4762H13.5238V5.52381C13.5238 4.68571 12.8381 4 12 4C11.1619 4 10.4762 4.68571 10.4762 5.52381V10.4762H5.52381C4.68571 10.4762 4 11.1619 4 12C4 12.8381 4.68571 13.5238 5.52381 13.5238H10.4762V18.4762C10.4762 19.3143 11.1619 20 12 20C12.8381 20 13.5238 19.3143 13.5238 18.4762V13.5238H18.4762C19.3143 13.5238 20 12.8381 20 12C20 11.1619 19.3143 10.4762 18.4762 10.4762Z" fill="white" />
        </svg>
      case 'collapse':
        return
    }
  }
  const handleTaskSelect = (id) => {
    if (id === selectedTask) {
      setSelectedTask(-1)
    } else {
      setSelectedTask(id);
    }
  }

  const showCustomAlert = (title, body) => {
    setEndModalTitle(title);
    setEndModalText(body);
    setSubmissionEndedDialogOpen(true);
  }
  const taskVerified = (taskId, taskValue) => {

    const newObj = {};
    let _isAllTaskCompleted = true;
    Object.keys(taskList).map(key => {
      const item = taskList[key];
      item.map(innerItem => {
        if (innerItem.id == taskId) {
          innerItem.submittedTask = taskValue;
        }

        if (!innerItem.submittedTask || !innerItem.submittedTask.isVerified) {
          _isAllTaskCompleted = false
        }
        return innerItem;
      });
      newObj[key] = item;
     
    });
    setAllTaskCompleted(_isAllTaskCompleted);
    setTaskList(newObj);
  }


  return (
    <>
      <div className="detail-page">
        <div className="container">
          <LoadingOverlay
            spinner
            active={loading}
            text="In Progress..."
          >
            <div className="h-100">
              <div className="page-content h-100">
                <div className="top-header mobile container">
                  <div className="sub-name-wrapper">
                    <p className="sub-name">
                      <p
                        className="d-inline-block"
                        style={{ cursor: "pointer" }}
                        onClick={() => history.goBack()}
                      >
                        <KeyboardBackspaceIcon
                          // onClick={goPreviousStep}
                          style={{ color: "#FFFFFF", marginRight: 12 }}
                        />
                        {/* {getNameAndIcon(nft.nftType).name} */}
                        {challenge?.asset_type == 1
                          ? "NFT Challenge"
                          : "Token Challenge"}
                      </p>
                    </p>
                  </div>
                </div>
                {/* <div className="top-header mobile container pt-0 mb-3">
                  <div className="favorite-wrapper align-items-center">
                    {nft && nft.id ? (
                      <>
                        {nft?.holderData?.address?.toLowerCase() ==
                          userData?.address?.toLowerCase() && (
                            <CustomTooltip
                              title="Refresh metadata"
                              placement="top"
                            >
                              <img
                                style={{
                                  width: "17px",
                                  height: "17px",
                                  marginRight: "10px",
                                }}
                                src="/images/refresh.png"
                                alt=""
                                onClick={refreshMetadata}
                              />
                            </CustomTooltip>
                          )}
                        <p className="favorite">
                          {likedByUser(nft) && isWeb3Connected && (
                            <svg className="mr-2" style={{ height: 'auto', width: 'auto' }} width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => likeNFT()}>
                              <path d="M13.05 0C15.7842 0 18 2.2973 18 5.51351C18 11.9459 11.25 15.6216 9 17C6.75 15.6216 0 11.9459 0 5.51351C0 2.2973 2.25 0 4.95 0C6.624 0 8.1 0.918919 9 1.83784C9.9 0.918919 11.376 0 13.05 0Z" fill="#4353FF" />
                            </svg>

                          )}
                          {(!likedByUser(nft) || !isWeb3Connected) && (
                            <svg className="mr-2" style={{ height: 'auto', width: 'auto' }} width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"
                              onClick={() => {
                                if (isWeb3Connected) {
                                  likeNFT();
                                } else {
                                  setIsConnectWalletAlertOpen(true);
                                }
                              }}>
                              <path d="M8.64279 2.1877L9 2.55242L9.35721 2.18769C10.1985 1.32874 11.5537 0.5 13.05 0.5C15.4684 0.5 17.5 2.532 17.5 5.51351C17.5 8.54034 15.9146 10.9458 13.997 12.7918C12.2964 14.4289 10.3809 15.583 9.17097 16.3119C9.11229 16.3473 9.05526 16.3817 9 16.415C8.94474 16.3817 8.88771 16.3473 8.82903 16.3119C7.61908 15.583 5.70361 14.4289 4.00302 12.7918C2.08545 10.9458 0.5 8.54034 0.5 5.51351C0.5 2.53433 2.5637 0.5 4.95 0.5C6.44634 0.5 7.80152 1.32874 8.64279 2.1877Z" stroke="#6B6C6D" />
                            </svg>
                          )}
                          {nft && nft.likes}
                        </p>
                        <p className="favorite">
                          <svg className="mr-2" style={{ height: 'auto', width: 'auto' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.9992 9.111L16.4992 9.1042V9.111H16.9992ZM16.9992 8.889H16.4992L16.4993 8.8958L16.9992 8.889ZM16.9992 8.27271H17.4992V7.77271H16.9992V8.27271ZM16.9674 8.27271L16.4694 8.31758L16.5104 8.77271H16.9674V8.27271ZM8.27197 16.9673H8.77197V16.5104L8.3169 16.4693L8.27197 16.9673ZM8.27197 17H7.77197V17.5H8.27197V17ZM8.98106 17L8.9822 16.5H8.98106V17ZM9.01894 17V16.5L9.0178 16.5L9.01894 17ZM16.9992 17V17.5H17.4992V17H16.9992ZM16.5 9C16.5 9.03479 16.4998 9.06953 16.4993 9.1042L17.4992 9.1178C17.4997 9.07859 17.5 9.03932 17.5 9H16.5ZM16.4993 8.8958C16.4998 8.93047 16.5 8.9652 16.5 9H17.5C17.5 8.96068 17.4997 8.92141 17.4992 8.8822L16.4993 8.8958ZM16.4992 8.27271V8.889H17.4992V8.27271H16.4992ZM16.9674 8.77271H16.9992V7.77271H16.9674V8.77271ZM9 1.5C12.912 1.5 16.125 4.49551 16.4694 8.31758L17.4654 8.22783C17.0749 3.89501 13.4342 0.5 9 0.5V1.5ZM1.5 9C1.5 4.85786 4.85786 1.5 9 1.5V0.5C4.30558 0.5 0.5 4.30558 0.5 9H1.5ZM8.3169 16.4693C4.49515 16.1246 1.5 12.9118 1.5 9H0.5C0.5 13.4339 3.89461 17.0745 8.22705 17.4653L8.3169 16.4693ZM8.77197 17V16.9673H7.77197V17H8.77197ZM8.98106 16.5H8.27197V17.5H8.98106V16.5ZM9 16.5C8.99409 16.5 8.98816 16.5 8.9822 16.5L8.97993 17.5C8.98659 17.5 8.99328 17.5 9 17.5V16.5ZM9.0178 16.5C9.01184 16.5 9.00591 16.5 9 16.5V17.5C9.00672 17.5 9.01341 17.5 9.02007 17.5L9.0178 16.5ZM16.9992 16.5H9.01894V17.5H16.9992V16.5ZM16.4992 9.111V17H17.4992V9.111H16.4992Z" fill="#6B6C6D" />
                          </svg>

                          {challenge?.totalCommentCount}
                        </p>

                      </>
                    ) : (
                      <>
                        <p className="favorite">
                          <svg className="mr-2" style={{ height: 'auto', width: 'auto' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.9992 9.111L16.4992 9.1042V9.111H16.9992ZM16.9992 8.889H16.4992L16.4993 8.8958L16.9992 8.889ZM16.9992 8.27271H17.4992V7.77271H16.9992V8.27271ZM16.9674 8.27271L16.4694 8.31758L16.5104 8.77271H16.9674V8.27271ZM8.27197 16.9673H8.77197V16.5104L8.3169 16.4693L8.27197 16.9673ZM8.27197 17H7.77197V17.5H8.27197V17ZM8.98106 17L8.9822 16.5H8.98106V17ZM9.01894 17V16.5L9.0178 16.5L9.01894 17ZM16.9992 17V17.5H17.4992V17H16.9992ZM16.5 9C16.5 9.03479 16.4998 9.06953 16.4993 9.1042L17.4992 9.1178C17.4997 9.07859 17.5 9.03932 17.5 9H16.5ZM16.4993 8.8958C16.4998 8.93047 16.5 8.9652 16.5 9H17.5C17.5 8.96068 17.4997 8.92141 17.4992 8.8822L16.4993 8.8958ZM16.4992 8.27271V8.889H17.4992V8.27271H16.4992ZM16.9674 8.77271H16.9992V7.77271H16.9674V8.77271ZM9 1.5C12.912 1.5 16.125 4.49551 16.4694 8.31758L17.4654 8.22783C17.0749 3.89501 13.4342 0.5 9 0.5V1.5ZM1.5 9C1.5 4.85786 4.85786 1.5 9 1.5V0.5C4.30558 0.5 0.5 4.30558 0.5 9H1.5ZM8.3169 16.4693C4.49515 16.1246 1.5 12.9118 1.5 9H0.5C0.5 13.4339 3.89461 17.0745 8.22705 17.4653L8.3169 16.4693ZM8.77197 17V16.9673H7.77197V17H8.77197ZM8.98106 16.5H8.27197V17.5H8.98106V16.5ZM9 16.5C8.99409 16.5 8.98816 16.5 8.9822 16.5L8.97993 17.5C8.98659 17.5 8.99328 17.5 9 17.5V16.5ZM9.0178 16.5C9.01184 16.5 9.00591 16.5 9 16.5V17.5C9.00672 17.5 9.01341 17.5 9.02007 17.5L9.0178 16.5ZM16.9992 16.5H9.01894V17.5H16.9992V16.5ZM16.4992 9.111V17H17.4992V9.111H16.4992Z" fill="#6B6C6D" />
                          </svg>
                          {challenge?.totalCommentCount}
                        </p>
                      </>
                    )}
                    <p className="favorite">
                      <svg className="mr-2" style={{ height: 'auto', width: 'auto' }} width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.1334 15.9997V14.3997C14.1334 13.5511 13.7963 12.7372 13.1962 12.1371C12.5961 11.537 11.7822 11.1999 10.9336 11.1999H4.53384C3.68519 11.1999 2.87129 11.537 2.2712 12.1371C1.67111 12.7372 1.33398 13.5511 1.33398 14.3997V15.9997" stroke="#6B6C6D" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7.73501 7.0664C9.50224 7.0664 10.9349 5.63377 10.9349 3.86654C10.9349 2.09931 9.50224 0.666687 7.73501 0.666687C5.96778 0.666687 4.53516 2.09931 4.53516 3.86654C4.53516 5.63377 5.96778 7.0664 7.73501 7.0664Z" stroke="#6B6C6D" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                      {submissions?.length ? submissions?.length : 0}
                    </p>

                    {!isUserOwner && (
                      <MoreVertIcon
                        onClick={(e) => {
                          setThreeDotsOptionOpen(true);
                          setAnchorElMobile(e.currentTarget);
                        }}
                      />
                    )}

                    <div className="more-options">
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorElMobile}
                        open={Boolean(anchorElMobile)}
                        onClose={handleMoreOptionClose}
                        className="more-menu"
                        style={{ top: 30, left: -25 }}
                      >
                        <MenuItem
                          className="more-item"
                          onClick={async () => {
                            handleMoreOptionClose();
                            if (isWeb3Connected) {
                              setIsShareOpen(true);
                            } else {
                              setIsConnectWalletAlertOpen(true);
                            }
                          }}
                        >
                          Share
                        </MenuItem>
                        <MenuItem
                          className="more-item"
                          onClick={() => {
                            if (isWeb3Connected) {
                              setIsMoreOpen(true);
                              handleMoreOptionClose();
                            } else {
                              setIsConnectWalletAlertOpen(true);
                            }
                          }}
                        >
                          Report
                        </MenuItem>
                      </Menu>
                    </div>

                  </div>
                </div> */}
                <div className="left-container desktop">
                    <h1 className="title">{challenge.name}</h1>
                    <div className="image-content">
                      <div className="inner-image-content">
                        {isTimePassed(challenge.expiresAt) ? 
                        <div className="timer-content">
                          <p className="subtitle">Challenge Ended</p>
                        </div> :
                        <div className="timer-content">
                          <p className="subtitle">Join Challenge</p>
                            {challenge && challenge.expiresAt && (
                              <ChallengeCountDown auctionETime={parseInt(challenge.expiresAt)} />
                            ) }
                        </div>}
                        <div className="image-wrapper new">
                          {nft.fileType === "video/mp4" ||
                            nft.fileType === "audio/mp3" ||
                            nft.fileType === "audio/mpeg" ||
                            nft.fileType === "video/mov" ? (
                            <ReactPlayer
                              url={challenge.file}
                              playing={false}
                              controls={true}
                              width={'100%'}
                              config={{
                                file: {
                                  attributes: {
                                    controlsList: "nodownload",
                                  },
                                },
                              }}
                            />
                          ) : (
                            <>
                              <img
                                src={challenge.file}
                                alt="Art"
                                onClick={() => setIsOpenLightbox(true)}
                              />
                              {isOpenLightBox && (
                                <Lightbox
                                  mainSrc={nft.file}
                                  onCloseRequest={() => setIsOpenLightbox(false)}
                                />
                              )}
                            </>
                          )}
                        </div>
                        <div className="participant-container">
                          <div className="avatar-container">
                            <img src="/images/avatar-1.svg" alt="" className="avatar bordered avatar-1" />
                            <img src="/images/avatar-2.svg" alt="" className="avatar bordered avatar-2" />
                            <img src="/images/avatar-3.svg" alt="" className="avatar bordered avatar-3" />
                            <img src="/images/avatar-4.svg" alt="" className="avatar bordered avatar-4" />
                            <img src="/images/avatar-5.svg" alt="" className="avatar bordered avatar-5" />
                          </div>
                          <p className="participant">{`${submissions?.length ? submissions?.length : 0} participants`}</p>
                        </div>
                      </div>


                    </div>

                    <div className="others-container">
                    <div
                      className={`custom-switch-2`}
                      style={{ width: "99%", padding: 0 }}
                    >
                      <>
                        <div
                          onClick={() => setSelectedTab("submissions")}
                          className={`
                          ${selectedTab === "submissions" ? "active" : ""}
                          d-flex justify-content-center flex-fill toggle-nav nav-left`}
                          style={{ width: "33%" }}
                        >
                          Submissions
                        </div>

                        <div
                          onClick={() => setSelectedTab("winners")}
                          style={{ width: "33%" }}
                          className={`
                          ${selectedTab === "winners" ? "active" : ""}
                          d-flex justify-content-center flex-fill toggle-nav nav-right`}
                        >
                          Winners
                        </div>
                      </>


                      <div
                        onClick={() => setSelectedTab("comments")}
                        style={{ width: "33%" }}
                        className={`
                        ${selectedTab === "comments" ? "active" : ""}
                        d-flex justify-content-center flex-fill toggle-nav nav-right`}
                      >
                        Comments
                      </div>


                      <div
                        className="toggle-bar"
                        style={{
                          left:
                            selectedTab === "winners"
                              ? "33%"
                              : selectedTab === "comments"
                                ? "67%"
                                : selectedTab === "submissions"
                                  ? "0%"
                                  : undefined,
                        }}
                      />
                    </div>

                    {selectedTab === "submissions" ? (
                      <SubmissionsList
                        challenge={challenge}
                        isloading={isloading}
                        submissions={submissions}
                      />
                    ) : selectedTab === "winners" ? (
                      <WinnersList challenge={challenge} />
                    ) : selectedTab === "comments" ? (
                      <CommentsList challenge={challenge} setChallenge={setChallenge} />
                    ) : (
                        <div className="not-found">
                          <EyeIcon />
                          <p>No item found</p>
                        </div>
                      )}
                    </div>

                    .
                  </div>
                {/* <div className="image-wrapper">
                  {nft.fileType === "video/mp4" ||
                    nft.fileType === "audio/mp3" ||
                    nft.fileType === "audio/mpeg" ||
                    nft.fileType === "video/mov" ? (
                    <ReactPlayer
                      url={challenge.file}
                      playing={false}
                      controls={true}
                      config={{
                        file: {
                          attributes: {
                            controlsList: "nodownload",
                          },
                        },
                      }}
                    />
                  ) : (
                    <>
                      <img
                        src={challenge.file}
                        alt="Art"
                        onClick={() => setIsOpenLightbox(true)}
                      />
                      {isOpenLightBox && (
                        <Lightbox
                          mainSrc={challenge.file}
                          onCloseRequest={() => setIsOpenLightbox(false)}
                        />
                      )}
                    </>
                  )}
                </div> */}
                <div className="detail-wrapper new with-bottom-bar">

                  {/* new details */}
                  <div className="detail-new-content">
                      <div className="detail-new-content-header">
                        <div className="header-item">

                        {challenge.asset_type == 1 ? (
                          <>
                            <span className="number">
                              {challenge.amountToAirdrop}
                            </span> Total NFTs                          
                          </>
                        ) : (
                          <>
                            <span className="number">
                              {(Number(challenge?.winnerCount) * Number(challenge.tokenAmount)).toFixed(2)}
                            </span>
                            Total Tokens
                          </>
                        )}
                        </div>
                        {challenge.asset_type == 1 ? (
                        <div className="header-item">
                          <div className="d-flex">                            
                              <img
                                src={
                                  nft?.collectionType
                                    ? nft.collectionType.image
                                    : "/images/card_yiki.png"
                                }
                                alt=" "
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  history.push(
                                    `/collection/${nft.collectionType?.address}`
                                  );
                                }}
                              />
                          </div>
                          {nft.collectionType
                                    ? nft?.collectionType?.name
                                    : nft?.collectionType?.address}
                        </div>) : (
                          <div className="header-item">
                          <>
                            <span className="number">
                              {challenge?.winnerCount}
                            </span>
                            Total Winners
                          </>
                        </div>
                        )}


                        <div className="header-item">
                          {renderNetwork(challenge.chain_id)}
                          {challenge.hidden_status == 2 && <p className="network-name">
                            <span className="ml-1">Status: hidden</span>
                          </p>}
                        </div>
                      </div>
                      <div className="details-new-content-stat">
                        <div className="d-flex align-items-center">
                          <img className="avatar" src={challenge?.creator?.avatar_img ? challenge?.creator?.avatar_img : "/images/default-profile-cover.png"} alt="" />
                          <span className="username">@{challenge?.creator?.username}</span>
                        </div>
                        <div className="favorite-wrapper align-items-center">
                    {nft && nft.id ? (
                      <>
                        {nft?.holderData?.address?.toLowerCase() ==
                          userData?.address?.toLowerCase() && (
                            <CustomTooltip
                              title="Refresh metadata"
                              placement="top"
                            >
                              <img
                                style={{
                                  width: "17px",
                                  height: "17px",
                                  marginRight: "10px",
                                }}
                                src="/images/refresh.png"
                                alt=""
                                onClick={refreshMetadata}
                              />
                            </CustomTooltip>
                          )}
                        <p className="favorite">
                          {/* <FavoriteIcon /> */}
                          {likedByUser(nft) && isWeb3Connected && (
                            <svg className="mr-2" style={{ height: 'auto', width: 'auto' }} width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => likeNFT()}>
                              <path d="M13.05 0C15.7842 0 18 2.2973 18 5.51351C18 11.9459 11.25 15.6216 9 17C6.75 15.6216 0 11.9459 0 5.51351C0 2.2973 2.25 0 4.95 0C6.624 0 8.1 0.918919 9 1.83784C9.9 0.918919 11.376 0 13.05 0Z" fill="#4353FF" />
                            </svg>

                          )}
                          {(!likedByUser(nft) || !isWeb3Connected) && (
                            <svg className="mr-2" style={{ height: 'auto', width: 'auto' }} width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"
                              onClick={() => {
                                if (isWeb3Connected) {
                                  likeNFT();
                                } else {
                                  // connectWallet();
                                  setIsConnectWalletAlertOpen(true);
                                }
                              }}>
                              <path d="M8.64279 2.1877L9 2.55242L9.35721 2.18769C10.1985 1.32874 11.5537 0.5 13.05 0.5C15.4684 0.5 17.5 2.532 17.5 5.51351C17.5 8.54034 15.9146 10.9458 13.997 12.7918C12.2964 14.4289 10.3809 15.583 9.17097 16.3119C9.11229 16.3473 9.05526 16.3817 9 16.415C8.94474 16.3817 8.88771 16.3473 8.82903 16.3119C7.61908 15.583 5.70361 14.4289 4.00302 12.7918C2.08545 10.9458 0.5 8.54034 0.5 5.51351C0.5 2.53433 2.5637 0.5 4.95 0.5C6.44634 0.5 7.80152 1.32874 8.64279 2.1877Z" stroke="#6B6C6D" />
                            </svg>
                          )}
                          {nft && nft.likes}
                        </p>
                        <p className="favorite">
                          <svg className="mr-2" style={{ height: 'auto', width: 'auto' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.9992 9.111L16.4992 9.1042V9.111H16.9992ZM16.9992 8.889H16.4992L16.4993 8.8958L16.9992 8.889ZM16.9992 8.27271H17.4992V7.77271H16.9992V8.27271ZM16.9674 8.27271L16.4694 8.31758L16.5104 8.77271H16.9674V8.27271ZM8.27197 16.9673H8.77197V16.5104L8.3169 16.4693L8.27197 16.9673ZM8.27197 17H7.77197V17.5H8.27197V17ZM8.98106 17L8.9822 16.5H8.98106V17ZM9.01894 17V16.5L9.0178 16.5L9.01894 17ZM16.9992 17V17.5H17.4992V17H16.9992ZM16.5 9C16.5 9.03479 16.4998 9.06953 16.4993 9.1042L17.4992 9.1178C17.4997 9.07859 17.5 9.03932 17.5 9H16.5ZM16.4993 8.8958C16.4998 8.93047 16.5 8.9652 16.5 9H17.5C17.5 8.96068 17.4997 8.92141 17.4992 8.8822L16.4993 8.8958ZM16.4992 8.27271V8.889H17.4992V8.27271H16.4992ZM16.9674 8.77271H16.9992V7.77271H16.9674V8.77271ZM9 1.5C12.912 1.5 16.125 4.49551 16.4694 8.31758L17.4654 8.22783C17.0749 3.89501 13.4342 0.5 9 0.5V1.5ZM1.5 9C1.5 4.85786 4.85786 1.5 9 1.5V0.5C4.30558 0.5 0.5 4.30558 0.5 9H1.5ZM8.3169 16.4693C4.49515 16.1246 1.5 12.9118 1.5 9H0.5C0.5 13.4339 3.89461 17.0745 8.22705 17.4653L8.3169 16.4693ZM8.77197 17V16.9673H7.77197V17H8.77197ZM8.98106 16.5H8.27197V17.5H8.98106V16.5ZM9 16.5C8.99409 16.5 8.98816 16.5 8.9822 16.5L8.97993 17.5C8.98659 17.5 8.99328 17.5 9 17.5V16.5ZM9.0178 16.5C9.01184 16.5 9.00591 16.5 9 16.5V17.5C9.00672 17.5 9.01341 17.5 9.02007 17.5L9.0178 16.5ZM16.9992 16.5H9.01894V17.5H16.9992V16.5ZM16.4992 9.111V17H17.4992V9.111H16.4992Z" fill="#6B6C6D" />
                          </svg>

                          {challenge?.totalCommentCount}
                        </p>

                      </>
                    ) : (
                      <>
                        <p className="favorite">
                          <svg className="mr-2" style={{ height: 'auto', width: 'auto' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.9992 9.111L16.4992 9.1042V9.111H16.9992ZM16.9992 8.889H16.4992L16.4993 8.8958L16.9992 8.889ZM16.9992 8.27271H17.4992V7.77271H16.9992V8.27271ZM16.9674 8.27271L16.4694 8.31758L16.5104 8.77271H16.9674V8.27271ZM8.27197 16.9673H8.77197V16.5104L8.3169 16.4693L8.27197 16.9673ZM8.27197 17H7.77197V17.5H8.27197V17ZM8.98106 17L8.9822 16.5H8.98106V17ZM9.01894 17V16.5L9.0178 16.5L9.01894 17ZM16.9992 17V17.5H17.4992V17H16.9992ZM16.5 9C16.5 9.03479 16.4998 9.06953 16.4993 9.1042L17.4992 9.1178C17.4997 9.07859 17.5 9.03932 17.5 9H16.5ZM16.4993 8.8958C16.4998 8.93047 16.5 8.9652 16.5 9H17.5C17.5 8.96068 17.4997 8.92141 17.4992 8.8822L16.4993 8.8958ZM16.4992 8.27271V8.889H17.4992V8.27271H16.4992ZM16.9674 8.77271H16.9992V7.77271H16.9674V8.77271ZM9 1.5C12.912 1.5 16.125 4.49551 16.4694 8.31758L17.4654 8.22783C17.0749 3.89501 13.4342 0.5 9 0.5V1.5ZM1.5 9C1.5 4.85786 4.85786 1.5 9 1.5V0.5C4.30558 0.5 0.5 4.30558 0.5 9H1.5ZM8.3169 16.4693C4.49515 16.1246 1.5 12.9118 1.5 9H0.5C0.5 13.4339 3.89461 17.0745 8.22705 17.4653L8.3169 16.4693ZM8.77197 17V16.9673H7.77197V17H8.77197ZM8.98106 16.5H8.27197V17.5H8.98106V16.5ZM9 16.5C8.99409 16.5 8.98816 16.5 8.9822 16.5L8.97993 17.5C8.98659 17.5 8.99328 17.5 9 17.5V16.5ZM9.0178 16.5C9.01184 16.5 9.00591 16.5 9 16.5V17.5C9.00672 17.5 9.01341 17.5 9.02007 17.5L9.0178 16.5ZM16.9992 16.5H9.01894V17.5H16.9992V16.5ZM16.4992 9.111V17H17.4992V9.111H16.4992Z" fill="#6B6C6D" />
                          </svg>
                          {challenge?.totalCommentCount}
                        </p>
                      </>
                    )}
                    <p className="favorite">
                      <svg className="mr-2" style={{ height: 'auto', width: 'auto' }} width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.1334 15.9997V14.3997C14.1334 13.5511 13.7963 12.7372 13.1962 12.1371C12.5961 11.537 11.7822 11.1999 10.9336 11.1999H4.53384C3.68519 11.1999 2.87129 11.537 2.2712 12.1371C1.67111 12.7372 1.33398 13.5511 1.33398 14.3997V15.9997" stroke="#6B6C6D" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7.73501 7.0664C9.50224 7.0664 10.9349 5.63377 10.9349 3.86654C10.9349 2.09931 9.50224 0.666687 7.73501 0.666687C5.96778 0.666687 4.53516 2.09931 4.53516 3.86654C4.53516 5.63377 5.96778 7.0664 7.73501 7.0664Z" stroke="#6B6C6D" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                      {submissions?.length ? submissions?.length : 0}
                    </p>

                    {!isUserOwner && (
                      <MoreVertIcon
                        onClick={(e) => {
                          setThreeDotsOptionOpen(true);
                          setAnchorElMobile(e.currentTarget);
                        }}
                      />
                    )}

                    <div className="more-options">
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorElMobile}
                        open={Boolean(anchorElMobile)}
                        onClose={handleMoreOptionClose}
                        className="more-menu"
                        style={{ top: 30, left: -25 }}
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
                          onClick={() => {
                            if (isWeb3Connected) {
                              setIsMoreOpen(true);
                              handleMoreOptionClose();
                            } else {
                              // connectWallet();
                              setIsConnectWalletAlertOpen(true);
                            }
                          }}
                        >
                          Report
                        </MenuItem>
                      </Menu>
                    </div>

                    {/* <HearingDisabledIcon color="error" onClick={() => setIsMoreOpen(true)} /> */}
                  </div>
                      </div>
                      <div className="details-new-content-description">
                        <label>Description</label>
                        <p className={`content-lead ${showDetail ? 'content-lead-height' : ''}`}>{parse(challenge?.description ? challenge.description : "")}</p>
                        <p 
                          className="showhide"
                          onClick={()=>{
                            setShowDetail(!showDetail);
                          }}
                        >{showDetail ? 'Show details' : 'Hide details'}</p>
                      </div>
                      <div className="details-item">
                        <label>Challenge Reward</label>
                        {challenge?.asset_type == 1 ? 
                        <div className="right-content">
                          <div className="item">
                            <p className="item-sublead">NFT</p>
                            <p className="item-lead">1</p>
                          </div>
                          <div className="item">
                            <p className="item-sublead">Reselling</p>
                            <p className="item-lead">
                              {nft.resale ? `Yes` : "No"}
                            </p>
                          </div>
                          <div className="item">
                            <p className="item-sublead">Royalties</p>
                            <p className="item-lead">
                              {nft.resale && nft.loyaltyPercentage
                                ? `${nft.loyaltyPercentage}% `
                                : "0%"}
                            </p>
                          </div>
                        </div> :  
                        <div className="right-content">
                            <div className="item">
                              <p className="item-sublead">Token</p>
                              <p className="item-lead">{challenge?.token?.name}</p>
                            </div>
                            <div className="item">
                              <p className="item-sublead">Airdrop Amount</p>
                              <p className="item-lead">
                                {challenge.tokenAmount}
                              </p>
                            </div>
                          </div>}
                      </div>
                      <div className="details-item">
                        <label>Airdrop Distribution</label>
                        <div className="right-content">
                          <div className="item">
                            <p className="item-sublead">From</p>
                            <p className="item-lead">{new Date(parseInt(challenge?.airdropStartAt)).toLocaleDateString()}</p>
                          </div>
                          <div className="item">
                            <p className="item-sublead">To</p>
                            <p className="item-lead">{new Date(parseInt(challenge?.airdropEndAt)).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="task-container">
                        {
                          Object.keys(taskList).map(key => {
                            const item = taskList[key];
                            return <div>
                              <label>{key} <InfoIcon /></label>
                              {
                                item.map(innerItem => (
                                  <>
                                  {challenge && isTimePassed(challenge.expiresAt) ? 
                                    <CustomAccordion
                                      key={innerItem.id}
                                      beforeIcon={renderIcon(key)}
                                      expanded={false}
                                      title={innerItem.task_template.task_name}
                                      addTask={() => {
                                        setEndModalTitle("Submission Ended");
                                        setEndModalText(
                                          "The period for submissions has ended. Now the creator will review all submissions and winners will receive the airdrop. Stay tuned to see if you won!"
                                        );
                                        setSubmissionEndedDialogOpen(true);
                                      }}>
                                      
                                    </CustomAccordion> : challenge.submissionLimit > 0 &&
                                    submissions.length >=
                                    challenge.submissionLimit ? 
                                    <CustomAccordion
                                      key={innerItem.id}
                                      beforeIcon={renderIcon(key)}
                                      expanded={false}
                                      title={innerItem.task_template.task_name}
                                      addTask={() => {
                                        setEndModalTitle("Submission Limit Reached");
                                        setEndModalText(
                                          "The creator has limited the amount of people who can submit to this challenge. The submissions are full!"
                                        );
                                        setSubmissionEndedDialogOpen(true);
                                      }}>
                                      
                                    </CustomAccordion>
                                  :
                                    <CustomAccordion
                                      key={innerItem.id}
                                      beforeIcon={renderIcon(key)}
                                      endIcon={renderIcon('expand')}
                                      expanded={selectedTask === innerItem.id}
                                      isCompleted={innerItem.submittedTask?.isVerified}
                                      title={innerItem.task_template.task_name}
                                      addTask={() => handleTaskSelect(innerItem.id)}>
                                        <TaskBody
                                        key={innerItem.id}
                                        task={innerItem}
                                        userData={userData}
                                        network={network}
                                        showCustomAlert={showCustomAlert}
                                        isWeb3Connected={isWeb3Connected} setIsConnectWalletAlertOpen={setIsConnectWalletAlertOpen}
                                        challenge={challenge}
                                        submissions={submissions}
                                        taskVerified={taskVerified}
                                      />
                                    </CustomAccordion>
                                  }
                                  </>
                                  
                                ))
                              }
                            </div>
                          })
                        }
                      </div>
                    </div>
                    {/* new details */}

                  {/* old details */}
                  {/* <div className="detail-content with-bottom-bar">
                    <div className="detail-header">
                      <div className="top-header">
                        <div className="sub-name-wrapper">
                          <p
                            className="sub-name cursor-pointer"
                            onClick={() => handleNftTypeClick()}
                          >
                            <KeyboardBackspaceIcon
                              style={{ color: "#FFFFFF", marginRight: 12 }}
                            />
                            <p
                              className="d-inline-block"
                              style={{ cursor: "pointer" }}
                            >
                              {challenge?.asset_type == 1
                                ? "NFT Challenge"
                                : "Token Challenge"}
                            </p>
                          </p>
                        </div>
                        <div className="favorite-wrapper">
                          {nft && nft.id ? (
                            <>
                              {nft?.holderData?.address?.toLowerCase() ==
                                userData?.address?.toLowerCase() && (
                                  <CustomTooltip
                                    title="Refresh metadata"
                                    placement="top"
                                  >
                                    <img
                                      style={{
                                        width: "17px",
                                        height: "17px",
                                        marginRight: "10px",
                                      }}
                                      src="/images/refresh.png"
                                      alt=""
                                      onClick={refreshMetadata}
                                    />
                                  </CustomTooltip>
                                )}
                              <p className="favorite">
                                {likedByUser(nft) && isWeb3Connected && (
                                  <svg className="mr-2" style={{ height: 'auto', width: 'auto' }} width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => likeNFT()}>
                                    <path d="M13.05 0C15.7842 0 18 2.2973 18 5.51351C18 11.9459 11.25 15.6216 9 17C6.75 15.6216 0 11.9459 0 5.51351C0 2.2973 2.25 0 4.95 0C6.624 0 8.1 0.918919 9 1.83784C9.9 0.918919 11.376 0 13.05 0Z" fill="#4353FF" />
                                  </svg>

                                )}
                                {(!likedByUser(nft) || !isWeb3Connected) && (
                                  <svg className="mr-2" style={{ height: 'auto', width: 'auto' }} width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"
                                    onClick={() => {
                                      if (isWeb3Connected) {
                                        likeNFT();
                                      } else {
                                        setIsConnectWalletAlertOpen(true);
                                      }
                                    }}>
                                    <path d="M8.64279 2.1877L9 2.55242L9.35721 2.18769C10.1985 1.32874 11.5537 0.5 13.05 0.5C15.4684 0.5 17.5 2.532 17.5 5.51351C17.5 8.54034 15.9146 10.9458 13.997 12.7918C12.2964 14.4289 10.3809 15.583 9.17097 16.3119C9.11229 16.3473 9.05526 16.3817 9 16.415C8.94474 16.3817 8.88771 16.3473 8.82903 16.3119C7.61908 15.583 5.70361 14.4289 4.00302 12.7918C2.08545 10.9458 0.5 8.54034 0.5 5.51351C0.5 2.53433 2.5637 0.5 4.95 0.5C6.44634 0.5 7.80152 1.32874 8.64279 2.1877Z" stroke="#6B6C6D" />
                                  </svg>
                                )}
                                {nft && nft.likes}
                              </p>
                              <p className="favorite">
                                <svg className="mr-2" style={{ height: 'auto', width: 'auto' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M16.9992 9.111L16.4992 9.1042V9.111H16.9992ZM16.9992 8.889H16.4992L16.4993 8.8958L16.9992 8.889ZM16.9992 8.27271H17.4992V7.77271H16.9992V8.27271ZM16.9674 8.27271L16.4694 8.31758L16.5104 8.77271H16.9674V8.27271ZM8.27197 16.9673H8.77197V16.5104L8.3169 16.4693L8.27197 16.9673ZM8.27197 17H7.77197V17.5H8.27197V17ZM8.98106 17L8.9822 16.5H8.98106V17ZM9.01894 17V16.5L9.0178 16.5L9.01894 17ZM16.9992 17V17.5H17.4992V17H16.9992ZM16.5 9C16.5 9.03479 16.4998 9.06953 16.4993 9.1042L17.4992 9.1178C17.4997 9.07859 17.5 9.03932 17.5 9H16.5ZM16.4993 8.8958C16.4998 8.93047 16.5 8.9652 16.5 9H17.5C17.5 8.96068 17.4997 8.92141 17.4992 8.8822L16.4993 8.8958ZM16.4992 8.27271V8.889H17.4992V8.27271H16.4992ZM16.9674 8.77271H16.9992V7.77271H16.9674V8.77271ZM9 1.5C12.912 1.5 16.125 4.49551 16.4694 8.31758L17.4654 8.22783C17.0749 3.89501 13.4342 0.5 9 0.5V1.5ZM1.5 9C1.5 4.85786 4.85786 1.5 9 1.5V0.5C4.30558 0.5 0.5 4.30558 0.5 9H1.5ZM8.3169 16.4693C4.49515 16.1246 1.5 12.9118 1.5 9H0.5C0.5 13.4339 3.89461 17.0745 8.22705 17.4653L8.3169 16.4693ZM8.77197 17V16.9673H7.77197V17H8.77197ZM8.98106 16.5H8.27197V17.5H8.98106V16.5ZM9 16.5C8.99409 16.5 8.98816 16.5 8.9822 16.5L8.97993 17.5C8.98659 17.5 8.99328 17.5 9 17.5V16.5ZM9.0178 16.5C9.01184 16.5 9.00591 16.5 9 16.5V17.5C9.00672 17.5 9.01341 17.5 9.02007 17.5L9.0178 16.5ZM16.9992 16.5H9.01894V17.5H16.9992V16.5ZM16.4992 9.111V17H17.4992V9.111H16.4992Z" fill="#6B6C6D" />
                                </svg>
                                {challenge.totalCommentCount}
                              </p>

                            </>
                          ) :
                            (<p className="favorite">
                              <svg className="mr-2" style={{ height: 'auto', width: 'auto' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.9992 9.111L16.4992 9.1042V9.111H16.9992ZM16.9992 8.889H16.4992L16.4993 8.8958L16.9992 8.889ZM16.9992 8.27271H17.4992V7.77271H16.9992V8.27271ZM16.9674 8.27271L16.4694 8.31758L16.5104 8.77271H16.9674V8.27271ZM8.27197 16.9673H8.77197V16.5104L8.3169 16.4693L8.27197 16.9673ZM8.27197 17H7.77197V17.5H8.27197V17ZM8.98106 17L8.9822 16.5H8.98106V17ZM9.01894 17V16.5L9.0178 16.5L9.01894 17ZM16.9992 17V17.5H17.4992V17H16.9992ZM16.5 9C16.5 9.03479 16.4998 9.06953 16.4993 9.1042L17.4992 9.1178C17.4997 9.07859 17.5 9.03932 17.5 9H16.5ZM16.4993 8.8958C16.4998 8.93047 16.5 8.9652 16.5 9H17.5C17.5 8.96068 17.4997 8.92141 17.4992 8.8822L16.4993 8.8958ZM16.4992 8.27271V8.889H17.4992V8.27271H16.4992ZM16.9674 8.77271H16.9992V7.77271H16.9674V8.77271ZM9 1.5C12.912 1.5 16.125 4.49551 16.4694 8.31758L17.4654 8.22783C17.0749 3.89501 13.4342 0.5 9 0.5V1.5ZM1.5 9C1.5 4.85786 4.85786 1.5 9 1.5V0.5C4.30558 0.5 0.5 4.30558 0.5 9H1.5ZM8.3169 16.4693C4.49515 16.1246 1.5 12.9118 1.5 9H0.5C0.5 13.4339 3.89461 17.0745 8.22705 17.4653L8.3169 16.4693ZM8.77197 17V16.9673H7.77197V17H8.77197ZM8.98106 16.5H8.27197V17.5H8.98106V16.5ZM9 16.5C8.99409 16.5 8.98816 16.5 8.9822 16.5L8.97993 17.5C8.98659 17.5 8.99328 17.5 9 17.5V16.5ZM9.0178 16.5C9.01184 16.5 9.00591 16.5 9 16.5V17.5C9.00672 17.5 9.01341 17.5 9.02007 17.5L9.0178 16.5ZM16.9992 16.5H9.01894V17.5H16.9992V16.5ZM16.4992 9.111V17H17.4992V9.111H16.4992Z" fill="#6B6C6D" />
                              </svg>
                              {challenge.totalCommentCount}
                            </p>)
                          }
                          <p className="favorite">
                            <svg className="mr-2" style={{ height: 'auto', width: 'auto' }} width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14.1334 15.9997V14.3997C14.1334 13.5511 13.7963 12.7372 13.1962 12.1371C12.5961 11.537 11.7822 11.1999 10.9336 11.1999H4.53384C3.68519 11.1999 2.87129 11.537 2.2712 12.1371C1.67111 12.7372 1.33398 13.5511 1.33398 14.3997V15.9997" stroke="#6B6C6D" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M7.73501 7.0664C9.50224 7.0664 10.9349 5.63377 10.9349 3.86654C10.9349 2.09931 9.50224 0.666687 7.73501 0.666687C5.96778 0.666687 4.53516 2.09931 4.53516 3.86654C4.53516 5.63377 5.96778 7.0664 7.73501 7.0664Z" stroke="#6B6C6D" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>


                            {submissions?.length ? submissions?.length : 0}
                          </p>
                          {!isUserOwner && (
                            <MoreVertIcon
                              onClick={(e) => {
                                setThreeDotsOptionOpen(true);
                                setAnchorEl(e.currentTarget);
                              }}
                            />
                          )}

                          <div className="more-options">
                            <Menu
                              id="basic-menu"
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleMoreOptionClose}
                              className="more-menu"
                              style={{ top: 30, left: -156 }}
                            >
                              <MenuItem
                                className="more-item"
                                onClick={async () => {
                                  handleMoreOptionClose();
                                  if (isWeb3Connected) {
                                    setIsShareOpen(true);
                                  } else {
                                    setIsConnectWalletAlertOpen(true);
                                  }
                                }}
                              >
                                Share
                              </MenuItem>
                              <MenuItem
                                className="more-item"
                                onClick={() => {
                                  if (isWeb3Connected) {
                                    setIsMoreOpen(true);
                                    handleMoreOptionClose();
                                  } else {
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
                      <p className="detail-title">
                        {challenge ? challenge?.name : nft?.name}
                      </p>
                      <div className="d-flex align-items-center">
                        {challenge.asset_type == 1 ? (
                          <p className="total mr-3">
                            <span>{nft.supply > 0 ? nft.supply : 1}</span>
                            Total NFTs
                          </p>
                        ) : (
                          <p className="total mr-3">
                            <span>{challenge?.winnerCount}</span>
                            Potential Winners
                          </p>
                        )}

                        {renderNetwork(challenge.chain_id)}
                        {nft?.status == 2 && (
                          <p className="network-name">
                            <span className="ml-1">Status: hidden</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="detail-label">Description</p>
                    <p className="content-lead">
                      {parse(
                        challenge?.description ? challenge.description : ""
                      )}
                    </p>

                    <div className="d-flex flex-wrap mb-3">
                      {challenge.asset_type == 1 ? (
                        <div className="collection-item">
                          <p className="collection-lead">Collection</p>
                          <div className="d-flex">
                            {nft.collectionType ? (
                              <img
                                src={
                                  nft.collectionType
                                    ? nft.collectionType.image
                                    : "/images/card_yiki.png"
                                }
                                alt=" "
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  history.push(
                                    `/collection/${nft.collectionType?.address}`
                                  );
                                }}
                              />
                            ) : (
                              <img
                                src="/images/default-profile-cover.png"
                                alt=""
                              />
                            )}
                          </div>
                        </div>
                      ) : (
                        <CustomTooltip placement={"top"} title={challenge?.token?.address ? challenge?.token?.address : "Token Address"}>
                          <div className="collection-item">
                            <p className="collection-lead">Token</p>
                            <div className="d-flex">
                              {getIconByChainId(challenge.chain_id, true)}
                            </div>
                          </div>
                        </CustomTooltip>

                      )}

                      {
                        (challenge?.websiteurl || nft?.externalLink) && (
                          <div className="collection-item">
                            <p className="collection-lead">External Link</p>
                            <div>
                              {challenge?.websiteurl ? (
                                <CustomTooltip
                                  title={getUrl(challenge?.websiteurl)}
                                  placement={"top"}
                                >
                                  <a
                                    href={getUrl(challenge?.websiteurl)}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    className="external-link"
                                  >
                                    <div className="styled-icon">
                                      <svg
                                        width="21"
                                        height="21"
                                        viewBox="0 0 21 21"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M16.5041 11.0019V17.0035C16.5041 17.5341 16.2933 18.043 15.9181 18.4181C15.543 18.7933 15.0341 19.0041 14.5035 19.0041H3.50054C2.96997 19.0041 2.46112 18.7933 2.08595 18.4181C1.71077 18.043 1.5 17.5341 1.5 17.0035V6.00054C1.5 5.46997 1.71077 4.96112 2.08595 4.58595C2.46112 4.21077 2.96997 4 3.50054 4H9.50218"
                                          stroke="white"
                                          stroke-width="2"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M13.5029 1H19.5046V7.00163"
                                          stroke="white"
                                          stroke-width="2"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M8.5011 12.003L19.5041 1"
                                          stroke="white"
                                          stroke-width="2"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  </a>
                                </CustomTooltip>
                              ) : (
                                <>
                                  {nft?.externalLink ? (
                                    <CustomTooltip
                                      title={getUrl(nft.externalLink)}
                                      placement={"top"}
                                    >
                                      <a
                                        href={getUrl(nft.externalLink)}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        className="external-link"
                                      >
                                        <div className="styled-icon">
                                          <svg
                                            width="21"
                                            height="21"
                                            viewBox="0 0 21 21"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M16.5041 11.0019V17.0035C16.5041 17.5341 16.2933 18.043 15.9181 18.4181C15.543 18.7933 15.0341 19.0041 14.5035 19.0041H3.50054C2.96997 19.0041 2.46112 18.7933 2.08595 18.4181C1.71077 18.043 1.5 17.5341 1.5 17.0035V6.00054C1.5 5.46997 1.71077 4.96112 2.08595 4.58595C2.46112 4.21077 2.96997 4 3.50054 4H9.50218"
                                              stroke="white"
                                              stroke-width="2"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            />
                                            <path
                                              d="M13.5029 1H19.5046V7.00163"
                                              stroke="white"
                                              stroke-width="2"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            />
                                            <path
                                              d="M8.5011 12.003L19.5041 1"
                                              stroke="white"
                                              stroke-width="2"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            />
                                          </svg>
                                        </div>
                                      </a>
                                    </CustomTooltip>
                                  ) : (
                                    <a
                                      href={""}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                      className="external-link"
                                    >
                                      <div className="styled-icon">
                                        <svg
                                          width="21"
                                          height="21"
                                          viewBox="0 0 21 21"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M16.5041 11.0019V17.0035C16.5041 17.5341 16.2933 18.043 15.9181 18.4181C15.543 18.7933 15.0341 19.0041 14.5035 19.0041H3.50054C2.96997 19.0041 2.46112 18.7933 2.08595 18.4181C1.71077 18.043 1.5 17.5341 1.5 17.0035V6.00054C1.5 5.46997 1.71077 4.96112 2.08595 4.58595C2.46112 4.21077 2.96997 4 3.50054 4H9.50218"
                                            stroke="white"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                          <path
                                            d="M13.5029 1H19.5046V7.00163"
                                            stroke="white"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                          <path
                                            d="M8.5011 12.003L19.5041 1"
                                            stroke="white"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                        </svg>
                                      </div>
                                    </a>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        )
                      }

                      {challenge.asset_type == 1 ? (
                        <div className="collection-item" style={{ width: 63 }}>
                          <p className="collection-lead">Reselling</p>
                          {nft.resale ? (
                            <div className="styled-icon">
                              <svg
                                width="23"
                                height="17"
                                viewBox="0 0 23 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M9.14151 17C8.49238 17 7.86644 16.7412 7.40277 16.2711L1.21288 9.99518C0.262373 9.03143 0.262373 7.45652 1.21288 6.49277C2.16339 5.52902 3.71666 5.52902 4.66717 6.49277L9.07196 10.9589L18.2525 0.804295C19.1566 -0.206467 20.7099 -0.276986 21.7068 0.663258C22.7036 1.58 22.7732 3.15491 21.8459 4.16567L10.9498 16.2008C10.5093 16.6942 9.86018 17 9.18787 17H9.14151Z"
                                  fill="white"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div className="styled-icon">
                              <CloseIcon />
                            </div>
                          )}

                          <div className="d-flex">
                            <p className="item-lead">
                              {nft.resale && nft.loyaltyPercentage
                                ? `Creator Royalities: ${nft.loyaltyPercentage}% `
                                : "No"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="collection-item">
                          <p className="collection-lead" style={{ whiteSpace: 'nowrap' }}>Airdrop Amount</p>

                          <div className="styled-icon">
                            <span>
                              {challenge?.tokenAmount}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <ChallengeDetails
                      challenge={challenge}
                      showCreator={true}
                      showSocialRequires={true}
                      showDistribution={true}
                      showChallengeSubmission={true}
                    />

                    <div
                      className={`custom-switch-2`}
                      style={{ width: "99%", padding: 0 }}
                    >
                      <>
                        <div
                          onClick={() => setSelectedTab("submissions")}
                          className={`
                          ${selectedTab === "submissions" ? "active" : ""}
                          d-flex justify-content-center flex-fill toggle-nav nav-left`}
                          style={{ width: "33%" }}
                        >
                          Submissions
                        </div>

                        <div
                          onClick={() => setSelectedTab("winners")}
                          style={{ width: "33%" }}
                          className={`
                          ${selectedTab === "winners" ? "active" : ""}
                          d-flex justify-content-center flex-fill toggle-nav nav-right`}
                        >
                          Winners
                        </div>
                      </>


                      <div
                        onClick={() => setSelectedTab("comments")}
                        style={{ width: "33%" }}
                        className={`
                        ${selectedTab === "comments" ? "active" : ""}
                        d-flex justify-content-center flex-fill toggle-nav nav-right`}
                      >
                        Comments
                      </div>


                      <div
                        className="toggle-bar"
                        style={{
                          left:
                            selectedTab === "winners"
                              ? "33%"
                              : selectedTab === "comments"
                                ? "67%"
                                : selectedTab === "submissions"
                                  ? "0%"
                                  : undefined,
                        }}
                      />
                    </div>

                    {selectedTab === "submissions" ? (
                      <SubmissionsList
                        challenge={challenge}
                        isloading={isloading}
                        submissions={submissions}
                      />
                    ) : selectedTab === "winners" ? (
                      <WinnersList challenge={challenge} />
                    ) : selectedTab === "comments" ? (
                      <CommentsList challenge={challenge} setChallenge={setChallenge} />
                    ) : (
                      <div style={{ color: "white", textAlign: "center" }}>
                        No Data Found
                      </div>
                    )}
                  </div> */}
                  {/* old details */}
                </div>
                <div className="left-container mobile">
                    <div className="others-container">
                    <div
                      className={`custom-switch-2`}
                      style={{ width: "99%", padding: 0 }}
                    >
                      <>
                        <div
                          onClick={() => setSelectedTab("submissions")}
                          className={`
                          ${selectedTab === "submissions" ? "active" : ""}
                          d-flex justify-content-center flex-fill toggle-nav nav-left`}
                          style={{ width: "33%" }}
                        >
                          Submissions
                        </div>

                        <div
                          onClick={() => setSelectedTab("winners")}
                          style={{ width: "33%" }}
                          className={`
                          ${selectedTab === "winners" ? "active" : ""}
                          d-flex justify-content-center flex-fill toggle-nav nav-right`}
                        >
                          Winners
                        </div>
                      </>


                      <div
                        onClick={() => setSelectedTab("comments")}
                        style={{ width: "33%" }}
                        className={`
                        ${selectedTab === "comments" ? "active" : ""}
                        d-flex justify-content-center flex-fill toggle-nav nav-right`}
                      >
                        Comments
                      </div>


                      <div
                        className="toggle-bar"
                        style={{
                          left:
                            selectedTab === "winners"
                              ? "33%"
                              : selectedTab === "comments"
                                ? "67%"
                                : selectedTab === "submissions"
                                  ? "0%"
                                  : undefined,
                        }}
                      />
                    </div>

                    {selectedTab === "submissions" ? (
                      <SubmissionsList
                        challenge={challenge}
                        isloading={isloading}
                        submissions={submissions}
                      />
                    ) : selectedTab === "winners" ? (
                      <WinnersList challenge={challenge} />
                    ) : selectedTab === "comments" ? (
                      <CommentsList challenge={challenge} setChallenge={setChallenge} />
                    ) : (
                        <div className="not-found">
                          <EyeIcon />
                          <p>No item found</p>
                        </div>
                      )}
                    </div>
                  </div>
              </div>
            </div>

            <Dialog
              open={isMoreOpen}
              onClose={() => [setIsMoreOpen(false), setReportValues({})]}
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
                  onClick={() => [setIsMoreOpen(false), setReportValues({})]}
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
                        !Object.values(reportValues).find(
                          (item) => item === true
                        )
                      }
                      className={`btn-report ${!Object.values(reportValues).find(
                        (item) => item === true
                      )
                          ? ""
                          : "btn-active"
                        }`}
                      onClick={handleReportSubmit}
                    >
                      Submit
                    </button>
                    <button
                      className={`btn-continue btn-cancel`}
                      onClick={() => [
                        setIsMoreOpen(false),
                        setReportValues({}),
                      ]}
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <CustomAlert
              type=""
              width={514}
              isDialogOpen={submissionEndedDialogOpen}
              title={endModalTitle}
              message={endModalText}
              btnText="Okay"
              customDialogAlertClose={() => setSubmissionEndedDialogOpen(false)}
              showCloseIcon={true}
            // doSomething={handleConnectWallet}
            />

            {/* <Dialog
              open={submissionEndedDialogOpen}
              onClose={() => setSubmissionEndedDialogOpen(false)}
              className="submission-ended-modal"
            >
              <MuiDialogTitle className="share-modal-header">
                <Typography className="main-title">{endModalTitle}</Typography>
                <IconButton
                  aria-label="close"
                  onClick={() => setSubmissionEndedDialogOpen(false)}
                  className="close_button"
                >
                  <CloseIcon />
                </IconButton>
              </MuiDialogTitle>
              <DialogContent>
                <p className="modal-text">{endModalText}</p>
              </DialogContent>
            </Dialog> */}
          </LoadingOverlay>
        </div>

        <div className="bottom-action-section">
          <div className="container">
            <div className="challenge-actions">
              <div className="submit-container mt-0 mb-0">
                {challenge &&
                  challenge.creator.address.toLowerCase() !==
                  metaMaskAddress.toLowerCase() && (
                    <>
                      {challenge && isTimePassed(challenge.expiresAt) ? (
                        <button
                          className="btn-continue btn-submission-ended"
                          onClick={() => {
                            setEndModalTitle("Submission Ended");
                            setEndModalText(
                              "The period for submissions has ended. Now the creator will review all submissions and winners will receive the airdrop. Stay tuned to see if you won!"
                            );
                            setSubmissionEndedDialogOpen(true);
                          }}
                        >
                          Challenge Ended
                        </button>
                      ) : (
                        <>
                          {submissions ? (
                            <>
                              {submissions.find(
                                (sub) =>
                                  sub.user.address.toLowerCase() ===
                                  metaMaskAddress.toLowerCase()
                              ) ? (
                                <button
                                  className="btn-continue btn-submission-ended"
                                  onClick={() => handleAddSubmission()}
                                >
                                  Challenge Completed
                                </button>
                              ) : (
                                <>
                                  {challenge.submissionLimit > 0 &&
                                    submissions.length >=
                                    challenge.submissionLimit ? (
                                    <button
                                      className="btn-continue btn-submission-limit"
                                      onClick={() => {
                                        setEndModalTitle(
                                          "Submission Limit Reached"
                                        );
                                        setEndModalText(
                                          "The creator has limited the amount of people who can submit to this challenge. The submissions are full!"
                                        );
                                        setSubmissionEndedDialogOpen(true);
                                      }}
                                    >
                                      Challenge Ended
                                    </button>
                                  ) : (
                                    <button
                                      className={`btn-continue ${!isAllTaskCompleted ? 'btn-submission-ended' : ''}`}
                                      onClick={() => handleAddSubmission()}
                                    >
                                      {`${!isAllTaskCompleted ? 'Please finish tasks to join' : 'Join Challenge'}`}
                                    </button>
                                  )}
                                </>
                              )}
                            </>
                          ) : (
                            <button
                            className={`btn-continue ${!isAllTaskCompleted ? 'btn-submission-ended' : ''}`}
                              onClick={() => handleAddSubmission()}
                            >
                              {`${!isAllTaskCompleted ? 'Please finish tasks to join' : 'Join Challenge'}`}
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      :{" "}
      {/* <div style={{ height: "80vh", width: "100vw" }}>
        <Spinner animation="border" className="art-spinner" />
      </div> */}
      {addSubmission && (
        <AddChallengeSubmission
          addSubmission={addSubmission}
          closeSumbission={() => {
            setAddSumbission(false);
          }}
          nft={nft}
          challenge={challenge}
          getSubmissionsList={getSubmissionsList}
          submissions={submissions}
          setIsSubmissionSuccess={setIsSubmissionSuccess}
          setSubmissionFailedMessage={setSubmissionFailedMessage}
        />
      )}
      <Dialog
        fullWidth={true}
        maxWidth={"xs"}
        open={purchaseSuccessModalOpen}
        className="congratulation-modal"
      >
        <DialogContent>
          {/* <DialogTitle /> */}
          <div className="congratulation-content">
            {/* <img src={`/images/challenge.png`} alt="Challenge Icon" /> */
              <svg style={{ marginBottom: 23 }} width="47" height="67" viewBox="0 0 47 67" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.5225 2.42546L25.1239 6.85771C24.9708 6.7005 24.7768 6.60178 24.5762 6.56311L26.9751 2.13086C27.176 2.16953 27.3694 2.26826 27.5225 2.42546Z" fill="#26603E" />
                <path d="M27.0314 3.0546L24.6321 7.48685C24.7566 7.25795 24.7736 6.9731 24.6541 6.70648C24.6321 6.65586 24.6057 6.60807 24.5762 6.56311L26.9748 2.13086C27.0047 2.17582 27.0311 2.22361 27.0534 2.27392C27.1726 2.54117 27.1556 2.82571 27.0314 3.0546Z" fill="#26603E" />
                <path d="M27.0314 3.0546L24.6321 7.48685C24.7566 7.25795 24.7736 6.9731 24.6541 6.70648C24.6321 6.65586 24.6057 6.60807 24.5762 6.56311L26.9748 2.13086C27.0047 2.17582 27.0311 2.22361 27.0534 2.27392C27.1726 2.54117 27.1556 2.82571 27.0314 3.0546Z" fill="#26603E" />
                <path d="M29.6961 5.1891L27.2969 9.62135C26.0873 7.85311 25.1535 6.89007 25.123 6.85705L27.5217 2.4248C27.5522 2.45782 28.4863 3.42117 29.6961 5.1891Z" fill="#26603E" />
                <path d="M26.9735 2.13127L24.5746 6.56351C24.3941 6.28872 24.0844 6.11862 23.7644 6.10447C23.6399 6.09882 23.5141 6.11674 23.3937 6.16107C22.9107 6.33148 22.2316 6.62262 21.4531 7.19139L23.8521 2.75914C24.6306 2.19037 25.31 1.89923 25.7926 1.72882C25.913 1.68417 26.0388 1.66625 26.1633 1.67191C26.4837 1.68637 26.7924 1.85647 26.9735 2.13127Z" fill="#26603E" />
                <path d="M23.8539 2.75899L21.455 7.19124C19.3214 6.65014 17.4274 6.37062 15.7509 6.29548C15.5903 6.28856 15.4315 6.2829 15.2749 6.27945C9.52213 6.16594 6.38148 8.40832 4.49722 10.8419C4.08534 11.3776 3.74043 11.9253 3.45117 12.4592L5.85044 8.02725C6.13938 7.49307 6.48492 6.94537 6.89648 6.40961C8.78043 3.97607 11.9214 1.7337 17.6735 1.84688C17.8307 1.85034 17.9892 1.856 18.1502 1.86292C19.8263 1.93838 21.72 2.21789 23.8539 2.75899Z" fill="url(#paint0_linear_403_23775)" />
                <path d="M27.0304 3.05469L24.6311 7.48694C24.5343 7.66615 24.3724 7.81109 24.1598 7.88781C24.0325 7.9356 23.8935 7.98905 23.7432 8.05445C23.1311 8.32232 22.3249 8.79803 21.3012 9.96543C21.1195 10.1723 20.8551 10.2761 20.5847 10.2714C20.5778 10.2714 20.5705 10.2707 20.5636 10.2707C20.3511 10.261 20.1351 10.183 19.9568 10.0349C19.5946 9.73843 19.4956 9.25707 19.6952 8.88826L22.0945 4.45602C21.8948 4.82482 21.9935 5.30618 22.3557 5.60267C22.5337 5.75044 22.7503 5.82842 22.9629 5.83848C22.9695 5.83848 22.977 5.83879 22.9839 5.83879C23.2543 5.84382 23.5184 5.73975 23.7002 5.53287C24.7239 4.36547 25.53 3.88976 26.1425 3.62188C26.2928 3.55617 26.4311 3.50272 26.5582 3.45493C26.7716 3.37916 26.9339 3.2339 27.0304 3.05469Z" fill="url(#paint1_linear_403_23775)" />
                <path d="M44.048 20.9103L41.6491 25.3426C39.729 20.1604 36.2636 16.2495 32.8484 13.428C30.8661 11.7911 28.9041 10.5313 27.2969 9.6217L29.6961 5.18945C31.3034 6.09936 33.265 7.35889 35.2477 8.99571C38.6625 11.8169 42.1279 15.7279 44.048 20.9103Z" fill="url(#paint2_linear_403_23775)" />
                <path d="M34.3364 16.4375L31.9375 20.8697C31.8139 21.0977 31.5875 21.2668 31.3008 21.3153L33.7 16.883C33.9865 16.8346 34.2132 16.6654 34.3364 16.4375Z" fill="#4353FF" />
                <path d="M22.5767 7.04268L20.1775 11.4749C20.0646 11.6824 19.8184 11.7856 19.5367 11.773C19.3635 11.7654 19.177 11.7139 18.9988 11.6161C18.5281 11.3586 18.2979 10.8801 18.4806 10.5455L20.8799 6.11328C20.6972 6.44781 20.927 6.92603 21.3977 7.18385C21.576 7.28195 21.7627 7.3332 21.9357 7.34106C22.2177 7.35332 22.4632 7.25019 22.5767 7.04268Z" fill="url(#paint3_linear_403_23775)" />
                <path d="M46.7733 23.4522L44.3744 27.8844C44.3351 27.8112 44.2863 27.7407 44.226 27.6756C43.3607 26.7362 42.4967 25.9665 41.6484 25.3424L44.0474 20.9102C44.8957 21.5343 45.7597 22.3039 46.6246 23.2434C46.685 23.3088 46.7343 23.3789 46.7733 23.4522Z" fill="#26603E" />
                <path d="M19.606 9.21081L17.207 13.6431C17.2215 13.6031 17.2388 13.5648 17.2583 13.5289L19.6572 9.09668C19.6377 9.13284 19.6204 9.17088 19.606 9.21081Z" fill="#26603E" />
                <path d="M46.7821 24.2968L44.3828 28.7291C44.4435 28.6171 44.4771 28.4936 44.4841 28.3678L46.883 23.9355C46.8761 24.0616 46.8425 24.1849 46.7821 24.2968Z" fill="#26603E" />
                <path d="M33.7012 16.8823L31.3019 21.3146C31.2406 21.3256 31.1793 21.3303 31.1177 21.3275C30.6571 21.307 30.2559 20.998 30.1509 20.5628C28.3942 13.2 24.256 8.59888 23.7991 8.11469C23.769 8.08262 23.762 8.07319 23.7617 8.07287L26.1607 3.64062C26.161 3.64062 26.1682 3.65037 26.1984 3.68244C26.6546 4.16632 30.7929 8.76772 32.5498 16.1306C32.6548 16.5657 33.0557 16.8748 33.5163 16.8952C33.5783 16.8981 33.6399 16.8934 33.7012 16.8823Z" fill="url(#paint4_linear_403_23775)" />
                <path d="M46.7821 24.2969L44.3828 28.7291C44.3337 28.82 44.2668 28.9033 44.1822 28.9744C44.0068 29.1228 43.7838 29.1907 43.5625 29.1856L45.9618 24.7534C46.1831 24.7584 46.4057 24.6905 46.5812 24.5421C46.6657 24.4711 46.7324 24.3877 46.7821 24.2969Z" fill="#26603E" />
                <path d="M34.7093 20.5369L32.3103 24.9692C32.4317 24.4828 32.1154 23.9697 31.5991 23.8238C31.5211 23.8015 31.4432 23.7889 31.3671 23.7858C31.0118 23.7697 30.6857 23.9467 30.5254 24.2429L32.9247 19.8107C33.085 19.5145 33.4107 19.3378 33.766 19.3535C33.8424 19.3567 33.9201 19.3692 33.9981 19.3916C34.514 19.5374 34.8309 20.0506 34.7093 20.5369Z" fill="#26603E" />
                <path d="M45.9616 24.7533L43.5623 29.1856C43.2765 29.173 43.0184 29.0598 42.83 28.8548C42.7549 28.774 42.6798 28.6951 42.6052 28.6174C39.7325 25.6286 37.2213 24.8646 35.338 24.7803C35.2911 24.7785 35.2446 24.7766 35.1987 24.7753C33.7807 24.7401 32.7076 25.1265 32.2168 25.3469L34.6161 20.9147C35.1069 20.6943 36.1803 20.3079 37.5973 20.3431C37.6435 20.3443 37.6901 20.3465 37.7369 20.3484C39.6205 20.4327 42.1317 21.1967 45.0042 24.1855C45.0787 24.2631 45.1542 24.3421 45.229 24.4229C45.4173 24.6275 45.6758 24.7407 45.9616 24.7533Z" fill="url(#paint5_linear_403_23775)" />
                <path d="M34.6161 20.9141L32.2168 25.3463L32.3111 24.9694L34.7101 20.5371L34.6161 20.9141Z" fill="#255D3C" />
                <path d="M32.8482 20.0099L30.4492 24.4422C30.4671 24.3711 30.4929 24.3048 30.5259 24.2438L32.9252 19.8115C32.8922 19.8728 32.8661 19.9389 32.8482 20.0099Z" fill="#26603E" />
                <path d="M32.7232 20.5106L30.3242 24.9429L30.449 24.442L32.848 20.0098L32.7232 20.5106Z" fill="#255D3C" />
                <path d="M20.9421 16.2736L18.5431 20.7059C18.6283 20.5223 18.6488 20.3066 18.5859 20.0903C18.5173 19.8611 18.4655 19.6218 18.4277 19.3756L20.827 14.9434C20.8647 15.1895 20.9163 15.4291 20.9848 15.658C21.0477 15.8743 21.0273 16.09 20.9421 16.2736Z" fill="#26603E" />
                <path d="M20.7333 15.651L18.3343 20.0832C18.2013 19.6836 17.8202 19.4151 17.4131 19.3972C17.3181 19.3928 17.2226 19.4022 17.1276 19.4264C16.8852 19.4896 16.6962 19.6393 16.584 19.8326L18.9829 15.4004C19.0955 15.207 19.2845 15.0574 19.5269 14.9942C19.6215 14.9697 19.7174 14.9605 19.8124 14.9649C20.2198 14.9829 20.6003 15.2514 20.7333 15.651Z" fill="#26603E" />
                <path d="M20.7333 15.651L18.3343 20.0832C18.2013 19.6836 17.8202 19.4151 17.4131 19.3972C17.3181 19.3928 17.2226 19.4022 17.1276 19.4264C16.8852 19.4896 16.6962 19.6393 16.584 19.8326L18.9829 15.4004C19.0955 15.207 19.2845 15.0574 19.5269 14.9942C19.6215 14.9697 19.7174 14.9605 19.8124 14.9649C20.2198 14.9829 20.6003 15.2514 20.7333 15.651Z" fill="#26603E" />
                <path d="M20.9421 16.2736L18.5431 20.7059C18.6283 20.5223 18.6488 20.3066 18.5859 20.0903C18.5173 19.8611 18.4655 19.6218 18.4277 19.3756L20.827 14.9434C20.8647 15.1895 20.9163 15.4291 20.9848 15.658C21.0477 15.8743 21.0273 16.09 20.9421 16.2736Z" fill="#26603E" />
                <path d="M20.943 16.2733L18.5444 20.7055L18.3359 20.0833L20.7349 15.6514L20.943 16.2733Z" fill="#255D3C" />
                <path d="M20.7333 15.651L18.3343 20.0832C18.2013 19.6836 17.8202 19.4151 17.4131 19.3972C17.3181 19.3928 17.2226 19.4022 17.1276 19.4264C16.8852 19.4896 16.6962 19.6393 16.584 19.8326L18.9829 15.4004C19.0955 15.207 19.2845 15.0574 19.5269 14.9942C19.6215 14.9697 19.7174 14.9605 19.8124 14.9649C20.2198 14.9829 20.6003 15.2514 20.7333 15.651Z" fill="#26603E" />
                <path d="M18.984 15.4011L16.585 19.8333C16.4982 19.385 16.4533 18.9369 16.4379 18.4999C16.4363 18.4534 16.4347 18.4062 16.4341 18.3597C16.3813 15.879 17.1944 13.6979 17.2082 13.6432L19.6071 9.21094C19.5933 9.26596 18.7806 11.4467 18.8327 13.9274C18.834 13.9739 18.8353 14.0211 18.8368 14.0676C18.8526 14.5047 18.8975 14.9524 18.984 15.4011Z" fill="#4353FF" />
                <path d="M18.9844 15.4004L16.5855 19.8326C16.5808 19.8402 16.5767 19.8477 16.5723 19.8559L18.9715 15.4237C18.9756 15.4155 18.9797 15.4079 18.9844 15.4004Z" fill="#26603E" />
                <path d="M32.7227 20.5109L30.3238 24.9432C27.042 21.7833 24.0519 20.9646 21.8259 20.8653C21.7627 20.8624 21.7001 20.8599 21.6376 20.8583C20.3434 20.8288 19.3216 21.0599 18.7227 21.2441L21.1216 16.8119C21.7209 16.6279 22.7424 16.3968 24.0368 16.4264C24.0991 16.428 24.1616 16.4305 24.2255 16.4333C26.4509 16.5327 29.4409 17.3511 32.7227 20.5109Z" fill="url(#paint6_linear_403_23775)" />
                <path d="M21.1221 16.8114L18.7231 21.2436L18.543 20.7057L20.9416 16.2734L21.1221 16.8114Z" fill="#255D3C" />
                <path d="M18.9152 16.1202L16.5163 20.5525C16.4345 20.3073 16.4616 20.0595 16.5716 19.8561L18.9709 15.4238C18.8605 15.6273 18.8335 15.875 18.9152 16.1202Z" fill="#26603E" />
                <path d="M19.0337 16.4754L16.6345 20.9076L16.5156 20.5524L18.9146 16.1201L19.0337 16.4754Z" fill="#255D3C" />
                <path d="M4.78931 10.5908L2.39005 15.0231C1.21006 15.2799 0.509557 15.5796 0.466797 15.595L2.86575 11.1627C2.90851 11.147 3.60933 10.8477 4.78931 10.5908Z" fill="#26603E" />
                <path d="M2.86375 11.1631L0.4648 15.5953C0.369848 15.6365 0.286215 15.6912 0.214844 15.7563L2.61411 11.3241C2.68517 11.2593 2.76912 11.2043 2.86375 11.1631Z" fill="#26603E" />
                <path d="M0.214844 15.7562C0.369848 14.9495 0.771036 13.3274 1.73879 11.5397L4.13743 7.10742C3.16999 8.89516 2.7688 10.5172 2.61411 11.324C1.8938 12.6539 0.93453 14.4266 0.214844 15.7562Z" fill="url(#paint7_linear_403_23775)" />
                <path d="M2.61373 11.3243L0.0195312 16.1662C0.174221 15.3598 0.770973 13.3274 1.73841 11.5397L4.13737 7.10742C3.16961 8.89516 2.76874 10.5172 2.61373 11.3243Z" fill="url(#paint8_linear_403_23775)" />
                <path d="M19.0333 16.4766L16.6341 20.9088C13.0328 17.5827 9.45137 16.6363 6.61822 16.5093C6.51918 16.5046 6.42077 16.5011 6.3233 16.4986C4.80941 16.4637 3.53165 16.6718 2.6469 16.8834C1.99795 17.0384 1.56029 17.1953 1.39648 17.2592L3.79575 12.8269C3.95925 12.7631 4.39691 12.6062 5.04616 12.4512C5.9306 12.2399 7.20836 12.0314 8.72257 12.0663C8.81972 12.0689 8.91782 12.0723 9.01748 12.077C11.85 12.2041 15.4318 13.1504 19.0333 16.4766Z" fill="url(#paint9_linear_403_23775)" />
                <path d="M3.7965 12.8261L1.39723 17.2584C1.34347 17.2795 1.32932 17.2857 1.32869 17.2861C1.1935 17.3442 1.05044 17.3678 0.908954 17.3618C0.80457 17.3571 0.702072 17.3361 0.603976 17.3002C0.368797 17.2147 0.223225 17.0487 0.103749 16.8132C-0.0396228 16.5337 -0.0292472 16.2274 0.10312 15.9828L2.44171 11.5449C2.30903 11.7898 2.29865 12.0961 2.44202 12.3756C2.56181 12.6111 2.76744 12.7821 3.00293 12.868C3.10071 12.9038 3.20352 12.9249 3.30759 12.9299C3.44908 12.9359 3.59213 12.912 3.72733 12.8538C3.72859 12.8535 3.74242 12.8472 3.7965 12.8261Z" fill="url(#paint10_linear_403_23775)" />
                <path d="M46.7447 25.2021L44.3458 28.8015L33.7539 39.1265L36.1529 35.5274L46.7447 25.2021Z" fill="url(#paint11_linear_403_23775)" />
                <path d="M36.1519 35.5267L33.753 39.9589L31.4785 39.4791L33.8775 35.0469L36.1519 35.5267Z" fill="#255D3C" />
                <path d="M31.2307 34.4885L28.8318 38.9207L26.9355 38.5211L29.3348 34.0889L31.2307 34.4885Z" fill="#255D3C" />
                <path d="M29.3348 34.0889L26.9355 38.5211L30.3249 24.943L32.7238 20.5107L29.3348 34.0889Z" fill="url(#paint12_linear_403_23775)" />
                <path d="M26.7245 33.5385L24.3253 37.9708L22.1992 37.5224L24.5982 33.0898L26.7245 33.5385Z" fill="#255D3C" />
                <path d="M24.5978 33.09L22.1989 37.5226L16.6348 20.9088L19.034 16.4766L24.5978 33.09Z" fill="url(#paint13_linear_403_23775)" />
                <path d="M22.0415 32.5497L19.6425 36.982L16.7949 36.3815L19.1942 31.9492L22.0415 32.5497Z" fill="#255D3C" />
                <path d="M19.1906 32.0151L16.7916 36.4474L0.375 17.1721L3.00253 12.8682L19.1906 32.0151Z" fill="url(#paint14_linear_403_23775)" />
                <path d="M19.0923 35.3644L16.6934 39.7963L16.7921 36.4479L19.191 32.0156L19.0923 35.3644Z" fill="url(#paint15_linear_403_23775)" />
                <path d="M30.9557 40.7443L28.5564 43.7885L23.916 42.9276L26.315 39.8838L30.9557 40.7443Z" fill="url(#paint16_linear_403_23775)" />
                <path d="M23.1578 39.418L20.7589 42.4621L16.2559 41.6056L18.6551 38.5615L23.1578 39.418Z" fill="url(#paint17_linear_403_23775)" />
                <path d="M23.2706 47.0431L20.8717 49.254L20.7598 42.4621L23.1587 39.418L23.2706 47.0431Z" fill="url(#paint18_linear_403_23775)" />
                <path d="M27.7139 47.6108L24.2045 49.8217L20.8711 49.2539L23.27 47.043L27.7139 47.6108Z" fill="url(#paint19_linear_403_23775)" />
                <path d="M31.3958 52.5823L28.9968 57.0146L28.5566 43.7883L30.9559 40.7441L31.3958 52.5823Z" fill="url(#paint20_linear_403_23775)" />
                <path d="M39.1651 61.1362L36.7658 63.0696L32.8926 62.9366L35.2918 61.0029L39.1651 61.1362Z" fill="#4353FF" />
                <path d="M27.6314 60.6128L25.2325 65.0451L24.8477 56.4931L27.2469 52.0605L27.6314 60.6128Z" fill="url(#paint21_linear_403_23775)" />
                <path d="M35.537 65.128L33.1377 66.5057L12.6504 64.9871L14.7717 63.6094L35.537 65.128Z" fill="url(#paint22_linear_403_23775)" />
                <path d="M15.327 63.6091L12.6504 64.9868L12.9362 39.0979L15.3348 34.666L15.327 63.6091Z" fill="url(#paint23_linear_403_23775)" />
                <path d="M21.7831 6.25286C21.6045 6.15477 21.4174 6.1032 21.2435 6.09566C20.9612 6.08277 20.7147 6.18558 20.6015 6.39152C20.4191 6.72605 20.649 7.20427 21.1196 7.46208C21.2976 7.56018 21.4847 7.61143 21.6576 7.61929C21.9396 7.63218 22.1855 7.52874 22.2987 7.32123C22.4839 6.9889 22.2512 6.51036 21.7831 6.25286ZM46.7048 24.6959C46.6731 24.5336 46.6397 24.3736 46.6051 24.2133C46.6139 24.0507 46.5778 23.8838 46.496 23.73C44.6926 16.0923 39.779 10.6905 35.2845 7.20018C30.5954 3.55742 26.3335 1.94323 26.215 1.89764C23.0407 0.904735 20.2695 0.410796 17.8463 0.30201C17.6715 0.29415 17.4979 0.288176 17.3263 0.284403C10.5822 0.112735 6.67845 3.10089 4.64421 6.09974C3.09605 8.3613 2.26789 11.0382 2.07642 12.0355C2.07956 12.0327 2.08554 12.0248 2.08962 12.0207C2.03869 12.2226 2.05724 12.4452 2.16445 12.6536C2.20816 12.7395 2.26601 12.813 2.32952 12.881L18.9131 32.293L18.915 32.2273L21.7626 32.8278L4.76872 12.7285C5.65347 12.5169 6.93092 12.3087 8.44512 12.3436C8.54227 12.3461 8.64069 12.3496 8.74004 12.3543C11.5732 12.481 15.1546 13.4274 18.7559 16.7535L24.32 33.367L21.7629 32.8278L18.9134 32.293L18.815 35.6411L15.0575 34.9435L14.4944 63.8865L35.259 65.4051L35.0131 61.2807L38.8867 61.4137L36.117 35.8559L35.8746 35.8046L46.4665 25.4794C46.6734 25.2785 46.763 24.9845 46.7048 24.6959ZM2.58671 11.4406C2.58639 11.441 2.58639 11.441 2.58608 11.441C2.58608 11.441 2.58639 11.4406 2.58671 11.4406C2.60117 11.4353 2.69486 11.3963 2.8483 11.3403C2.69455 11.3966 2.60086 11.4353 2.58671 11.4406ZM20.4726 14.3886C20.432 13.3416 20.5974 12.2735 20.7791 11.4803C20.8672 11.0822 20.9615 10.753 21.0297 10.527C21.0653 10.4125 21.0935 10.3264 21.1124 10.2682C21.1316 10.2097 21.141 10.1893 21.1388 10.189C21.3092 9.71704 21.0445 9.18003 20.5449 8.98761C20.4374 8.94579 20.3283 8.92284 20.2211 8.91844C19.8284 8.90083 19.4633 9.11966 19.3291 9.48878C19.3149 9.5438 18.5025 11.7245 18.5547 14.2052C15.0833 11.5362 11.5763 10.6401 8.77179 10.5147C8.63848 10.5087 8.50675 10.5043 8.37689 10.5015C6.82182 10.4675 5.49815 10.6534 4.51027 10.8687C4.84763 9.74188 5.47866 8.16982 6.61745 6.68769C8.50172 4.25352 11.6427 2.01115 17.3948 2.12465C17.5517 2.12811 17.7105 2.13345 17.8715 2.14068C19.5476 2.21583 21.4413 2.49534 23.5752 3.03675C23.0583 3.41373 22.4986 3.91365 21.9236 4.58051C21.5941 4.95875 21.6633 5.54072 22.0783 5.8806C22.2562 6.02837 22.4729 6.10666 22.6851 6.11641C22.6917 6.11641 22.6992 6.11704 22.7062 6.11704C22.9769 6.12207 23.241 6.018 23.4224 5.81111C24.4464 4.64339 25.2526 4.16769 25.8647 3.89981C26.0153 3.83441 26.1537 3.78096 26.2807 3.73317C26.1537 3.78096 26.015 3.83441 25.882 3.91868C25.8823 3.91899 25.8896 3.92842 25.9198 3.96049C26.376 4.44469 30.5142 9.04577 32.2712 16.4086C32.3759 16.8438 32.7767 17.1525 33.2377 17.1733C33.2993 17.1758 33.3609 17.1714 33.4219 17.1601C33.9353 17.0742 34.2557 16.5989 34.1359 16.0971C33.0069 11.3862 30.9824 7.75354 29.4185 5.46746C31.0255 6.37705 32.9871 7.63658 34.9694 9.27372C38.3846 12.0949 41.85 16.0062 43.7701 21.1883C41.4661 19.493 39.2775 18.8658 37.491 18.7859C37.4102 18.7821 37.33 18.7796 37.2511 18.7784C35.6247 18.7457 34.3774 19.1251 33.6536 19.4232C30.1222 16.0499 26.6237 14.991 23.9952 14.8731C23.8927 14.8683 23.7912 14.8655 23.6915 14.8636C22.3792 14.836 21.3051 15.0224 20.549 15.2211C20.5075 14.9495 20.483 14.6703 20.4726 14.3886ZM20.8445 17.089C21.4435 16.9051 22.4653 16.674 23.7594 16.7032C23.8217 16.7048 23.8846 16.7073 23.9481 16.7102C26.1735 16.8098 29.1635 17.6282 32.4454 20.7884L29.0563 34.3665L26.4461 33.8154L20.8445 17.089ZM27.3538 60.8905L23.036 60.4321L22.748 51.7849L18.3915 51.1928L18.3777 38.8393L22.88 39.6958L22.992 47.3209L27.4355 47.8887L27.1475 40.3567L30.6777 41.022L31.1176 52.8598L26.9689 52.3386L27.3538 60.8905ZM45.6575 25.0298C45.3978 25.0185 45.1397 24.9053 44.951 24.7C44.8762 24.6192 44.8011 24.5402 44.7294 24.4748L33.6002 35.3248L30.9525 34.7661L34.3384 21.1921C34.8292 20.9717 35.9023 20.5853 37.3197 20.6205C37.3659 20.6217 37.4124 20.6236 37.4593 20.6258C39.3429 20.7101 41.8538 21.4738 44.7265 24.4629C44.8011 24.5409 44.8762 24.6198 44.9513 24.7003C45.1369 24.9028 45.3909 25.0144 45.672 25.0295C45.6673 25.0295 45.6622 25.0301 45.6575 25.0298Z" fill="white" />
                <path d="M22.0601 5.97523C21.8815 5.87682 21.6944 5.82557 21.5206 5.81802C21.2385 5.80513 20.9917 5.90826 20.8789 6.11388C20.6962 6.44842 20.926 6.92663 21.3967 7.18445C21.575 7.28255 21.7617 7.3338 21.9346 7.34166C22.2167 7.35455 22.4625 7.25111 22.5757 7.0436C22.7609 6.71095 22.5286 6.23242 22.0601 5.97523ZM46.9819 24.4182C46.9501 24.256 46.9168 24.0957 46.8822 23.9356C46.891 23.7728 46.8548 23.6058 46.7731 23.4524C44.9699 15.815 40.056 10.4128 35.5615 6.92255C30.8724 3.27979 26.6109 1.6656 26.492 1.62001C23.3177 0.627102 20.5465 0.133163 18.1237 0.0246916C17.9485 0.0168313 17.775 0.0108575 17.6036 0.00708456C10.8592 -0.164898 6.95549 2.82326 4.92125 5.82242C3.37278 8.08367 2.54462 10.7609 2.35346 11.7582C2.3566 11.755 2.36258 11.7475 2.36698 11.7431C2.31605 11.9449 2.3346 12.1675 2.4415 12.376C2.48551 12.4615 2.54305 12.5354 2.60656 12.6033L19.1905 32.0157L19.1924 31.95L22.0397 32.5505L5.04576 12.4508C5.9302 12.2395 7.20796 12.0311 8.72216 12.066C8.81932 12.0685 8.91741 12.072 9.01708 12.0767C11.8499 12.2037 15.4314 13.1501 19.0329 16.4762L24.5968 33.0897L22.0397 32.5505L19.1905 32.0157L19.0917 35.3641L15.3342 34.6661L14.7711 63.6092L35.5361 65.1278L35.2902 61.0031L39.1634 61.1364L36.3938 35.5783L36.1514 35.5273L46.7432 25.2021C46.9504 25.0008 47.04 24.7072 46.9819 24.4182ZM2.86344 11.163C2.8779 11.1573 2.97159 11.1187 3.12534 11.0627C2.97159 11.119 2.8779 11.1577 2.86344 11.163ZM20.7496 14.1106C20.7091 13.0636 20.8748 11.9956 21.0562 11.2023C21.1442 10.8043 21.2389 10.4751 21.3068 10.249C21.3423 10.1346 21.3709 10.0484 21.3898 9.99025C21.4086 9.93146 21.4181 9.91102 21.4159 9.91071C21.5866 9.43878 21.3215 8.90176 20.8219 8.70934C20.7147 8.66753 20.6056 8.64489 20.4981 8.64017C20.1054 8.62257 19.7407 8.8414 19.6061 9.2102C19.5923 9.26522 18.7795 11.446 18.8317 13.9267C15.3603 11.258 11.8534 10.3616 9.04884 10.2361C8.91553 10.2301 8.78379 10.2257 8.65394 10.2232C7.09886 10.1893 5.77488 10.3754 4.78731 10.5908C5.12499 9.46393 5.75601 7.89188 6.89481 6.40974C8.77876 3.9762 11.9197 1.73383 17.6719 1.84702C17.8291 1.85047 17.9875 1.85613 18.1485 1.86305C19.8246 1.93819 21.7183 2.21771 23.8522 2.75881C23.3357 3.1361 22.7757 3.6357 22.2006 4.30288C21.8711 4.6808 21.9403 5.26309 22.3553 5.60297C22.5333 5.75074 22.7499 5.82871 22.9625 5.83877C22.9691 5.83877 22.9766 5.83909 22.9835 5.83909C23.2539 5.84412 23.518 5.74005 23.6997 5.53317C24.7235 4.36576 25.5296 3.89006 26.1421 3.62218C26.2924 3.55647 26.4307 3.50302 26.5577 3.45523C26.4307 3.50302 26.2921 3.55647 26.1591 3.64073C26.1591 3.64073 26.1666 3.65048 26.1968 3.68255C26.653 4.16642 30.7913 8.76783 32.5482 16.1307C32.6532 16.5658 33.0541 16.8749 33.5147 16.8953C33.5763 16.8982 33.638 16.8935 33.6993 16.8821C34.2124 16.7963 34.5328 16.3212 34.4133 15.8194C33.2836 11.1086 31.2591 7.47591 29.6949 5.18983C31.3019 6.09942 33.2635 7.35895 35.2462 8.99577C38.661 11.817 42.1264 15.7282 44.0465 20.9104C41.7425 19.2151 39.5539 18.5878 37.7674 18.508C37.6866 18.5042 37.6064 18.5017 37.5275 18.5004C35.9011 18.4677 34.6541 18.8469 33.93 19.1453C30.3986 15.772 26.9004 14.713 24.2713 14.5951C24.1688 14.5904 24.0676 14.5876 23.9676 14.5857C22.6556 14.558 21.5816 14.7445 20.8251 14.9432C20.7842 14.6718 20.76 14.3926 20.7496 14.1106ZM21.1216 16.8114C21.7208 16.6275 22.7424 16.3964 24.0368 16.4259C24.099 16.4275 24.1616 16.43 24.2254 16.4328C26.4512 16.5322 29.4412 17.3509 32.7227 20.5107L29.334 34.0889L26.7234 33.538L21.1216 16.8114ZM27.6305 60.6129L23.3127 60.1542L23.025 51.5072L18.6685 50.9149L18.6544 38.5617L23.1571 39.4182L23.2687 47.0432L27.7126 47.6111L27.4243 40.079L30.9545 40.744L31.3943 52.5822L27.2457 52.0606L27.6305 60.6129ZM45.9346 24.7521C45.6752 24.7408 45.4167 24.6276 45.2281 24.4226C45.1536 24.3418 45.0781 24.2629 45.0064 24.1975L33.8772 35.0472L31.2296 34.4888L34.6155 20.9148C35.1063 20.6944 36.1796 20.308 37.5967 20.3432C37.6429 20.3444 37.6894 20.3466 37.7363 20.3485C39.6199 20.4328 42.1311 21.1968 45.0036 24.1856C45.0781 24.2632 45.1536 24.3422 45.2284 24.423C45.4139 24.6251 45.6682 24.7371 45.9493 24.7521C45.9443 24.7518 45.9396 24.7525 45.9346 24.7521Z" fill="#4353FF" />
                <rect x="17.0332" y="37.0732" width="15.9795" height="25.1106" fill="#4353FF" />
                <g filter="url(#filter0_d_403_23775)">
                  <path d="M31.3213 51.6335C31.3593 50.8717 31.1922 50.1145 30.8386 49.4462C30.485 48.7779 29.9587 48.2245 29.3182 47.8475C29.3184 47.8443 29.3185 47.8417 29.3186 47.8391L29.2511 47.8093L29.1714 47.7651L29.1708 47.7762C29.0203 47.7158 28.8629 47.662 28.6904 47.6127C28.8281 47.5868 28.9586 47.558 29.082 47.5264L29.0816 47.5328L29.1026 47.5238L29.1497 47.5113C29.1496 47.5087 29.1497 47.506 29.1501 47.5034C29.7043 47.2604 30.1822 46.8622 30.5297 46.354C30.8773 45.8457 31.0806 45.2476 31.1168 44.6273C31.153 44.007 31.0205 43.3891 30.7345 42.8435C30.4484 42.298 30.02 41.8465 29.4979 41.54C29.3224 41.419 29.1331 41.3208 28.9343 41.2476C28.3565 41.0331 27.4945 40.8974 26.3482 40.8404L22.7246 40.6602L22.5925 43.3164C23.2257 43.0628 23.8807 43.1324 24.5423 43.3689C25.8492 43.8384 27.2604 44.2671 28.8837 44.2087C28.897 44.2094 28.8614 44.2357 28.812 44.2723C28.7442 44.3232 28.6821 44.3816 28.6268 44.4466C27.998 45.1661 27.1377 45.2434 26.2025 45.19C25.7153 45.1621 25.0393 44.66 24.7957 45.2686C24.6736 45.574 25.186 46.1657 25.4986 46.5678C26.2486 47.5357 26.6733 48.5736 26.4885 49.7895C26.3022 51.0154 26.3924 51.1034 27.6862 50.9108C27.8527 50.8863 27.9926 50.8303 28.1809 50.8201C28.5554 50.8001 29.1313 50.7616 29.6723 50.8197C28.2857 51.7374 27.0428 53.1492 25.2542 52.0678L25.1194 54.7789L25.0958 55.2536L26.2124 55.3091C27.3928 55.3678 28.253 55.3542 28.7931 55.2682L28.7987 55.2685L28.8075 55.2663C29.0909 55.1826 29.3545 55.0391 29.5816 54.8448C30.092 54.4844 30.5147 54.0068 30.8166 53.4495C31.1185 52.8923 31.2912 52.2706 31.3213 51.6335Z" fill="white" />
                </g>
                <defs>
                  <filter id="filter0_d_403_23775" x="18.5918" y="40.6602" width="12.7344" height="17.6846" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="-3" dy="2" />
                    <feGaussianBlur stdDeviation="0.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.183066 0 0 0 0 0.250465 0 0 0 0 0.975 0 0 0 1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_403_23775" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_403_23775" result="shape" />
                  </filter>
                  <linearGradient id="paint0_linear_403_23775" x1="21.2137" y1="11.3575" x2="10.3851" y2="5.9894" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#278CFF" />
                    <stop offset="0.5275" stop-color="#3176FF" />
                    <stop offset="1" stop-color="#3A5EF7" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_403_23775" x1="25.2542" y1="7.11175" x2="21.8299" y2="6.09369" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#278AFF" />
                    <stop offset="0.5275" stop-color="#3470FF" />
                    <stop offset="1" stop-color="#3A5CF6" />
                  </linearGradient>
                  <linearGradient id="paint2_linear_403_23775" x1="39.3639" y1="21.9078" x2="32.1448" y2="8.44144" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2988FF" />
                    <stop offset="0.5275" stop-color="#3470FF" />
                    <stop offset="1" stop-color="#4353FF" />
                  </linearGradient>
                  <linearGradient id="paint3_linear_403_23775" x1="17.9945" y1="7.83833" x2="21.3259" y2="9.59648" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2392FF" />
                    <stop offset="0.5275" stop-color="#2A85FF" />
                    <stop offset="1" stop-color="#3E5EFF" />
                  </linearGradient>
                  <linearGradient id="paint4_linear_403_23775" x1="24.2956" y1="8.1078" x2="31.422" y2="15.6509" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#278AFF" />
                    <stop offset="0.552083" stop-color="#2E7DFE" />
                    <stop offset="1" stop-color="#4353FF" />
                  </linearGradient>
                  <linearGradient id="paint5_linear_403_23775" x1="43.3321" y1="26.7988" x2="34.7247" y2="22.2637" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#278BFF" />
                    <stop offset="0.5275" stop-color="#3373FF" />
                    <stop offset="1" stop-color="#3A5BF5" />
                  </linearGradient>
                  <linearGradient id="paint6_linear_403_23775" x1="31.504" y1="24.463" x2="21.8785" y2="18.1694" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#278BFF" />
                    <stop offset="0.5275" stop-color="#356EFF" />
                    <stop offset="1" stop-color="#3A5BF5" />
                  </linearGradient>
                  <linearGradient id="paint7_linear_403_23775" x1="0.866868" y1="10.4559" x2="3.39567" y2="12.3415" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#6BC189" />
                    <stop offset="0.5275" stop-color="#6ADB80" />
                    <stop offset="1" stop-color="#217B3D" />
                  </linearGradient>
                  <linearGradient id="paint8_linear_403_23775" x1="3.7441" y1="13.5591" x2="21.3178" y2="33.8438" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2986FF" />
                    <stop offset="0.5275" stop-color="#366CFF" />
                    <stop offset="1" stop-color="#3B58F3" />
                  </linearGradient>
                  <linearGradient id="paint9_linear_403_23775" x1="17.854" y1="21.3381" x2="5.1741" y2="13.5636" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2986FF" />
                    <stop offset="0.53125" stop-color="#3373FF" />
                    <stop offset="1" stop-color="#3B59F4" />
                  </linearGradient>
                  <linearGradient id="paint10_linear_403_23775" x1="2.05011" y1="14.967" x2="19.4495" y2="35.0504" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#278AFF" />
                    <stop offset="0.5275" stop-color="#356EFF" />
                    <stop offset="1" stop-color="#3B59F4" />
                  </linearGradient>
                  <linearGradient id="paint11_linear_403_23775" x1="44.007" y1="28.7524" x2="35.9549" y2="36.0641" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#278CFF" />
                    <stop offset="0.5275" stop-color="#356EFF" />
                    <stop offset="1" stop-color="#3A5DF7" />
                  </linearGradient>
                  <linearGradient id="paint12_linear_403_23775" x1="26.8657" y1="18.4756" x2="30.5677" y2="32.2661" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2889FF" />
                    <stop offset="0.5275" stop-color="#366DFF" />
                    <stop offset="1" stop-color="#3A5CF6" />
                  </linearGradient>
                  <linearGradient id="paint13_linear_403_23775" x1="14.7904" y1="18.7707" x2="22.1947" y2="29.2292" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#278AFF" />
                    <stop offset="0.5275" stop-color="#4353FF" />
                    <stop offset="1" stop-color="#4353FF" />
                  </linearGradient>
                  <linearGradient id="paint14_linear_403_23775" x1="1.73621" y1="15.2378" x2="19.1363" y2="35.322" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#268DFF" />
                    <stop offset="0.5275" stop-color="#376AFF" />
                    <stop offset="1" stop-color="#3C52EF" />
                  </linearGradient>
                  <linearGradient id="paint15_linear_403_23775" x1="12.5356" y1="30.8239" x2="17.1629" y2="35.1736" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#278BFF" />
                    <stop offset="0.5275" stop-color="#3274FF" />
                    <stop offset="1" stop-color="#4353FF" />
                  </linearGradient>
                  <linearGradient id="paint16_linear_403_23775" x1="29.2343" y1="37.0229" x2="26.0876" y2="45.4451" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#278CFF" />
                    <stop offset="0.5275" stop-color="#3373FF" />
                    <stop offset="1" stop-color="#3A5AF4" />
                  </linearGradient>
                  <linearGradient id="paint17_linear_403_23775" x1="22.0178" y1="34.3263" x2="18.8711" y2="42.7487" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2987FF" />
                    <stop offset="0.5275" stop-color="#356DFF" />
                    <stop offset="0.9998" stop-color="#395FF7" />
                    <stop offset="0.9999" stop-color="#3A5DF6" />
                  </linearGradient>
                  <linearGradient id="paint18_linear_403_23775" x1="24.9628" y1="43.4645" x2="18.3915" y2="45.4082" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2888FF" />
                    <stop offset="0.5275" stop-color="#356EFF" />
                    <stop offset="1" stop-color="#3A5BF5" />
                  </linearGradient>
                  <linearGradient id="paint19_linear_403_23775" x1="25.7796" y1="45.8302" x2="23.188" y2="50.3654" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#278BFF" />
                    <stop offset="0.5275" stop-color="#356FFF" />
                    <stop offset="1" stop-color="#3A5AF4" />
                  </linearGradient>
                  <linearGradient id="paint20_linear_403_23775" x1="33.0473" y1="48.7177" x2="27.7713" y2="48.9953" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2987FF" />
                    <stop offset="0.5275" stop-color="#366DFF" />
                    <stop offset="1" stop-color="#4353FF" />
                  </linearGradient>
                  <linearGradient id="paint21_linear_403_23775" x1="28.0077" y1="58.4759" x2="23.7504" y2="58.6608" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2C81FF" />
                    <stop offset="0.5275" stop-color="#3371FD" />
                    <stop offset="1" stop-color="#3A5EF7" />
                  </linearGradient>
                  <linearGradient id="paint22_linear_403_23775" x1="24.0938" y1="54.8745" x2="24.0938" y2="65.7608" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#278BFF" />
                    <stop offset="0.5275" stop-color="#3373FF" />
                    <stop offset="1" stop-color="#3B59F4" />
                  </linearGradient>
                  <linearGradient id="paint23_linear_403_23775" x1="11.644" y1="35.062" x2="15.9838" y2="62.3414" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#6BC189" />
                    <stop offset="0.0001" stop-color="#278BFF" />
                    <stop offset="0.5275" stop-color="#3372FF" />
                    <stop offset="1" stop-color="#3A5AF5" />
                  </linearGradient>
                </defs>
              </svg>}
            <p className="congratulation-message">Congrats!</p>

            <p className="item-lead">{successModalText}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-continue mb-0"
            >
              Okay
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Submission success modal */}
      <Dialog
        fullWidth={true}
        maxWidth={"xs"}
        open={isSubmissionSuccess === "success"}
        className="congratulation-modal"
        onClose={() => setIsSubmissionSuccess("")}
      >
        <DialogContent>
          <div className="congratulation-content">
            {/* <img src={`/images/challenge.png`} alt="Challenge Icon" /> */}
            <svg style={{ marginBottom: 23 }} width="47" height="67" viewBox="0 0 47 67" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27.5225 2.42546L25.1239 6.85771C24.9708 6.7005 24.7768 6.60178 24.5762 6.56311L26.9751 2.13086C27.176 2.16953 27.3694 2.26826 27.5225 2.42546Z" fill="#26603E" />
              <path d="M27.0314 3.0546L24.6321 7.48685C24.7566 7.25795 24.7736 6.9731 24.6541 6.70648C24.6321 6.65586 24.6057 6.60807 24.5762 6.56311L26.9748 2.13086C27.0047 2.17582 27.0311 2.22361 27.0534 2.27392C27.1726 2.54117 27.1556 2.82571 27.0314 3.0546Z" fill="#26603E" />
              <path d="M27.0314 3.0546L24.6321 7.48685C24.7566 7.25795 24.7736 6.9731 24.6541 6.70648C24.6321 6.65586 24.6057 6.60807 24.5762 6.56311L26.9748 2.13086C27.0047 2.17582 27.0311 2.22361 27.0534 2.27392C27.1726 2.54117 27.1556 2.82571 27.0314 3.0546Z" fill="#26603E" />
              <path d="M29.6961 5.1891L27.2969 9.62135C26.0873 7.85311 25.1535 6.89007 25.123 6.85705L27.5217 2.4248C27.5522 2.45782 28.4863 3.42117 29.6961 5.1891Z" fill="#26603E" />
              <path d="M26.9735 2.13127L24.5746 6.56351C24.3941 6.28872 24.0844 6.11862 23.7644 6.10447C23.6399 6.09882 23.5141 6.11674 23.3937 6.16107C22.9107 6.33148 22.2316 6.62262 21.4531 7.19139L23.8521 2.75914C24.6306 2.19037 25.31 1.89923 25.7926 1.72882C25.913 1.68417 26.0388 1.66625 26.1633 1.67191C26.4837 1.68637 26.7924 1.85647 26.9735 2.13127Z" fill="#26603E" />
              <path d="M23.8539 2.75899L21.455 7.19124C19.3214 6.65014 17.4274 6.37062 15.7509 6.29548C15.5903 6.28856 15.4315 6.2829 15.2749 6.27945C9.52213 6.16594 6.38148 8.40832 4.49722 10.8419C4.08534 11.3776 3.74043 11.9253 3.45117 12.4592L5.85044 8.02725C6.13938 7.49307 6.48492 6.94537 6.89648 6.40961C8.78043 3.97607 11.9214 1.7337 17.6735 1.84688C17.8307 1.85034 17.9892 1.856 18.1502 1.86292C19.8263 1.93838 21.72 2.21789 23.8539 2.75899Z" fill="url(#paint0_linear_403_23775)" />
              <path d="M27.0304 3.05469L24.6311 7.48694C24.5343 7.66615 24.3724 7.81109 24.1598 7.88781C24.0325 7.9356 23.8935 7.98905 23.7432 8.05445C23.1311 8.32232 22.3249 8.79803 21.3012 9.96543C21.1195 10.1723 20.8551 10.2761 20.5847 10.2714C20.5778 10.2714 20.5705 10.2707 20.5636 10.2707C20.3511 10.261 20.1351 10.183 19.9568 10.0349C19.5946 9.73843 19.4956 9.25707 19.6952 8.88826L22.0945 4.45602C21.8948 4.82482 21.9935 5.30618 22.3557 5.60267C22.5337 5.75044 22.7503 5.82842 22.9629 5.83848C22.9695 5.83848 22.977 5.83879 22.9839 5.83879C23.2543 5.84382 23.5184 5.73975 23.7002 5.53287C24.7239 4.36547 25.53 3.88976 26.1425 3.62188C26.2928 3.55617 26.4311 3.50272 26.5582 3.45493C26.7716 3.37916 26.9339 3.2339 27.0304 3.05469Z" fill="url(#paint1_linear_403_23775)" />
              <path d="M44.048 20.9103L41.6491 25.3426C39.729 20.1604 36.2636 16.2495 32.8484 13.428C30.8661 11.7911 28.9041 10.5313 27.2969 9.6217L29.6961 5.18945C31.3034 6.09936 33.265 7.35889 35.2477 8.99571C38.6625 11.8169 42.1279 15.7279 44.048 20.9103Z" fill="url(#paint2_linear_403_23775)" />
              <path d="M34.3364 16.4375L31.9375 20.8697C31.8139 21.0977 31.5875 21.2668 31.3008 21.3153L33.7 16.883C33.9865 16.8346 34.2132 16.6654 34.3364 16.4375Z" fill="#4353FF" />
              <path d="M22.5767 7.04268L20.1775 11.4749C20.0646 11.6824 19.8184 11.7856 19.5367 11.773C19.3635 11.7654 19.177 11.7139 18.9988 11.6161C18.5281 11.3586 18.2979 10.8801 18.4806 10.5455L20.8799 6.11328C20.6972 6.44781 20.927 6.92603 21.3977 7.18385C21.576 7.28195 21.7627 7.3332 21.9357 7.34106C22.2177 7.35332 22.4632 7.25019 22.5767 7.04268Z" fill="url(#paint3_linear_403_23775)" />
              <path d="M46.7733 23.4522L44.3744 27.8844C44.3351 27.8112 44.2863 27.7407 44.226 27.6756C43.3607 26.7362 42.4967 25.9665 41.6484 25.3424L44.0474 20.9102C44.8957 21.5343 45.7597 22.3039 46.6246 23.2434C46.685 23.3088 46.7343 23.3789 46.7733 23.4522Z" fill="#26603E" />
              <path d="M19.606 9.21081L17.207 13.6431C17.2215 13.6031 17.2388 13.5648 17.2583 13.5289L19.6572 9.09668C19.6377 9.13284 19.6204 9.17088 19.606 9.21081Z" fill="#26603E" />
              <path d="M46.7821 24.2968L44.3828 28.7291C44.4435 28.6171 44.4771 28.4936 44.4841 28.3678L46.883 23.9355C46.8761 24.0616 46.8425 24.1849 46.7821 24.2968Z" fill="#26603E" />
              <path d="M33.7012 16.8823L31.3019 21.3146C31.2406 21.3256 31.1793 21.3303 31.1177 21.3275C30.6571 21.307 30.2559 20.998 30.1509 20.5628C28.3942 13.2 24.256 8.59888 23.7991 8.11469C23.769 8.08262 23.762 8.07319 23.7617 8.07287L26.1607 3.64062C26.161 3.64062 26.1682 3.65037 26.1984 3.68244C26.6546 4.16632 30.7929 8.76772 32.5498 16.1306C32.6548 16.5657 33.0557 16.8748 33.5163 16.8952C33.5783 16.8981 33.6399 16.8934 33.7012 16.8823Z" fill="url(#paint4_linear_403_23775)" />
              <path d="M46.7821 24.2969L44.3828 28.7291C44.3337 28.82 44.2668 28.9033 44.1822 28.9744C44.0068 29.1228 43.7838 29.1907 43.5625 29.1856L45.9618 24.7534C46.1831 24.7584 46.4057 24.6905 46.5812 24.5421C46.6657 24.4711 46.7324 24.3877 46.7821 24.2969Z" fill="#26603E" />
              <path d="M34.7093 20.5369L32.3103 24.9692C32.4317 24.4828 32.1154 23.9697 31.5991 23.8238C31.5211 23.8015 31.4432 23.7889 31.3671 23.7858C31.0118 23.7697 30.6857 23.9467 30.5254 24.2429L32.9247 19.8107C33.085 19.5145 33.4107 19.3378 33.766 19.3535C33.8424 19.3567 33.9201 19.3692 33.9981 19.3916C34.514 19.5374 34.8309 20.0506 34.7093 20.5369Z" fill="#26603E" />
              <path d="M45.9616 24.7533L43.5623 29.1856C43.2765 29.173 43.0184 29.0598 42.83 28.8548C42.7549 28.774 42.6798 28.6951 42.6052 28.6174C39.7325 25.6286 37.2213 24.8646 35.338 24.7803C35.2911 24.7785 35.2446 24.7766 35.1987 24.7753C33.7807 24.7401 32.7076 25.1265 32.2168 25.3469L34.6161 20.9147C35.1069 20.6943 36.1803 20.3079 37.5973 20.3431C37.6435 20.3443 37.6901 20.3465 37.7369 20.3484C39.6205 20.4327 42.1317 21.1967 45.0042 24.1855C45.0787 24.2631 45.1542 24.3421 45.229 24.4229C45.4173 24.6275 45.6758 24.7407 45.9616 24.7533Z" fill="url(#paint5_linear_403_23775)" />
              <path d="M34.6161 20.9141L32.2168 25.3463L32.3111 24.9694L34.7101 20.5371L34.6161 20.9141Z" fill="#255D3C" />
              <path d="M32.8482 20.0099L30.4492 24.4422C30.4671 24.3711 30.4929 24.3048 30.5259 24.2438L32.9252 19.8115C32.8922 19.8728 32.8661 19.9389 32.8482 20.0099Z" fill="#26603E" />
              <path d="M32.7232 20.5106L30.3242 24.9429L30.449 24.442L32.848 20.0098L32.7232 20.5106Z" fill="#255D3C" />
              <path d="M20.9421 16.2736L18.5431 20.7059C18.6283 20.5223 18.6488 20.3066 18.5859 20.0903C18.5173 19.8611 18.4655 19.6218 18.4277 19.3756L20.827 14.9434C20.8647 15.1895 20.9163 15.4291 20.9848 15.658C21.0477 15.8743 21.0273 16.09 20.9421 16.2736Z" fill="#26603E" />
              <path d="M20.7333 15.651L18.3343 20.0832C18.2013 19.6836 17.8202 19.4151 17.4131 19.3972C17.3181 19.3928 17.2226 19.4022 17.1276 19.4264C16.8852 19.4896 16.6962 19.6393 16.584 19.8326L18.9829 15.4004C19.0955 15.207 19.2845 15.0574 19.5269 14.9942C19.6215 14.9697 19.7174 14.9605 19.8124 14.9649C20.2198 14.9829 20.6003 15.2514 20.7333 15.651Z" fill="#26603E" />
              <path d="M20.7333 15.651L18.3343 20.0832C18.2013 19.6836 17.8202 19.4151 17.4131 19.3972C17.3181 19.3928 17.2226 19.4022 17.1276 19.4264C16.8852 19.4896 16.6962 19.6393 16.584 19.8326L18.9829 15.4004C19.0955 15.207 19.2845 15.0574 19.5269 14.9942C19.6215 14.9697 19.7174 14.9605 19.8124 14.9649C20.2198 14.9829 20.6003 15.2514 20.7333 15.651Z" fill="#26603E" />
              <path d="M20.9421 16.2736L18.5431 20.7059C18.6283 20.5223 18.6488 20.3066 18.5859 20.0903C18.5173 19.8611 18.4655 19.6218 18.4277 19.3756L20.827 14.9434C20.8647 15.1895 20.9163 15.4291 20.9848 15.658C21.0477 15.8743 21.0273 16.09 20.9421 16.2736Z" fill="#26603E" />
              <path d="M20.943 16.2733L18.5444 20.7055L18.3359 20.0833L20.7349 15.6514L20.943 16.2733Z" fill="#255D3C" />
              <path d="M20.7333 15.651L18.3343 20.0832C18.2013 19.6836 17.8202 19.4151 17.4131 19.3972C17.3181 19.3928 17.2226 19.4022 17.1276 19.4264C16.8852 19.4896 16.6962 19.6393 16.584 19.8326L18.9829 15.4004C19.0955 15.207 19.2845 15.0574 19.5269 14.9942C19.6215 14.9697 19.7174 14.9605 19.8124 14.9649C20.2198 14.9829 20.6003 15.2514 20.7333 15.651Z" fill="#26603E" />
              <path d="M18.984 15.4011L16.585 19.8333C16.4982 19.385 16.4533 18.9369 16.4379 18.4999C16.4363 18.4534 16.4347 18.4062 16.4341 18.3597C16.3813 15.879 17.1944 13.6979 17.2082 13.6432L19.6071 9.21094C19.5933 9.26596 18.7806 11.4467 18.8327 13.9274C18.834 13.9739 18.8353 14.0211 18.8368 14.0676C18.8526 14.5047 18.8975 14.9524 18.984 15.4011Z" fill="#4353FF" />
              <path d="M18.9844 15.4004L16.5855 19.8326C16.5808 19.8402 16.5767 19.8477 16.5723 19.8559L18.9715 15.4237C18.9756 15.4155 18.9797 15.4079 18.9844 15.4004Z" fill="#26603E" />
              <path d="M32.7227 20.5109L30.3238 24.9432C27.042 21.7833 24.0519 20.9646 21.8259 20.8653C21.7627 20.8624 21.7001 20.8599 21.6376 20.8583C20.3434 20.8288 19.3216 21.0599 18.7227 21.2441L21.1216 16.8119C21.7209 16.6279 22.7424 16.3968 24.0368 16.4264C24.0991 16.428 24.1616 16.4305 24.2255 16.4333C26.4509 16.5327 29.4409 17.3511 32.7227 20.5109Z" fill="url(#paint6_linear_403_23775)" />
              <path d="M21.1221 16.8114L18.7231 21.2436L18.543 20.7057L20.9416 16.2734L21.1221 16.8114Z" fill="#255D3C" />
              <path d="M18.9152 16.1202L16.5163 20.5525C16.4345 20.3073 16.4616 20.0595 16.5716 19.8561L18.9709 15.4238C18.8605 15.6273 18.8335 15.875 18.9152 16.1202Z" fill="#26603E" />
              <path d="M19.0337 16.4754L16.6345 20.9076L16.5156 20.5524L18.9146 16.1201L19.0337 16.4754Z" fill="#255D3C" />
              <path d="M4.78931 10.5908L2.39005 15.0231C1.21006 15.2799 0.509557 15.5796 0.466797 15.595L2.86575 11.1627C2.90851 11.147 3.60933 10.8477 4.78931 10.5908Z" fill="#26603E" />
              <path d="M2.86375 11.1631L0.4648 15.5953C0.369848 15.6365 0.286215 15.6912 0.214844 15.7563L2.61411 11.3241C2.68517 11.2593 2.76912 11.2043 2.86375 11.1631Z" fill="#26603E" />
              <path d="M0.214844 15.7562C0.369848 14.9495 0.771036 13.3274 1.73879 11.5397L4.13743 7.10742C3.16999 8.89516 2.7688 10.5172 2.61411 11.324C1.8938 12.6539 0.93453 14.4266 0.214844 15.7562Z" fill="url(#paint7_linear_403_23775)" />
              <path d="M2.61373 11.3243L0.0195312 16.1662C0.174221 15.3598 0.770973 13.3274 1.73841 11.5397L4.13737 7.10742C3.16961 8.89516 2.76874 10.5172 2.61373 11.3243Z" fill="url(#paint8_linear_403_23775)" />
              <path d="M19.0333 16.4766L16.6341 20.9088C13.0328 17.5827 9.45137 16.6363 6.61822 16.5093C6.51918 16.5046 6.42077 16.5011 6.3233 16.4986C4.80941 16.4637 3.53165 16.6718 2.6469 16.8834C1.99795 17.0384 1.56029 17.1953 1.39648 17.2592L3.79575 12.8269C3.95925 12.7631 4.39691 12.6062 5.04616 12.4512C5.9306 12.2399 7.20836 12.0314 8.72257 12.0663C8.81972 12.0689 8.91782 12.0723 9.01748 12.077C11.85 12.2041 15.4318 13.1504 19.0333 16.4766Z" fill="url(#paint9_linear_403_23775)" />
              <path d="M3.7965 12.8261L1.39723 17.2584C1.34347 17.2795 1.32932 17.2857 1.32869 17.2861C1.1935 17.3442 1.05044 17.3678 0.908954 17.3618C0.80457 17.3571 0.702072 17.3361 0.603976 17.3002C0.368797 17.2147 0.223225 17.0487 0.103749 16.8132C-0.0396228 16.5337 -0.0292472 16.2274 0.10312 15.9828L2.44171 11.5449C2.30903 11.7898 2.29865 12.0961 2.44202 12.3756C2.56181 12.6111 2.76744 12.7821 3.00293 12.868C3.10071 12.9038 3.20352 12.9249 3.30759 12.9299C3.44908 12.9359 3.59213 12.912 3.72733 12.8538C3.72859 12.8535 3.74242 12.8472 3.7965 12.8261Z" fill="url(#paint10_linear_403_23775)" />
              <path d="M46.7447 25.2021L44.3458 28.8015L33.7539 39.1265L36.1529 35.5274L46.7447 25.2021Z" fill="url(#paint11_linear_403_23775)" />
              <path d="M36.1519 35.5267L33.753 39.9589L31.4785 39.4791L33.8775 35.0469L36.1519 35.5267Z" fill="#255D3C" />
              <path d="M31.2307 34.4885L28.8318 38.9207L26.9355 38.5211L29.3348 34.0889L31.2307 34.4885Z" fill="#255D3C" />
              <path d="M29.3348 34.0889L26.9355 38.5211L30.3249 24.943L32.7238 20.5107L29.3348 34.0889Z" fill="url(#paint12_linear_403_23775)" />
              <path d="M26.7245 33.5385L24.3253 37.9708L22.1992 37.5224L24.5982 33.0898L26.7245 33.5385Z" fill="#255D3C" />
              <path d="M24.5978 33.09L22.1989 37.5226L16.6348 20.9088L19.034 16.4766L24.5978 33.09Z" fill="url(#paint13_linear_403_23775)" />
              <path d="M22.0415 32.5497L19.6425 36.982L16.7949 36.3815L19.1942 31.9492L22.0415 32.5497Z" fill="#255D3C" />
              <path d="M19.1906 32.0151L16.7916 36.4474L0.375 17.1721L3.00253 12.8682L19.1906 32.0151Z" fill="url(#paint14_linear_403_23775)" />
              <path d="M19.0923 35.3644L16.6934 39.7963L16.7921 36.4479L19.191 32.0156L19.0923 35.3644Z" fill="url(#paint15_linear_403_23775)" />
              <path d="M30.9557 40.7443L28.5564 43.7885L23.916 42.9276L26.315 39.8838L30.9557 40.7443Z" fill="url(#paint16_linear_403_23775)" />
              <path d="M23.1578 39.418L20.7589 42.4621L16.2559 41.6056L18.6551 38.5615L23.1578 39.418Z" fill="url(#paint17_linear_403_23775)" />
              <path d="M23.2706 47.0431L20.8717 49.254L20.7598 42.4621L23.1587 39.418L23.2706 47.0431Z" fill="url(#paint18_linear_403_23775)" />
              <path d="M27.7139 47.6108L24.2045 49.8217L20.8711 49.2539L23.27 47.043L27.7139 47.6108Z" fill="url(#paint19_linear_403_23775)" />
              <path d="M31.3958 52.5823L28.9968 57.0146L28.5566 43.7883L30.9559 40.7441L31.3958 52.5823Z" fill="url(#paint20_linear_403_23775)" />
              <path d="M39.1651 61.1362L36.7658 63.0696L32.8926 62.9366L35.2918 61.0029L39.1651 61.1362Z" fill="#4353FF" />
              <path d="M27.6314 60.6128L25.2325 65.0451L24.8477 56.4931L27.2469 52.0605L27.6314 60.6128Z" fill="url(#paint21_linear_403_23775)" />
              <path d="M35.537 65.128L33.1377 66.5057L12.6504 64.9871L14.7717 63.6094L35.537 65.128Z" fill="url(#paint22_linear_403_23775)" />
              <path d="M15.327 63.6091L12.6504 64.9868L12.9362 39.0979L15.3348 34.666L15.327 63.6091Z" fill="url(#paint23_linear_403_23775)" />
              <path d="M21.7831 6.25286C21.6045 6.15477 21.4174 6.1032 21.2435 6.09566C20.9612 6.08277 20.7147 6.18558 20.6015 6.39152C20.4191 6.72605 20.649 7.20427 21.1196 7.46208C21.2976 7.56018 21.4847 7.61143 21.6576 7.61929C21.9396 7.63218 22.1855 7.52874 22.2987 7.32123C22.4839 6.9889 22.2512 6.51036 21.7831 6.25286ZM46.7048 24.6959C46.6731 24.5336 46.6397 24.3736 46.6051 24.2133C46.6139 24.0507 46.5778 23.8838 46.496 23.73C44.6926 16.0923 39.779 10.6905 35.2845 7.20018C30.5954 3.55742 26.3335 1.94323 26.215 1.89764C23.0407 0.904735 20.2695 0.410796 17.8463 0.30201C17.6715 0.29415 17.4979 0.288176 17.3263 0.284403C10.5822 0.112735 6.67845 3.10089 4.64421 6.09974C3.09605 8.3613 2.26789 11.0382 2.07642 12.0355C2.07956 12.0327 2.08554 12.0248 2.08962 12.0207C2.03869 12.2226 2.05724 12.4452 2.16445 12.6536C2.20816 12.7395 2.26601 12.813 2.32952 12.881L18.9131 32.293L18.915 32.2273L21.7626 32.8278L4.76872 12.7285C5.65347 12.5169 6.93092 12.3087 8.44512 12.3436C8.54227 12.3461 8.64069 12.3496 8.74004 12.3543C11.5732 12.481 15.1546 13.4274 18.7559 16.7535L24.32 33.367L21.7629 32.8278L18.9134 32.293L18.815 35.6411L15.0575 34.9435L14.4944 63.8865L35.259 65.4051L35.0131 61.2807L38.8867 61.4137L36.117 35.8559L35.8746 35.8046L46.4665 25.4794C46.6734 25.2785 46.763 24.9845 46.7048 24.6959ZM2.58671 11.4406C2.58639 11.441 2.58639 11.441 2.58608 11.441C2.58608 11.441 2.58639 11.4406 2.58671 11.4406C2.60117 11.4353 2.69486 11.3963 2.8483 11.3403C2.69455 11.3966 2.60086 11.4353 2.58671 11.4406ZM20.4726 14.3886C20.432 13.3416 20.5974 12.2735 20.7791 11.4803C20.8672 11.0822 20.9615 10.753 21.0297 10.527C21.0653 10.4125 21.0935 10.3264 21.1124 10.2682C21.1316 10.2097 21.141 10.1893 21.1388 10.189C21.3092 9.71704 21.0445 9.18003 20.5449 8.98761C20.4374 8.94579 20.3283 8.92284 20.2211 8.91844C19.8284 8.90083 19.4633 9.11966 19.3291 9.48878C19.3149 9.5438 18.5025 11.7245 18.5547 14.2052C15.0833 11.5362 11.5763 10.6401 8.77179 10.5147C8.63848 10.5087 8.50675 10.5043 8.37689 10.5015C6.82182 10.4675 5.49815 10.6534 4.51027 10.8687C4.84763 9.74188 5.47866 8.16982 6.61745 6.68769C8.50172 4.25352 11.6427 2.01115 17.3948 2.12465C17.5517 2.12811 17.7105 2.13345 17.8715 2.14068C19.5476 2.21583 21.4413 2.49534 23.5752 3.03675C23.0583 3.41373 22.4986 3.91365 21.9236 4.58051C21.5941 4.95875 21.6633 5.54072 22.0783 5.8806C22.2562 6.02837 22.4729 6.10666 22.6851 6.11641C22.6917 6.11641 22.6992 6.11704 22.7062 6.11704C22.9769 6.12207 23.241 6.018 23.4224 5.81111C24.4464 4.64339 25.2526 4.16769 25.8647 3.89981C26.0153 3.83441 26.1537 3.78096 26.2807 3.73317C26.1537 3.78096 26.015 3.83441 25.882 3.91868C25.8823 3.91899 25.8896 3.92842 25.9198 3.96049C26.376 4.44469 30.5142 9.04577 32.2712 16.4086C32.3759 16.8438 32.7767 17.1525 33.2377 17.1733C33.2993 17.1758 33.3609 17.1714 33.4219 17.1601C33.9353 17.0742 34.2557 16.5989 34.1359 16.0971C33.0069 11.3862 30.9824 7.75354 29.4185 5.46746C31.0255 6.37705 32.9871 7.63658 34.9694 9.27372C38.3846 12.0949 41.85 16.0062 43.7701 21.1883C41.4661 19.493 39.2775 18.8658 37.491 18.7859C37.4102 18.7821 37.33 18.7796 37.2511 18.7784C35.6247 18.7457 34.3774 19.1251 33.6536 19.4232C30.1222 16.0499 26.6237 14.991 23.9952 14.8731C23.8927 14.8683 23.7912 14.8655 23.6915 14.8636C22.3792 14.836 21.3051 15.0224 20.549 15.2211C20.5075 14.9495 20.483 14.6703 20.4726 14.3886ZM20.8445 17.089C21.4435 16.9051 22.4653 16.674 23.7594 16.7032C23.8217 16.7048 23.8846 16.7073 23.9481 16.7102C26.1735 16.8098 29.1635 17.6282 32.4454 20.7884L29.0563 34.3665L26.4461 33.8154L20.8445 17.089ZM27.3538 60.8905L23.036 60.4321L22.748 51.7849L18.3915 51.1928L18.3777 38.8393L22.88 39.6958L22.992 47.3209L27.4355 47.8887L27.1475 40.3567L30.6777 41.022L31.1176 52.8598L26.9689 52.3386L27.3538 60.8905ZM45.6575 25.0298C45.3978 25.0185 45.1397 24.9053 44.951 24.7C44.8762 24.6192 44.8011 24.5402 44.7294 24.4748L33.6002 35.3248L30.9525 34.7661L34.3384 21.1921C34.8292 20.9717 35.9023 20.5853 37.3197 20.6205C37.3659 20.6217 37.4124 20.6236 37.4593 20.6258C39.3429 20.7101 41.8538 21.4738 44.7265 24.4629C44.8011 24.5409 44.8762 24.6198 44.9513 24.7003C45.1369 24.9028 45.3909 25.0144 45.672 25.0295C45.6673 25.0295 45.6622 25.0301 45.6575 25.0298Z" fill="white" />
              <path d="M22.0601 5.97523C21.8815 5.87682 21.6944 5.82557 21.5206 5.81802C21.2385 5.80513 20.9917 5.90826 20.8789 6.11388C20.6962 6.44842 20.926 6.92663 21.3967 7.18445C21.575 7.28255 21.7617 7.3338 21.9346 7.34166C22.2167 7.35455 22.4625 7.25111 22.5757 7.0436C22.7609 6.71095 22.5286 6.23242 22.0601 5.97523ZM46.9819 24.4182C46.9501 24.256 46.9168 24.0957 46.8822 23.9356C46.891 23.7728 46.8548 23.6058 46.7731 23.4524C44.9699 15.815 40.056 10.4128 35.5615 6.92255C30.8724 3.27979 26.6109 1.6656 26.492 1.62001C23.3177 0.627102 20.5465 0.133163 18.1237 0.0246916C17.9485 0.0168313 17.775 0.0108575 17.6036 0.00708456C10.8592 -0.164898 6.95549 2.82326 4.92125 5.82242C3.37278 8.08367 2.54462 10.7609 2.35346 11.7582C2.3566 11.755 2.36258 11.7475 2.36698 11.7431C2.31605 11.9449 2.3346 12.1675 2.4415 12.376C2.48551 12.4615 2.54305 12.5354 2.60656 12.6033L19.1905 32.0157L19.1924 31.95L22.0397 32.5505L5.04576 12.4508C5.9302 12.2395 7.20796 12.0311 8.72216 12.066C8.81932 12.0685 8.91741 12.072 9.01708 12.0767C11.8499 12.2037 15.4314 13.1501 19.0329 16.4762L24.5968 33.0897L22.0397 32.5505L19.1905 32.0157L19.0917 35.3641L15.3342 34.6661L14.7711 63.6092L35.5361 65.1278L35.2902 61.0031L39.1634 61.1364L36.3938 35.5783L36.1514 35.5273L46.7432 25.2021C46.9504 25.0008 47.04 24.7072 46.9819 24.4182ZM2.86344 11.163C2.8779 11.1573 2.97159 11.1187 3.12534 11.0627C2.97159 11.119 2.8779 11.1577 2.86344 11.163ZM20.7496 14.1106C20.7091 13.0636 20.8748 11.9956 21.0562 11.2023C21.1442 10.8043 21.2389 10.4751 21.3068 10.249C21.3423 10.1346 21.3709 10.0484 21.3898 9.99025C21.4086 9.93146 21.4181 9.91102 21.4159 9.91071C21.5866 9.43878 21.3215 8.90176 20.8219 8.70934C20.7147 8.66753 20.6056 8.64489 20.4981 8.64017C20.1054 8.62257 19.7407 8.8414 19.6061 9.2102C19.5923 9.26522 18.7795 11.446 18.8317 13.9267C15.3603 11.258 11.8534 10.3616 9.04884 10.2361C8.91553 10.2301 8.78379 10.2257 8.65394 10.2232C7.09886 10.1893 5.77488 10.3754 4.78731 10.5908C5.12499 9.46393 5.75601 7.89188 6.89481 6.40974C8.77876 3.9762 11.9197 1.73383 17.6719 1.84702C17.8291 1.85047 17.9875 1.85613 18.1485 1.86305C19.8246 1.93819 21.7183 2.21771 23.8522 2.75881C23.3357 3.1361 22.7757 3.6357 22.2006 4.30288C21.8711 4.6808 21.9403 5.26309 22.3553 5.60297C22.5333 5.75074 22.7499 5.82871 22.9625 5.83877C22.9691 5.83877 22.9766 5.83909 22.9835 5.83909C23.2539 5.84412 23.518 5.74005 23.6997 5.53317C24.7235 4.36576 25.5296 3.89006 26.1421 3.62218C26.2924 3.55647 26.4307 3.50302 26.5577 3.45523C26.4307 3.50302 26.2921 3.55647 26.1591 3.64073C26.1591 3.64073 26.1666 3.65048 26.1968 3.68255C26.653 4.16642 30.7913 8.76783 32.5482 16.1307C32.6532 16.5658 33.0541 16.8749 33.5147 16.8953C33.5763 16.8982 33.638 16.8935 33.6993 16.8821C34.2124 16.7963 34.5328 16.3212 34.4133 15.8194C33.2836 11.1086 31.2591 7.47591 29.6949 5.18983C31.3019 6.09942 33.2635 7.35895 35.2462 8.99577C38.661 11.817 42.1264 15.7282 44.0465 20.9104C41.7425 19.2151 39.5539 18.5878 37.7674 18.508C37.6866 18.5042 37.6064 18.5017 37.5275 18.5004C35.9011 18.4677 34.6541 18.8469 33.93 19.1453C30.3986 15.772 26.9004 14.713 24.2713 14.5951C24.1688 14.5904 24.0676 14.5876 23.9676 14.5857C22.6556 14.558 21.5816 14.7445 20.8251 14.9432C20.7842 14.6718 20.76 14.3926 20.7496 14.1106ZM21.1216 16.8114C21.7208 16.6275 22.7424 16.3964 24.0368 16.4259C24.099 16.4275 24.1616 16.43 24.2254 16.4328C26.4512 16.5322 29.4412 17.3509 32.7227 20.5107L29.334 34.0889L26.7234 33.538L21.1216 16.8114ZM27.6305 60.6129L23.3127 60.1542L23.025 51.5072L18.6685 50.9149L18.6544 38.5617L23.1571 39.4182L23.2687 47.0432L27.7126 47.6111L27.4243 40.079L30.9545 40.744L31.3943 52.5822L27.2457 52.0606L27.6305 60.6129ZM45.9346 24.7521C45.6752 24.7408 45.4167 24.6276 45.2281 24.4226C45.1536 24.3418 45.0781 24.2629 45.0064 24.1975L33.8772 35.0472L31.2296 34.4888L34.6155 20.9148C35.1063 20.6944 36.1796 20.308 37.5967 20.3432C37.6429 20.3444 37.6894 20.3466 37.7363 20.3485C39.6199 20.4328 42.1311 21.1968 45.0036 24.1856C45.0781 24.2632 45.1536 24.3422 45.2284 24.423C45.4139 24.6251 45.6682 24.7371 45.9493 24.7521C45.9443 24.7518 45.9396 24.7525 45.9346 24.7521Z" fill="#4353FF" />
              <rect x="17.0332" y="37.0732" width="15.9795" height="25.1106" fill="#4353FF" />
              <g filter="url(#filter0_d_403_23775)">
                <path d="M31.3213 51.6335C31.3593 50.8717 31.1922 50.1145 30.8386 49.4462C30.485 48.7779 29.9587 48.2245 29.3182 47.8475C29.3184 47.8443 29.3185 47.8417 29.3186 47.8391L29.2511 47.8093L29.1714 47.7651L29.1708 47.7762C29.0203 47.7158 28.8629 47.662 28.6904 47.6127C28.8281 47.5868 28.9586 47.558 29.082 47.5264L29.0816 47.5328L29.1026 47.5238L29.1497 47.5113C29.1496 47.5087 29.1497 47.506 29.1501 47.5034C29.7043 47.2604 30.1822 46.8622 30.5297 46.354C30.8773 45.8457 31.0806 45.2476 31.1168 44.6273C31.153 44.007 31.0205 43.3891 30.7345 42.8435C30.4484 42.298 30.02 41.8465 29.4979 41.54C29.3224 41.419 29.1331 41.3208 28.9343 41.2476C28.3565 41.0331 27.4945 40.8974 26.3482 40.8404L22.7246 40.6602L22.5925 43.3164C23.2257 43.0628 23.8807 43.1324 24.5423 43.3689C25.8492 43.8384 27.2604 44.2671 28.8837 44.2087C28.897 44.2094 28.8614 44.2357 28.812 44.2723C28.7442 44.3232 28.6821 44.3816 28.6268 44.4466C27.998 45.1661 27.1377 45.2434 26.2025 45.19C25.7153 45.1621 25.0393 44.66 24.7957 45.2686C24.6736 45.574 25.186 46.1657 25.4986 46.5678C26.2486 47.5357 26.6733 48.5736 26.4885 49.7895C26.3022 51.0154 26.3924 51.1034 27.6862 50.9108C27.8527 50.8863 27.9926 50.8303 28.1809 50.8201C28.5554 50.8001 29.1313 50.7616 29.6723 50.8197C28.2857 51.7374 27.0428 53.1492 25.2542 52.0678L25.1194 54.7789L25.0958 55.2536L26.2124 55.3091C27.3928 55.3678 28.253 55.3542 28.7931 55.2682L28.7987 55.2685L28.8075 55.2663C29.0909 55.1826 29.3545 55.0391 29.5816 54.8448C30.092 54.4844 30.5147 54.0068 30.8166 53.4495C31.1185 52.8923 31.2912 52.2706 31.3213 51.6335Z" fill="white" />
              </g>
              <defs>
                <filter id="filter0_d_403_23775" x="18.5918" y="40.6602" width="12.7344" height="17.6846" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dx="-3" dy="2" />
                  <feGaussianBlur stdDeviation="0.5" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0.183066 0 0 0 0 0.250465 0 0 0 0 0.975 0 0 0 1 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_403_23775" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_403_23775" result="shape" />
                </filter>
                <linearGradient id="paint0_linear_403_23775" x1="21.2137" y1="11.3575" x2="10.3851" y2="5.9894" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#278CFF" />
                  <stop offset="0.5275" stop-color="#3176FF" />
                  <stop offset="1" stop-color="#3A5EF7" />
                </linearGradient>
                <linearGradient id="paint1_linear_403_23775" x1="25.2542" y1="7.11175" x2="21.8299" y2="6.09369" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#278AFF" />
                  <stop offset="0.5275" stop-color="#3470FF" />
                  <stop offset="1" stop-color="#3A5CF6" />
                </linearGradient>
                <linearGradient id="paint2_linear_403_23775" x1="39.3639" y1="21.9078" x2="32.1448" y2="8.44144" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2988FF" />
                  <stop offset="0.5275" stop-color="#3470FF" />
                  <stop offset="1" stop-color="#4353FF" />
                </linearGradient>
                <linearGradient id="paint3_linear_403_23775" x1="17.9945" y1="7.83833" x2="21.3259" y2="9.59648" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2392FF" />
                  <stop offset="0.5275" stop-color="#2A85FF" />
                  <stop offset="1" stop-color="#3E5EFF" />
                </linearGradient>
                <linearGradient id="paint4_linear_403_23775" x1="24.2956" y1="8.1078" x2="31.422" y2="15.6509" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#278AFF" />
                  <stop offset="0.552083" stop-color="#2E7DFE" />
                  <stop offset="1" stop-color="#4353FF" />
                </linearGradient>
                <linearGradient id="paint5_linear_403_23775" x1="43.3321" y1="26.7988" x2="34.7247" y2="22.2637" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#278BFF" />
                  <stop offset="0.5275" stop-color="#3373FF" />
                  <stop offset="1" stop-color="#3A5BF5" />
                </linearGradient>
                <linearGradient id="paint6_linear_403_23775" x1="31.504" y1="24.463" x2="21.8785" y2="18.1694" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#278BFF" />
                  <stop offset="0.5275" stop-color="#356EFF" />
                  <stop offset="1" stop-color="#3A5BF5" />
                </linearGradient>
                <linearGradient id="paint7_linear_403_23775" x1="0.866868" y1="10.4559" x2="3.39567" y2="12.3415" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#6BC189" />
                  <stop offset="0.5275" stop-color="#6ADB80" />
                  <stop offset="1" stop-color="#217B3D" />
                </linearGradient>
                <linearGradient id="paint8_linear_403_23775" x1="3.7441" y1="13.5591" x2="21.3178" y2="33.8438" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2986FF" />
                  <stop offset="0.5275" stop-color="#366CFF" />
                  <stop offset="1" stop-color="#3B58F3" />
                </linearGradient>
                <linearGradient id="paint9_linear_403_23775" x1="17.854" y1="21.3381" x2="5.1741" y2="13.5636" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2986FF" />
                  <stop offset="0.53125" stop-color="#3373FF" />
                  <stop offset="1" stop-color="#3B59F4" />
                </linearGradient>
                <linearGradient id="paint10_linear_403_23775" x1="2.05011" y1="14.967" x2="19.4495" y2="35.0504" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#278AFF" />
                  <stop offset="0.5275" stop-color="#356EFF" />
                  <stop offset="1" stop-color="#3B59F4" />
                </linearGradient>
                <linearGradient id="paint11_linear_403_23775" x1="44.007" y1="28.7524" x2="35.9549" y2="36.0641" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#278CFF" />
                  <stop offset="0.5275" stop-color="#356EFF" />
                  <stop offset="1" stop-color="#3A5DF7" />
                </linearGradient>
                <linearGradient id="paint12_linear_403_23775" x1="26.8657" y1="18.4756" x2="30.5677" y2="32.2661" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2889FF" />
                  <stop offset="0.5275" stop-color="#366DFF" />
                  <stop offset="1" stop-color="#3A5CF6" />
                </linearGradient>
                <linearGradient id="paint13_linear_403_23775" x1="14.7904" y1="18.7707" x2="22.1947" y2="29.2292" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#278AFF" />
                  <stop offset="0.5275" stop-color="#4353FF" />
                  <stop offset="1" stop-color="#4353FF" />
                </linearGradient>
                <linearGradient id="paint14_linear_403_23775" x1="1.73621" y1="15.2378" x2="19.1363" y2="35.322" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#268DFF" />
                  <stop offset="0.5275" stop-color="#376AFF" />
                  <stop offset="1" stop-color="#3C52EF" />
                </linearGradient>
                <linearGradient id="paint15_linear_403_23775" x1="12.5356" y1="30.8239" x2="17.1629" y2="35.1736" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#278BFF" />
                  <stop offset="0.5275" stop-color="#3274FF" />
                  <stop offset="1" stop-color="#4353FF" />
                </linearGradient>
                <linearGradient id="paint16_linear_403_23775" x1="29.2343" y1="37.0229" x2="26.0876" y2="45.4451" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#278CFF" />
                  <stop offset="0.5275" stop-color="#3373FF" />
                  <stop offset="1" stop-color="#3A5AF4" />
                </linearGradient>
                <linearGradient id="paint17_linear_403_23775" x1="22.0178" y1="34.3263" x2="18.8711" y2="42.7487" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2987FF" />
                  <stop offset="0.5275" stop-color="#356DFF" />
                  <stop offset="0.9998" stop-color="#395FF7" />
                  <stop offset="0.9999" stop-color="#3A5DF6" />
                </linearGradient>
                <linearGradient id="paint18_linear_403_23775" x1="24.9628" y1="43.4645" x2="18.3915" y2="45.4082" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2888FF" />
                  <stop offset="0.5275" stop-color="#356EFF" />
                  <stop offset="1" stop-color="#3A5BF5" />
                </linearGradient>
                <linearGradient id="paint19_linear_403_23775" x1="25.7796" y1="45.8302" x2="23.188" y2="50.3654" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#278BFF" />
                  <stop offset="0.5275" stop-color="#356FFF" />
                  <stop offset="1" stop-color="#3A5AF4" />
                </linearGradient>
                <linearGradient id="paint20_linear_403_23775" x1="33.0473" y1="48.7177" x2="27.7713" y2="48.9953" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2987FF" />
                  <stop offset="0.5275" stop-color="#366DFF" />
                  <stop offset="1" stop-color="#4353FF" />
                </linearGradient>
                <linearGradient id="paint21_linear_403_23775" x1="28.0077" y1="58.4759" x2="23.7504" y2="58.6608" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2C81FF" />
                  <stop offset="0.5275" stop-color="#3371FD" />
                  <stop offset="1" stop-color="#3A5EF7" />
                </linearGradient>
                <linearGradient id="paint22_linear_403_23775" x1="24.0938" y1="54.8745" x2="24.0938" y2="65.7608" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#278BFF" />
                  <stop offset="0.5275" stop-color="#3373FF" />
                  <stop offset="1" stop-color="#3B59F4" />
                </linearGradient>
                <linearGradient id="paint23_linear_403_23775" x1="11.644" y1="35.062" x2="15.9838" y2="62.3414" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#6BC189" />
                  <stop offset="0.0001" stop-color="#278BFF" />
                  <stop offset="0.5275" stop-color="#3372FF" />
                  <stop offset="1" stop-color="#3A5AF5" />
                </linearGradient>
              </defs>
            </svg>

            <p className="congratulation-message">Congrats!</p>

            <p className="item-lead">{`You successfully joined the Challenge. Stay tuned to see if you get the airdrop!`}</p>
            <button
              onClick={() => {
                setIsSubmissionSuccess("");
                history.push("/challenges");
              }}
              className="btn-continue mb-0"
            >
              Discover More Challenges
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Submission failed modal */}
      <Dialog
        fullWidth={true}
        maxWidth={"xs"}
        open={isSubmissionSuccess === "failed"}
        className="congratulation-modal"
        onClose={() => setIsSubmissionSuccess("")}
      >
        <DialogContent>
          {/* <DialogTitle /> */}
          <div className="congratulation-content">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="30" fill="#FF4343" />
              <path d="M40 37.7781L47.7781 30L50 32.2219L42.2219 40L50 47.7781L47.7781 50L40 42.2219L32.2219 50L30 47.7781L37.7781 40L30 32.2219L32.2219 30L40 37.7781Z" fill="white" />
            </svg>

            <p className="congratulation-message">Something went wrong</p>

            <p className="item-lead">{submissionFailedMessage}</p>
            <button
              onClick={() => setIsSubmissionSuccess("")}
              className="btn-continue mb-3"
            >
              Try Again
            </button>
            <button
              onClick={() => setIsSubmissionSuccess("")}
              className="btn-cancel mb-0"
            >
              Contact Support
            </button>
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
        customDialogAlertClose={() => setIsConnectWalletAlertOpen(false)}
        doSomething={handleConnectWallet}
      />

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
                href={` mailto:?to=&body=Check out this awesome challenge on BULLZ ${url}&subject=Check out this awesome challenge on BULLZ`}
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
    </>
  );
};

export default Art;
