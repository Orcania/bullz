import DateFnsUtils from "@date-io/date-fns";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { DateTimePicker } from "@material-ui/pickers";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useMediaQuery } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import { Dialog, IconButton, DialogContent, FormControlLabel, Checkbox } from '@material-ui/core';

import React, { useState, useEffect, useRef } from "react";
import { verifyPrice, getBaseCurrencyPrice } from '../../common/validatePrice';

import { useSnackbar } from "notistack";

import "react-datepicker/dist/react-datepicker.css";

import { shares } from "../../config";
import { getNFTChallengeInstance } from "../../common/exchange";
import { validateInput } from "../../common/utils";
import { divideNo } from "../../common/utils";
import { useFetchTokens } from "../../data/useFetchTokens";
import Calender from "../../components/Common/Calender/Calender";

import { resaleConfig } from "./createConfig";
import PreviewNFT from "./previewNFT";
import "./style.scss";
import { scrollToTop } from 'common/utils';
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import CustomTooltip from "components/Common/Tooltip/CustomTooltip";
import { setNetwork } from "../../redux/actions/web3action";
import { useDispatch, useSelector } from "react-redux";
import { assetTypes } from "data/tokenTypes";
import ERC20Exchanger from "common/ERC20/erc20Exchanger";
import { printLog } from "utils/printLog";

const notificationConfig = {
  preventDuplicate: true,
  vertical: "bottom",
  horizontal: "right",
};

const start_date_option = [
  {
    key: 0,
    value: "Right after listing",
  },
  {
    key: 1,
    value: "1 Day after listing",
  },
  {
    key: 3,
    value: "3 Days after listing",
  },
];

const end_date_option = [
  {
    key: 1,
    value: "1 Day after listing",
  },
  {
    key: 3,
    value: "3 Days after listing",
  },
  {
    key: 5,
    value: "5 Days after listing",
  },
  {
    key: 7,
    value: "7 Days after listing",
  },
];

const airdrop_start_date_option = [
  {
    key: 0,
    value: "Right after challenge",
  },
  {
    key: 1,
    value: "1 Day after challenge",
  },
  {
    key: 3,
    value: "3 Days after challenge",
  },
];

const airdrop_end_date_option = [
  {
    key: 1,
    value: "1 Day after challenge",
  },
  {
    key: 3,
    value: "3 Days after challenge",
  },
  {
    key: 5,
    value: "5 Days after challenge",
  },
  {
    key: 7,
    value: "7 Days after challenge",
  },
];

const SellNFT = ({
  collectibleType,
  setStep,
  addMultiple,
  collectible,
  form,
  file,
  coverFile,
  onUploadFile,
  selectedCollection,
  setSelectedCollection,
  setIsLoading,
  mintToken,
  handleChange,
  step,
  goPreviousStep,
  callCreate,
  setCallCreate,
  setFieldsCompleted,
  selectedNft,
  assetType,
  selectedToken,
  ...props
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const web3Object = useSelector((state) => {
    return state.web3.web3object;
  });
  const wcPopupConfig = useSelector((state) => state.web3.wcPopupConfig);

  const [baseCurrencyPrice, setBaseCurrencyPrice] = useState(0);

  const collectibleTypeName = collectibleType && collectibleType.type;
  
  const dispatch = useDispatch();

  const [tokenOptions, setTokenOptions] = useState([]);
  const [selectedCurreny, setSelectedCurreny] = useState();
  const network = useSelector((state) => state.web3.network);
  const tokens = useFetchTokens(network);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (!(Object.keys(network).length === 0) && tokens.length > 0) {
      setTokenOptions(tokens);
      setSelectedCurreny(tokens[0].currencyKey);
      setAirDropCurrency(network.smartContracts.CHALLENGE_UTILITY_TOKEN);
    }
  }, [network, tokens]);

  const [isInstantPrice, setIsInstantPrice] = useState(false);
  const [isForSell, setIsForSell] = useState(false);

  const [auctionPrice, setAuctionPrice] = useState(0);
  const [auctionDuration, setAuctionDuration] = useState(null);
  const [auctionStartDuration, setAuctionStartDuration] = useState(null);
  const [auctionDurationText, setAuctionDurationText] = useState(null);
  const [auctionStartDurationText, setAuctionStartDurationText] = useState(null);

  const [instantPrice, setInstantPrice] = useState(0);

  const [resaleAllowed, setResaleAllowed] = useState(true);
  const [loyaltyPercentage, setLoyaltyPercentage] = useState(5);
  const [resaleCurrency, setResaleCurrency] = useState("");

  const [currencyDropOpen, setCurrencyDropOpen] = useState("");
  const [reSaleDropOpen, setReSaleDropOpen] = useState("");

  const [collStartDate, setCollStartDate] = useState(null);
  const [collEndDate, setCollEndDate] = useState(null);
  const [collStartDateText, setCollStartDateText] = useState(null);
  const [collEndDateText, setCollEndDateText] = useState(null);

  const [startDateDropOpen, setStartDateDropOpen] = useState("");
  const [endDateDropOpen, setEndDateDropOpen] = useState("");

  const [collabStartDateDropOpen, setCollabStartDateDropOpen] = useState("");
  const [collabendDateDropOpen, setCollabEndDateDropOpen] = useState("");
  const [showSubmissionLimit, setShowSubmissionLimit] = useState(false);
  const [submissionLimit, setSubmissionLimit] = useState(0);
  const [airdropCurrency, setAirDropCurrency] = useState();
  const [yaasLimitFee, setyaasLimitFee] = useState(5);

  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [dateSelectionFor, setDateSelectionFor] = useState("");
  const [isSubmissionLimit, setIsSubmissionLimit] = useState(false);

  // Time dropdown refs
  const challengeStartRef = useRef(null);
  const challengeEndRef = useRef(null);
  const airdropStartRef = useRef(null);
  const airdropEndRef = useRef(null);

  const isMobile = useMediaQuery("(min-width:350px) and (max-width:1023px");

  useEffect(() => {
    if (
      isForSell === true &&
      !(Object.keys(network).length === 0) &&
      tokens.length > 0
    ) {
      setCurrencyDropOpen(false);
      setTokenOptions(tokens);
      setIsInstantPrice(false);
      setAirDropCurrency(network?.smartContracts?.CHALLENGE_UTILITY_TOKEN);
    }
  }, [isForSell]);

  async function getBullzFees() {
    let erc1155Challenge = getNFTChallengeInstance(
      web3Object,
      "ERC1155",
      network,
      wcPopupConfig,
      dispatch
    );
    let token = await erc1155Challenge.getFeeToken();
    printLog(["token", token], 'success');    
    const erc20Exchanger = new ERC20Exchanger(web3Object, token, wcPopupConfig, dispatch);
    const decimals = await erc20Exchanger.decimals();

    if (assetType.value == 1) {
      let res = await erc1155Challenge.getBullzFees();
      setyaasLimitFee(parseFloat(divideNo(res, decimals)));
    } else if (assetType.value == 2) {
      let res = await erc1155Challenge.getTokenAirdropFee(selectedToken.address);
      setyaasLimitFee(parseInt(res));
    }
    
    if(token.toLowerCase() != network?.smartContracts.CHALLENGE_UTILITY_TOKEN.address.toLowerCase()) {
      network.smartContracts.CHALLENGE_UTILITY_TOKEN.address = token;

      dispatch(setNetwork(network));
      localStorage.setItem(process.env.REACT_APP_CURRENT_NETWORK, JSON.stringify(network));
    }
  }

  const handleSubmissionLimitCkeckbox = (checked) => {
    if (!checked) {
      setSubmissionLimit(0);
    }
    setIsSubmissionLimit(checked);
  }

  async function _getBaseCurrencyPrice() {
    const price = await getBaseCurrencyPrice(network);
    setBaseCurrencyPrice(price);
  }

  useEffect(() => {
    _getBaseCurrencyPrice();
    scrollToTop();
  }, []);

  useEffect(() => {
    if (collectibleTypeName === "nft_challenge") {
      getBullzFees();
    }
  }, []);

  useEffect(() => {
    if (callCreate) {
      setCallCreate(false);
      handleMintToken();
    }
  }, [callCreate]);

  useEffect(() => {
    if (
      isInstantPrice === true &&
      !(Object.keys(network).length === 0) &&
      tokens.length > 0
    ) {
      setCurrencyDropOpen(false);
      setTokenOptions(tokens);
      setSelectedCurreny(tokens[0].currencyKey);
      setIsForSell(false);
    }
  }, [isInstantPrice]);

  const handleDropDown1 = (name, comingFor = "auction") => {
    setCurrencyDropOpen(!currencyDropOpen);
    setSelectedCurreny(name);
  };


  const handleStartDateDropDown = (name) => {
    const date = new Date();
    date.setDate(date.getDate() + name.key);
    date.setMinutes(date.getMinutes() + 1);
    if (isValidDuration(date, auctionDuration)) {


      setAuctionStartDuration(date);
      setAuctionStartDurationText(name.value)
    } else {
      showTimeError();
    }
    setStartDateDropOpen(!startDateDropOpen);
  };

  const showTimeError = () => {
    enqueueSnackbar(`Auction duration must be between ${process.env.REACT_APP_AUCTION_MINIMUM_DURATION} and ${process.env.REACT_APP_AUCTION_MAXIMUM_DURATION} days.`, {
      ...notificationConfig,
      variant: "error",
    });
  }
  const handleEndDateDropDown = (name) => {
    const date = new Date();
    date.setDate(date.getDate() + name.key);
    date.setMinutes(date.getMinutes() + 1);
    if (isValidDuration(auctionStartDuration, date)) {
      setAuctionDuration(date);
      setAuctionDurationText(name.value);
    } else {
      showTimeError();
    }
    setEndDateDropOpen(!endDateDropOpen);
  };

  const c_handleStartDateDropDown = (name) => {
    const date = new Date(auctionDuration);
    date.setDate(date.getDate() + name.key);
    date.setMinutes(date.getMinutes() + 1);
    setCollStartDate(date);
    setCollStartDateText(name.value);
    setCollabStartDateDropOpen(!collabStartDateDropOpen);
  };

  const c_handleEndDateDropDown = (name) => {
    const date = new Date(auctionDuration);
    date.setDate(date.getDate() + name.key);
    date.setMinutes(date.getMinutes() + 1);
    setCollEndDate(date);
    setCollEndDateText(name.value);
    setCollabEndDateDropOpen(!collabendDateDropOpen);
  };

  const onNumberFieldChange = (e) => {
    let reForDecimalNo = /^\d*\.?\d*$/;
    if (reForDecimalNo.test(e.target.value)) {
      if (e.target.name === "auctionPrice") {
        setAuctionPrice(e.target.value);
      }
      if (e.target.name === "instantPrice") {
        setInstantPrice(e.target.value);
      }
      if (e.target.name === "loyaltyPercentage") {        
        setLoyaltyPercentage(e.target.value);
      }

      if (e.target.name === "winnerCount") {   
        handleChange("winnerCount", e.target.value);        
      }

      if (e.target.name === "tokenAmount") {        
        handleChange("tokenAmount", e.target.value);
      }
    }
  };

  if (document.getElementById("inputField1")) {
    document.getElementById("inputField1").style.color = "white";
    document.getElementById("inputField1").style.textDecoration = "none";
    document.getElementById("inputField1").style.fontSize = "0.75rem";
  }
  if (document.getElementById("datetime-local-end")) {
    document.getElementById("datetime-local-end").style.color = "white";
    document.getElementById("datetime-local-end").style.textDecoration = "none";
    document.getElementById("datetime-local-end").style.fontSize = "0.75rem";

  }

  if (document.getElementById("datetime-local-start")) {
    document.getElementById("datetime-local-start").style.color = "white";
    document.getElementById("datetime-local-start").style.textDecoration = "none";
    document.getElementById("datetime-local-start").style.fontSize = "0.75rem";
  }

  if (document.getElementById("inputField2")) {
    document.getElementById("inputField2").style.color = "white";
    document.getElementById("inputField2").style.textDecoration = "none";
    document.getElementById("inputField2").style.fontSize = "0.75rem";
  }

  if (document.getElementById("inputField_Start")) {
    document.getElementById("inputField_Start").style.color = "white";
    document.getElementById("inputField_Start").style.textDecoration = "none";
    document.getElementById("inputField_Start").style.fontSize = "0.75rem";
  }

  if (document.getElementById("inputField_End")) {
    document.getElementById("inputField_End").style.color = "white";
    document.getElementById("inputField_End").style.textDecoration = "none";
    document.getElementById("inputField_End").style.fontSize = "0.75rem";
  }

  if (document.getElementById("inputField3")) {
    document.getElementById("inputField3").style.color = "white";
    document.getElementById("inputField3").style.textDecoration = "none";
    document.getElementById("inputField3").style.fontSize = "0.75rem";
  }


  const handleMintToken = async () => {
    if (selectedCurreny && collectibleType.type !== "nft_challenge") {
      const result = await verifyPrice(selectedCurreny, isInstantPrice ? auctionPrice : instantPrice, network);
      if (!result.verified) {
        enqueueSnackbar(`
          Price should be bigger than $${process.env.REACT_APP_MIN_AMOUNT} USD (${result.minValue} ${result.currentCurrency})`, {
          ...notificationConfig,
          variant: "error",
        });
        return;
      }
    }
    if (form.nftSupply === "" || parseInt(form.nftSupply) <= 0) {
      enqueueSnackbar("Enter valid nft supply", {
        ...notificationConfig,
        variant: "error",
      });
      return;
    }
    if (isForSell && !validateInput(instantPrice)) {
      enqueueSnackbar("Invalid Price", {
        ...notificationConfig,
        variant: "error",
      });
      return;
    }

    if (isSubmissionLimit && submissionLimit < 1) {
      enqueueSnackbar("Minimum submission limit is 1.", {
        ...notificationConfig,
        variant: "error",
      });
      return;
    }

    if (
      isInstantPrice &&
      (!validateInput(auctionPrice) ||
        auctionDuration === null ||
        auctionStartDuration === null)
    ) {
      enqueueSnackbar("Invalid price or empty sale start/end time", {
        ...notificationConfig,
        variant: "error",
      });
      return;
    } else if (
      isInstantPrice &&
      auctionStartDuration &&
      auctionDuration &&
      auctionDuration.getTime() <= auctionStartDuration.getTime()
    ) {
      enqueueSnackbar(
        "In time details, start time must be less than end time.",
        {
          ...notificationConfig,
          variant: "error",
        }
      );
      return;
    } else if (
      isInstantPrice &&
      auctionStartDuration &&
      auctionDuration &&
      auctionDuration.getTime() > (auctionStartDuration.getTime() + 7776000000)
    ) {
      enqueueSnackbar(
        "End time can't be more than 90days than start date.",
        {
          ...notificationConfig,
          variant: "error",
        }
      );
      return;
    } 
    else if (
      (resaleAllowed && loyaltyPercentage && parseFloat(loyaltyPercentage) > process.env.REACT_APP_MAX_RESALE_PERCENT)
    ) {
      enqueueSnackbar(`Resale royalties must be lower or equal to ${process.env.REACT_APP_MAX_RESALE_PERCENT}%`, {
        ...notificationConfig,
        variant: "error",
      });
      return;
    } 
    else if (
      (collStartDate && !collEndDate) ||
      (!collStartDate && collEndDate)
    ) {
      enqueueSnackbar("Time details must have both start and end time.", {
        ...notificationConfig,
        variant: "error",
      });
      return;
    } else if (
      isInstantPrice &&
      collStartDate &&
      auctionDuration &&
      collStartDate.getTime() <= auctionDuration.getTime()
    ) {
      enqueueSnackbar(
        "Sale end time must be less than both collaboration start and end time.",
        {
          ...notificationConfig,
          variant: "error",
        }
      );
      return;
    } else if (
      collectibleType.type === "nft_challenge" &&
      (!collStartDate || !collEndDate)
    ) {
      enqueueSnackbar(
        "Please fill out the challenge and airdrop deadlines to continue.",
        {
          ...notificationConfig,
          variant: "error",
        }
      );
      return;
    } else if (collectibleType.type === "nft_challenge" && (!auctionStartDuration || !auctionDuration)) {
      enqueueSnackbar("Please fill out the challenge and airdrop deadlines to continue.", {
        ...notificationConfig,
        variant: "error",
      });
      return;
    } else if (
      collectibleType.type === "nft_challenge" &&
      collStartDate &&
      auctionDuration &&
      collStartDate.getTime() <= auctionDuration.getTime()
    ) {
      enqueueSnackbar(
        "Sale end time must be less than both airdrop start and end time.",
        {
          ...notificationConfig,
          variant: "error",
        }
      );
      return;
    } else if (
      collEndDate &&
      collStartDate &&
      collEndDate.getTime() <= collStartDate.getTime()
    ) {
      enqueueSnackbar(
        "In time details, start time must be less than end time.",
        {
          ...notificationConfig,
          variant: "error",
        }
      );
      return;
    }

    else if (isForSell && parseFloat(instantPrice) < 0.01) {
      enqueueSnackbar("NFT can not be put on sale with price below 0.01", {
        ...notificationConfig,
        variant: "error",
      });
      return;
    }
    if (collectibleTypeName === "nft_challenge") {
      let startTime = parseInt(new Date(auctionStartDuration).getTime() / 1000);
      let endTime = parseInt(new Date(auctionDuration).getTime() / 1000);
      let dropSTime = parseInt(new Date(collStartDate).getTime() / 1000);
      let dropETime = parseInt(new Date(collEndDate).getTime() / 1000);

      const airdropFee = yaasLimitFee;
      //* submissionLimit;
      props.addChallange({
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
      });
    } else {
      mintToken({
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
      });
    }
  };

  const checkFields = () => {
    if (((assetType.value == 1 && form.nftSupply > 0) || (assetType.value == 2 && form.winnerCount > 0 && form.tokenAmount > 0)) && auctionDuration && auctionStartDuration && collStartDate && collEndDate && (!isSubmissionLimit || (isSubmissionLimit && submissionLimit > 0) )) {
      setFieldsCompleted(true);
    } else {
      setFieldsCompleted(false);
    }
  }

  function handleResaleOn() {
    if (resaleAllowed) {
      setReSaleDropOpen(false);
      setLoyaltyPercentage(0);
    }
    setResaleAllowed(!resaleAllowed);

  }

  const submissionLimitHandler = (limit) => {

    limit = Number(limit);
    // if (1 > limit) {
    //   enqueueSnackbar(
    //     "Submission limit must be greater than or equal to 1",
    //     {
    //       ...notificationConfig,
    //       variant: "error",
    //     }
    //   );
    // } else {
    setSubmissionLimit(limit);
    // }
  };

  const minuesLimitCounter = () => {
    if (submissionLimit > 0) {
      submissionLimitHandler(submissionLimit - 1);
    }
  };

  const isValidDuration = (startDate, endDate) => {
    return true; //TODO remove this line after chaecking completed

    if (!startDate || !endDate) {
      return true;
    }
    const duration = endDate.getTime() - startDate.getTime();
    const minDuration = process.env.REACT_APP_AUCTION_MINIMUM_DURATION * 24 * 60 * 60 * 1000
    const maxDuration = process.env.REACT_APP_AUCTION_MAXIMUM_DURATION * 24 * 60 * 60 * 1000
    const result = duration >= minDuration && duration <= maxDuration;
    return result;
  }

  const plusLimitCounter = () => {
    submissionLimitHandler(submissionLimit + 1);
  };
  const checkForSell = (isForSell) => {
    const current_token_key = !isForSell ? network.nativeCurrency.symbol : tokens[0].currencyKey;
    setSelectedCurreny(current_token_key)
    setIsForSell(!isForSell);
  }
  const changeNFTSupply = (e) => {
    const re = /(^[0-9]+$|^$|^\s$)/;
    if (
      re.test(e.target.value) &&
      (e.target.value > "0" || e.target.value === "")
    ) {
      handleChange("nftSupply", e.target.value);
    }
  };

  const handleDateDialog = (name) => {
    setDateDialogOpen(true);
    setDateSelectionFor(name);
  };

  const handleConfirmDate = (date) => {
    if (date) {
      if (new Date(date).getTime() < new Date().getTime()) {
        enqueueSnackbar(
          "Date/Time must be greater than the current Date/Time.",
          {
            ...notificationConfig,
            variant: "error",
          }
        );
        return
      }
      if (dateSelectionFor === "auctionStartDuration") {
        date.setMinutes(date.getMinutes() + 1);
        if (isValidDuration(date, auctionDuration)) {
          setAuctionStartDuration(date);
          setAuctionStartDurationText(date.toLocaleString())
        } else {
          showTimeError();
        }
        setStartDateDropOpen(false);
      } else if (dateSelectionFor === "auctionDuration") {
        date.setMinutes(date.getMinutes() + 1);
        if (isValidDuration(auctionStartDuration, date)) {
          setAuctionDuration(date);
          setAuctionDurationText(date.toLocaleString());
        } else {
          showTimeError();
        }
        setEndDateDropOpen(false);
      } else if (dateSelectionFor === "collStartDate") {
        date.setMinutes(date.getMinutes() + 1);
        setCollStartDate(date);
        setCollStartDateText(date.toLocaleString())
        setCollabStartDateDropOpen(false);
      } else if (dateSelectionFor === "collEndDate") {
        date.setMinutes(date.getMinutes() + 1);
        setCollEndDate(date);
        setCollEndDateText(date.toLocaleString());
        setCollabEndDateDropOpen(false);
      }
      setDateDialogOpen(false);
    }
  };

  const onOutsideDateDropdownClick = (e) => {
    if (!challengeStartRef.current.contains(e.target)) {
      setStartDateDropOpen("")
    }
    if (!challengeEndRef.current.contains(e.target)) {
      setEndDateDropOpen("")
    }
    if (!airdropStartRef.current.contains(e.target)) {
      setCollabStartDateDropOpen("")
    }
    if (!airdropEndRef.current.contains(e.target)) {
      setCollabEndDateDropOpen("")
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', onOutsideDateDropdownClick);
    return () => document.removeEventListener('mousedown', onOutsideDateDropdownClick);
  });

  return (
    <React.Fragment>
      <div className="create-step5">
        {checkFields()}
        <div className="d-flex align-items-center mb-3">
          <KeyboardBackspaceIcon
            onClick={goPreviousStep}
            style={{ color: "#FFFFFF", cursor: "pointer" }}
          />
            <span className="step-lead">Step {step - 2} of {assetType.creationStep}</span>          
        </div>

        <p className="collectible-title mt-2" style={{ marginBottom: isMobile ? 25 : 39 }}>
          Final Details
        </p>
        <div className="upload-section">
          <div className="detail-panel">
            {assetType.value == 1 && collectible.name === "Multiple" && (
              <div className="price-card">
                <div className="card-detail">
                  <p className="detail-title mt-0">
                      Number of NFTs
                  </p>
                  <div className="detail-wrapper">
                    <p className="detail-lead mb-2 op-100 text-white">
                      Set number of NFTs to be airdropped
                      <CustomTooltip title={"This limits the amount of winners who can receive an NFT."} placement="top-start">
                        <svg style={{ marginLeft: 8 }} width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12Z" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M6.5 8.7V6.5" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M6.5 4.30078H6.5055" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                      </CustomTooltip>
                    </p>
                    <div className="card-actions">
                      <div className="d-flex justify-content-center align-items-center">

                        <input
                          className="price-unit text-center ml-0 long-input"
                          value={form.nftSupply}
                          onChange={changeNFTSupply}
                          placeholder={"No of copies."}
                          defaultValue="1"
                          style={{ width: 97 }}
                        />
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* Challenge Rewards */}
            {assetType.value == 2 && (
              <div className="price-card">
                <div className="card-detail">
                  <p className="detail-title mt-0">
                    Challenge Rewards
                  </p>
                  <div className="detail-wrapper">
                    <p className="detail-lead mb-2 op-100 text-white">
                      Set number of winners
                      <CustomTooltip title={"This limits the amount of winners who can receive a token airdrop."} placement="top-start">
                        <svg style={{ marginLeft: 8 }} width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12Z" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M6.5 8.7V6.5" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M6.5 4.30078H6.5055" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                      </CustomTooltip>
                    </p>
                    <div className="card-actions">
                      <div className="d-flex justify-content-center align-items-center">

                        <input
                          className="price-unit text-center ml-0 long-input"
                          value={form.winnerCount}
                          name={"winnerCount"}
                          onChange={onNumberFieldChange}
                          placeholder={"No of winners."}
                          style={{ width: 97 }}
                          defaultValue="1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="detail-wrapper">
                    <p className="detail-lead mb-2 op-100 text-white">
                      Set the token airdrop amount per winner
                      <CustomTooltip title={"This is the amount of tokens a winner will receive in the airdrop."} placement="top-start">
                        <svg style={{ marginLeft: 8 }} width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12Z" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M6.5 8.7V6.5" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M6.5 4.30078H6.5055" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                      </CustomTooltip>
                    </p>
                    <div className="card-actions">
                      <div className="d-flex justify-content-center align-items-center">

                        <input
                          className="price-unit text-center ml-0 long-input"
                          value={form.tokenAmount}
                          name={"tokenAmount"}
                          onChange={onNumberFieldChange}
                          placeholder={"Token amount"}                          
                          style={{ width: 97 }}
                          defaultValue="1"
                        />
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* nft_challenge */}
            {collectibleTypeName === "nft_challenge" && (
              <div className="price-card">
                <div className="card-detail mb-4">
                  <div className="detail-airdrop-wrapper justify-content-between align-items-center card-actions">
                    <div className="inner-wrapper">
                      <p className="detail-lead mt-0 op-100">
                        Airdrop Fee
                        <CustomTooltip title={"To process the airdrops, BULLZ requires a fee. Please ensure you have enough funds to launch your NFT challenge."} placement="top-start">
                          <svg style={{ marginLeft: 8 }} width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12Z" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M6.5 8.7V6.5" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M6.5 4.30078H6.5055" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>

                        </CustomTooltip>
                      </p>
                      <p className="detail-lead op-100">


                        {/* <svg style={{ marginRight: 4 }} width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.22217 5.62891L5.02764 1.04688L7.83311 5.62891L5.02764 7.26328L2.22217 5.62891Z" fill="white" />
                          <path d="M5.02773 7.77822L7.74336 6.09229L5.02773 9.95322L2.24805 6.09229L5.02773 7.77822Z" fill="white" />
                        </svg> */}
                        {/* <img src={airdropCurrency?.logo} alt="" /> */}

                        {assetType.value == 1 ? (yaasLimitFee * parseInt(form.nftSupply)) : ((yaasLimitFee * parseFloat(form.tokenAmount) * parseInt(form.winnerCount)) / 100) }
                      </p>
                    </div>
                    <div className="ntf-type dropdown-item short-input">
                      <div
                        className="dropdown-content justify-content-center"
                        style={{ paddingLeft: 12 }}
                      >
                        <p className="dropdown-lead" style={{ marginRight: 0 }}>
                          {assetType.value == 1 ? airdropCurrency?.symbol : selectedToken.symbol}
                        </p>

                      </div>
                      {/* <div
                        className={`dropdown-card ntf-type ${currencyDropOpen ? "open" : ""
                          }`}
                      >
                        {tokenOptions.map((item, index) => (
                          <div
                            className="ntf-dropdown-item"
                            key={index}
                            onClick={() =>
                              handleDropDown1(item.currencyKey, "auction")
                            }
                          >
                            <p className="primary-lead">{item.currencyKey}</p>
                            <img
                              src={item.image}
                              alt="Collectible Icon"
                            />
                          </div>
                        ))}
                      </div> */}
                    </div>
                  </div>

                </div>
              </div>
            )}

           
            {collectibleType &&
              collectibleType.type &&
              resaleConfig[collectibleTypeName].resale && (
                <div className="price-card">
                  {/* Submission Limit */}
                  <div className="card-detail mb-3">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checkedIcon={<svg className="checkbox-checked-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                            <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          }
                          checked={isSubmissionLimit} onChange={event => {
                            handleSubmissionLimitCkeckbox(event.target.checked);
                          }} name="isSubmissionLimit" />
                      }
                      label="Submission Limit (optional)"
                    />
                    <div className="checkbox-bottom-content">
                      <p className={`detail-lead mb-2`} style={{color: '#A0A0A0', opacity:  1}}>
                        Limit the number of people who can submit
                      </p>
                      <div className="d-flex align-items-center">
                        {isSubmissionLimit && (
                          <div className="d-flex align-items-center">
                            <input
                              value={submissionLimit}
                              className="price-unit text-center short-input"
                              name={"submissionLimit"}
                              onChange={(e) => submissionLimitHandler(e.target.value)}
                              disabled={!isSubmissionLimit}
                            />
                          </div>
                        )}
                      </div>
                    </div>



                  </div>
                  
                  {/* Resale NFT */}
                  {assetType.value == 1 && collectible.key != "existing" && <>
                  <div className="card-detail">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checkedIcon={<svg className="checkbox-checked-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                            <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          }
                          checked={resaleAllowed} onChange={event => {
                            setResaleAllowed(event.target.checked);
                            if (!event.target.checked) {
                              setLoyaltyPercentage(0);
                            }
                          }} name="resaleAllowed" />
                      }
                      label={resaleConfig[collectibleTypeName].heading}
                    />
                    <div className="checkbox-bottom-content">
                      <p className={`detail-lead mb-2`} style={{color: '#A0A0A0', opacity:  1}}>
                        {resaleConfig[collectibleTypeName].description}
                      </p>
                      <div className="d-flex align-items-center">
                        {resaleAllowed && (
                          <div className="d-flex align-items-center">
                            <input
                              value={loyaltyPercentage}
                              className="price-unit text-center short-input"
                              name={"loyaltyPercentage"}
                              onChange={onNumberFieldChange}
                              disabled={!resaleAllowed}
                            />
                            <p className="percentage-txt">%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div> 
                  <div className="card-actions">
                  </div>
                  </>}
                  
                </div>
              )}

            {collectibleTypeName !== "nft_challenge" && (
              <label className="detail-subtitle ml-3">Price Details</label>
            )}

            {/* Fixed Price */}
            {collectibleTypeName !== "nft_challenge" ? (
              <div className="price-card">
                <div className="card-detail">
                  <p className="detail-title">Fixed Price</p>
                  <p className={`detail-lead mb-0 ${isForSell ? "op-100" : ""}`}>
                    Enter the price for which the item will be instantly sold
                  </p>
                  {isForSell && (
                    <>
                      <p
                        className={`detail-lead mt-3 ${isForSell ? "op-100" : ""}`}
                        style={{ marginBottom: 5 }}
                      >
                        Service fee
                        <strong
                          className="text-white"
                          style={{ marginLeft: 6, marginRight: 6, opacity: 1 }}
                        >
                          {shares[collectibleTypeName]}%
                        </strong>
                      </p>
                      <p className={`detail-lead ${isForSell ? "op-100" : ""}`}>
                        You will receive
                        <strong
                          className="text-white"
                          style={{ marginLeft: 6, marginRight: 6, opacity: 1 }}
                        >
                          {instantPrice ? instantPrice : 0} {selectedCurreny}
                        </strong>
                        $
                        {instantPrice &&
                          (
                            parseFloat(instantPrice) * parseFloat(baseCurrencyPrice)
                          ).toFixed(3)}
                      </p>
                    </>
                  )}
                </div>
                <div className="card-actions">
                  <div
                    className={`custom-switch-2 ${isForSell ? "active" : ""}`}
                    onClick={() => checkForSell(isForSell)}
                  >
                    <div className="d-flex justify-content-center flex-fill toggle-nav nav-left">
                      No
                    </div>
                    <div className="d-flex justify-content-center flex-fill toggle-nav nav-right">
                      Yes
                    </div>
                    <div className="toggle-bar" />
                  </div>
                  {isForSell && (
                    <div className="d-flex justify-content-center align-items-center">
                      <input
                        value={instantPrice}
                        className="price-unit text-center"
                        name={"instantPrice"}
                        onChange={onNumberFieldChange}
                      />

                      <div className="ntf-type dropdown-item">
                        <div
                          className="dropdown-content justify-content-center"
                          style={{ paddingLeft: 12 }}
                        >
                          <p className="dropdown-lead">{selectedCurreny}</p>
                        </div>
                        <div
                          className={`dropdown-card ntf-type ${currencyDropOpen ? "open" : ""
                            }`}
                        >
                          {tokenOptions.map((item, index) => (
                            <div
                              className="ntf-dropdown-item"
                              key={index}
                              onClick={() =>
                                handleDropDown1(item.currencyKey, "sell")
                              }
                            >
                              <p className="primary-lead">{item.currencyKey}</p>
                              <img
                                src={`${item.image}`}
                                alt="Collectible Icon"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Put on Auction */}
            {collectibleTypeName !== "nft_challenge" && (
              <div className="price-card">
                <div className="card-detail">
                  <p className="detail-title">Put on Auction</p>
                  <p className={`detail-lead ${isInstantPrice ? "op-100" : ""}`}>
                    Select minimum sale price. Bids below this amount
                    <br /> won’t be allowed.
                  </p>
                </div>
                <div className="card-actions">
                  <div
                    className={`custom-switch-2 ${isInstantPrice ? "active" : ""
                      }`}
                    onClick={() => setIsInstantPrice(!isInstantPrice)}
                  >
                    <div className="d-flex justify-content-center flex-fill toggle-nav nav-left">
                      No
                    </div>
                    <div className="d-flex justify-content-center flex-fill toggle-nav nav-right">
                      Yes
                    </div>
                    <div className="toggle-bar" />
                  </div>
                  {isInstantPrice && (
                    <>
                      <div className="d-flex align-items-center">
                        <input
                          type="number"
                          value={auctionPrice}
                          className="price-unit text-center"
                          onChange={(e) => setAuctionPrice(e.target.value)}
                        />

                        <div className="ntf-type dropdown-item">
                          <div
                            className="dropdown-content"
                            onClick={() =>
                              setCurrencyDropOpen(!currencyDropOpen)
                            }
                          >
                            <p className="dropdown-lead">{selectedCurreny}</p>
                            <svg
                              width="10"
                              height="6"
                              viewBox="0 0 10 6"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.24137 2.829L8.06938 -6.18516e-08L9.48437 1.414L5.24137 5.657L0.998375 1.414L2.41337 -3.09083e-07L5.24137 2.829Z"
                                fill="white"
                                fill-opacity="0.33"
                              />
                            </svg>
                          </div>
                          <div
                            className={`dropdown-card ntf-type ${currencyDropOpen ? "open" : ""
                              }`}
                          >
                            {tokenOptions.map((item, index) => (
                              <div
                                className="ntf-dropdown-item"
                                key={index}
                                onClick={() =>
                                  handleDropDown1(item.currencyKey, "auction")
                                }
                              >
                                <p className="primary-lead">
                                  {item.currencyKey}
                                </p>
                                <img
                                  src={`${item.image}`}
                                  alt="Collectible Icon"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {isInstantPrice &&
              (collectibleTypeName === "art" ||
                collectibleTypeName === "exclusive_content" ||
                collectibleTypeName === "event_tickets" ||
                collectibleTypeName === "merchandise") && (
                <p className="text-white ml-3">Time Details</p>
              )}
            {/* {(collectibleTypeName === "tiktok_duet" ||
              collectibleTypeName === "tiktok_collab" ||
              collectibleTypeName === "nft_challenge" ||
              collectibleTypeName === "music_promo") && (
              <p className="text-white ml-3">NFT Challenge deadline</p>
            )} */}

            {(isInstantPrice || collectibleTypeName === "nft_challenge") && (
              <div
                className="price-card"
                style={{
                  justifyContent: "flex-start",
                  flexDirection: "column",
                }}
              >
                {collectibleTypeName === "nft_challenge" ? (
                  <p className="detail-title">Challenge deadline</p>
                ) : (
                  <p className="text-white">Auction deadline</p>
                )}


                <div className="dead-line-item">
                  <p className="dead-line-lead">
                    {collectibleTypeName === "nft_challenge"
                      ? "Challenge Starts"
                      : "Sale Starts"}
                  </p>
                  <div className="picker-group align-items-center card-actions">
                    {/* <p className="dead-line-lead-to">Sale Starts</p> */}
                    <div className="ntf-type dropdown-item card-actions">
                      <div
                        className="dropdown-content auction-deadline-dropdown"
                        onClick={() =>
                          setStartDateDropOpen(!startDateDropOpen)
                        }
                      >
                        <p style={{ color: "white", width: "100%", fontfontSize: '0.75rem' }}
                          className="dropdown-lead">{auctionStartDurationText}</p>
                        {/* <MuiPickersUtilsProvider
                          utils={DateFnsUtils}
                          style={{ color: "white", width: "100%" }}
                          className="dropdown-item"
                        >
                          <DateTimePicker
                            id="inputField1"
                            label=""
                            value={auctionStartDurationText}
                            name="auctionStartDuration"
                            className="dropdown-lead"
                            InputProps={{ disableUnderline: true }}
                            disabled={true}
                            format="yyyy/MM/dd hh:mm a"
                          />
                        </MuiPickersUtilsProvider> */}
                        <ArrowDropDown />
                        {/* <svg
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.24137 2.829L8.06938 -6.18516e-08L9.48437 1.414L5.24137 5.657L0.998375 1.414L2.41337 -3.09083e-07L5.24137 2.829Z"
                            fill="white"
                            fill-opacity="0.33"
                          />
                        </svg> */}
                      </div>
                      <div
                        className={`dropdown-card time-deadline ${startDateDropOpen ? "open" : ""
                          }`}
                        ref={challengeStartRef}
                      >
                        {/* <p className="card-title">Starting Date of Auction</p> */}

                        {start_date_option.map((item, index) => (
                          <div
                            className="ntf-dropdown-item"
                            key={index}
                            onClick={() =>
                              handleStartDateDropDown(item, "startDate")
                            }
                          >
                            <p className="primary-lead">{item.value}</p>
                          </div>
                        ))}
                        <div
                          className="ntf-dropdown-item"
                          onClick={() =>
                            handleDateDialog("auctionStartDuration")
                          }
                        >
                          <p className="primary-lead">Select Specific Time</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="dead-line-item">
                  <p className="dead-line-lead">
                    {collectibleTypeName === "nft_challenge"
                      ? "Challenge Ends"
                      : "Sale Ends"}
                  </p>

                  <div className="picker-group align-items-center card-actions">
                    {/* <p className="dead-line-lead-to">
                      {isInstantPrice ? "Sale Ends" : "Challenge Ends"}
                    </p> */}
                    <div className="ntf-type dropdown-item ">
                      <div
                        className="dropdown-content auction-deadline-dropdown"
                        onClick={() => {
                          if (!auctionStartDurationText) {
                            enqueueSnackbar("Select challenge start time first.", {
                              ...notificationConfig,
                              variant: "error",
                            });
                          } else {
                            setEndDateDropOpen(!endDateDropOpen)
                          }
                        }
                        }
                      >
                        <p style={{ color: "white", width: "100%", fontfontSize: '0.75rem' }}
                          className="dropdown-lead">{auctionDurationText}</p>
                        {/* <MuiPickersUtilsProvider
                          utils={DateFnsUtils}
                          style={{ color: "black", width: "100%" }}
                          className="dropdown-item"
                        >
                          <DateTimePicker
                            id="inputField2"
                            label=""
                            value={auctionDurationText}
                            name="auctionDuration"
                            className="dropdown-lead"
                            InputProps={{ disableUnderline: true }}
                            disabled={true}
                            format="yyyy/MM/dd hh:mm a"
                          />
                        </MuiPickersUtilsProvider> */}
                        <ArrowDropDown />
                        {/* <svg
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.24137 2.829L8.06938 -6.18516e-08L9.48437 1.414L5.24137 5.657L0.998375 1.414L2.41337 -3.09083e-07L5.24137 2.829Z"
                            fill="white"
                            fill-opacity="0.33"
                          />
                        </svg> */}
                      </div>
                      <div
                        className={`dropdown-card time-deadline ${endDateDropOpen ? "open" : ""
                          }`}
                        ref={challengeEndRef}
                      >
                        {end_date_option.map((item, index) => (
                          <div
                            className="ntf-dropdown-item"
                            key={index}
                            onClick={(value) =>
                              handleEndDateDropDown(item, "endDate")
                            }
                          >
                            <p className="primary-lead">{item.value}</p>
                          </div>
                        ))}
                        <div
                          className="ntf-dropdown-item"
                          onClick={() => handleDateDialog("auctionDuration")}
                        >
                          <p className="primary-lead"> Select Specific Time</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(collectibleTypeName === "tiktok_duet" ||
              collectibleTypeName === "tiktok_collab" ||
              collectibleTypeName === "nft_challenge" ||
              collectibleTypeName === "music_promo") && (
                <>
                  <div
                    className="price-card"
                    style={{
                      justifyContent: "flex-start",
                      flexDirection: "column",
                    }}
                  >
                    <p className="detail-title">
                      {collectibleTypeName === "nft_challenge"
                        ? "Airdrop Distribution"
                        : "Collaboration"}{" "}
                      deadline
                    </p>

                    <div className="dead-line-item">
                      <p className="dead-line-lead">
                        {collectibleTypeName === "nft_challenge"
                          ? "Airdrop"
                          : "Collab"}{" "}
                        Starts
                      </p>
                      <div className="picker-group align-items-center card-actions">
                        <div className="ntf-type dropdown-item card-actions">
                          <div
                            className="dropdown-content auction-deadline-dropdown"
                            onClick={() => {
                                if (!auctionStartDurationText || !auctionDurationText) {
                                  enqueueSnackbar("Select challenge deadline first.", {
                                    ...notificationConfig,
                                    variant: "error",
                                  });
                                } else {
                                  setCollabStartDateDropOpen(!collabStartDateDropOpen)
                                }
                              }
                            }
                          >
                            <p style={{ color: "white", width: "100%", fontfontSize: '0.75rem' }}
                              className="dropdown-lead">{collStartDateText}</p>
                            {/* <MuiPickersUtilsProvider
                              utils={DateFnsUtils}
                              style={{ color: "white", width: "100%" }}
                              className="dropdown-item"
                            >
                              <DateTimePicker
                                id="inputField_Start"
                                label=""
                                value={collStartDateText}
                                name="collStartDate"
                                className="dropdown-lead Ending Date of "
                                InputProps={{ disableUnderline: true }}
                                disabled={true}
                                format="yyyy/MM/dd hh:mm a"
                              />
                            </MuiPickersUtilsProvider> */}
                            <ArrowDropDown />
                            {/* <svg
                              width="10"
                              height="6"
                              viewBox="0 0 10 6"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.24137 2.829L8.06938 -6.18516e-08L9.48437 1.414L5.24137 5.657L0.998375 1.414L2.41337 -3.09083e-07L5.24137 2.829Z"
                                fill="white"
                                fill-opacity="0.33"
                              />
                            </svg> */}
                          </div>
                          <div
                            className={`dropdown-card time-deadline ${collabStartDateDropOpen ? "open" : ""
                              }`}
                            ref={airdropStartRef}
                          >
                            {/* <p className="card-title">
                              Starting Date of{" "}
                              {collectibleTypeName === "nft_challenge"
                                ? "airdrop"
                                : "Collaboration"}
                            </p> */}
                            {/* {resaleAllowed && ( */}
                            {/* <p className="card-title">
                              Please choose a date after
                              <br /> sale time
                            </p> */}
                            {/* )} */}
                            {airdrop_start_date_option.map((item, index) => (
                              <div
                                className="ntf-dropdown-item"
                                key={index}
                                onClick={() => c_handleStartDateDropDown(item)}
                              >
                                <p className="primary-lead">{item.value}</p>
                              </div>
                            ))}
                            <div
                              className="ntf-dropdown-item"
                              onClick={() => handleDateDialog("collStartDate")}
                            >
                              <p className="primary-lead">
                                {" "}
                                Select Specific Time
                              </p>
                            </div>
                            {/* <div className="ntf-dropdown-item customDropDownDate">
                            <TextField
                              hiddenLabel
                              size="small"
                              onChange={(e) => {
                                setCollStartDate(new Date(e.target.value));
                              }}
                              id="datetime-local-start"
                              type="datetime-local"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{ disableUnderline: true }}
                              className="primary-lead"
                            />
                          </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* )} */}
                    <div className="dead-line-item">
                      <p className="dead-line-lead">
                        {collectibleTypeName === "nft_challenge"
                          ? "Airdrop"
                          : "Collab"}{" "}
                        Ends
                      </p>

                      <div className="picker-group align-items-center card-actions">
                        <div className="ntf-type dropdown-item ">
                          <div
                            className="dropdown-content auction-deadline-dropdown"
                            onClick={() => {
                              if (!collStartDateText) {
                                enqueueSnackbar("Select airdrop start time first.", {
                                  ...notificationConfig,
                                  variant: "error",
                                });
                              } else {
                                setCollabEndDateDropOpen(!collabendDateDropOpen)
                              }
                            }}
                          >
                            <p style={{ color: "white", width: "100%", fontfontSize: '0.75rem' }}
                              className="dropdown-lead">{collEndDateText}</p>
                            {/* <MuiPickersUtilsProvider
                              utils={DateFnsUtils}
                              style={{ color: "black", width: "100%" }}
                              className="dropdown-item"
                            >
                              <DateTimePicker
                                id="inputField_End"
                                label=""
                                value={collEndDateText}
                                name="collEndDate"
                                className="dropdown-lead text-white"
                                InputProps={{ disableUnderline: true }}
                                disabled={true}
                                format="yyyy/MM/dd hh:mm a"
                              />
                            </MuiPickersUtilsProvider> */}
                            <ArrowDropDown />
                            {/* <svg
                              width="10"
                              height="6"
                              viewBox="0 0 10 6"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.24137 2.829L8.06938 -6.18516e-08L9.48437 1.414L5.24137 5.657L0.998375 1.414L2.41337 -3.09083e-07L5.24137 2.829Z"
                                fill="white"
                                fill-opacity="0.33"
                              />
                            </svg> */}
                          </div>
                          <div
                            className={`dropdown-card time-deadline ${collabendDateDropOpen ? "open" : ""
                              }`}
                            ref={airdropEndRef}
                          >
                            {/* <p className="card-title">
                              Ending Date of{" "}
                              {collectibleTypeName === "nft_challenge"
                                ? "airdrop"
                                : "Collaboration"}
                            </p> */}
                            {airdrop_end_date_option.map((item, index) => (
                              <div
                                className="ntf-dropdown-item"
                                key={index}
                                onClick={(value) => c_handleEndDateDropDown(item)}
                              >
                                <p className="primary-lead">{item.value}</p>
                              </div>
                            ))}
                            <div
                              className="ntf-dropdown-item"
                              onClick={() => handleDateDialog("collEndDate")}
                            >
                              <p className="primary-lead">
                                {" "}
                                Select Specific Time
                              </p>
                            </div>
                            {/* <div
                            className="ntf-dropdown-item customDropDownDate"
                            style={{ marginTop: -10 }}
                          >
                            <TextField
                              hiddenLabel
                              size="small"
                              onChange={(e) => {
                                setCollEndDate(new Date(e.target.value));
                              }}
                              id="datetime-local-end"
                              type="datetime-local"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{ disableUnderline: true }}
                              className="primary-lead"
                            />
                          </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
          </div>

          {!isMobile && (
            <PreviewNFT
              file={file}
              coverFile={coverFile}
              form={form}
              collectibleType={collectibleType}
              addMultiple={
                collectible && collectible.name === "Multiple" ? true : false
              }
              collectible={collectible}
              selectedCollection={selectedCollection}
              isInstantPrice={isInstantPrice}
              isForSell={isForSell}
              auctionPrice={auctionPrice}
              instantPrice={instantPrice}
              selectedCurreny={selectedCurreny}
              selectedNft={selectedNft}
            />
          )}

          {/* Preview modal for mobile views */}
          {/* {isMobile && (
            <Dialog
              open={isPreviewOpen}
              onClose={() => setIsPreviewOpen(false)}
              className="preview-modal"
            >
              <MuiDialogTitle className="share-modal-header">
                <IconButton
                  aria-label="close"
                  onClick={() => setIsPreviewOpen(false)}
                  className="close_button"
                >
                  <CloseIcon />
                </IconButton>
              </MuiDialogTitle>
              <DialogContent>
                <PreviewNFT
                  file={file}
                  coverFile={coverFile}
                  form={form}
                  collectibleType={collectibleType}
                  addMultiple={
                    collectible && collectible.name === "Multiple"
                      ? true
                      : false
                  }
                  collectible={collectible}
                  selectedCollection={selectedCollection}
                  isInstantPrice={isInstantPrice}
                  isForSell={isForSell}
                  auctionPrice={auctionPrice}
                  instantPrice={instantPrice}
                  selectedCurreny={selectedCurreny}
                  selectedNft={selectedNft}
                />
              </DialogContent>
            </Dialog>
          )} */}
        </div>

        {/* {isMobile ? (
          <div className="d-flex flex-column align-items-center justify-content-center">
            <button className="btn-continue" onClick={handleMintToken}>
              Create
            </button>

            <button
              className={`btn-preview ${selectedCollection ? "" : "disable"}`}
              onClick={() => setIsPreviewOpen(true)}
            >
              Preview
            </button>
          </div>
        ) : (
          <button className="btn-continue" onClick={handleMintToken}>
            Create
          </button>
        )} */}
      </div>

      {dateDialogOpen && (
        <Calender
          open={dateDialogOpen}
          onHide={setDateDialogOpen}
          onConfirm={handleConfirmDate}
        />
      )}
    </React.Fragment>
  );
};

export default React.memo(SellNFT);
