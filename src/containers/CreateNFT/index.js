import { makeStyles, withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent, Typography } from "@material-ui/core";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import StepConnector from "@material-ui/core/StepConnector";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import React, { useEffect, useState } from "react";
import { getTokenAddressByCurrency } from "../../common/validatePrice";
import { collectibleTypes } from "../../data/tokenTypes";
import PropTypes from "prop-types";
import { handleError, multipliedBy, verifyTransaction, divideNo } from "common/utils";

import clsx from "clsx";

import { useHistory } from "react-router-dom";

import S3 from "react-aws-s3";

import LoadingOverlay from "react-loading-overlay";

import { useSnackbar } from "notistack";

import { collectibles } from "../../data/tokenTypes";

import "react-datepicker/dist/react-datepicker.css";

import ERC1155ChallengeMinter from "common/ERC1155/erc1155ChallengeMinter";

import { S3Config } from "../../config";
import { shares } from "../../config";
import { getNFTExchangerInstance } from "../../common/exchange";
import { SIX_MONTHS_IN_SECONDS } from "../../constants/expireTimes";
import { ChallengeService } from "../../services/challenge.service";
import { NftService } from "../../services/nft.service";
import { OfferService } from "../../services/offer.service";
import { UserService } from "../../services/user.service";
import { TempStorageService } from "services/temp-storage.service";
import ERC1155Challenge from "../../common/ERC1155/ERC1155Challenge";
import ERC1155Minter from "../../common/ERC1155/erc1155Minter";
import ERC20Exchanger from "../../common/ERC20/erc20Exchanger";
import ERC721Minter from "../../common/ERC721/erc721Minter";
import ButtonLoader from "../../components/ButtonLoader/buttonLoader";

import AddCollection from "./addCollection";
import { finalSteps, existingNftSteps } from "./createConfig";

import CreateNFT from "./createNFT";
import SelectNFT from "./selectNft";
import PutOnSell from "./putOnSell";
import SelectCollectibleNo from "./selectCollectibleNo";
import SelectCollectibleType from "./selectCollectibleType";
import "./style.scss";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { Checkbox } from "@mui/material";
import CheckIcon from "@material-ui/icons/Check";
import CustomLoader from "components/CustomLoader/CustomLoader";
import CustomAlert from "components/CustomAlert";
import { useSelector, useDispatch } from "react-redux";
import SelectNetwork from "./selectNetwork";
import ConnectWallet from "./connectWallet";
import SelectAssetType from "./selectAssetType";
import SelectToken from "./selectToken";
import { parse } from "date-fns";
import { TasksService } from "services/tasks.service";
import { result } from "lodash";
import { printLog } from 'utils/printLog';

const bottomStepperSteps = {
  1: [
    { id: 1, label: "Type" },
    { id: 2, label: "Details" },
    { id: 3, label: "Collection" },
    { id: 4, label: "Launch" },
  ],
  2: [
    { id: 1, label: "Type" },
    { id: 2, label: "Details" },
    { id: 3, label: "Launch" },
  ],
};

const QontoConnector = withStyles({
  root: {
    display: "none",
  },
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  active: {
    "& $line": {
      borderColor: "transparent",
    },
  },
  completed: {
    "& $line": {
      borderColor: "transparent",
    },
  },
  line: {
    borderColor: "transparent",
    borderTopWidth: 0,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#545458",
    display: "flex",
    height: 17,
    alignItems: "center",
  },
  active: {
    color: "#545458",
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  completed: {
    color: "#4353FF",
    zIndex: 1,
    fontSize: 18,
  },
  noCompleted: {
    color: "#545458",
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <div className="progress-icon completed">
          <CheckIcon />
        </div>
      ) : (
        // <CheckCircleIcon className={classes.completed} />
        <div className="progress-icon">
          <CheckIcon />
        </div>
        // <CheckCircleIcon className={classes.noCompleted} />
      )}
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool.isRequired,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool.isRequired,
};

let stepsToPerform = [];

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: "0 !important",
    color: theme.palette.grey[500],
  },
});

const notificationConfig = {
  preventDuplicate: true,
  vertical: "bottom",
  horizontal: "right",
};

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

const useBottomStepperIconStyle = makeStyles({
  root: {
    color: "#373737",
    display: "flex",
    height: 22,
    alignItems: "center",
    fontSize: 18,

    '&:hover': {
      color: '#A8AEFF',
    }
  },
  active: {
    color: "#373737",
  },
  completed: {
    color: "#3445FF",
    zIndex: 1,
  },
});

function BottomStepperIcon(props) {
  const classes = useBottomStepperIconStyle();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {completed ? (
        <img src="/images/stepper-checked.png" />
      ) : (
        <CheckBoxOutlineBlankIcon />
      )}
    </div>
  );
}

const BottomStepperConnector = withStyles({
  root: {
    borderBottom: "1px solid #373737",
  },
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  active: {
    "& $line": {
      borderColor: "#fff",
    },
  },
  completed: {
    "& $line": {
      borderColor: "#fff",
    },
  },
  line: {
    borderColor: "#373737",
    borderTopWidth: 1,
    borderRadius: 1,
  },
})(StepConnector);

const Explore = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  const [step, setStep] = useState(1);
  // const [step, setStep] = useState(5);

  const [isLoading, setIsLoading] = useState(false);

  const [collectibleType, setCollectibleType] = useState(
    collectibleTypes.find((item) => item.type === "nft_challenge")
  );
  const [collectible, setCollectible] = useState(null);

  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [dFile, setDFile] = useState(null);
  const [dFilePreview, setDFilePreview] = useState(null);
  const [callCreate, setCallCreate] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);
  const [switchNetwork, setSwitchNetwork] = useState(false);
  const [assetType, setAssetType] = useState(null);

  const [defaultTasks, setDefaultTasks] = useState([]);

  const [fileLoading, setFileLoading] = useState({
    coverFile: false,
    nftFile: false,
    collectionFile: false,
  });

  const [form, setForm] = useState({
    nftSupply: 1,
    winnerCount: 1,
    tokenAmount: 1,
  });
  const [selectedCollection, setSelectedCollection] = useState("");
  const [lockedData, setLockedData] = useState("");

  const [finalOpenDialog, setFinalOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [resultDialog, setResultDialog] = useState(false);
  const [fieldsCompleted, setFieldsCompleted] = useState(false);

  // notification states
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationBtnText, setNotificationBtnText] = useState("");
  const [notificationWidth, setNotificationWidth] = useState(287);
  const [notificationCloseIcon, setNotificationCloseIcon] = useState(false);
  const [invalidUrl, setInvalidUrl] = useState(false);
  
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const history = useHistory();
  const dispatch = useDispatch();
  const web3Connected = useSelector((state) => {
    return state.web3.web3connected;
  });
  const web3Object = useSelector((state) => {
    return state.web3.web3object;
  });
  const wcPopupConfig = useSelector((state) => state.web3.wcPopupConfig);
  const wcProvider = useSelector((state) => state.web3.wcProvider);

  const userData = useSelector((state) => state.auth.userData);
  const network = useSelector((state) => state.web3.network);
  const router = useSelector((state) => state.router);

  const userService = new UserService(network.backendUrl);
  const nftService = new NftService(network.backendUrl);
  const offerService = new OfferService(network.backendUrl);
  const challengeService = new ChallengeService(network.backendUrl);
  const tempStorageService = new TempStorageService(network.backendUrl);
  const taskService = new TasksService(network.backendUrl);

  const [needThumbnail, setNeedThumbnail] = useState(false);

  useEffect(() => {
    clearState();
    if (router.location.state) {
      setCollectibleType(router.location.state.collectibleTypeState);
      setStep(1);
    }
  }, [router.location.key]);

  useEffect(() => {
    if (selectedNetwork) {
      const connectedWith = localStorage.getItem("connectedWith");
      let currentChainId = 0;
      if (connectedWith === "walletConnect") {
        currentChainId = wcProvider.chainId;
      } else if (connectedWith === "metamask") {
        currentChainId = window.ethereum.networkVersion;
      }
      if (
        selectedNetwork &&
        parseInt(selectedNetwork.chainId, 16) == currentChainId
      ) {
        setStep(2);
      } else {
        setSwitchNetwork(true);
      }
    }
  }, [selectedNetwork]);

  useEffect(() => {
    if (assetType) {
      setStep(3);
    }
  }, [assetType]);

  useEffect(() => {
    getTaskTemplates();
  }, []);

  const handleFinalDialogClose = () => {
    setFinalOpenDialog(false);
  };

  const getTaskTemplates = async () => {
    const taskTemplates = await taskService.getTaskTemplates();
    printLog(['taskTemplates', taskTemplates], 'success');
    if (result && result.length) {
      setDefaultTasks(taskTemplates);
    }
  }

  const handleResultDialogClose = () => {
    setResultDialog(false);
    clearState();
  };

  const onClickNft = async (nft) => {
    setSelectedNft(nft);
    setSelectedCollection(nft.collectionType);
    setForm({ ...form, nftSupply: nft.supply });
  };
  const onAddFile = async (value, comingFor = "nftFile") => {
    setFileLoading({ ...fileLoading, [comingFor]: true });
    if (comingFor === "nftFile") {
      let res = await onUploadFile(value[0], "image", comingFor);
      if (res) {
        setFile(value[0]);
        setImagePreview(res);
        if (
          value[0].type?.includes("audio") ||
          value[0].type?.includes("video")
        ) {
          setNeedThumbnail(true);
          setCoverFile(null);
          setCoverPreview(null);
        } else {
          setNeedThumbnail(false);
          setCoverFile(value[0]);
          setCoverPreview(res);
        }
      }
    } else if (comingFor === "coverFile") {
      let res = await onUploadFile(value[0], "image", comingFor);
      if (res) {
        setCoverFile(value[0]);
        setCoverPreview(res);
      }
    } else if (comingFor === "dFile") {
      let res = await onUploadFile(value[0], "image", comingFor);
      if (res) {
        setDFile(value[0]);
        setDFilePreview(res);
      }
    }

    setFileLoading((prevState) => ({ ...prevState, [comingFor]: false }));
  };

  const handleChange = (type, value) => {
    setForm({
      ...form,
      [type]: value,
    });
  };

  const clearState = () => {
    setStep(1);
    setIsLoading(false);
    setCollectibleType(
      collectibleTypes.find((item) => item.type === "nft_challenge")
    );
    setCollectible(null);
    setSelectedNetwork(null);
    setFile(null);
    setImagePreview(null);
    setAudioFile(null);

    setCoverFile(null);
    setCoverPreview(null);

    setDFile(null);

    setFileLoading({
      coverFile: false,
      nftFile: false,
      collectionFile: false,
    });

    setForm({ nftSupply: 1, winnerCount: 1, tokenAmount: 1 });
    setSelectedCollection("");
    setLockedData("");

    setSelectedNft(null);
    setAssetType(null);
    setSelectedToken(null);
  };

  const goPreviousStep = () => {
    if (step === 1) {
      if (switchNetwork) {
        setSwitchNetwork(false);
        setSelectedNetwork(null);
      } else {
        props.history.goBack();
      }
    } else if (step == 2) {
      setSelectedNetwork(null);
      setStep(step - 1);
    } else if (step == 3) {
      setAssetType(null);
      setStep(step - 1);
    } else if (step === 3 && !collectibleType.addMultiple) {
      setStep(step - 2);
    } else if (
      step === 3 &&
      collectibleType.addMultiple &&
      !collectibleType.addSingle
    ) {
      setStep(step - 2);
    } else {
      setStep(step - 1);
    }
  };

  const handleNext = () => {
    let currActive = activeStep + 1;
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    printLog([currActive, stepsToPerform.length], 'success');
    if (currActive === stepsToPerform.length) {
      setFinalOpenDialog(false);
      setResultDialog(true);
      setActiveStep(0);
    }
  };

  const onUploadFile = async (e, fileType, comingFor) => {
    let _file = e;
    let newFileName = new Date().getTime() + _file.name;
    const ReactS3Client = new S3(S3Config);
    let res = await ReactS3Client.uploadFile(_file, newFileName)
      .then((data) => {
        if (data.status === 204) {
          if (fileType === "image") {
            // setImagePreview(data.location);
            return data.location;
          } else {
            // setAudioFile({ name: newFileName, url: data.location });
            return data.location;
          }
        } else {
          return false;
        }
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });

    return res;
  };

  const showNotification = (msg, variant) => {
    enqueueSnackbar(msg, {
      ...notificationConfig,
      variant: variant ? variant : "error",
    });
  };

  const removeFile = (removeType) => {
    printLog(["removefile", removeType], 'success');
    if (removeType === "nftFile") {
      setFile(null);
      setImagePreview(null);
      if (!file.type?.includes("audio") && !file.type?.includes("video")) {
        setCoverFile(null);
        setCoverPreview(null);
      }
    } else if (removeType === "coverFile") {
      setCoverFile(null);
      setCoverPreview(null);
    }
  };

  const postMintingFunction = async (
    minter,
    addMultiple,
    ercMinter,
    ERC1155_CHALLANGE_ADDRESS,
    endTime,
    dropSTime,
    dropETime,
    price,
    airdropFee,
    connectedWith,
    tokenId,
    submissionLimit,
    _resaleAllowed,
    startTime,
    nftId,
    _file,
    _cover
  ) => {
    try {
      handleNext();
      let erc1155Challenge = new ERC1155Challenge(
        web3Object,
        ERC1155_CHALLANGE_ADDRESS,
        wcPopupConfig,
        dispatch
      );
      const eventIdAddChallenge = Math.floor(
        (Date.now() + Math.random()) * 10000
      ).toString();
      const addChallengeCallback = async (success, data) => {
        if (success) {
          const endRequestsAt =
            Date.now() +
            parseInt(process.env.REACT_APP_TRANSACTION_WAITING_TIME);
          const verified = await verifyTransaction(
            tempStorageService,
            eventIdAddChallenge,
            endRequestsAt
          );
          if (verified) {
            setFinalOpenDialog(false);
            setResultDialog(true);
            setActiveStep(0);
          } else {
            cancelMintingWithError(
              "Transaction timeout, but still your challenge can be created. Check after some time."
            );
          }
        } else {
          cancelMintingWithError(data);
        }
      };

      const tempDataObj = {
        name: form.name,
        description: form.description,
        websiteurl: form.url ? form.url : "",
        creator_id: userData.id,
        collection: selectedCollection.address,
        assetId: tokenId,
        submissionLimit: submissionLimit,
        amountToAirdrop: form.nftSupply,
        airdropFee: airdropFee * form.nftSupply,
        airdropStartAt: dropSTime * 1000,
        airdropEndAt: dropETime * 1000,
        allowResell: _resaleAllowed,
        challengeStartAt: parseInt(startTime) * 1000,
        expiresAt: parseInt(endTime) * 1000,
        nft_id: nftId,
        isInstagram: form.isInstagram,
        isTwitter: form.isTwitter,
        isYoutube: form.isYoutube,
        isTwitch: form.isTwitch,
        isTiktok: form.isTiktok,
        nftType: collectibleType.type,
        existing: collectible.key == "existing",
        existingChId: selectedNft?.challenges[0]?.id
          ? selectedNft?.challenges[0]?.id
          : "",
        file: _file,
        cover: _cover,
        asset_type: assetType.value,
        tasks: selectedTasks.map(task => task.taskValue),
        airdrop_fee_currency: network.smartContracts.CHALLENGE_UTILITY_TOKEN.symbol,
        airdrop_fee_token: network.smartContracts.CHALLENGE_UTILITY_TOKEN.address,
        challengerAddress: userData.address.toLowerCase()
      };

      const tempobj = {
        eventId: eventIdAddChallenge,
        event_name: "AddChallenge",
        user_id: minter.toLowerCase(),
        json_string: JSON.stringify(tempDataObj),
      };

      const tempRes = await tempStorageService.save(tempobj);
      if (tempRes) {
        erc1155Challenge.addChallange(
          minter,
          selectedCollection.address,
          tokenId,
          form.nftSupply.toString(),
          dropSTime,
          dropETime,
          eventIdAddChallenge,
          connectedWith,
          addChallengeCallback
        );
      } else {
        cancelMintingWithError("Transaction failed");
      }
    } catch (exception) {
      printLog(["exception", exception]);
      cancelMintingWithError(exception.message);
    }
  };

  const callPostERC20Approval = async (
    minter,
    addMultiple,
    ercMinter,
    ERC1155_CHALLANGE_ADDRESS,
    endTime,
    dropSTime,
    dropETime,
    price,
    airdropFee,
    connectedWith,
    submissionLimit,
    _resaleAllowed,
    startTime,
    resaleCurrency,
    loyaltyPercentage
  ) => {
    try {
      printLog(["step 4"], 'success');
      /* eslint-disable */
      let receipt, tokenId, resChallenge, nftId;
      tokenId = Math.floor((Date.now() + Math.random()) * 10000).toString();
      //await nftService.getCountNfts();
      if (collectible.key != "existing") {
        handleNext();

        const mintNFTCallback = async (success, result) => {
          if (success) {
            const nftObj = {
              name: form.name,
              description: form.description,
              expiry: "",
              type:
                collectibleType.type === "nft_challenge"
                  ? "art"
                  : collectibleType.type,
              file: imagePreview,
              audio: audioFile ? audioFile.url : null,
              cover: coverPreview,
            };
            nftObj.assetId = tokenId;
            nftObj.contractType = "ERC1155";
            nftObj.isForSell = false;
            nftObj.isForAuction = false;
            nftObj.holder = minter.toLowerCase();
            nftObj.creator = minter.toLowerCase();
            nftObj.price = price;
            nftObj.lockedData = lockedData;
            nftObj.ownerShare = shares[collectibleType.type];
            nftObj.shareindex = shares[collectibleType.type];
            nftObj.nftType =
              collectibleType.type === "nft_challenge"
                ? "art"
                : collectibleType.type;
            nftObj.supply = addMultiple ? form.nftSupply : 1;
            nftObj.externalLink = form.url ? form.url : "";
            nftObj.dFile = dFilePreview;
            nftObj.collectionType = selectedCollection.address;
            nftObj.resale = _resaleAllowed;
            nftObj.resaleCurrency = resaleCurrency;
            nftObj.loyaltyPercentage = loyaltyPercentage;
            nftObj.fileType = file.type;
            nftObj.totalSupply = addMultiple ? form.nftSupply : 1;
            nftObj.chain_id = parseInt(selectedNetwork.chainId, 16);

            printLog([nftObj, 'success']);
            const nftDb = await nftService.saveNFT(nftObj);
            nftId = nftDb.id;

            // get user created nfts
            let newUser = await userService.getUser(minter.toLowerCase());

            const user = {
              id: newUser.id,
              createdNFTCount: newUser.createdNFTCount + Number(form.nftSupply),
              ownedNFTCount: newUser.ownedNFTCount + Number(form.nftSupply),
            };
            await userService.updateUser(user);

            postMintingFunction(
              minter,
              addMultiple,
              ercMinter,
              ERC1155_CHALLANGE_ADDRESS,
              endTime,
              dropSTime,
              dropETime,
              price,
              airdropFee,
              connectedWith,
              tokenId,
              submissionLimit,
              _resaleAllowed,
              startTime,
              nftId,
              imagePreview,
              coverPreview
            );
          } else {
            cancelMintingWithError(result);
          }
        };


        const resaleStatus = _resaleAllowed ? 1 : 2;
          ercMinter.mintBasicERC1155(
          tokenId,
          minter,
          "0x000",
          form.nftSupply.toString(),
          loyaltyPercentage,
          resaleStatus,
          connectedWith,
          mintNFTCallback
        );

        // const setUrlCalback = (success, result) => {
        //   if (success) {
        //     const resaleStatus = _resaleAllowed ? 1 : 2;
        //     ercMinter.mintBasicERC1155(
        //       tokenId,
        //       minter,
        //       "0x000",
        //       form.nftSupply.toString(),
        //       loyaltyPercentage,
        //       resaleStatus,
        //       connectedWith,
        //       mintNFTCallback
        //     );
        //   } else {
        //     cancelMintingWithError(result);
        //   }
        // };

        // if (selectedCollection?.user?.id == userData.id) {
        //   const baseUri = await ercMinter.getUrl(1);
        //   const a = baseUri.split("/");
        //   const domain = a[2];
        //   const b = network.backendUrl.split("/");


        //   if (a[2] !== b[2]) {
        //     ercMinter.setUrl(
        //       minter,
        //       network.backendUrl + "/nfts/item/",
        //       connectedWith,
        //       setUrlCalback
        //     );
        //   } else {
        //     setUrlCalback(true);
        //   }
        // } else {
        //   setUrlCalback(true);
        // }
      } else {
        nftId = selectedNft.id;
        tokenId = selectedNft.assetId;
        _resaleAllowed = selectedNft.resale;

        postMintingFunction(
          minter,
          addMultiple,
          ercMinter,
          ERC1155_CHALLANGE_ADDRESS,
          endTime,
          dropSTime,
          dropETime,
          price,
          airdropFee,
          connectedWith,
          tokenId,
          submissionLimit,
          _resaleAllowed,
          startTime,
          nftId,
          selectedNft.file,
          selectedNft.cover
        );
      }
    } catch (exception) {
      printLog(["exception", exception]);
      cancelMintingWithError(exception.message);
    }
  };

  const callPostNFTApproval = async (
    erc20Exchanger,
    minter,
    ERC1155_CHALLANGE_ADDRESS,
    calculatedAirdropFeeValue,
    airdropInWei,
    addMultiple,
    ercMinter,
    endTime,
    dropSTime,
    dropETime,
    price,
    airdropFee,
    connectedWith,
    submissionLimit,
    _resaleAllowed,
    startTime,
    resaleCurrency,
    loyaltyPercentage,
    decimals
  ) => {
    try {
      let allowance = await erc20Exchanger.getAllowance(
        minter,
        ERC1155_CHALLANGE_ADDRESS
      );
      printLog(["allowance", allowance], 'success');
      const allowanceCallback = (success, data) => {
        if (success) {
          callPostERC20Approval(
            minter,
            addMultiple,
            ercMinter,
            ERC1155_CHALLANGE_ADDRESS,
            endTime,
            dropSTime,
            dropETime,
            price,
            airdropFee,
            connectedWith,
            submissionLimit,
            _resaleAllowed,
            startTime,
            resaleCurrency,
            loyaltyPercentage
          );
        } else {
          printLog(["Error", data]);
          cancelMintingWithError(data);
        }
      };
      if (Number(allowance) === 0) {
        printLog(["step 1"], 'success');
        erc20Exchanger.approve(
          minter,
          ERC1155_CHALLANGE_ADDRESS,
          multipliedBy(calculatedAirdropFeeValue.toString(), decimals),          
          connectedWith,
          allowanceCallback
        );
      } else if (Number(allowance) >= Number(airdropInWei)) {
        printLog(["step 2"], 'success');
        allowanceCallback(true);
      } else {
        printLog(["step 3"], 'success');
        let allowanceIncreaseValue = Number(airdropInWei) - allowance;

        erc20Exchanger.increaseApproval(
          minter,
          ERC1155_CHALLANGE_ADDRESS,
          allowanceIncreaseValue.toString(),
          connectedWith,
          allowanceCallback
        );
      }
    } catch (exception) {
      printLog(["exception", exception]);
      cancelMintingWithError(exception.message);
    }
  };

  const addNFTChallange = async (sellDetails) => {
    const { ERC1155_CHALLANGE_ADDRESS } = network.smartContracts;
    const {
      isForSell,
      isInstantPrice,
      startTime,
      endTime,
      submissionLimit,
      selectedCurreny,
      resaleAllowed,
      loyaltyPercentage,
      resaleCurrency,
      dropSTime,
      dropETime,
      airdropCurrency,
      airdropFee,
    } = sellDetails;

    const price = 0;
    if (web3Connected) {
      try {
        let _resaleAllowed = resaleAllowed;
        const connectedWith = localStorage.getItem("connectedWith");
        finalSteps[1].title = "Upload files & Mint Token";
        stepsToPerform = finalSteps.slice(0, 3);
        if (collectible.key == "existing") {
          stepsToPerform = existingNftSteps;
        }
        const addMultiple =
          collectible && collectible.key === "multiple" ? true : false;
        setFinalOpenDialog(true);

        const web3 = web3Object;
        // Init erc721 smart contract invoke service

        let ercMinter = new ERC1155ChallengeMinter(
          web3,
          selectedCollection.address,
          wcPopupConfig,
          dispatch
        );
        const accounts = await web3.eth.getAccounts();
        const erc20Exchanger = new ERC20Exchanger(
          web3Object,
          airdropCurrency.address,
          wcPopupConfig,
          dispatch
        );
        // const current_user_balance = await erc20Exchanger.balanceOf(
        //   accounts[0]
        // );

        const [ decimals, current_user_balance ] = await Promise.all([
          
          erc20Exchanger.contract.methods.decimals().call().catch(handleError),
          erc20Exchanger.contract.methods
            .balanceOf(accounts[0])
            .call()
            .catch(handleError),
        ]);

        const calculatedAirdropFeeValue = form.nftSupply * airdropFee;
        printLog([
          accounts[0],
          current_user_balance,
          form.nftSupply * airdropFee
        ], 'success');

        // const airdropInWei = web3.utils.toWei(
        //   calculatedAirdropFeeValue.toString(),
        //   "ether"
        // );

        const airdropInWei =  multipliedBy(calculatedAirdropFeeValue, decimals);



        if (Number(current_user_balance) < Number(airdropInWei)) {
          // Setting notification
          showCustomNotification(
            "Insufficient Balance",
            `Insufficient token balance. You need ${calculatedAirdropFeeValue} ${airdropCurrency.symbol} to create the challenge.`,
            "error",
            "OK"
          );
          setFinalOpenDialog(false);
          setActiveStep(0);
          return;
        }

        if (accounts[0]) {
          const minter = accounts[0];
          if (
            !(await ercMinter.isSetApprovalForAll(
              minter,
              ERC1155_CHALLANGE_ADDRESS
            ))
          ) {
            const approveCallback = (success, result) => {
              printLog(["approveCallback", success, result], 'success');
              if (success) {
                callPostNFTApproval(
                  erc20Exchanger,
                  minter,
                  ERC1155_CHALLANGE_ADDRESS,
                  calculatedAirdropFeeValue,
                  airdropInWei,
                  addMultiple,
                  ercMinter,
                  endTime,
                  dropSTime,
                  dropETime,
                  price,
                  airdropFee,
                  connectedWith,
                  submissionLimit,
                  _resaleAllowed,
                  startTime,
                  resaleCurrency,
                  loyaltyPercentage,
                  decimals
                );
              } else {
                cancelMintingWithError(result?.message);
              }
            };
            ercMinter.setApprovalForAll(
              minter,
              ERC1155_CHALLANGE_ADDRESS,
              connectedWith,
              approveCallback
            );
          } else {
            callPostNFTApproval(
              erc20Exchanger,
              minter,
              ERC1155_CHALLANGE_ADDRESS,
              calculatedAirdropFeeValue,
              airdropInWei,
              addMultiple,
              ercMinter,
              endTime,
              dropSTime,
              dropETime,
              price,
              airdropFee,
              connectedWith,
              submissionLimit,
              _resaleAllowed,
              startTime,
              resaleCurrency,
              loyaltyPercentage,
              decimals
            );
          }
        }
      } catch (e) {
        cancelMintingWithError("Transaction Failed!");
        return;
      }
    }
  };

  const addTokenChallenge = async (sellDetails) => {
    const { ERC1155_CHALLANGE_ADDRESS } = network.smartContracts;
    const {
      startTime,
      endTime,
      submissionLimit,
      resaleAllowed,
      loyaltyPercentage,
      resaleCurrency,
      dropSTime,
      dropETime,
      airdropCurrency,
      airdropFee,
    } = sellDetails;

    const price = 0;
    if (web3Connected) {
      try {
        const connectedWith = localStorage.getItem("connectedWith");
        finalSteps[1].title = "Upload files";
        stepsToPerform = finalSteps.slice(0, 3);
        setFinalOpenDialog(true);
        const web3 = web3Object;
        const accounts = await web3.eth.getAccounts();
        const erc20Exchanger = new ERC20Exchanger(
          web3Object,
          selectedToken.address,
          wcPopupConfig,
          dispatch
        );
        // const current_user_balance = await erc20Exchanger.balanceOf(
        //   accounts[0]
        // );
        const [ decimals, current_user_balance ] = await Promise.all([
          
          erc20Exchanger.contract.methods.decimals().call().catch(handleError),
          erc20Exchanger.contract.methods
            .balanceOf(accounts[0])
            .call()
            .catch(handleError),
        ]);

        let erc1155Challenge = new ERC1155Challenge(
          web3Object,
          ERC1155_CHALLANGE_ADDRESS,
          wcPopupConfig,
          dispatch
        );

        const airdropFeePercent = await erc1155Challenge.getTokenAirdropFee(
          selectedToken.address
        );
        printLog(["airdropFeePercent1", airdropFeePercent, form.tokenAmount], 'success');


        // const tokenAmountInWei = web3.utils.toWei(form.tokenAmount.toString(), "ether");
        const tokenAmountInWei = multipliedBy(form.tokenAmount.toString(), decimals);

        printLog(["tokenAmountInWei", tokenAmountInWei], 'success');
        const fee =
          (airdropFeePercent * Number(tokenAmountInWei)) / 100;
        printLog(["fee", fee], 'success');

        const totalPayable =
          parseInt(form.winnerCount) * (Number(tokenAmountInWei) + fee);
        printLog([accounts[0], current_user_balance, totalPayable], 'success');
        

        if (Number(current_user_balance) < totalPayable) {
          // Setting notification
          showCustomNotification(
            "Insufficient Balance",
            `Insufficient token balance. You need ${totalPayable} ${selectedToken.symbol} to create the challenge.`,
            "error",
            "OK"
          );
          setFinalOpenDialog(false);
          setActiveStep(0);
          return;
        }

        if (accounts[0]) {
          const minter = accounts[0];
          try {
            let allowance = await erc20Exchanger.getAllowance(
              minter,
              ERC1155_CHALLANGE_ADDRESS
            );
            printLog(["allowance", allowance], 'success');
            const eventIdAddTokenChallenge = Math.floor(
              (Date.now() + Math.random()) * 10000
            ).toString();
            const addTokenChallengeCallback = async (success, data) => {
              if (success) {
                const endRequestsAt =
                  Date.now() +
                  parseInt(process.env.REACT_APP_TRANSACTION_WAITING_TIME);
                const verified = await verifyTransaction(
                  tempStorageService,
                  eventIdAddTokenChallenge,
                  endRequestsAt
                );
                if (verified) {
                  setFinalOpenDialog(false);
                  setResultDialog(true);
                  setActiveStep(0);
                } else {
                  cancelMintingWithError(
                    "Transaction timeout, but still your challenge can be created. Check after some time."
                  );
                }
              } else {
                cancelMintingWithError(data);
              }
            };
            const allowanceCallback = async (success, data) => {
              if (success) {
                handleNext();
                const tempDataObj = {
                  name: form.name,
                  description: form.description,
                  websiteurl: form.url ? form.url : "",
                  creator_id: userData.id,
                  submissionLimit: submissionLimit,
                  airdropFee: parseInt(form.winnerCount) * divideNo(fee, decimals),
                  airdropStartAt: dropSTime * 1000,
                  airdropEndAt: dropETime * 1000,
                  challengeStartAt: parseInt(startTime) * 1000,
                  expiresAt: parseInt(endTime) * 1000,
                  isInstagram: form.isInstagram,
                  isTwitter: form.isTwitter,
                  isYoutube: form.isYoutube,
                  isTwitch: form.isTwitch,
                  isTiktok: form.isTiktok,
                  file: imagePreview,
                  cover: coverPreview,
                  asset_type: assetType.value,
                  tokenAddress: selectedToken.address,
                  winnerCount: parseInt(form.winnerCount),
                  tokenAmount: parseFloat(form.tokenAmount),
                  token_id: selectedToken.id,
                  tasks: selectedTasks.map(task => task.taskValue),
                  airdrop_fee_currency: selectedToken.symbol,
                  airdrop_fee_token: selectedToken.address,
                  decimals: decimals,
                  challengerAddress: userData.address.toLowerCase()
                };

                const tempobj = {
                  eventId: eventIdAddTokenChallenge,
                  event_name: "AddTokenChallenge",
                  user_id: minter.toLowerCase(),
                  json_string: JSON.stringify(tempDataObj),
                };

                const tempRes = await tempStorageService.save(tempobj);
                if (tempRes) {
                  handleNext();
                  erc1155Challenge.addTokenChallange(
                    minter,
                    selectedToken.address,
                    form.winnerCount,
                    tokenAmountInWei,
                    dropSTime,
                    dropETime,
                    eventIdAddTokenChallenge,
                    connectedWith,
                    addTokenChallengeCallback
                  );
                } else {
                  cancelMintingWithError("Transaction failed");
                }
              } else {
                printLog(["Error", data]);
                cancelMintingWithError(data);
              }
            };

            if (Number(allowance) === 0) {
              printLog(["step 1"], 'success');
              erc20Exchanger.approve(
                minter,
                ERC1155_CHALLANGE_ADDRESS,
                totalPayable.toLocaleString('fullwide', { useGrouping: false }),
                connectedWith,
                allowanceCallback
              );
            } else if (Number(allowance) >= totalPayable) {
              printLog(["step 2"], 'success');
              allowanceCallback(true);
            } else {
              printLog(["step 3"], 'success');
              const allowZeroCallback = async (success, data) => {
                if (success) {
                  erc20Exchanger.approve(
                    minter,
                    ERC1155_CHALLANGE_ADDRESS,
                    totalPayable.toLocaleString('fullwide', { useGrouping: false }),
                    connectedWith,
                    allowanceCallback
                  );
                } else {
                  printLog(["Error", data]);
                  cancelMintingWithError(data);
                }
              };
              erc20Exchanger.approve(
                minter,
                ERC1155_CHALLANGE_ADDRESS,
                0,
                connectedWith,
                allowZeroCallback
              );
              // let allowanceIncreaseValue = Number(airdropInWei) - allowance;
              // erc20Exchanger.increaseApproval(
              //   minter,
              //   ERC1155_CHALLANGE_ADDRESS,
              //   allowanceIncreaseValue.toString(),
              //   connectedWith,
              //   allowanceCallback
              // );
            }
          } catch (exception) {
            printLog(["exception", exception]);
            cancelMintingWithError(exception.message);
          }
        }
      } catch (e) {
        printLog(["err", e])
        cancelMintingWithError("Transaction Failed!");
        return;
      }
    }
  };

  const addChallange = async (sellDetails) => {
    if (assetType.value == 1) {
      addNFTChallange(sellDetails);
    } else if (assetType.value == 2) {
      addTokenChallenge(sellDetails);
    }
  };

  const cancelMintingWithError = (message) => {
    printLog([message]);
    if (!message) {
      message = "Transaction failed";
    }
    // Setting notification
    showCustomNotification("Transaction Failed!", message, "error", "OK");
    setActiveStep(0);
    setFinalOpenDialog(false);
  };

  const mintToken = async (sellDetails) => {
    const { ERC721_EXCHANGER_ADDRESS } = network.smartContracts;
    const { ERC1155_EXCHANGER_ADDRESS } = network.smartContracts;
    const { ERC1155_ADDRESS } = network.smartContracts;
    const { ERC721_ADDRESS } = network.smartContracts;
    const {
      isForSell,
      isInstantPrice,
      auctionDuration,
      auctionStartDuration,
      instantPrice,
      auctionPrice,
      selectedCurreny,
      resaleAllowed,
      loyaltyPercentage,
      resaleCurrency,
      collStartDate,
      collEndDate,
    } = sellDetails;
    let receipt, tokenId;
    tokenId = Math.floor((Date.now() + Math.random()) * 10000).toString();
    //await nftService.getCountNfts();
    printLog(["tokenId", tokenId], 'success');
    if (web3Connected) {
      const price = isForSell
        ? instantPrice
        : isInstantPrice
        ? auctionPrice
        : "";

      const addMultiple =
        collectible && collectible.key === "multiple" ? true : false;
      stepsToPerform = finalSteps.slice(0, 2);
      if (isForSell || isInstantPrice) {
        stepsToPerform = finalSteps.slice(0, 3);
      }

      setFinalOpenDialog(true);
      const web3 = web3Object;
      // Init erc721 smart contract invoke service
      let ercMinter = new ERC721Minter(
        web3,
        selectedCollection.address,
        wcPopupConfig,
        dispatch
      );
      const isMultipe = addMultiple ? "ERC1155" : "ERC721";
      let erc721Exchanger = getNFTExchangerInstance(
        web3Object,
        isMultipe,
        network,
        wcPopupConfig,
        dispatch
      );
      let approveTo = ERC721_EXCHANGER_ADDRESS;
      if (addMultiple) {
        ercMinter = new ERC1155Minter(
          web3,
          selectedCollection.address,
          wcPopupConfig,
          dispatch
        );
        approveTo = ERC1155_EXCHANGER_ADDRESS;
      }

      var accounts = await web3.eth.getAccounts();
      if (accounts[0]) {
        try {
          const minter = accounts[0];
          if (isForSell) {
            if (!(await ercMinter.isSetApprovalForAll(minter, approveTo))) {
              await ercMinter.setApprovalForAll(minter, approveTo);
            }
          }
          printLog(["isForSell", isForSell], 'success');
          // get user created nfts

          const tokenURI =
            network.backendUrl + "/nfts/item/" + tokenId + ".json";
          handleNext();
          printLog([tokenURI], 'success');
          let numberOfNFT = 1;
          if (addMultiple) {
            numberOfNFT = Number(form.nftSupply);
            receipt = await ercMinter.mintBasicERC1155(
              tokenId,
              minter,
              "0x000",
              form.nftSupply.toString()
            );
          } else {
            receipt = await ercMinter.mintBasicERC721(
              tokenId,
              minter,
              tokenURI
            );
          }
          let newUser = await userService.getUser(minter.toLowerCase());

          const user = {
            id: newUser.id,
            createdNFTCount: newUser.createdNFTCount + numberOfNFT,
            ownedNFTCount: newUser.ownedNFTCount + numberOfNFT,
          };
          await userService.updateUser(user);

          // save nft logs on database
          const nftObj = {
            name: form.name,
            description: form.description,
            expiry: "",
            type: collectibleType.type,
            file: imagePreview,
            audio: audioFile ? audioFile.url : null,
            cover: coverPreview,
          };
          nftObj.assetId = tokenId;
          nftObj.contractType = addMultiple ? "ERC1155" : "ERC721";
          nftObj.isForSell = isForSell;
          nftObj.isForAuction = isForSell && !isInstantPrice ? true : false;
          nftObj.holder = minter.toLowerCase();
          nftObj.creator = minter.toLowerCase();
          nftObj.price = price;
          nftObj.uri = tokenURI;
          nftObj.lockedData = lockedData;
          nftObj.ownerShare = shares[collectibleType.type];
          nftObj.shareindex = shares[collectibleType.type];
          nftObj.nftType = collectibleType.type;
          nftObj.supply = addMultiple ? form.nftSupply : 1;
          nftObj.totalSupply = addMultiple ? form.nftSupply : 1;
          nftObj.externalLink = form.url ? form.url : "";
          nftObj.instagramUrl = form.instagramUrl ? form.instagramUrl : "";
          nftObj.collectionType = selectedCollection.address;

          nftObj.resale = resaleAllowed;
          nftObj.resaleCurrency = resaleCurrency;
          nftObj.loyaltyPercentage = loyaltyPercentage;
          nftObj.collabStart = collStartDate;
          nftObj.collabEnd = collEndDate;

          nftObj.eventOrganizer = form.eventOrganizer
            ? form.eventOrganizer
            : "";
          nftObj.eventType = form.eventType ? form.eventType : "";
          nftObj.eventMode = form.eventMode ? form.eventMode : "venue";
          nftObj.eventStartTime = form.eventStartTime
            ? form.eventStartTime
            : "";
          nftObj.eventEndTime = form.eventEndTime ? form.eventEndTime : "";
          nftObj.eventVenue = form.eventVenue ? form.eventVenue : "";
          nftObj.eventConferenceLink = form.eventConferenceLink
            ? form.eventConferenceLink
            : "";
          nftObj.eventUnblockContent = form.eventUnblockContent
            ? form.eventUnblockContent
            : "";
          nftObj.fileType = file.type;
          nftObj.chain_id = parseInt(selectedNetwork.chainId, 16);
          printLog([nftObj], 'success');
          const nftDb = await nftService.saveNFT(nftObj);

          if (isForSell || isInstantPrice) {
            if (!(await ercMinter.isSetApprovalForAll(minter, approveTo))) {
              await ercMinter.setApprovalForAll(minter, approveTo);
            }
            const isEther = true;
            const currentDate = Math.round(new Date().getTime() / 1000);
            const seconds = isInstantPrice
              ? Math.round(auctionDuration.getTime() / 1000)
              : currentDate +
                parseInt(
                  process.env.REACT_APP_FIXED_PRICE_SALE_EXPIRED_DURATION
                ) *
                  24 *
                  60 *
                  60;
            const auctionStartTime = isInstantPrice
              ? Math.round(auctionStartDuration.getTime() / 1000)
              : Math.round(new Date().getTime() / 1000);
            const putedInsell = isForSell || isInstantPrice;
            printLog([putedInsell], 'success');
            // setLoaderState("setPrice");
            handleNext();
            printLog([shares[collectibleType.type]], 'success');
            let res;
            let offerId = 0;
            const tokenAddress = await getTokenAddressByCurrency(
              network,
              selectedCurreny
            );
            printLog(["tokenAddress1", tokenAddress], 'success');

            if (addMultiple) {
              offerId = Math.floor(
                (Date.now() + Math.random()) * 10000
              ).toString();

              if (Number(loyaltyPercentage) > 0) {
                res = await erc721Exchanger.addLoyaltyOffer(
                  offerId,
                  minter,
                  selectedCollection.address, //collection address
                  tokenId,
                  tokenAddress,
                  web3.utils.toWei(price.toString(), "ether"),
                  form.nftSupply,
                  putedInsell, // in sell
                  isInstantPrice, // In auction
                  seconds,
                  shares[collectibleType.type],
                  loyaltyPercentage
                );
              } else {
                res = await erc721Exchanger.addOffer(
                  offerId,
                  minter,
                  selectedCollection.address, //collection address
                  tokenId,
                  tokenAddress,
                  web3.utils.toWei(price.toString(), "ether"),
                  form.nftSupply,
                  putedInsell, // in sell
                  isInstantPrice, // In auction
                  seconds,
                  shares[collectibleType.type]
                );
              }
            } else {
              if (Number(loyaltyPercentage) > 0) {
                res = await erc721Exchanger.addLoyaltyOffer(
                  minter,
                  selectedCollection.address, //collection address
                  tokenId,
                  tokenAddress,
                  web3.utils.toWei(price.toString(), "ether"),
                  putedInsell, // in sell
                  isInstantPrice, // In auction
                  seconds,
                  shares[collectibleType.type],
                  loyaltyPercentage
                );
              } else {
                res = await erc721Exchanger.addOffer(
                  minter,
                  selectedCollection.address, //collection address
                  tokenId,
                  tokenAddress,
                  web3.utils.toWei(price.toString(), "ether"),
                  putedInsell, // in sell
                  isInstantPrice, // In auction
                  seconds,
                  shares[collectibleType.type]
                );
              }
            }
            let offer = {
              offer_id: offerId,
              seller: minter.toLowerCase(),
              collection: selectedCollection.address,
              assetId: tokenId,
              token: addMultiple ? ERC1155_ADDRESS : ERC721_ADDRESS,
              isEther: isEther,
              price: price,
              isForSell: putedInsell,
              isForAuction: isInstantPrice, // in auction
              expiresAt: parseInt(seconds) * 1000,
              auctionStartTime: parseInt(auctionStartTime) * 1000,
              isSold: false,
              nft_id: nftDb.id,
              shareindex: shares[collectibleType.type],
              currency: selectedCurreny,
              supply: addMultiple ? form.nftSupply : 0,
            };
            const offerDb = await offerService.saveOffer(offer);
            printLog([offerDb], 'success');
            // setLoaderState("");
          }
          setFinalOpenDialog(false);
          setResultDialog(true);
          setActiveStep(0);
        } catch (e) {
          printLog([e]);

          // Setting notification
          showCustomNotification(
            "Transaction Failed!",
            `Transaction Failed.`,
            "error",
            "OK"
          );
          setActiveStep(0);
          // setShow(false);
          setFinalOpenDialog(false);
          return;
        }
      }
    }
  };

  const setCanGoStep4 = () => {
    if (invalidUrl) return false;

    let decision = true;
    selectedTasks.forEach(task => {
      if (task.is_url && !task.taskValue?.url_text) decision = false;
      if (task.is_description && !task.taskValue?.description) decision = false;
      if (task.is_template && task.taskValue?.is_template_checked 
        && !task.taskValue?.template_text) decision = false;
      if (((task.social_name == "Telegram" && task.task_name == "Join a Channel" 
        && task.taskValue?.is_private) || (task.social_name == "Question & Answer" 
        && task.task_name == "Q&A with specified answer")) 
        && !task.taskValue?.second_text) decision = false;
    });

    if (!decision) return false;
    if (assetType.value == 1 && collectible.key == "existing") {
      if (!!form.name && !!form.description) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        !!form.name &&
        !!form.description &&
        file !== null &&
        coverFile !== null
      ) {
        return true;
      }
    }
  };

  const handleStep4 = () => {
    if (selectedTasks.length == 0) {
      setNotificationCloseIcon(true);
      setNotificationWidth(514);
      showCustomNotification("Minimum Task Required", 'Please choose at least 1 task to continue.', "", "Ok, got it!"); 
      return;
    }
    if (form.url) {
      /* eslint-disable */
      const urlRegex =
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
      if (!urlRegex.test(form.url)) {
        // Setting notification
        showCustomNotification(
          "Validation Failed!",
          `Either leave URL empty or enter valid URL.`,
          "error",
          "OK"
        );
        return;
      }
    }
    setStep(step + 1);
  };

  const showCustomNotification = (title, message, type, buttonText) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setNotificationType(type);
    setNotificationBtnText(buttonText);
    setNotificationOpen(true);
  };
  const customDialogAlertClose = () => {
    setNotificationTitle("");
    setNotificationMessage("");
    setNotificationType("");
    setNotificationBtnText("");
    setNotificationOpen(false);
    setNotificationWidth(287);
    setNotificationCloseIcon(false);
  };

  return (
    <div className="explore-page create-page">
      {/* <Calender/> */}
      <LoadingOverlay
        active={isLoading}
        spinner
        text="Transaction in Progress..."
      >
        <div className="container">
          {step === 1 && (
            <>
              {selectedNetwork && switchNetwork ? (
                <ConnectWallet
                  selectedNetwork={selectedNetwork}
                  step={step}
                  goPreviousStep={goPreviousStep}
                  currentNetwork={network}
                  setSwitchNetwork={setSwitchNetwork}
                  setSelectedNetwork={setSelectedNetwork}
                />
              ) : (
                <SelectNetwork
                  collectible={collectible}
                  setCollectible={setCollectible}
                  setStep={setStep}
                  collectibleType={collectibleType}
                  step={step}
                  goPreviousStep={goPreviousStep}
                  setForm={setForm}
                  form={form}
                  selectedNetwork={selectedNetwork}
                  setSelectedNetwork={setSelectedNetwork}
                />
              )}
            </>
          )}
          {step === 2 && (
            <SelectAssetType
              assetType={assetType}
              setAssetType={setAssetType}
              setStep={setStep}
              step={step}
              goPreviousStep={goPreviousStep}
            />
          )}
          {step == 3 && (
            <>
              {assetType.value == 1 ? (
                <SelectCollectibleNo
                  collectible={collectible}
                  setCollectible={setCollectible}
                  setStep={setStep}
                  collectibleType={collectibleType}
                  step={step}
                  goPreviousStep={goPreviousStep}
                  setForm={setForm}
                  form={form}
                  assetType={assetType}
                />
              ) : (
                <SelectToken
                  collectible={collectible}
                  setCollectible={setCollectible}
                  setStep={setStep}
                  collectibleType={collectibleType}
                  step={step}
                  goPreviousStep={goPreviousStep}
                  selectedNft={selectedNft}
                  onClickNft={onClickNft}
                  showNotification={showNotification}
                  selectedNetwork={selectedNetwork}
                  assetType={assetType}
                  selectedToken={selectedToken}
                  setSelectedToken={setSelectedToken}
                />
              )}
            </>
          )}

          {((step === 4 &&
            (assetType.value == 2 || collectible.key != "existing")) ||
            (step === 5 &&
              assetType.value == 1 &&
              collectible.key == "existing")) && (
            <CreateNFT
              collectibleType={collectibleType}
              setStep={setStep}
              addMultiple={
                collectible && collectible.name === "Multiple" ? true : false
              }
              collectible={collectible}
              handleChange={handleChange}
              onAddFile={onAddFile}
              file={file}
              coverFile={coverFile}
              dFile={dFile}
              form={form}
              fileLoading={fileLoading}
              step={step}
              goPreviousStep={goPreviousStep}
              showNotification={showNotification}
              needThumbnail={needThumbnail}
              setNeedThumbnail={setNeedThumbnail}
              removeFile={removeFile}
              selectedNft={selectedNft}
              assetType={assetType}
              defaultTasks={defaultTasks}
              selectedTasks={selectedTasks}
              setSelectedTasks={setSelectedTasks}
              setInvalidUrl={setInvalidUrl}
            />
          )}

          {step === 4 &&
            assetType.value == 1 &&
            collectible.key == "existing" && (
              <SelectNFT
                collectible={collectible}
                setCollectible={setCollectible}
                setStep={setStep}
                collectibleType={collectibleType}
                step={step}
                goPreviousStep={goPreviousStep}
                selectedNft={selectedNft}
                onClickNft={onClickNft}
                showNotification={showNotification}
                selectedNetwork={selectedNetwork}
              />
            )}

          {step == 5 &&
            assetType.value == 1 &&
            collectible.key != "existing" && (
              <AddCollection
                collectibleType={collectibleType}
                setStep={setStep}
                addMultiple={
                  collectible && collectible.name === "Multiple" ? true : false
                }
                collectible={collectible}
                file={file}
                coverFile={coverFile}
                form={form}
                onUploadFile={onUploadFile}
                selectedCollection={selectedCollection}
                setSelectedCollection={setSelectedCollection}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                step={step}
                goPreviousStep={goPreviousStep}
                showNotification={showNotification}
              />
            )}

          {((step === 5 && assetType.value == 2) ||
            (step === 6 && assetType.value == 1)) && (
            <PutOnSell
              collectibleType={collectibleType}
              setStep={setStep}
              addMultiple={
                collectible && collectible.name === "Multiple" ? true : false
              }
              collectible={collectible}
              file={file}
              coverFile={coverFile}
              form={form}
              onUploadFile={onUploadFile}
              selectedCollection={selectedCollection}
              setSelectedCollection={setSelectedCollection}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              mintToken={mintToken}
              addChallange={addChallange}
              handleChange={handleChange}
              step={step}
              goPreviousStep={goPreviousStep}
              callCreate={callCreate}
              setCallCreate={setCallCreate}
              setFieldsCompleted={setFieldsCompleted}
              selectedNft={selectedNft}
              assetType={assetType}
              selectedToken={selectedToken}
            />
          )}
        </div>

        {/* <div className="mobile-action">
          {step === 3 && (
            <>
              {assetType.value == 1 ? (
                <button
                  className={`btn-continue ${
                    collectible == null ? "idle" : ""
                  }`}
                  onClick={() => {
                    if (collectible) setStep(4);
                  }}
                >
                  Continue
                </button>
              ) : (
                <button
                  className={`btn-continue ${
                    selectedToken == null ? "idle" : ""
                  }`}
                  onClick={() => {
                    if (selectedToken) {
                      if (selectedToken.balance > 0) {
                        setStep(4);
                      } else {
                        showNotification("You do not have token balance.");
                      }
                    }
                  }}
                >
                  Continue
                </button>
              )}
            </>
          )}

          {((step === 4 &&
            (assetType.value == 2 || collectible.key != "existing")) ||
            (step === 5 &&
              assetType.value == 1 &&
              collectible.key == "existing")) && (
            <button
              className={`btn-continue ${setCanGoStep4() ? "" : "idle"}`}
              onClick={() => {
                if (setCanGoStep4()) handleStep4();
              }}
            >
              Continue
            </button>
          )}

          {step === 4 && assetType.value == 1 && collectible.key == "existing" && (
            <button
              className={`btn-continue ${selectedNft ? "" : "idle"}`}
              onClick={() => {
                if (selectedNft) setStep(5);
              }}
            >
              Continue
            </button>
          )}
          {step == 5 && assetType.value == 1 && collectible.key != "existing" && (
            <button
              className={`btn-continue ${selectedCollection ? "" : "idle"}`}
              onClick={() => {
                if (selectedCollection) setStep(6);
              }}
            >
              Continue
            </button>
          )}

          {((step === 5 && assetType.value == 2) ||
            (step === 6 && assetType.value == 1)) && (
            <button
              className={`btn-continue ${fieldsCompleted ? "" : "idle"}`}
              onClick={() => {
                if (fieldsCompleted) setCallCreate(true);
              }}
            >
              Continue
            </button>
          )}
        </div> */}

        {step > 2 && (
          <div className="bottom-stepper">
            <div className="container">
              <div className="bottom-stepper-inner">
                <button
                  className="btn-continue mb-0 idle"
                  onClick={() => goPreviousStep()}
                >
                  Back
                </button>
                <Stepper
                  activeStep={step - 3}
                  connector={<BottomStepperConnector />}
                >
                  {bottomStepperSteps[assetType.value].map((item) => (
                    <Step key={item.id}>
                      <StepLabel StepIconComponent={BottomStepperIcon}>
                        {item.label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {step === 3 && (
                  <>
                    {assetType.value == 1 ? (
                      <button
                        className={`btn-continue mb-0 ${
                          collectible == null ? "idle" : ""
                        }`}
                        onClick={() => {
                          if (collectible) setStep(4);
                        }}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        className={`btn-continue mb-0 ${
                          selectedToken == null ? "idle" : ""
                        }`}
                        onClick={() => {
                          if (selectedToken) {
                            if (selectedToken.balance > 0) {
                              setStep(4);
                            } else {
                              showNotification(
                                "You do not have token balance."
                              );
                            }
                          }
                        }}
                      >
                        Next
                      </button>
                    )}
                  </>
                )}

                {((step === 4 &&
                  (assetType.value == 2 || collectible.key != "existing")) ||
                  (step === 5 &&
                    assetType.value == 1 &&
                    collectible.key == "existing")) && (
                  <button
                    className={`btn-continue mb-0 ${
                      setCanGoStep4() ? "" : "idle"
                    }`}
                    onClick={() => {
                      if (setCanGoStep4()) handleStep4();
                    }}
                  >
                    Next
                  </button>
                )}

                {step === 4 &&
                  assetType.value == 1 &&
                  collectible.key == "existing" && (
                    <button
                      className={`btn-continue mb-0 ${
                        selectedNft ? "" : "idle"
                      }`}
                      onClick={() => {
                        if (selectedNft) setStep(5);
                      }}
                    >
                      Next
                    </button>
                  )}

                {step == 5 &&
                  assetType.value == 1 &&
                  collectible.key != "existing" && (
                    <button
                      className={`btn-continue mb-0 ${
                        selectedCollection ? "" : "idle"
                      }`}
                      onClick={() => {
                        if (selectedCollection) setStep(6);
                      }}
                    >
                      Next
                    </button>
                  )}

                {((step === 5 && assetType.value == 2) ||
                  (step === 6 && assetType.value == 1)) && (
                  <button
                    className={`btn-continue mb-0 ${
                      fieldsCompleted ? "" : "idle"
                    }`}
                    onClick={() => {
                      if (fieldsCompleted) setCallCreate(true);
                    }}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <Dialog
          open={finalOpenDialog}
          fullWidth={true}
          maxWidth={"sm"}
          // onClose={handleFinalDialogClose}
          className="progress-dialog"
        >
          <DialogContent>
            <DialogTitle
              style={{ color: "white" }}
              // onClose={handleFinalDialogClose}
            >
              <Typography className="progress-dialog-title">
                Follow Steps
              </Typography>
            </DialogTitle>
            <Stepper
              activeStep={activeStep}
              orientation="vertical"
              connector={<QontoConnector />}
            >
              {stepsToPerform.map((label, index) => (
                <Step
                  key={index}
                  className={activeStep === index ? "active" : ""}
                >
                  <StepLabel
                    className="step-label"
                    StepIconComponent={QontoStepIcon}
                  >
                    {label.title}
                  </StepLabel>
                  <StepContent TransitionComponent="None">
                    <div>
                      <p className="step-lead m-0">{label.description}</p>
                      {activeStep === index ? (
                        <span className="loader">
                          <CustomLoader size={20} />
                        </span>
                      ) : (
                        <button
                          className={`btn-continue ${
                            activeStep === index ? "" : "disable"
                          }`}
                          style={{backgroundColor: 'transparent'}}
                          // onClick={handleNext}
                        >
                          {activeStep < index
                            ? "Start"
                            : activeStep === index
                            ? "Start"
                            : "Start"}{" "}
                        </button>
                      )}

                      {/* <ButtonLoader color={"black"} /> */}
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </DialogContent>
        </Dialog>

        <Dialog
          fullWidth={true}
          maxWidth={"xs"}
          open={resultDialog}
          // onClose={handleResultDialogClose}
          className="congratulation-modal"
        >
          <DialogContent>
            {/* <DialogTitle
            onClose={handleResultDialogClose}
            /> */}

            {collectibleType !== null && (
              <div className="congratulation-content">
                {/* <img
                  src={`/images/${collectibleType.image}.svg`}
                  alt="Collectible Icon"
                /> */}
                 <svg style={{marginBottom: 23}} width="47" height="67" viewBox="0 0 47 67" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.5225 2.42546L25.1239 6.85771C24.9708 6.7005 24.7768 6.60178 24.5762 6.56311L26.9751 2.13086C27.176 2.16953 27.3694 2.26826 27.5225 2.42546Z" fill="#26603E"/>
            <path d="M27.0314 3.0546L24.6321 7.48685C24.7566 7.25795 24.7736 6.9731 24.6541 6.70648C24.6321 6.65586 24.6057 6.60807 24.5762 6.56311L26.9748 2.13086C27.0047 2.17582 27.0311 2.22361 27.0534 2.27392C27.1726 2.54117 27.1556 2.82571 27.0314 3.0546Z" fill="#26603E"/>
            <path d="M27.0314 3.0546L24.6321 7.48685C24.7566 7.25795 24.7736 6.9731 24.6541 6.70648C24.6321 6.65586 24.6057 6.60807 24.5762 6.56311L26.9748 2.13086C27.0047 2.17582 27.0311 2.22361 27.0534 2.27392C27.1726 2.54117 27.1556 2.82571 27.0314 3.0546Z" fill="#26603E"/>
            <path d="M29.6961 5.1891L27.2969 9.62135C26.0873 7.85311 25.1535 6.89007 25.123 6.85705L27.5217 2.4248C27.5522 2.45782 28.4863 3.42117 29.6961 5.1891Z" fill="#26603E"/>
            <path d="M26.9735 2.13127L24.5746 6.56351C24.3941 6.28872 24.0844 6.11862 23.7644 6.10447C23.6399 6.09882 23.5141 6.11674 23.3937 6.16107C22.9107 6.33148 22.2316 6.62262 21.4531 7.19139L23.8521 2.75914C24.6306 2.19037 25.31 1.89923 25.7926 1.72882C25.913 1.68417 26.0388 1.66625 26.1633 1.67191C26.4837 1.68637 26.7924 1.85647 26.9735 2.13127Z" fill="#26603E"/>
            <path d="M23.8539 2.75899L21.455 7.19124C19.3214 6.65014 17.4274 6.37062 15.7509 6.29548C15.5903 6.28856 15.4315 6.2829 15.2749 6.27945C9.52213 6.16594 6.38148 8.40832 4.49722 10.8419C4.08534 11.3776 3.74043 11.9253 3.45117 12.4592L5.85044 8.02725C6.13938 7.49307 6.48492 6.94537 6.89648 6.40961C8.78043 3.97607 11.9214 1.7337 17.6735 1.84688C17.8307 1.85034 17.9892 1.856 18.1502 1.86292C19.8263 1.93838 21.72 2.21789 23.8539 2.75899Z" fill="url(#paint0_linear_403_23775)"/>
            <path d="M27.0304 3.05469L24.6311 7.48694C24.5343 7.66615 24.3724 7.81109 24.1598 7.88781C24.0325 7.9356 23.8935 7.98905 23.7432 8.05445C23.1311 8.32232 22.3249 8.79803 21.3012 9.96543C21.1195 10.1723 20.8551 10.2761 20.5847 10.2714C20.5778 10.2714 20.5705 10.2707 20.5636 10.2707C20.3511 10.261 20.1351 10.183 19.9568 10.0349C19.5946 9.73843 19.4956 9.25707 19.6952 8.88826L22.0945 4.45602C21.8948 4.82482 21.9935 5.30618 22.3557 5.60267C22.5337 5.75044 22.7503 5.82842 22.9629 5.83848C22.9695 5.83848 22.977 5.83879 22.9839 5.83879C23.2543 5.84382 23.5184 5.73975 23.7002 5.53287C24.7239 4.36547 25.53 3.88976 26.1425 3.62188C26.2928 3.55617 26.4311 3.50272 26.5582 3.45493C26.7716 3.37916 26.9339 3.2339 27.0304 3.05469Z" fill="url(#paint1_linear_403_23775)"/>
            <path d="M44.048 20.9103L41.6491 25.3426C39.729 20.1604 36.2636 16.2495 32.8484 13.428C30.8661 11.7911 28.9041 10.5313 27.2969 9.6217L29.6961 5.18945C31.3034 6.09936 33.265 7.35889 35.2477 8.99571C38.6625 11.8169 42.1279 15.7279 44.048 20.9103Z" fill="url(#paint2_linear_403_23775)"/>
            <path d="M34.3364 16.4375L31.9375 20.8697C31.8139 21.0977 31.5875 21.2668 31.3008 21.3153L33.7 16.883C33.9865 16.8346 34.2132 16.6654 34.3364 16.4375Z" fill="#4353FF"/>
            <path d="M22.5767 7.04268L20.1775 11.4749C20.0646 11.6824 19.8184 11.7856 19.5367 11.773C19.3635 11.7654 19.177 11.7139 18.9988 11.6161C18.5281 11.3586 18.2979 10.8801 18.4806 10.5455L20.8799 6.11328C20.6972 6.44781 20.927 6.92603 21.3977 7.18385C21.576 7.28195 21.7627 7.3332 21.9357 7.34106C22.2177 7.35332 22.4632 7.25019 22.5767 7.04268Z" fill="url(#paint3_linear_403_23775)"/>
            <path d="M46.7733 23.4522L44.3744 27.8844C44.3351 27.8112 44.2863 27.7407 44.226 27.6756C43.3607 26.7362 42.4967 25.9665 41.6484 25.3424L44.0474 20.9102C44.8957 21.5343 45.7597 22.3039 46.6246 23.2434C46.685 23.3088 46.7343 23.3789 46.7733 23.4522Z" fill="#26603E"/>
            <path d="M19.606 9.21081L17.207 13.6431C17.2215 13.6031 17.2388 13.5648 17.2583 13.5289L19.6572 9.09668C19.6377 9.13284 19.6204 9.17088 19.606 9.21081Z" fill="#26603E"/>
            <path d="M46.7821 24.2968L44.3828 28.7291C44.4435 28.6171 44.4771 28.4936 44.4841 28.3678L46.883 23.9355C46.8761 24.0616 46.8425 24.1849 46.7821 24.2968Z" fill="#26603E"/>
            <path d="M33.7012 16.8823L31.3019 21.3146C31.2406 21.3256 31.1793 21.3303 31.1177 21.3275C30.6571 21.307 30.2559 20.998 30.1509 20.5628C28.3942 13.2 24.256 8.59888 23.7991 8.11469C23.769 8.08262 23.762 8.07319 23.7617 8.07287L26.1607 3.64062C26.161 3.64062 26.1682 3.65037 26.1984 3.68244C26.6546 4.16632 30.7929 8.76772 32.5498 16.1306C32.6548 16.5657 33.0557 16.8748 33.5163 16.8952C33.5783 16.8981 33.6399 16.8934 33.7012 16.8823Z" fill="url(#paint4_linear_403_23775)"/>
            <path d="M46.7821 24.2969L44.3828 28.7291C44.3337 28.82 44.2668 28.9033 44.1822 28.9744C44.0068 29.1228 43.7838 29.1907 43.5625 29.1856L45.9618 24.7534C46.1831 24.7584 46.4057 24.6905 46.5812 24.5421C46.6657 24.4711 46.7324 24.3877 46.7821 24.2969Z" fill="#26603E"/>
            <path d="M34.7093 20.5369L32.3103 24.9692C32.4317 24.4828 32.1154 23.9697 31.5991 23.8238C31.5211 23.8015 31.4432 23.7889 31.3671 23.7858C31.0118 23.7697 30.6857 23.9467 30.5254 24.2429L32.9247 19.8107C33.085 19.5145 33.4107 19.3378 33.766 19.3535C33.8424 19.3567 33.9201 19.3692 33.9981 19.3916C34.514 19.5374 34.8309 20.0506 34.7093 20.5369Z" fill="#26603E"/>
            <path d="M45.9616 24.7533L43.5623 29.1856C43.2765 29.173 43.0184 29.0598 42.83 28.8548C42.7549 28.774 42.6798 28.6951 42.6052 28.6174C39.7325 25.6286 37.2213 24.8646 35.338 24.7803C35.2911 24.7785 35.2446 24.7766 35.1987 24.7753C33.7807 24.7401 32.7076 25.1265 32.2168 25.3469L34.6161 20.9147C35.1069 20.6943 36.1803 20.3079 37.5973 20.3431C37.6435 20.3443 37.6901 20.3465 37.7369 20.3484C39.6205 20.4327 42.1317 21.1967 45.0042 24.1855C45.0787 24.2631 45.1542 24.3421 45.229 24.4229C45.4173 24.6275 45.6758 24.7407 45.9616 24.7533Z" fill="url(#paint5_linear_403_23775)"/>
            <path d="M34.6161 20.9141L32.2168 25.3463L32.3111 24.9694L34.7101 20.5371L34.6161 20.9141Z" fill="#255D3C"/>
            <path d="M32.8482 20.0099L30.4492 24.4422C30.4671 24.3711 30.4929 24.3048 30.5259 24.2438L32.9252 19.8115C32.8922 19.8728 32.8661 19.9389 32.8482 20.0099Z" fill="#26603E"/>
            <path d="M32.7232 20.5106L30.3242 24.9429L30.449 24.442L32.848 20.0098L32.7232 20.5106Z" fill="#255D3C"/>
            <path d="M20.9421 16.2736L18.5431 20.7059C18.6283 20.5223 18.6488 20.3066 18.5859 20.0903C18.5173 19.8611 18.4655 19.6218 18.4277 19.3756L20.827 14.9434C20.8647 15.1895 20.9163 15.4291 20.9848 15.658C21.0477 15.8743 21.0273 16.09 20.9421 16.2736Z" fill="#26603E"/>
            <path d="M20.7333 15.651L18.3343 20.0832C18.2013 19.6836 17.8202 19.4151 17.4131 19.3972C17.3181 19.3928 17.2226 19.4022 17.1276 19.4264C16.8852 19.4896 16.6962 19.6393 16.584 19.8326L18.9829 15.4004C19.0955 15.207 19.2845 15.0574 19.5269 14.9942C19.6215 14.9697 19.7174 14.9605 19.8124 14.9649C20.2198 14.9829 20.6003 15.2514 20.7333 15.651Z" fill="#26603E"/>
            <path d="M20.7333 15.651L18.3343 20.0832C18.2013 19.6836 17.8202 19.4151 17.4131 19.3972C17.3181 19.3928 17.2226 19.4022 17.1276 19.4264C16.8852 19.4896 16.6962 19.6393 16.584 19.8326L18.9829 15.4004C19.0955 15.207 19.2845 15.0574 19.5269 14.9942C19.6215 14.9697 19.7174 14.9605 19.8124 14.9649C20.2198 14.9829 20.6003 15.2514 20.7333 15.651Z" fill="#26603E"/>
            <path d="M20.9421 16.2736L18.5431 20.7059C18.6283 20.5223 18.6488 20.3066 18.5859 20.0903C18.5173 19.8611 18.4655 19.6218 18.4277 19.3756L20.827 14.9434C20.8647 15.1895 20.9163 15.4291 20.9848 15.658C21.0477 15.8743 21.0273 16.09 20.9421 16.2736Z" fill="#26603E"/>
            <path d="M20.943 16.2733L18.5444 20.7055L18.3359 20.0833L20.7349 15.6514L20.943 16.2733Z" fill="#255D3C"/>
            <path d="M20.7333 15.651L18.3343 20.0832C18.2013 19.6836 17.8202 19.4151 17.4131 19.3972C17.3181 19.3928 17.2226 19.4022 17.1276 19.4264C16.8852 19.4896 16.6962 19.6393 16.584 19.8326L18.9829 15.4004C19.0955 15.207 19.2845 15.0574 19.5269 14.9942C19.6215 14.9697 19.7174 14.9605 19.8124 14.9649C20.2198 14.9829 20.6003 15.2514 20.7333 15.651Z" fill="#26603E"/>
            <path d="M18.984 15.4011L16.585 19.8333C16.4982 19.385 16.4533 18.9369 16.4379 18.4999C16.4363 18.4534 16.4347 18.4062 16.4341 18.3597C16.3813 15.879 17.1944 13.6979 17.2082 13.6432L19.6071 9.21094C19.5933 9.26596 18.7806 11.4467 18.8327 13.9274C18.834 13.9739 18.8353 14.0211 18.8368 14.0676C18.8526 14.5047 18.8975 14.9524 18.984 15.4011Z" fill="#4353FF"/>
            <path d="M18.9844 15.4004L16.5855 19.8326C16.5808 19.8402 16.5767 19.8477 16.5723 19.8559L18.9715 15.4237C18.9756 15.4155 18.9797 15.4079 18.9844 15.4004Z" fill="#26603E"/>
            <path d="M32.7227 20.5109L30.3238 24.9432C27.042 21.7833 24.0519 20.9646 21.8259 20.8653C21.7627 20.8624 21.7001 20.8599 21.6376 20.8583C20.3434 20.8288 19.3216 21.0599 18.7227 21.2441L21.1216 16.8119C21.7209 16.6279 22.7424 16.3968 24.0368 16.4264C24.0991 16.428 24.1616 16.4305 24.2255 16.4333C26.4509 16.5327 29.4409 17.3511 32.7227 20.5109Z" fill="url(#paint6_linear_403_23775)"/>
            <path d="M21.1221 16.8114L18.7231 21.2436L18.543 20.7057L20.9416 16.2734L21.1221 16.8114Z" fill="#255D3C"/>
            <path d="M18.9152 16.1202L16.5163 20.5525C16.4345 20.3073 16.4616 20.0595 16.5716 19.8561L18.9709 15.4238C18.8605 15.6273 18.8335 15.875 18.9152 16.1202Z" fill="#26603E"/>
            <path d="M19.0337 16.4754L16.6345 20.9076L16.5156 20.5524L18.9146 16.1201L19.0337 16.4754Z" fill="#255D3C"/>
            <path d="M4.78931 10.5908L2.39005 15.0231C1.21006 15.2799 0.509557 15.5796 0.466797 15.595L2.86575 11.1627C2.90851 11.147 3.60933 10.8477 4.78931 10.5908Z" fill="#26603E"/>
            <path d="M2.86375 11.1631L0.4648 15.5953C0.369848 15.6365 0.286215 15.6912 0.214844 15.7563L2.61411 11.3241C2.68517 11.2593 2.76912 11.2043 2.86375 11.1631Z" fill="#26603E"/>
            <path d="M0.214844 15.7562C0.369848 14.9495 0.771036 13.3274 1.73879 11.5397L4.13743 7.10742C3.16999 8.89516 2.7688 10.5172 2.61411 11.324C1.8938 12.6539 0.93453 14.4266 0.214844 15.7562Z" fill="url(#paint7_linear_403_23775)"/>
            <path d="M2.61373 11.3243L0.0195312 16.1662C0.174221 15.3598 0.770973 13.3274 1.73841 11.5397L4.13737 7.10742C3.16961 8.89516 2.76874 10.5172 2.61373 11.3243Z" fill="url(#paint8_linear_403_23775)"/>
            <path d="M19.0333 16.4766L16.6341 20.9088C13.0328 17.5827 9.45137 16.6363 6.61822 16.5093C6.51918 16.5046 6.42077 16.5011 6.3233 16.4986C4.80941 16.4637 3.53165 16.6718 2.6469 16.8834C1.99795 17.0384 1.56029 17.1953 1.39648 17.2592L3.79575 12.8269C3.95925 12.7631 4.39691 12.6062 5.04616 12.4512C5.9306 12.2399 7.20836 12.0314 8.72257 12.0663C8.81972 12.0689 8.91782 12.0723 9.01748 12.077C11.85 12.2041 15.4318 13.1504 19.0333 16.4766Z" fill="url(#paint9_linear_403_23775)"/>
            <path d="M3.7965 12.8261L1.39723 17.2584C1.34347 17.2795 1.32932 17.2857 1.32869 17.2861C1.1935 17.3442 1.05044 17.3678 0.908954 17.3618C0.80457 17.3571 0.702072 17.3361 0.603976 17.3002C0.368797 17.2147 0.223225 17.0487 0.103749 16.8132C-0.0396228 16.5337 -0.0292472 16.2274 0.10312 15.9828L2.44171 11.5449C2.30903 11.7898 2.29865 12.0961 2.44202 12.3756C2.56181 12.6111 2.76744 12.7821 3.00293 12.868C3.10071 12.9038 3.20352 12.9249 3.30759 12.9299C3.44908 12.9359 3.59213 12.912 3.72733 12.8538C3.72859 12.8535 3.74242 12.8472 3.7965 12.8261Z" fill="url(#paint10_linear_403_23775)"/>
            <path d="M46.7447 25.2021L44.3458 28.8015L33.7539 39.1265L36.1529 35.5274L46.7447 25.2021Z" fill="url(#paint11_linear_403_23775)"/>
            <path d="M36.1519 35.5267L33.753 39.9589L31.4785 39.4791L33.8775 35.0469L36.1519 35.5267Z" fill="#255D3C"/>
            <path d="M31.2307 34.4885L28.8318 38.9207L26.9355 38.5211L29.3348 34.0889L31.2307 34.4885Z" fill="#255D3C"/>
            <path d="M29.3348 34.0889L26.9355 38.5211L30.3249 24.943L32.7238 20.5107L29.3348 34.0889Z" fill="url(#paint12_linear_403_23775)"/>
            <path d="M26.7245 33.5385L24.3253 37.9708L22.1992 37.5224L24.5982 33.0898L26.7245 33.5385Z" fill="#255D3C"/>
            <path d="M24.5978 33.09L22.1989 37.5226L16.6348 20.9088L19.034 16.4766L24.5978 33.09Z" fill="url(#paint13_linear_403_23775)"/>
            <path d="M22.0415 32.5497L19.6425 36.982L16.7949 36.3815L19.1942 31.9492L22.0415 32.5497Z" fill="#255D3C"/>
            <path d="M19.1906 32.0151L16.7916 36.4474L0.375 17.1721L3.00253 12.8682L19.1906 32.0151Z" fill="url(#paint14_linear_403_23775)"/>
            <path d="M19.0923 35.3644L16.6934 39.7963L16.7921 36.4479L19.191 32.0156L19.0923 35.3644Z" fill="url(#paint15_linear_403_23775)"/>
            <path d="M30.9557 40.7443L28.5564 43.7885L23.916 42.9276L26.315 39.8838L30.9557 40.7443Z" fill="url(#paint16_linear_403_23775)"/>
            <path d="M23.1578 39.418L20.7589 42.4621L16.2559 41.6056L18.6551 38.5615L23.1578 39.418Z" fill="url(#paint17_linear_403_23775)"/>
            <path d="M23.2706 47.0431L20.8717 49.254L20.7598 42.4621L23.1587 39.418L23.2706 47.0431Z" fill="url(#paint18_linear_403_23775)"/>
            <path d="M27.7139 47.6108L24.2045 49.8217L20.8711 49.2539L23.27 47.043L27.7139 47.6108Z" fill="url(#paint19_linear_403_23775)"/>
            <path d="M31.3958 52.5823L28.9968 57.0146L28.5566 43.7883L30.9559 40.7441L31.3958 52.5823Z" fill="url(#paint20_linear_403_23775)"/>
            <path d="M39.1651 61.1362L36.7658 63.0696L32.8926 62.9366L35.2918 61.0029L39.1651 61.1362Z" fill="#4353FF"/>
            <path d="M27.6314 60.6128L25.2325 65.0451L24.8477 56.4931L27.2469 52.0605L27.6314 60.6128Z" fill="url(#paint21_linear_403_23775)"/>
            <path d="M35.537 65.128L33.1377 66.5057L12.6504 64.9871L14.7717 63.6094L35.537 65.128Z" fill="url(#paint22_linear_403_23775)"/>
            <path d="M15.327 63.6091L12.6504 64.9868L12.9362 39.0979L15.3348 34.666L15.327 63.6091Z" fill="url(#paint23_linear_403_23775)"/>
            <path d="M21.7831 6.25286C21.6045 6.15477 21.4174 6.1032 21.2435 6.09566C20.9612 6.08277 20.7147 6.18558 20.6015 6.39152C20.4191 6.72605 20.649 7.20427 21.1196 7.46208C21.2976 7.56018 21.4847 7.61143 21.6576 7.61929C21.9396 7.63218 22.1855 7.52874 22.2987 7.32123C22.4839 6.9889 22.2512 6.51036 21.7831 6.25286ZM46.7048 24.6959C46.6731 24.5336 46.6397 24.3736 46.6051 24.2133C46.6139 24.0507 46.5778 23.8838 46.496 23.73C44.6926 16.0923 39.779 10.6905 35.2845 7.20018C30.5954 3.55742 26.3335 1.94323 26.215 1.89764C23.0407 0.904735 20.2695 0.410796 17.8463 0.30201C17.6715 0.29415 17.4979 0.288176 17.3263 0.284403C10.5822 0.112735 6.67845 3.10089 4.64421 6.09974C3.09605 8.3613 2.26789 11.0382 2.07642 12.0355C2.07956 12.0327 2.08554 12.0248 2.08962 12.0207C2.03869 12.2226 2.05724 12.4452 2.16445 12.6536C2.20816 12.7395 2.26601 12.813 2.32952 12.881L18.9131 32.293L18.915 32.2273L21.7626 32.8278L4.76872 12.7285C5.65347 12.5169 6.93092 12.3087 8.44512 12.3436C8.54227 12.3461 8.64069 12.3496 8.74004 12.3543C11.5732 12.481 15.1546 13.4274 18.7559 16.7535L24.32 33.367L21.7629 32.8278L18.9134 32.293L18.815 35.6411L15.0575 34.9435L14.4944 63.8865L35.259 65.4051L35.0131 61.2807L38.8867 61.4137L36.117 35.8559L35.8746 35.8046L46.4665 25.4794C46.6734 25.2785 46.763 24.9845 46.7048 24.6959ZM2.58671 11.4406C2.58639 11.441 2.58639 11.441 2.58608 11.441C2.58608 11.441 2.58639 11.4406 2.58671 11.4406C2.60117 11.4353 2.69486 11.3963 2.8483 11.3403C2.69455 11.3966 2.60086 11.4353 2.58671 11.4406ZM20.4726 14.3886C20.432 13.3416 20.5974 12.2735 20.7791 11.4803C20.8672 11.0822 20.9615 10.753 21.0297 10.527C21.0653 10.4125 21.0935 10.3264 21.1124 10.2682C21.1316 10.2097 21.141 10.1893 21.1388 10.189C21.3092 9.71704 21.0445 9.18003 20.5449 8.98761C20.4374 8.94579 20.3283 8.92284 20.2211 8.91844C19.8284 8.90083 19.4633 9.11966 19.3291 9.48878C19.3149 9.5438 18.5025 11.7245 18.5547 14.2052C15.0833 11.5362 11.5763 10.6401 8.77179 10.5147C8.63848 10.5087 8.50675 10.5043 8.37689 10.5015C6.82182 10.4675 5.49815 10.6534 4.51027 10.8687C4.84763 9.74188 5.47866 8.16982 6.61745 6.68769C8.50172 4.25352 11.6427 2.01115 17.3948 2.12465C17.5517 2.12811 17.7105 2.13345 17.8715 2.14068C19.5476 2.21583 21.4413 2.49534 23.5752 3.03675C23.0583 3.41373 22.4986 3.91365 21.9236 4.58051C21.5941 4.95875 21.6633 5.54072 22.0783 5.8806C22.2562 6.02837 22.4729 6.10666 22.6851 6.11641C22.6917 6.11641 22.6992 6.11704 22.7062 6.11704C22.9769 6.12207 23.241 6.018 23.4224 5.81111C24.4464 4.64339 25.2526 4.16769 25.8647 3.89981C26.0153 3.83441 26.1537 3.78096 26.2807 3.73317C26.1537 3.78096 26.015 3.83441 25.882 3.91868C25.8823 3.91899 25.8896 3.92842 25.9198 3.96049C26.376 4.44469 30.5142 9.04577 32.2712 16.4086C32.3759 16.8438 32.7767 17.1525 33.2377 17.1733C33.2993 17.1758 33.3609 17.1714 33.4219 17.1601C33.9353 17.0742 34.2557 16.5989 34.1359 16.0971C33.0069 11.3862 30.9824 7.75354 29.4185 5.46746C31.0255 6.37705 32.9871 7.63658 34.9694 9.27372C38.3846 12.0949 41.85 16.0062 43.7701 21.1883C41.4661 19.493 39.2775 18.8658 37.491 18.7859C37.4102 18.7821 37.33 18.7796 37.2511 18.7784C35.6247 18.7457 34.3774 19.1251 33.6536 19.4232C30.1222 16.0499 26.6237 14.991 23.9952 14.8731C23.8927 14.8683 23.7912 14.8655 23.6915 14.8636C22.3792 14.836 21.3051 15.0224 20.549 15.2211C20.5075 14.9495 20.483 14.6703 20.4726 14.3886ZM20.8445 17.089C21.4435 16.9051 22.4653 16.674 23.7594 16.7032C23.8217 16.7048 23.8846 16.7073 23.9481 16.7102C26.1735 16.8098 29.1635 17.6282 32.4454 20.7884L29.0563 34.3665L26.4461 33.8154L20.8445 17.089ZM27.3538 60.8905L23.036 60.4321L22.748 51.7849L18.3915 51.1928L18.3777 38.8393L22.88 39.6958L22.992 47.3209L27.4355 47.8887L27.1475 40.3567L30.6777 41.022L31.1176 52.8598L26.9689 52.3386L27.3538 60.8905ZM45.6575 25.0298C45.3978 25.0185 45.1397 24.9053 44.951 24.7C44.8762 24.6192 44.8011 24.5402 44.7294 24.4748L33.6002 35.3248L30.9525 34.7661L34.3384 21.1921C34.8292 20.9717 35.9023 20.5853 37.3197 20.6205C37.3659 20.6217 37.4124 20.6236 37.4593 20.6258C39.3429 20.7101 41.8538 21.4738 44.7265 24.4629C44.8011 24.5409 44.8762 24.6198 44.9513 24.7003C45.1369 24.9028 45.3909 25.0144 45.672 25.0295C45.6673 25.0295 45.6622 25.0301 45.6575 25.0298Z" fill="white"/>
            <path d="M22.0601 5.97523C21.8815 5.87682 21.6944 5.82557 21.5206 5.81802C21.2385 5.80513 20.9917 5.90826 20.8789 6.11388C20.6962 6.44842 20.926 6.92663 21.3967 7.18445C21.575 7.28255 21.7617 7.3338 21.9346 7.34166C22.2167 7.35455 22.4625 7.25111 22.5757 7.0436C22.7609 6.71095 22.5286 6.23242 22.0601 5.97523ZM46.9819 24.4182C46.9501 24.256 46.9168 24.0957 46.8822 23.9356C46.891 23.7728 46.8548 23.6058 46.7731 23.4524C44.9699 15.815 40.056 10.4128 35.5615 6.92255C30.8724 3.27979 26.6109 1.6656 26.492 1.62001C23.3177 0.627102 20.5465 0.133163 18.1237 0.0246916C17.9485 0.0168313 17.775 0.0108575 17.6036 0.00708456C10.8592 -0.164898 6.95549 2.82326 4.92125 5.82242C3.37278 8.08367 2.54462 10.7609 2.35346 11.7582C2.3566 11.755 2.36258 11.7475 2.36698 11.7431C2.31605 11.9449 2.3346 12.1675 2.4415 12.376C2.48551 12.4615 2.54305 12.5354 2.60656 12.6033L19.1905 32.0157L19.1924 31.95L22.0397 32.5505L5.04576 12.4508C5.9302 12.2395 7.20796 12.0311 8.72216 12.066C8.81932 12.0685 8.91741 12.072 9.01708 12.0767C11.8499 12.2037 15.4314 13.1501 19.0329 16.4762L24.5968 33.0897L22.0397 32.5505L19.1905 32.0157L19.0917 35.3641L15.3342 34.6661L14.7711 63.6092L35.5361 65.1278L35.2902 61.0031L39.1634 61.1364L36.3938 35.5783L36.1514 35.5273L46.7432 25.2021C46.9504 25.0008 47.04 24.7072 46.9819 24.4182ZM2.86344 11.163C2.8779 11.1573 2.97159 11.1187 3.12534 11.0627C2.97159 11.119 2.8779 11.1577 2.86344 11.163ZM20.7496 14.1106C20.7091 13.0636 20.8748 11.9956 21.0562 11.2023C21.1442 10.8043 21.2389 10.4751 21.3068 10.249C21.3423 10.1346 21.3709 10.0484 21.3898 9.99025C21.4086 9.93146 21.4181 9.91102 21.4159 9.91071C21.5866 9.43878 21.3215 8.90176 20.8219 8.70934C20.7147 8.66753 20.6056 8.64489 20.4981 8.64017C20.1054 8.62257 19.7407 8.8414 19.6061 9.2102C19.5923 9.26522 18.7795 11.446 18.8317 13.9267C15.3603 11.258 11.8534 10.3616 9.04884 10.2361C8.91553 10.2301 8.78379 10.2257 8.65394 10.2232C7.09886 10.1893 5.77488 10.3754 4.78731 10.5908C5.12499 9.46393 5.75601 7.89188 6.89481 6.40974C8.77876 3.9762 11.9197 1.73383 17.6719 1.84702C17.8291 1.85047 17.9875 1.85613 18.1485 1.86305C19.8246 1.93819 21.7183 2.21771 23.8522 2.75881C23.3357 3.1361 22.7757 3.6357 22.2006 4.30288C21.8711 4.6808 21.9403 5.26309 22.3553 5.60297C22.5333 5.75074 22.7499 5.82871 22.9625 5.83877C22.9691 5.83877 22.9766 5.83909 22.9835 5.83909C23.2539 5.84412 23.518 5.74005 23.6997 5.53317C24.7235 4.36576 25.5296 3.89006 26.1421 3.62218C26.2924 3.55647 26.4307 3.50302 26.5577 3.45523C26.4307 3.50302 26.2921 3.55647 26.1591 3.64073C26.1591 3.64073 26.1666 3.65048 26.1968 3.68255C26.653 4.16642 30.7913 8.76783 32.5482 16.1307C32.6532 16.5658 33.0541 16.8749 33.5147 16.8953C33.5763 16.8982 33.638 16.8935 33.6993 16.8821C34.2124 16.7963 34.5328 16.3212 34.4133 15.8194C33.2836 11.1086 31.2591 7.47591 29.6949 5.18983C31.3019 6.09942 33.2635 7.35895 35.2462 8.99577C38.661 11.817 42.1264 15.7282 44.0465 20.9104C41.7425 19.2151 39.5539 18.5878 37.7674 18.508C37.6866 18.5042 37.6064 18.5017 37.5275 18.5004C35.9011 18.4677 34.6541 18.8469 33.93 19.1453C30.3986 15.772 26.9004 14.713 24.2713 14.5951C24.1688 14.5904 24.0676 14.5876 23.9676 14.5857C22.6556 14.558 21.5816 14.7445 20.8251 14.9432C20.7842 14.6718 20.76 14.3926 20.7496 14.1106ZM21.1216 16.8114C21.7208 16.6275 22.7424 16.3964 24.0368 16.4259C24.099 16.4275 24.1616 16.43 24.2254 16.4328C26.4512 16.5322 29.4412 17.3509 32.7227 20.5107L29.334 34.0889L26.7234 33.538L21.1216 16.8114ZM27.6305 60.6129L23.3127 60.1542L23.025 51.5072L18.6685 50.9149L18.6544 38.5617L23.1571 39.4182L23.2687 47.0432L27.7126 47.6111L27.4243 40.079L30.9545 40.744L31.3943 52.5822L27.2457 52.0606L27.6305 60.6129ZM45.9346 24.7521C45.6752 24.7408 45.4167 24.6276 45.2281 24.4226C45.1536 24.3418 45.0781 24.2629 45.0064 24.1975L33.8772 35.0472L31.2296 34.4888L34.6155 20.9148C35.1063 20.6944 36.1796 20.308 37.5967 20.3432C37.6429 20.3444 37.6894 20.3466 37.7363 20.3485C39.6199 20.4328 42.1311 21.1968 45.0036 24.1856C45.0781 24.2632 45.1536 24.3422 45.2284 24.423C45.4139 24.6251 45.6682 24.7371 45.9493 24.7521C45.9443 24.7518 45.9396 24.7525 45.9346 24.7521Z" fill="#4353FF"/>
            <rect x="17.0332" y="37.0732" width="15.9795" height="25.1106" fill="#4353FF"/>
            <g filter="url(#filter0_d_403_23775)">
            <path d="M31.3213 51.6335C31.3593 50.8717 31.1922 50.1145 30.8386 49.4462C30.485 48.7779 29.9587 48.2245 29.3182 47.8475C29.3184 47.8443 29.3185 47.8417 29.3186 47.8391L29.2511 47.8093L29.1714 47.7651L29.1708 47.7762C29.0203 47.7158 28.8629 47.662 28.6904 47.6127C28.8281 47.5868 28.9586 47.558 29.082 47.5264L29.0816 47.5328L29.1026 47.5238L29.1497 47.5113C29.1496 47.5087 29.1497 47.506 29.1501 47.5034C29.7043 47.2604 30.1822 46.8622 30.5297 46.354C30.8773 45.8457 31.0806 45.2476 31.1168 44.6273C31.153 44.007 31.0205 43.3891 30.7345 42.8435C30.4484 42.298 30.02 41.8465 29.4979 41.54C29.3224 41.419 29.1331 41.3208 28.9343 41.2476C28.3565 41.0331 27.4945 40.8974 26.3482 40.8404L22.7246 40.6602L22.5925 43.3164C23.2257 43.0628 23.8807 43.1324 24.5423 43.3689C25.8492 43.8384 27.2604 44.2671 28.8837 44.2087C28.897 44.2094 28.8614 44.2357 28.812 44.2723C28.7442 44.3232 28.6821 44.3816 28.6268 44.4466C27.998 45.1661 27.1377 45.2434 26.2025 45.19C25.7153 45.1621 25.0393 44.66 24.7957 45.2686C24.6736 45.574 25.186 46.1657 25.4986 46.5678C26.2486 47.5357 26.6733 48.5736 26.4885 49.7895C26.3022 51.0154 26.3924 51.1034 27.6862 50.9108C27.8527 50.8863 27.9926 50.8303 28.1809 50.8201C28.5554 50.8001 29.1313 50.7616 29.6723 50.8197C28.2857 51.7374 27.0428 53.1492 25.2542 52.0678L25.1194 54.7789L25.0958 55.2536L26.2124 55.3091C27.3928 55.3678 28.253 55.3542 28.7931 55.2682L28.7987 55.2685L28.8075 55.2663C29.0909 55.1826 29.3545 55.0391 29.5816 54.8448C30.092 54.4844 30.5147 54.0068 30.8166 53.4495C31.1185 52.8923 31.2912 52.2706 31.3213 51.6335Z" fill="white"/>
            </g>
            <defs>
            <filter id="filter0_d_403_23775" x="18.5918" y="40.6602" width="12.7344" height="17.6846" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="-3" dy="2"/>
            <feGaussianBlur stdDeviation="0.5"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.183066 0 0 0 0 0.250465 0 0 0 0 0.975 0 0 0 1 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_403_23775"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_403_23775" result="shape"/>
            </filter>
            <linearGradient id="paint0_linear_403_23775" x1="21.2137" y1="11.3575" x2="10.3851" y2="5.9894" gradientUnits="userSpaceOnUse">
            <stop stop-color="#278CFF"/>
            <stop offset="0.5275" stop-color="#3176FF"/>
            <stop offset="1" stop-color="#3A5EF7"/>
            </linearGradient>
            <linearGradient id="paint1_linear_403_23775" x1="25.2542" y1="7.11175" x2="21.8299" y2="6.09369" gradientUnits="userSpaceOnUse">
            <stop stop-color="#278AFF"/>
            <stop offset="0.5275" stop-color="#3470FF"/>
            <stop offset="1" stop-color="#3A5CF6"/>
            </linearGradient>
            <linearGradient id="paint2_linear_403_23775" x1="39.3639" y1="21.9078" x2="32.1448" y2="8.44144" gradientUnits="userSpaceOnUse">
            <stop stop-color="#2988FF"/>
            <stop offset="0.5275" stop-color="#3470FF"/>
            <stop offset="1" stop-color="#4353FF"/>
            </linearGradient>
            <linearGradient id="paint3_linear_403_23775" x1="17.9945" y1="7.83833" x2="21.3259" y2="9.59648" gradientUnits="userSpaceOnUse">
            <stop stop-color="#2392FF"/>
            <stop offset="0.5275" stop-color="#2A85FF"/>
            <stop offset="1" stop-color="#3E5EFF"/>
            </linearGradient>
            <linearGradient id="paint4_linear_403_23775" x1="24.2956" y1="8.1078" x2="31.422" y2="15.6509" gradientUnits="userSpaceOnUse">
            <stop stop-color="#278AFF"/>
            <stop offset="0.552083" stop-color="#2E7DFE"/>
            <stop offset="1" stop-color="#4353FF"/>
            </linearGradient>
            <linearGradient id="paint5_linear_403_23775" x1="43.3321" y1="26.7988" x2="34.7247" y2="22.2637" gradientUnits="userSpaceOnUse">
            <stop stop-color="#278BFF"/>
            <stop offset="0.5275" stop-color="#3373FF"/>
            <stop offset="1" stop-color="#3A5BF5"/>
            </linearGradient>
            <linearGradient id="paint6_linear_403_23775" x1="31.504" y1="24.463" x2="21.8785" y2="18.1694" gradientUnits="userSpaceOnUse">
            <stop stop-color="#278BFF"/>
            <stop offset="0.5275" stop-color="#356EFF"/>
            <stop offset="1" stop-color="#3A5BF5"/>
            </linearGradient>
            <linearGradient id="paint7_linear_403_23775" x1="0.866868" y1="10.4559" x2="3.39567" y2="12.3415" gradientUnits="userSpaceOnUse">
            <stop stop-color="#6BC189"/>
            <stop offset="0.5275" stop-color="#6ADB80"/>
            <stop offset="1" stop-color="#217B3D"/>
            </linearGradient>
            <linearGradient id="paint8_linear_403_23775" x1="3.7441" y1="13.5591" x2="21.3178" y2="33.8438" gradientUnits="userSpaceOnUse">
            <stop stop-color="#2986FF"/>
            <stop offset="0.5275" stop-color="#366CFF"/>
            <stop offset="1" stop-color="#3B58F3"/>
            </linearGradient>
            <linearGradient id="paint9_linear_403_23775" x1="17.854" y1="21.3381" x2="5.1741" y2="13.5636" gradientUnits="userSpaceOnUse">
            <stop stop-color="#2986FF"/>
            <stop offset="0.53125" stop-color="#3373FF"/>
            <stop offset="1" stop-color="#3B59F4"/>
            </linearGradient>
            <linearGradient id="paint10_linear_403_23775" x1="2.05011" y1="14.967" x2="19.4495" y2="35.0504" gradientUnits="userSpaceOnUse">
            <stop stop-color="#278AFF"/>
            <stop offset="0.5275" stop-color="#356EFF"/>
            <stop offset="1" stop-color="#3B59F4"/>
            </linearGradient>
            <linearGradient id="paint11_linear_403_23775" x1="44.007" y1="28.7524" x2="35.9549" y2="36.0641" gradientUnits="userSpaceOnUse">
            <stop stop-color="#278CFF"/>
            <stop offset="0.5275" stop-color="#356EFF"/>
            <stop offset="1" stop-color="#3A5DF7"/>
            </linearGradient>
            <linearGradient id="paint12_linear_403_23775" x1="26.8657" y1="18.4756" x2="30.5677" y2="32.2661" gradientUnits="userSpaceOnUse">
            <stop stop-color="#2889FF"/>
            <stop offset="0.5275" stop-color="#366DFF"/>
            <stop offset="1" stop-color="#3A5CF6"/>
            </linearGradient>
            <linearGradient id="paint13_linear_403_23775" x1="14.7904" y1="18.7707" x2="22.1947" y2="29.2292" gradientUnits="userSpaceOnUse">
            <stop stop-color="#278AFF"/>
            <stop offset="0.5275" stop-color="#4353FF"/>
            <stop offset="1" stop-color="#4353FF"/>
            </linearGradient>
            <linearGradient id="paint14_linear_403_23775" x1="1.73621" y1="15.2378" x2="19.1363" y2="35.322" gradientUnits="userSpaceOnUse">
            <stop stop-color="#268DFF"/>
            <stop offset="0.5275" stop-color="#376AFF"/>
            <stop offset="1" stop-color="#3C52EF"/>
            </linearGradient>
            <linearGradient id="paint15_linear_403_23775" x1="12.5356" y1="30.8239" x2="17.1629" y2="35.1736" gradientUnits="userSpaceOnUse">
            <stop stop-color="#278BFF"/>
            <stop offset="0.5275" stop-color="#3274FF"/>
            <stop offset="1" stop-color="#4353FF"/>
            </linearGradient>
            <linearGradient id="paint16_linear_403_23775" x1="29.2343" y1="37.0229" x2="26.0876" y2="45.4451" gradientUnits="userSpaceOnUse">
            <stop stop-color="#278CFF"/>
            <stop offset="0.5275" stop-color="#3373FF"/>
            <stop offset="1" stop-color="#3A5AF4"/>
            </linearGradient>
            <linearGradient id="paint17_linear_403_23775" x1="22.0178" y1="34.3263" x2="18.8711" y2="42.7487" gradientUnits="userSpaceOnUse">
            <stop stop-color="#2987FF"/>
            <stop offset="0.5275" stop-color="#356DFF"/>
            <stop offset="0.9998" stop-color="#395FF7"/>
            <stop offset="0.9999" stop-color="#3A5DF6"/>
            </linearGradient>
            <linearGradient id="paint18_linear_403_23775" x1="24.9628" y1="43.4645" x2="18.3915" y2="45.4082" gradientUnits="userSpaceOnUse">
            <stop stop-color="#2888FF"/>
            <stop offset="0.5275" stop-color="#356EFF"/>
            <stop offset="1" stop-color="#3A5BF5"/>
            </linearGradient>
            <linearGradient id="paint19_linear_403_23775" x1="25.7796" y1="45.8302" x2="23.188" y2="50.3654" gradientUnits="userSpaceOnUse">
            <stop stop-color="#278BFF"/>
            <stop offset="0.5275" stop-color="#356FFF"/>
            <stop offset="1" stop-color="#3A5AF4"/>
            </linearGradient>
            <linearGradient id="paint20_linear_403_23775" x1="33.0473" y1="48.7177" x2="27.7713" y2="48.9953" gradientUnits="userSpaceOnUse">
            <stop stop-color="#2987FF"/>
            <stop offset="0.5275" stop-color="#366DFF"/>
            <stop offset="1" stop-color="#4353FF"/>
            </linearGradient>
            <linearGradient id="paint21_linear_403_23775" x1="28.0077" y1="58.4759" x2="23.7504" y2="58.6608" gradientUnits="userSpaceOnUse">
            <stop stop-color="#2C81FF"/>
            <stop offset="0.5275" stop-color="#3371FD"/>
            <stop offset="1" stop-color="#3A5EF7"/>
            </linearGradient>
            <linearGradient id="paint22_linear_403_23775" x1="24.0938" y1="54.8745" x2="24.0938" y2="65.7608" gradientUnits="userSpaceOnUse">
            <stop stop-color="#278BFF"/>
            <stop offset="0.5275" stop-color="#3373FF"/>
            <stop offset="1" stop-color="#3B59F4"/>
            </linearGradient>
            <linearGradient id="paint23_linear_403_23775" x1="11.644" y1="35.062" x2="15.9838" y2="62.3414" gradientUnits="userSpaceOnUse">
            <stop stop-color="#6BC189"/>
            <stop offset="0.0001" stop-color="#278BFF"/>
            <stop offset="0.5275" stop-color="#3372FF"/>
            <stop offset="1" stop-color="#3A5AF5"/>
            </linearGradient>
            </defs>
            </svg>
                <p className="congratulation-message">Congrats!</p>
                <p className="item-lead">{`You have successfully created your ${assetType?.value == 1 ? 'NFT' : 'Token'} Challenge. Go check it out now!`}</p>
                
                <button
                  onClick={() => history.push("/mychallenge")}
                  className="btn-continue mb-0"
                >
                  {`Go to ${assetType?.value == 1 ? 'NFT' : 'Token'} Challenge`}
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <CustomAlert
          isDialogOpen={notificationOpen}
          customDialogAlertClose={customDialogAlertClose}
          title={notificationTitle}
          message={notificationMessage}
          type={notificationType}
          btnText={notificationBtnText}
          width={notificationWidth} 
          showCloseIcon={notificationCloseIcon}
        />
      </LoadingOverlay>
    </div>
  );
};

export default Explore;
