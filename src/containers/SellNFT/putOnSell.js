import DateFnsUtils from "@date-io/date-fns";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { DateTimePicker } from "@material-ui/pickers";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

import React, { useState, useEffect, useRef } from "react";

import { useSnackbar } from "notistack";

import LoadingOverlay from "react-loading-overlay";

import { Spinner } from "react-bootstrap";
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { shares } from "../../config";
import { getNFTExchangerInstance } from "../../common/exchange";
import { getNetworkByChainId, handleError, multipliedBy, validateInput } from "../../common/utils";
import { verifyPrice, getBaseCurrencyPrice, getTokenAddressByCurrency } from '../../common/validatePrice';
import { SIX_MONTHS_IN_SECONDS } from '../../constants/expireTimes';
import { useFetchTokens } from "../../data/useFetchTokens";
import { CollectionService } from "../../services/collection.service";
import { NftService } from "../../services/nft.service";
import { OfferService } from "../../services/offer.service";
import { UserService } from "../../services/user.service";
import ERC1155Minter from "../../common/ERC1155/erc1155Minter";
import ERC721Minter from "../../common/ERC721/erc721Minter";
import Calender from "../../components/Common/Calender/Calender";
import NftCard from "../../components/Common/ExploreCard/index";

import "./style.scss";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { verifyTransaction } from "common/utils";
import { TempStorageService } from "services/temp-storage.service";
import { setNetworkSwitchConfig } from "redux/actions/web3action";
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
    value: "1 Day After Sale",
  },
  {
    key: 3,
    value: "3 Day After Sale",
  },
];

const end_date_option = [
  {
    key: 1,
    value: "1 Day",
  },
  {
    key: 3,
    value: "3 Days",
  },
  {
    key: 7,
    value: "7 Days",
  },
];


const SellNFT = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const web3Object = useSelector((state) => {
    return state.web3.web3object;
  });
  const web3 = web3Object;
  const dispatch = useDispatch();
  const wcPopupConfig = useSelector((state) => state.web3.wcPopupConfig);
  const isWeb3Connected = useSelector((state) => state.web3.web3connected);
  const metaMaskAddress = useSelector((state) => state.web3.metaMaskAddress);
  const network = useSelector((state) => state.web3.network);
  const userData = useSelector((state) => state.auth.userData);
  const [baseCurrencyPrice, setBaseCurrencyPrice] = useState(0);
  const history = useHistory();
  const networkSwitchConfig = useSelector((state) => state.web3.networkSwitchConfig);
  const wcProvider = useSelector((state) => state.web3.wcProvider);
  const [nftNetwork, setNftNetwork] = useState(null);

  const tokens = useFetchTokens(nftNetwork);

  //dropdown refs
  const currencyDropdownRef = useRef(null);
  const auctionStartDropdownRef = useRef(null);
  const auctionEndDropdownRef = useRef(null);

  useEffect(() => {
    if (nftNetwork){
      _getBaseCurrencyPrice();
    }

    if (nftNetwork && !(Object.keys(nftNetwork).length === 0) && tokens.length > 0) {
      setTokenOptions(tokens);
      setSelectedCurreny(tokens[0].currencyKey);
      setOptions(tokens);
    }
  }, [nftNetwork, tokens]);

  const [options, setOptions] = useState();

  const [tokenOptions, setTokenOptions] = useState([]);
  const [selectedCurreny, setSelectedCurreny] = useState();

  const [isInstantPrice, setIsInstantPrice] = useState(false);
  const [isForSell, setIsForSell] = useState(false);

  const [auctionPrice, setAuctionPrice] = useState("");
  const [auctionDuration, setAuctionDuration] = useState(null);
  const [auctionStartDuration, setAuctionStartDuration] = useState(null);

  const [instantPrice, setInstantPrice] = useState("");

  const [currencyDropOpen, setCurrencyDropOpen] = useState("");

  const [startDateDropOpen, setStartDateDropOpen] = useState("");
  const [endDateDropOpen, setEndDateDropOpen] = useState("");
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [dateSelectionFor, setDateSelectionFor] = useState("");
  const [nftCountForDirectSale, setNftCountForDirectSale] = useState(0);
  const [isAcceptOffer, setAcceptOffer] = useState(false);


  //old code

  const [bids, setBids] = useState([]);
  const [nft, setNFT] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nftService = new NftService(network.backendUrl);
  const userService = new UserService(network.backendUrl);
  const collectionService = new CollectionService(network.backendUrl);
  const offerService = new OfferService(network.backendUrl);
  const tempStorageService = new TempStorageService(network.backendUrl);

  //handle outside click of dropdown
  const onOutsideDateDropdownClick = (e) => {
    if (!currencyDropdownRef.current?.contains(e.target)) {
      setCurrencyDropOpen(false)
    }
    if (!auctionStartDropdownRef.current?.contains(e.target)) {
      setStartDateDropOpen(false)
    }
    if (!auctionEndDropdownRef.current?.contains(e.target)) {
      setEndDateDropOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', onOutsideDateDropdownClick);
    return () => document.removeEventListener('mousedown', onOutsideDateDropdownClick);
  });

  const showNotification = (msg) => {
    enqueueSnackbar(msg, {
      ...notificationConfig,
      variant: "error",
    });
  };

  async function loadNftData() {
    const item = await nftService.getNft(props.match.params.nftId);
    if (item) {
      const holderData = await userService.getUser(item.holder);
      const collectionType = await collectionService.getCollectionsByAddress(
        item.collectionType
      );
      item.collectionType = collectionType ? collectionType : "";
      item.holderData = holderData;
      setNFT(item);

      setNftCountForDirectSale(item.supply);
      if (item.offers && item.offers.length > 0) {
        if (props.history.location.pathname.includes("updateoffer")) {
          if (item.offers[0].isForAuction) {
            setIsInstantPrice(true);
          } else if (item.offers[0].isForSell) {
            setIsForSell(true);
          }
        }
        let bids = item.offers[0]?.bids;
        reqBid(bids);
      }
    }
  }

  const isConnectedUserOwner = async () => {
    const accounts = await web3Object?.eth?.getAccounts();
    if (
      nft &&
      accounts &&
      nft.holder.toLowerCase() === accounts[0].toLowerCase()
    ) {
      return true;
    }
    return false;
  };

  async function _getBaseCurrencyPrice() {
    const price = await getBaseCurrencyPrice(nftNetwork);
    setBaseCurrencyPrice(price);
  }

  useEffect(() => {
    setNftNetwork(getNetworkByChainId(nft.chain_id));
  }, [nft?.chain_id]);

  useEffect(() => {
    loadNftData();
  }, [metaMaskAddress]);

  const setForSell = async () => {
    if (!nft.offers[0].isForSell) {
      showNotification("This nft is already not on sell.");
      return;
    }
    if (!isWeb3Connected) {
      connectWallet();
    } else if (!isForSell) {
      return;
    }
    const forSell = !isForSell;
    let erc721Exchanger = getNFTExchangerInstance(
      web3Object,
      nft.contractType,
      network,
      wcPopupConfig,
      dispatch
    );
    setIsLoading(true);
    if (
      metaMaskAddress &&
      metaMaskAddress.toLowerCase() === nft.holder.toLowerCase()
    ) {
      const acccouts = await web3Object.eth.getAccounts();
      const owner = acccouts[0];
      try {
        const connectedWith = localStorage.getItem("connectedWith");
        const setSellCallback = async (success, data) => {
          if (success) {
            await offerService.deleteOffer(nft?.offers[0]?.id);
            props.history.goBack();
          } else {
            setIsLoading(false);
          }
        }
        erc721Exchanger.setForSell(
          owner,
          nft.collectionType.address,
          nft.assetId,
          forSell,
          nft?.offers[0]?.offer_id,
          connectedWith,
          setSellCallback
        );
        
      } catch (error) {
        printLog([error]);
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  };

  const updateOfferprice = async (offer) => {
    const price = isForSell ? instantPrice : isInstantPrice ? auctionPrice : "";
    if (!offer.isForSell) {
      showNotification("This nft is not on sell.");
      return;
    } else if (!validateInput(price)) {
      showNotification("Please enter the valid price");
      return;
    }
    else if (isForSell && parseFloat(price) < 0.01) {
      showNotification("NFT can not be put on sale with price below 0.01");
      return;
    }
    let erc721Exchanger = getNFTExchangerInstance(
      web3Object,
      nft.contractType,
      network,
      wcPopupConfig,
      dispatch
    );

    if (
      metaMaskAddress &&
      metaMaskAddress.toLowerCase() === nft.holder.toLowerCase()
    ) {
      const acccouts = await web3Object.eth.getAccounts();
      const owner = acccouts[0];
      try {
        const connectedWith = localStorage.getItem("connectedWith");
        setIsLoading(true);
        const setOfferCallback = async (success, data) => {
          if (success) {
            const newOffer = {
              id: offer.id,
              price: price,
            };
            const dbUpdate = await offerService.updateOffer(newOffer);
            if (dbUpdate) props.history.goBack();
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        }
        erc721Exchanger.setOfferPrice(
          owner,
          offer.collection,
          offer.assetId,
          web3.utils.toWei(price.toString(), "ether"),
          offer.offer_id,
          connectedWith,
          setOfferCallback
        );
        
      } catch (error) {
        printLog(["err", error]);
        setIsLoading(false);
      }
    }
    
  };

  const checkNetwork = () => {
    const connectedWith = localStorage.getItem("connectedWith");
    let currentChainId = 0;
    if (connectedWith === "walletConnect") {
      currentChainId = wcProvider.chainId;
    } else if (connectedWith === "metamask") {        
      currentChainId = window.ethereum.networkVersion;
    }
    if(parseInt(nft.chain_id) == currentChainId) {
      return true;
    } else {
      dispatch(setNetworkSwitchConfig({
        ...networkSwitchConfig,
        show: true, 
        currentNetwork: network,
        newNetwork: getNetworkByChainId(parseInt(nft.chain_id))
      }));
      return false;      
    }
  }

  const placeNFTOnDirectSell = async (nft) => {
    if (!checkNetwork()) {        
      return;
    }
    const { ERC721_EXCHANGER_ADDRESS } = network.smartContracts;
    const { ERC1155_EXCHANGER_ADDRESS } = network.smartContracts;
    const { ERC1155_ADDRESS } = network.smartContracts;
    const { ERC721_ADDRESS } = network.smartContracts;
    if (selectedCurreny) {
      const result = await verifyPrice(selectedCurreny, isInstantPrice ? auctionPrice : instantPrice, nftNetwork);
      if (!result.verified) {
        enqueueSnackbar(`
            Price should be bigger than $${process.env.REACT_APP_MIN_AMOUNT} USD (${result.minValue} ${result.currentCurrency})`, {
          ...notificationConfig,
          variant: "error",
        });
        return;
      }
    }

    if (!nft.resale && nft.holder.toLowerCase() !== nft.creator.toLowerCase()) {
      showNotification("You can not put this nft on resale again");
      return;
    } else 
    if (nft && nft.offers.length > 0 && nft.offers[0].isForSell) {
      showNotification("This nft is already on sell");
      return;
    } else if (
      (nft.nftType === "tiktok_duet" ||
        nft.nftType === "tiktok_collab" ||
        nft.nftType === "music_promo") &&
      new Date().getTime() > new Date(nft.collabStart).getTime()
    ) {
      showNotification(
        "Nft can't be put on resale after the start of collaboration time"
      );
      return;
    } else if (!validateInput(instantPrice)) {
      showNotification("Please enter the valid price");
      return;
    }

    else if (parseFloat(instantPrice) < 0.01) {
      showNotification("NFT can not be put on sale with price below 0.01");
      return;
    }

    if (nft.contractType == 'ERC1155' && nftCountForDirectSale <= 0) {
      showNotification("Number of nft should be bigger than zero");
      return;
    }

    if (nft.contractType == 'ERC1155' && nftCountForDirectSale > nft.supply) {
      showNotification("You do not have enough supply to put on sale.");
      return;
    }
    try {
      const price = isForSell ? instantPrice : isInstantPrice ? auctionPrice : "";
      let erc721Exchanger = getNFTExchangerInstance(
        web3Object,
        nft.contractType,
        network,
        wcPopupConfig,
        dispatch
      );
      let approveTo = ERC721_EXCHANGER_ADDRESS;
      let erc721Minter = new ERC721Minter(web3Object, nft.collectionType.address, wcPopupConfig, dispatch);
      if (nft.contractType === "ERC1155") {
        erc721Minter = new ERC1155Minter(web3Object, nft.collectionType.address, wcPopupConfig, dispatch);
        approveTo = ERC1155_EXCHANGER_ADDRESS;
      }
      if (await isConnectedUserOwner()) {
        let accounts = await web3.eth.getAccounts();        
        const connectedWith = localStorage.getItem("connectedWith");
        if (accounts[0]) {
          setIsLoading(true);
          const expiresAt = (SIX_MONTHS_IN_SECONDS + Math.round(new Date().getTime() / 1000));
          const isEther = true;
          const isForSell = true;
          const isForAuction = false;           
          let res;          
          const eventIdListed = (Math.floor((Date.now()+ Math.random())*10000)).toString();
          
          const addOfferCallback = async (success, data) => {
            if (success) {                            
              const endRequestsAt = Date.now() + parseInt(process.env.REACT_APP_TRANSACTION_WAITING_TIME); 
              const verified = await verifyTransaction(tempStorageService, eventIdListed
                , endRequestsAt);
              if (verified) {
                props.history.goBack();
                setIsLoading(false);
              }  else {
                setIsLoading(false);
              }   
            } else {
              setIsLoading(false);
            }
          }
          const approveCallback = async (success, data) => {
            if (success) {
              const tokenAddress = await getTokenAddressByCurrency(nftNetwork, selectedCurreny)
              printLog(['tokenAddress2', tokenAddress], 'success');              
              const tempDataObj = {       
                seller: nft.holder,
                collection: nft.collectionType.address,
                assetId: nft.assetId,
                token: nft.contractType === "ERC1155" ? ERC1155_ADDRESS : ERC721_ADDRESS,
                isEther: isEther,
                price: price.toString(),
                isForSell: isForSell,
                isForAuction: isForAuction,
                expiresAt: parseInt(expiresAt) * 1000,
                auctionStartTime: new Date().getTime(),
                isSold: false,
                nft_id: nft.id,
                shareIndex: nft.shareIndex,
                currency: selectedCurreny,
                supply: nftCountForDirectSale,   
              }
        
              const tempobj = {          
                eventId: eventIdListed,
                event_name: 'Listed',
                user_id: metaMaskAddress.toLowerCase(),
                json_string: JSON.stringify(tempDataObj)
              }
              
              const tempRes = await tempStorageService.save(tempobj);
              if (tempRes) {

                if (nft.contractType === "ERC1155") {
                  res = await erc721Exchanger.addOffer(
                    accounts[0],
                    nft.collectionType.address, // collection add
                    nft.assetId,
                    tokenAddress,
                    web3.utils.toWei(price.toString(), "ether"),
                    nftCountForDirectSale,
                    isForSell,
                    isForAuction,
                    expiresAt,
                    nft.shareIndex,
                    eventIdListed,
                    connectedWith,
                    addOfferCallback
                  );
                } else {
                res = await erc721Exchanger.addOffer(
                  accounts[0],
                  nft.collectionType.address, //collection add
                  nft.assetId,
                  tokenAddress,
                  web3.utils.toWei(price.toString(), "ether"),
                  isForSell,
                  isForAuction,
                  expiresAt,
                  nft.shareIndex,
                  connectedWith,
                  addOfferCallback
                );
              }
            } else {
              setIsLoading(false);
            }              
            } else{
              setIsLoading(false);
            }
          }

          const approved = await erc721Minter.isSetApprovalForAll(
            accounts[0],
            approveTo
          );
          if (!approved) {
            erc721Minter.setApprovalForAll(accounts[0], approveTo, connectedWith, approveCallback);
          } else {
            approveCallback(true);
          }
        }
      }
    } catch (error) {
      printLog([error]);
      setIsLoading(false);
    }
  };

  const placeNFTOnAuction = async (nft) => {
    if (!checkNetwork()) {        
      return;
    }
    const { ERC721_EXCHANGER_ADDRESS } = network.smartContracts;
    const { ERC1155_EXCHANGER_ADDRESS } = network.smartContracts;
    const { ERC1155_ADDRESS } = network.smartContracts;
    const { ERC721_ADDRESS } = network.smartContracts;

    if (!nft.resale && nft.holder.toLowerCase() !== nft.creator.toLowerCase()) {
      showNotification("You can not put this nft on resale again");
      return;
    } else 
    if (nft && nft.offers.length > 0 && nft.offers[0].isForSell) {
      showNotification("This nft is already on sell");
      return;
    } else if (
      (nft.nftType === "tiktok_duet" ||
        nft.nftType === "tiktok_collab" ||
        nft.nftType === "music_promo") &&
      new Date().getTime() > new Date(nft.collabStart).getTime()
    ) {
      showNotification(
        "Nft can't be put on resale after the start of collaboration time"
      );
      return;
    } else if (!validateInput(auctionPrice)) {
      showNotification("Please enter the valid price");
      return;
    } else if (
      isInstantPrice &&
      auctionStartDuration &&
      auctionDuration &&
      auctionDuration.getTime() <= auctionStartDuration.getTime()
    ) {
      showNotification("In time details, start time must be less than end time.");
      return;
    }

    const price = isForSell ? instantPrice : isInstantPrice ? auctionPrice : "";
    if (!validateInput(price) || auctionDuration === null) {
      return;
    }
    if (
      metaMaskAddress &&
      metaMaskAddress.toLowerCase() === nft.holder.toLowerCase()
    ) {
      let accounts = await web3.eth.getAccounts();
      if (accounts[0]) {
        try {
          setIsLoading(true);
          let erc721Exchanger = getNFTExchangerInstance(
            web3Object,
            nft.contractType,
            network,
            wcPopupConfig,
            dispatch
          );
          let erc721Minter = new ERC721Minter(
            web3Object,
            nft.collectionType.address,
            wcPopupConfig,
            dispatch
          );
          let approveTo = ERC721_EXCHANGER_ADDRESS;

          if (nft.contractType === "ERC1155") {
            erc721Minter = new ERC1155Minter(
              web3Object,
              nft.collectionType.address,
              wcPopupConfig, 
              dispatch
            );
            approveTo = ERC1155_EXCHANGER_ADDRESS;
          }

          const expiresAt = Math.round(auctionDuration.getTime() / 1000);
          const isEther = false;
          const isForSell = true;
          const isForAuction = true;
          const connectedWith = localStorage.getItem("connectedWith");
          let res;
          const eventIdListed = (Math.floor((Date.now()+ Math.random())*10000)).toString();
          const addOfferCallback = async (success, data) => {
            if (success) {
              const endRequestsAt = Date.now() + parseInt(process.env.REACT_APP_TRANSACTION_WAITING_TIME); 
              const verified = await verifyTransaction(tempStorageService, eventIdListed
                , endRequestsAt);
              if (verified) {
                props.history.goBack();
                setIsLoading(false);
              }  else {
                setIsLoading(false);
              }   
            } else {
              setIsLoading(false);
            }
          }
          const approveCallback = async (success, data) => {
            if (success) {
              const tokenAddress = await getTokenAddressByCurrency(nftNetwork, selectedCurreny);
              printLog(['tokenAddress3', tokenAddress], 'success');
              const erc20Exchanger = new ERC20Exchanger(
                web3Object,
                tokenAddress,
                wcPopupConfig, 
                dispatch
              );
              const [ decimals ] = await Promise.all([
                erc20Exchanger.contract.methods.decimals().call().catch(handleError),
              ]);

              const tempDataObj = {       
                seller: nft.holder,
                collection: nft.collectionType.address,
                assetId: nft.assetId,
                token:
                  nft.contractType === "ERC1155" ? ERC1155_ADDRESS : ERC721_ADDRESS,
                isEther: isEther,
                price: price.toString(),
                isForSell: isForSell,
                isForAuction: isForAuction,
                expiresAt: parseInt(expiresAt) * 1000,
                auctionStartTime: Math.round(auctionStartDuration.getTime() / 1000),
                isSold: false,
                nft_id: nft.id,
                shareIndex: nft.shareIndex,
                currency: selectedCurreny,
                supply: nft.supply, 
              }
        
              const tempobj = {          
                eventId: eventIdListed,
                event_name: 'Listed',
                user_id: metaMaskAddress.toLowerCase(),
                json_string: JSON.stringify(tempDataObj)
              }
              
              const tempRes = await tempStorageService.save(tempobj);
              if (tempRes) {

                if (nft.contractType === "ERC1155") {                  
                  erc721Exchanger.addOffer(
                    accounts[0],
                    nft.collectionType.address,
                    nft.assetId,
                    tokenAddress,
                    multipliedBy(price.toString(), decimals),
                    nft.supply,
                    isForSell,
                    isForAuction,
                    expiresAt,
                    nft.shareIndex,
                    eventIdListed,
                    connectedWith,
                    addOfferCallback
                  );
                } else {
                  erc721Exchanger.addOffer(
                    accounts[0],
                    nft.collectionType.address,
                    nft.assetId,
                    tokenAddress,
                    web3.utils.toWei(price.toString(), "ether"),
                    isForSell,
                    isForAuction,
                    expiresAt,
                    nft.shareIndex,
                    connectedWith,
                    addOfferCallback
                  );
                }  
              }                         
            } else{
              setIsLoading(false);
            }
          }
          const approved = await erc721Minter.isSetApprovalForAll(
            accounts[0],
            approveTo
          );
          if (!approved) {
            await erc721Minter.setApprovalForAll(accounts[0], approveTo, connectedWith, approveCallback);
          } else {
            approveCallback(true)
          }
        } catch (error) {
          setIsLoading(false);
          printLog(["err", error]);
        }
      }
      
    }
  };

  useEffect(() => {
    async function loadNfts() {
      if (nft && nft.offers) {
        setBids(nft.offers[0]?.bids);
      }
    }
    loadNfts();
  }, [bids]);

  const reqBid = async (bids) => {
    const arr = [];
    for (let i = 0; i < bids.length; i++) {
      let userData = await userService.getUser(bids[i].bidder);
      if (userData) {
        arr.push({ bidder: bids[i], userData });
      }
    }
  };

  const connectWallet = async (e) => {
    if (document.getElementById("connectButton")) {
      document.getElementById("connectButton").click();
    }
  };

  useEffect(() => {
    if (
      nftNetwork &&
      isForSell === true &&
      !(Object.keys(nftNetwork).length === 0) &&
      tokens.length > 0
    ) {
      setCurrencyDropOpen(false);
      setTokenOptions(tokens);
      setIsInstantPrice(false);
    }
  }, [isForSell]);

  useEffect(() => {
    if (
      nftNetwork && 
      isInstantPrice === true &&
      !(Object.keys(nftNetwork).length === 0) &&
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

  const changeNFTSupply = (e) => {
    const re = /(^[0-9]+$|^$|^\s$)/;
    if (
      re.test(e.target.value) &&
      (e.target.value > "0" || e.target.value === "")
    ) {
      printLog([e.target.value], 'success');
      setNftCountForDirectSale(Number(e.target.value));
    }
  };
  const onNumberFieldChange = (e) => {
    let reForDecimalNo = /^\d*\.?\d*$/;
    let reForSimpleNo = /^\s*\d*\s*$/;
    if (reForDecimalNo.test(e.target.value)) {
      if (e.target.name === "auctionPrice") {
        setAuctionPrice(e.target.value);
      }
      if (e.target.name === "instantPrice") {
        setInstantPrice(e.target.value);
      }
    }
  };

  const handleDateDialog = (name) => {
    setDateDialogOpen(true);
    setDateSelectionFor(name);
  };

  const handleStartDateDropDown = (name) => {
    const date = new Date();
    date.setDate(date.getDate() + name.key);
    date.setMinutes(date.getMinutes() + 1);
    if (isValidDuration(date, auctionDuration)) {


      setAuctionStartDuration(date);
    } else {
      showTimeError();
    }
    setStartDateDropOpen(!startDateDropOpen);
  };

  const handleConfirmDate = (date) => {
    if (date) {
      if (new Date(date).getTime() < new Date().getTime()) {
        showNotification("Date/Time must be greater than the current Date/Time.")
        return
      }
      if (dateSelectionFor === "auctionStartDuration") {
        date.setMinutes(date.getMinutes() + 1);
        if (isValidDuration(date, auctionDuration)) {
          setAuctionStartDuration(date);
        } else {
          showTimeError();
        }
        setStartDateDropOpen(false);
      } else if (dateSelectionFor === "auctionDuration") {
        date.setMinutes(date.getMinutes() + 1);
        if (isValidDuration(auctionStartDuration, date)) {
          setAuctionDuration(date);
        } else {
          showTimeError();
        }
        setEndDateDropOpen(false);
      }

      setDateDialogOpen(false);
    }
  };

  const showTimeError = () => {
    enqueueSnackbar(`Auction duration must be between ${process.env.REACT_APP_AUCTION_MINIMUM_DURATION} and ${process.env.REACT_APP_AUCTION_MAXIMUM_DURATION} days.`, {
      ...notificationConfig,
      variant: "error",
    });
  }
  const isValidDuration = (startDate, endDate) => {

    if (!startDate || !endDate) {
      return true;
    }
    const duration = endDate.getTime() - startDate.getTime();
    const minDuration = process.env.REACT_APP_AUCTION_MINIMUM_DURATION * 24 * 60 * 60 * 1000
    const maxDuration = process.env.REACT_APP_AUCTION_MAXIMUM_DURATION * 24 * 60 * 60 * 1000
    const result = duration >= minDuration && duration <= maxDuration;
    return result;
  }

  const handleEndDateDropDown = (name) => {
    const date = new Date();
    date.setDate(date.getDate() + name.key);
    date.setMinutes(date.getMinutes() + 1);
    if (isValidDuration(auctionStartDuration, date)) {
      setAuctionDuration(date);
    } else {
      showTimeError();
    }
    setEndDateDropOpen(!endDateDropOpen);
  };


  if (document.getElementById("inputField1")) {
    document.getElementById("inputField1").style.color = "white";
    document.getElementById("inputField1").style.textDecoration = "none";
    document.getElementById("inputField1").style.fontSize = "0.75rem";
  }

  if (document.getElementById("inputField2")) {
    document.getElementById("inputField2").style.color = "white";
    document.getElementById("inputField2").style.textDecoration = "none";
    document.getElementById("inputField2").style.fontSize = "0.75rem";
  }

  if (document.getElementById("inputField3")) {
    document.getElementById("inputField3").style.color = "white";
    document.getElementById("inputField3").style.textDecoration = "none";
    document.getElementById("inputField3").style.fontSize = "0.75rem";
  }


  const checkForSell = (isForSell) => {
    const current_token_key = !isForSell ? nftNetwork.nativeCurrency.symbol : tokens[0].currencyKey;
    setSelectedCurreny(current_token_key)
    setIsForSell(!isForSell);
  }

  return (
    <React.Fragment>
      {nft ? (
        <div className="explore-page put-on-sale">
          <LoadingOverlay active={isLoading} spinner text="Transaction in Progress...">
            {props.history.location.pathname.includes("sellnft") ? (
              <div className="container">
                <div className="centered-container">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="step-crumb">
                        <KeyboardBackspaceIcon
                          onClick={() => props.history.goBack()}
                        />
                        <p className="step-lead">Back</p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <p className="collectible-title">Set Sale Details of NFT </p>
                    </div>
                  </div>
                  <div className="upload-section">
                    <div className="detail-panel">
                      {/* <label className="detail-subtitle ml-3">Offer Details</label> */}

                      {/* accept offer */}
                      {/* <div className="price-card">
                      <div className="card-detail">
                      <FormControlLabel
                        control={
                          <Checkbox checked={isAcceptOffer} onChange={event => {
                            setAcceptOffer(event.target.checked);
                          }} name="isAcceptOffer" />
                        }
                        label="Accept Offers"
                      />
                        <p className={`detail-lead ${isInstantPrice ? "op-100" : ""}`}>Enable other users to send offers. You can then view and accept or deny them.</p>
                      </div>
                      
                    </div> */}

                      <label className="detail-subtitle">Price Details</label>
                      {/* sell card */}
                      <div className="price-card">
                        <div className="card-detail">

                          <FormControlLabel
                            control={
                              <Checkbox
                                checkedIcon={<svg className="checkbox-checked-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                                  <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                }
                                checked={isForSell} onChange={event => {
                                  checkForSell(isForSell)
                                }} name="isForSell" />
                            }
                            label="Instant Sale"
                          />
                          <div className="inner-detail">
                            <p className={`detail-lead`}>
                              Enter the price for which the item will be instantly
                              sold
                            </p>
                            <div className="card-actions">
                              {isForSell && (
                                <div className="d-flex justify-content-center align-items-center">
                                  <input
                                    value={instantPrice}
                                    className="price-unit"
                                    name={"instantPrice"}
                                    onChange={onNumberFieldChange}
                                  />

                                  <div className="ntf-type dropdown-item put-sell">
                                    <div className="dropdown-content">
                                      <p className="dropdown-lead">
                                        {selectedCurreny}
                                      </p>
                                      {/* <ExpandMoreIcon /> */}
                                    </div>
                                    <div
                                      className={`dropdown-card ntf-type ${currencyDropOpen ? "open" : ""
                                        }`}
                                        ref={currencyDropdownRef}
                                    >
                                      {tokenOptions.map((item, index) => (
                                        <div
                                          className="ntf-dropdown-item"
                                          key={index}
                                          onClick={() =>
                                            handleDropDown1(item.currencyKey, "sell")
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
                              )}
                            </div>
                            {isForSell && (
                              <>
                                <p className={`detail-lead`}>
                                  Service fee
                                  <strong className="text-white">
                                    {" "}
                                    {shares[nft.nftType]}%
                                  </strong>
                                  <br />
                                  You will receive
                                  <strong className="text-white">
                                    {" "}
                                    {instantPrice ? instantPrice : 0}{" "}
                                    {selectedCurreny}
                                  </strong>{" "}
                                  ${" "}
                                  {instantPrice &&
                                    (parseFloat(instantPrice) * parseFloat(baseCurrencyPrice)).toFixed(3)}
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                      </div>

                      {(isForSell && nft.contractType == 'ERC1155' && nft.supply > 1) && (
                        <div className="price-card">
                          <div className="card-detail">
                            <p className="detail-title mt-0" style={{ marginBottom: 17 }}>
                              {nft.nftType === "nft_challenge"
                                ? "Number of Tokens"
                                : nft.nftType === "event_tickets"
                                  ? "Number of Tickets"
                                  : "Number of Copies"}
                            </p>
                            <p className="detail-lead mb-2 op-100">
                              {nft.nftType === "nft_challenge"
                                ? "Set number of tokens to be airdropped"
                                : nft.nftType === "event_tickets"
                                  ? "Set number of tickets (instances) to be sold"
                                  : "Set number of tokens (instances) to be sold"}
                            </p>
                          </div>
                          <div className="card-actions justify-content-end">
                            <div className="d-flex justify-content-center align-items-center">
                              <div
                                className="mr-2"
                                onClick={() => {
                                  if (nftCountForDirectSale > 1) {
                                    setNftCountForDirectSale(nftCountForDirectSale - 1);
                                  }
                                }}
                                style={{ cursor: "pointer", userSelect: 'none' }}
                              >
                                <svg
                                  width="22"
                                  height="22"
                                  viewBox="0 0 22 22"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle cx="11" cy="11" r="11" fill="#232528" />
                                  <path
                                    d="M6 11H16"
                                    stroke="white"
                                    stroke-linecap="round"
                                  />
                                </svg>
                              </div>

                              <input
                                className="price-unit text-center mr-2 ml-0"
                                value={nftCountForDirectSale}
                                onChange={changeNFTSupply}
                                placeholder={"No of copies you want to mint"}
                                defaultValue="1"
                                style={{ width: 97 }}
                              />

                              <div
                                onClick={() => {
                                  setNftCountForDirectSale(nftCountForDirectSale + 1);
                                }}
                                style={{ cursor: "pointer", userSelect: 'none' }}
                              >
                                <svg
                                  width="22"
                                  height="22"
                                  viewBox="0 0 22 22"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle cx="11" cy="11" r="11" fill="#232528" />
                                  <path
                                    d="M6 11H16"
                                    stroke="white"
                                    stroke-linecap="round"
                                  />
                                  <path
                                    d="M11 6V16"
                                    stroke="white"
                                    stroke-linecap="round"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Auction card */}
                      <div className="price-card">
                        <div className="card-detail">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checkedIcon={<svg className="checkbox-checked-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                                  <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                }
                                checked={isInstantPrice} onChange={event => {
                                  setIsInstantPrice(!isInstantPrice);
                                  setNftCountForDirectSale(nft.supply);
                                }} name="isInstantPrice" />
                            }
                            label="Put on Auction"
                          />
                        </div>
                        <div className="inner-detail">
                          <p className={`detail-lead ${isInstantPrice ? "op-100" : ""}`}>Select minimum sale price. Bids below this amount won’t be allowed.</p>
                          <div className="card-actions">
                            {isInstantPrice && (
                              <>
                                <div className="d-flex justify-content-center align-items-center">
                                  <input
                                    value={auctionPrice}
                                    className="price-unit"
                                    name={"auctionPrice"}
                                    onChange={onNumberFieldChange}
                                  />

                                  <div className="ntf-type dropdown-item put-sell">
                                    <div
                                      className="dropdown-content"
                                      onClick={() =>
                                        setCurrencyDropOpen(!currencyDropOpen)
                                      }
                                    >
                                      <p className="dropdown-lead">
                                        {selectedCurreny}
                                      </p>
                                      {/* <ExpandMoreIcon /> */}
                                      <ArrowDropDownIcon />
                                    </div>
                                    <div
                                      className={`dropdown-card ntf-type ${currencyDropOpen ? "open" : ""
                                        }`}
                                      ref={currencyDropdownRef}
                                    >
                                      {tokenOptions.map((item, index) => (
                                        <div
                                          className="ntf-dropdown-item"
                                          key={index}
                                          onClick={() =>
                                            handleDropDown1(
                                              item.currencyKey,
                                              "auction"
                                            )
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

                      </div>

                      {isInstantPrice && (
                        <div
                          className="price-card"
                          style={{
                            justifyContent: "flex-start",
                            flexDirection: "column",
                          }}
                        >
                          <p className="detail-subtitle mt-4">Auction deadline</p>

                          <div className="dead-line-item">
                            <p className="dead-line-lead" style={{ width: 181 }}>
                              Auction Starts
                            </p>
                            <div className="picker-group align-items-center card-actions">
                              <div className="ntf-type dropdown-item card-actions">
                                <div
                                  className="dropdown-content auction-deadline-dropdown"
                                  onClick={() =>
                                    setStartDateDropOpen(!startDateDropOpen)
                                  }
                                >
                                  <MuiPickersUtilsProvider
                                    utils={DateFnsUtils}
                                    style={{ color: "white", width: "100%" }}
                                    className="dropdown-item"
                                  >
                                    <DateTimePicker
                                      id="inputField1"
                                      label=""
                                      value={auctionStartDuration}
                                      name="auctionStartDuration"
                                      className="dropdown-lead"
                                      InputProps={{ disableUnderline: true }}
                                      disabled={true}
                                      format="yyyy/MM/dd hh:mm a"
                                    />
                                  </MuiPickersUtilsProvider>
                                  <ArrowDropDownIcon />
                                </div>
                                <div
                                  className={`dropdown-card time-deadline ${startDateDropOpen ? "open" : ""
                                    }`}
                                  ref={auctionStartDropdownRef}
                                >
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
                                    <p className="primary-lead">
                                      Select Specific Time
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="dead-line-item">
                            <p className="dead-line-lead" style={{ width: 181 }}>
                              Auction Ends
                            </p>

                            <div className="picker-group align-items-center card-actions">
                              <div className="ntf-type dropdown-item ">
                                <div
                                  className="dropdown-content auction-deadline-dropdown"
                                  onClick={() =>
                                    setEndDateDropOpen(!endDateDropOpen)
                                  }
                                >
                                  <MuiPickersUtilsProvider
                                    utils={DateFnsUtils}
                                    style={{ color: "black", width: "100%" }}
                                    className="dropdown-item"
                                  >
                                    <DateTimePicker
                                      id="inputField2"
                                      label=""
                                      value={auctionDuration}
                                      name="auctionDuration"
                                      className="dropdown-lead"
                                      InputProps={{ disableUnderline: true }}
                                      disabled={true}
                                      format="yyyy/MM/dd hh:mm a"
                                    />
                                  </MuiPickersUtilsProvider>
                                  <ArrowDropDownIcon />
                                </div>
                                <div
                                  className={`dropdown-card time-deadline ${endDateDropOpen ? "open" : ""
                                    }`}
                                  ref={auctionEndDropdownRef}
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
                                    onClick={() =>
                                      handleDateDialog("auctionDuration")
                                    }
                                  >
                                    <p className="primary-lead">
                                      {" "}
                                      Select Specific Time
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}



                    </div>
                    <div className="preview-panel mobile-view">
                      {nft && (
                        <NftCard
                          item={nft}
                          user={nft.holderData}
                          loggedInUser={userData}
                        />
                      )}
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-center justify-content-center mobile-show">
                    <button
                      className="btn-continue"
                      onClick={() => {
                        isInstantPrice
                          ? placeNFTOnAuction(nft)
                          : placeNFTOnDirectSell(nft);
                      }}
                    >
                      Save
                    </button>

                    {
                      nft && <button className="btn-preview mobile-show">
                        Preview
                      </button>
                    }
                  </div>
                  <button
                    className="btn-continue mobile-view"
                    onClick={() => {
                      isInstantPrice
                        ? placeNFTOnAuction(nft)
                        : placeNFTOnDirectSell(nft);
                    }}
                  >
                    Save
                  </button>
                  <button className="btn-continue btn-cancel mobile-view" onClick={() => history.goBack()}>
                    Cancel
                  </button>


                </div>

              </div>
            ) : props.history.location.pathname.includes("updateoffer") ? (
              <div className="container">
                <div className="centered-container">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="d-flex step-crumb">
                        <KeyboardBackspaceIcon
                          onClick={() => props.history.goBack()}
                        />
                        <p className="step-lead">Change Price</p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <p className="collectible-title">
                        Change NFT Selling Details
                      </p>
                    </div>
                  </div>
                  <div className="upload-section">
                    <div className="detail-panel">
                      <p className="text-white">
                        Adjust your sell methods and selling details
                      </p>
                      {nft &&
                        nft.offers &&
                        nft.offers.length > 0 &&
                        nft.offers[0].isForAuction ? (
                        <>
                          <div className="price-card">
                            <div className="card-detail">
                              <p className="detail-title">Put on Auction</p>
                              <p className="detail-lead">
                                Select minimum sale price. Bids below this amount won’t be allowed.
                              </p>
                            </div>
                            <div className="card-actions">
                              <div
                                className={`custom-switch-2 ${isInstantPrice ? "active" : ""
                                  }`}
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
                                  <div className="d-flex justify-content-center align-items-center">
                                    <input
                                      value={auctionPrice}
                                      className="price-unit"
                                      name={"auctionPrice"}
                                      onChange={onNumberFieldChange}
                                    />

                                    <div className="ntf-type dropdown-item">
                                      <div className="dropdown-content">
                                        <p className="dropdown-lead">
                                          {nft.offers[0].currency}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      ) : nft &&
                        nft.offers &&
                        nft.offers.length > 0 &&
                        nft.offers[0].isForSell ? (
                        <div className="price-card">
                          <div className="card-detail">
                            <p className="detail-title">Instant Sale</p>
                            <p className={`detail-lead mb-3 ${isForSell ? "op-100" : ""}`}>
                              Enter the price for which the item will be instantly
                              sold
                            </p>
                            <p className={`detail-lead ${isForSell ? "op-100" : ""}`}>
                              Service fee
                              <strong className="text-white">
                                {" "}
                                {shares[nft.nftType]}%
                              </strong>
                            </p>
                            <p className={`detail-lead ${isForSell ? "op-100" : ""}`}>
                              You will receive
                              <strong className="text-white">
                                {" "}
                                {instantPrice ? instantPrice : 0}{" "}
                                {nft.offers[0].currency}
                              </strong>{" "}
                              ${" "}
                              {instantPrice &&
                                (
                                  parseFloat(instantPrice) * parseFloat(baseCurrencyPrice)
                                ).toFixed(3)}
                            </p>
                          </div>
                          <div className="card-actions">
                            <div
                              className={`custom-switch-2 ${isForSell ? "active" : ""
                                }`}
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
                                  className="price-unit"
                                  name={"instantPrice"}
                                  onChange={onNumberFieldChange}
                                />

                                <div className="ntf-type dropdown-item">
                                  <div className="dropdown-content">
                                    <p className="dropdown-lead">
                                      {nft.offers[0].currency}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        "Item not on sell"
                      )}
                      <div className="d-flex flex-column align-items-center justify-content-center mobile-show">
                        <button
                          className="btn-continue"
                          onClick={() => {
                            updateOfferprice(nft.offers[0]);
                          }}
                        >
                          Save
                        </button>
                        {
                          nft && <button className="btn-preview mobile-show">
                            Preview
                          </button>
                        }
                      </div>
                      <button
                        className="btn-continue mobile-view"
                        onClick={() => {
                          updateOfferprice(nft.offers[0]);
                        }}
                      >
                        Save
                      </button>

                    </div>
                    <div className="preview-panel mobile-view">
                      {nft && (
                        <NftCard
                          item={nft}
                          user={nft.holderData}
                          loggedInUser={userData}
                        />
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ) : props.history.location.pathname.includes("cancelsell") ? (
              <div className="container">
                <div className="centered-container">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="d-flex step-crumb">
                        <KeyboardBackspaceIcon
                          onClick={() => props.history.goBack()}
                        />
                        <p className="step-lead">Remove From Sell </p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <p className="collectible-title">Remove From Sell</p>
                    </div>
                  </div>
                  <div className="upload-section">
                    <div className="detail-panel">
                      <p className="text-white">Please Select an option below</p>

                      {/* sell card */}
                      <div className="price-card">
                        <div className="card-detail">
                          <p className="detail-title">Remove from Sell</p>
                          <p className="detail-lead mb-3" style={{ opacity: isForSell ? 1 : .3 }}>
                            When select YES, your nft will not accept any offers
                            and will be removed from sell.
                          </p>
                        </div>
                        <div className="card-actions">
                          <div
                            className={`custom-switch-2 ${isForSell ? "active" : ""
                              }`}
                            onClick={() => setIsForSell(!isForSell)}
                          >
                            <div className="d-flex justify-content-center flex-fill toggle-nav nav-left">
                              No
                            </div>
                            <div className="d-flex justify-content-center flex-fill toggle-nav nav-right">
                              Yes
                            </div>
                            <div className="toggle-bar" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-center justify-content-center mobile-show">
                        <button className="btn-continue" onClick={setForSell}>
                          Save
                        </button>
                        {
                          nft && <button className="btn-preview mobile-show">
                            Preview
                          </button>
                        }
                      </div>

                      <button className="btn-continue mobile-view" onClick={setForSell}>
                        Save
                      </button>
                    </div>
                    <div className="preview-panel mobile-view">
                      {nft && (
                        <NftCard
                          item={nft}
                          user={nft.holderData}
                          loggedInUser={userData}
                        />
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ) : undefined}
          </LoadingOverlay>
        </div>
      ) : (
        <div style={{ width: '100%', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner animation="border" />
        </div>

      )}
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
