import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import axios from "axios";
import ConnectButton from "../ConnectButton";
import { divideNo, getNetworkByChainId, handleError } from "../../common/utils";
import { networks } from "../../constants/networks";
import { ChatUserService } from "../../services/chat-user.service";
import { UserService } from "../../services/user.service";
import ERC20Exchanger from "../../common/ERC20/erc20Exchanger";
import { setUserData } from "../../redux/actions/authAction";
import { setChatJWT, setMainJWT } from "../../redux/actions/jwtAction";
import { Menu, MenuItem } from "@material-ui/core";
import WalletConnectModal from "components/WalletConnectModal";

import {
  web3Connected,
  setMetaMask,
  setNetwork,
  Web3Object,
  setWcProvider,
  setWcPopupConfig,
} from "../../redux/actions/web3action";
import {
  SET_TOKEN_PRICE,
  SET_WOM_TO_ETH_RATE,
} from "../../redux/constants/index";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import "./style.scss";
import NetworkSwitcher from "components/NetworkSwitcher";
import { socialMediaLink } from "containers/Home/homeSocialIcons";
import InstagramIcon from "@material-ui/icons/Instagram";
import NetworkSwitchDialog from "./networkSwitchDialog";
import { printLog } from "utils/printLog";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElMobile, setAnchorElMobile] = useState(null);
  const history = useHistory();

  const dispatch = useDispatch();
  const isWeb3Connected = useSelector((state) => state.web3.web3connected);
  const metaMaskAddress = useSelector((state) => state.web3.metaMaskAddress);
  const web3Object = useSelector((state) => state.web3.web3object);
  const wcProvider = useSelector((state) => state.web3.wcProvider);
  const userData = useSelector((state) => state.auth.userData);
  const wcPopupConfig = useSelector((state) => state.web3.wcPopupConfig);
  const [userBalance, setUserBalance] = useState(0);
  const [userMainBalance, setUserMainBalance] = useState(0);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  let newUser = false;
  let initialWalletConnect = false;
  // const [showSocialLinkDialog, setShowSocialLinkDialog] = useState(false);
  const network = useSelector((state) => state.web3.network);
  const [showNetworkSwitcher, setShowNetworkSwitcher] = useState(false);
  const [isShowingAvailableWallets, setIsShowingAvailableWallets] =
    useState(true);
  const [wcProviderFound, setWcProviderFound] = useState(false);

  // const [walletConnectProvider, setWalletConnectProvider] = useState(null);

  const disconnectWallet = async () => {
    try {
      if (wcProvider && wcProvider.connected) {
        await wcProvider.disconnect();
      }
    } catch (ex) {
      printLog([ex]);
    }

    sessionStorage.removeItem("userConnected");
    sessionStorage.removeItem("userAccount");
    sessionStorage.removeItem("userBalance");
    localStorage.removeItem("walletconnect");
    localStorage.removeItem("connectedWith");
    localStorage.removeItem("accounts");
    localStorage.removeItem("connectorId");
    localStorage.removeItem("userConnected");
    // localStorage.removeItem("PHYLLO_USERID");
    sessionStorage.removeItem(process.env.REACT_APP_USER_MAIN_TOKEN_KEY);
    sessionStorage.removeItem(process.env.REACT_APP_USER_CHAT_TOKEN_KEY);
    dispatch(web3Connected(false));
    dispatch(Web3Object({}));
    dispatch(setWcProvider(null));
    dispatch(setUserData({}));
    dispatch(setMetaMask(""));
    handleClose();

    history.push("/");
    // window.location.reload()
  };

  const connectWallet = async (provider) => {
    let web3 = null;
    let accounts = null;
    const connectedWith = localStorage.getItem("connectedWith");
    if (connectedWith == "walletConnect") {
      dispatch(setWcProvider(provider));
    } else {
      localStorage.removeItem("walletconnect");
    }

    let currentChainId = 0;
    if (connectedWith === "walletConnect") {
      currentChainId = provider.chainId;
    } else if (connectedWith === "metamask") {
      currentChainId = window.ethereum.networkVersion;
    }
    const network = getNetworkByChainId(currentChainId);
    if (network) {
      dispatch(setNetwork(network));
      localStorage.setItem(
        process.env.REACT_APP_CURRENT_NETWORK,
        JSON.stringify(network)
      );
      localStorage.setItem(process.env.REACT_APP_CURRENT_CHAIN, currentChainId);
    }

    web3 = new Web3(provider);

    accounts = await web3.eth.getAccounts();

    const ethers = Web3.utils.fromWei(
      await web3.eth.getBalance(accounts[0]),
      "ether"
    );

    sessionStorage.setItem("userBalance", Number(ethers).toFixed(2));
    setUserMainBalance(Number(ethers).toFixed(2));
    sessionStorage.setItem("userAccount", accounts[0]);
    saveUser(accounts[0], web3, provider);
  };

  const saveUser = async (address, web3, provider) => {
    const default_backend_url = network
      ? network.backendUrl
      : networks[process.env.REACT_APP_DEFAULT_NETWORK].backendUrl;
    const chat_backend_url = network
      ? network.backendUrl
      : networks[process.env.REACT_APP_DEFAULT_NETWORK].chatUrl;

    let userService = new UserService(default_backend_url);
    let chatUserService = new ChatUserService(chat_backend_url);
    address = address.toLowerCase();

    let userDB = await userService.getUser(address);
    if (userDB) {
      dispatch(setUserData(userDB));
    }
    if (!userDB) {
      const userCount = await userService.getUserCount();
      const firstName = "bullz";
      const lastName = userCount + 1 + process.env.REACT_APP_USERNAME_SUFFIX;

      const user = {
        address: address,
        firstname: firstName,
        lastname: lastName,
        email: "famous@tiktok.com",
        username: firstName + lastName,
      };
      userDB = await userService.saveUser(user);
      if (userDB) {
        newUser = true;
        dispatch(setUserData(userDB));
      }
    }

    if (!userDB) {
      return;
    }
    try {
      if (
        !sessionStorage.getItem(process.env.REACT_APP_USER_MAIN_TOKEN_KEY) &&
        !sessionStorage.getItem(process.env.REACT_APP_USER_CHAT_TOKEN_KEY)
      ) {
        if (localStorage.getItem("connectedWith") == "walletConnect") {
          dispatch(
            setWcPopupConfig({
              ...wcPopupConfig,
              show: true,
              message:
                "Please sign your identity from wallet app in your device.",
            })
          );
        }

        const signature = await web3?.eth?.personal?.sign(
          userDB.nonce,
          address
        );
        initialWalletConnect = true;
        dispatch(setWcPopupConfig({ ...wcPopupConfig, show: false }));

        const main_result = await userService.login(address, signature);
        const chat_result = await chatUserService.login(address, signature);

        sessionStorage.setItem(
          process.env.REACT_APP_USER_MAIN_TOKEN_KEY,
          main_result.access_token
        );
        sessionStorage.setItem(
          process.env.REACT_APP_USER_CHAT_TOKEN_KEY,
          chat_result.access_token
        );
        dispatch(setMetaMask(address));
        dispatch(Web3Object(web3));
        dispatch(web3Connected(true));
        dispatch(setChatJWT(main_result.access_token));
        dispatch(setMainJWT(chat_result.access_token));
      } else {
        dispatch(setMetaMask(address));
        dispatch(Web3Object(web3));
        dispatch(web3Connected(true));
        dispatch(
          setMainJWT(
            sessionStorage.getItem(process.env.REACT_APP_USER_MAIN_TOKEN_KEY)
          )
        );
        dispatch(
          setChatJWT(
            sessionStorage.getItem(process.env.REACT_APP_USER_CHAT_TOKEN_KEY)
          )
        );
      }
    } catch (err) {
      printLog([err]);
      dispatch(setWcPopupConfig({ ...wcPopupConfig, show: false }));
      if (err.code === 4001) {
        disconnectWallet();
        return;
      }
    }
    showSocialLinkingPopup();
  };

  const showSocialLinkingPopup = () => {
    if (newUser) {
      newUser = false;
      history.push("/social-connect");
    } else if (initialWalletConnect) {
      initialWalletConnect = false;
      const urlParts = window.location.href.split("/");
      if (!urlParts[3]) {
        history.push("/discover");
      }
    }
  };

  const updateBalance = async () => {
    if (metaMaskAddress && Object.keys(web3Object).length !== 0) {
      const ethers = Web3.utils.fromWei(
        await web3Object.eth.getBalance(metaMaskAddress),
        "ether"
      );
      sessionStorage.setItem("userBalance", Number(ethers).toFixed(2));
      setUserMainBalance(Number(ethers).toFixed(2));

      getUserBalance();
    }
  };
  const handleClick = (event) => {
    updateBalance();
    setAnchorEl(event.currentTarget);
  };
  const handleClickMobile = (event) => {
    updateBalance();
    setAnchorElMobile(event.currentTarget);
  };
  const goToChat = () => {
    history.push(`/messaging`);
    setAnchorEl(null);
    setAnchorElMobile(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElMobile(null);
  };

  const getUserBalance = async () => {
    try {
      const erc20Exchanger = new ERC20Exchanger(
        web3Object,
        network.smartContracts.CHALLENGE_UTILITY_TOKEN.address,
        wcPopupConfig,
        dispatch
      );
      const [decimals, balance] = await Promise.all([
        erc20Exchanger.contract.methods.decimals().call().catch(handleError),
        erc20Exchanger.contract.methods
          .balanceOf(metaMaskAddress)
          .call()
          .catch(handleError),
      ]);

      const actualBalance = divideNo(balance, decimals);
      setUserBalance(parseFloat(actualBalance).toFixed(2));
    } catch (error) {
      printLog([error]);
    }
  };

  useEffect(() => {
    const currentChain = localStorage.getItem(
      process.env.REACT_APP_CURRENT_CHAIN
    );

    const dispatchNetwork = currentChain
      ? getNetworkByChainId(currentChain)
      : networks[process.env.REACT_APP_DEFAULT_NETWORK];

    dispatch(setNetwork(dispatchNetwork));
    if (!currentChain) {
      localStorage.setItem(
        process.env.REACT_APP_CURRENT_NETWORK,
        JSON.stringify(dispatchNetwork)
      );
      localStorage.setItem(
        process.env.REACT_APP_CURRENT_CHAIN,
        parseInt(dispatchNetwork.chainId, 16)
      );
    }
    if (metaMaskAddress && Object.keys(web3Object).length !== 0) {
      getUserBalance();
    }
  }, [metaMaskAddress, web3Object]);

  useEffect(() => {
    getTokenStats();
  }, []);

  useEffect(() => {
    if (wcProvider) {
      setWcProviderFound(true);
    }

    if (
      localStorage.getItem("connectedWith") == "walletConnect" &&
      wcProviderFound
    ) {
      if (
        !wcProvider ||
        wcProvider.accounts[0].toLowerCase() != metaMaskAddress.toLowerCase()
      ) {
        disconnectWallet();
      }
      setWcProviderFound(false);
    }

    if (wcProvider) {
      connectWallet(wcProvider);
    }
  }, [wcProvider]);

  history.listen((location, action) => {
    setShowMobileSearch(false);
  });

  function getTokenStats() {
    let tokensArray = [
      "?ids=wom-token&vs_currencies=usd",
      "?ids=ethereum&vs_currencies=usd",
    ];
    let requestUrl = [];
    tokensArray.forEach((element) => {
      requestUrl.push(
        axios.get("https://api.coingecko.com/api/v3/simple/price" + element)
      );
    });

    Promise.all(requestUrl)
      .then((res) => {
        let wom = parseFloat(res[0].data["wom-token"].usd.toFixed(8));
        let eth = parseFloat(res[1].data["ethereum"].usd.toFixed(8));
        let conversionRate = parseFloat((wom / eth).toFixed(8));
        dispatch({
          type: SET_TOKEN_PRICE,
          payload: {
            wom,
            eth,
          },
        });
        dispatch({ type: SET_WOM_TO_ETH_RATE, payload: conversionRate });
      })
      .catch((err) => {
        printLog([err]);
        dispatch({
          type: SET_TOKEN_PRICE,
          payload: {
            wom: 0,
            eth: 0,
          },
        });
        dispatch({ type: SET_WOM_TO_ETH_RATE, payload: 0 });
      });
  }

  const connectWalletClick = async (e) => {
    if (document.getElementById("connectButton")) {
      document.getElementById("connectButton").click();
    }
  };

  const handleCopyAddress = () => {
    var copyText = metaMaskAddress;

    try {
      var textArea = document.createElement("textarea");
      textArea.value = copyText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      // setCopied(true);
      // setTimeout(() => {
      //   setCopied(false);
      // }, 1000);
    } catch (e) {
      printLog(["copy error", e]);
    }
  };

  const handleSocialLinks = (type) => {
    printLog(["type", type], "success");
    window.open(socialMediaLink[type]);
  };

  return (
    <div className="app-header">
      <div className="container">
        <div className="header-content mobile-view">
          <div className="logo-search-group">
            <Link to="/">
              <img src="/images/bullzLogoBig.png" alt="Logo" className="logo" />
              <p className="slogan">Challenge Launchpad</p>
            </Link>
          </div>
          <div className="header-action-group">
            <div className="menu">
              <ul>
                {/* <li
                  onClick={() => history.push("/discover")}
                  className="menu-item"
                >
                  Discover Challenges
                </li> */}

                {isWeb3Connected ? (
                  <li
                    onClick={() => history.push("/mychallenge")}
                    className="menu-item"
                  >
                    My Challenges
                  </li>
                ) : (
                  // <li
                  //   onClick={() => history.push(`/profile/${metaMaskAddress}`)}
                  //   className="menu-item"
                  // >
                  //   My Items 1
                  // </li>
                  // <li
                  //   onClick={() => history.push("/challenges")}
                  //   className="menu-item"
                  // >
                  //   Challenges
                  // </li>
                  <></>
                )}
              </ul>
            </div>
            <div className="d-flex align-items-center">
              {!isWeb3Connected ? (
                <div className="">
                  {/* <ConnectButton
                    connectWallet={connectWallet}
                    handleLogout={disconnectWallet}
                  ></ConnectButton> */}
                  <button className="cs-btn"> 
                    Coming soon
                  </button>
                </div>
              ) : (
                <>
                  <button
                    id="createButton"
                    style={{ width: 109 }}
                    className="btn-continue"
                    onClick={() => history.push("/create")}
                  >
                    Create
                  </button>

                  <div className="account-wrapper" onClick={handleClick}>
                    {/* <CustomTooltip
                      title={`${capitalize(userData.firstname)} ${capitalize(userData.lastname)}`}
                      placement={"bottom"}
                    >
                      <p className="username">
                        {capitalize(userData.firstname)}{" "}
                        {capitalize(userData.lastname)}
                      </p>
                    </CustomTooltip> */}
                    <img src={userData.avatar_img} alt="User" />
                    <ArrowDropDownIcon />
                  </div>
                  <Menu
                    id="account-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    className="account-menu"
                  >
                    <div className="top-indicator"></div>
                    <MenuItem
                      onClick={handleClose}
                      className="header-menu-item"
                    >
                      <div className="menu-profile">
                        <img
                          src={
                            userData?.avatar_img
                              ? userData.avatar_img
                              : "/images/default-profile-cover.png"
                          }
                          alt="User"
                        />
                        <p className="username">@{userData.username}</p>
                      </div>
                    </MenuItem>
                    <MenuItem
                      className="menu-list-item"
                      onClick={() => {
                        handleClose();
                        history.push(`/profile/${metaMaskAddress}`);
                      }}
                    >
                      My Profile
                    </MenuItem>
                    <MenuItem className="menu-list-item" onClick={goToChat}>
                      My Messages
                    </MenuItem>
                    <MenuItem
                      className="menu-list-item"
                      onClick={() => {
                        handleClose();
                        history.push("/mychallenge");
                      }}
                    >
                      My Challenges
                    </MenuItem>
                    <MenuItem
                      className="menu-list-item"
                      onClick={() => {
                        handleClose();
                        history.push("/edit-profile");
                      }}
                    >
                      My Settings
                    </MenuItem>
                    <MenuItem
                      className="menu-list-item"
                      onClick={() => {
                        handleClose();
                        history.push("/how-it-works");
                      }}
                    >
                      How it works
                    </MenuItem>
                    <MenuItem
                      className="menu-list-item"
                      onClick={disconnectWallet}
                    >
                      Log Out
                    </MenuItem>
                    <MenuItem className="menu-wallet-section">
                      <div className="header">
                        <p className="title">Connected Wallets</p>
                        {/* <p className="manage" onClick={() => { setAnchorEl(null); history.push('/manage-wallet') }}>Manage Wallets</p> */}
                        {/* <p className="manage" onClick={() => { }}>Manage Wallets</p> */}
                      </div>
                      <div className="wallet-details">
                        {isShowingAvailableWallets ? (
                          <div>
                            {/* <div className="available-wallet-item" onClick={()=> setIsShowingAvailableWallets(false)}>
                              <div className="wallet-info" >
                                <img src="/images/balance-ether.png" alt="" />
                                <div className="wallet-info-inner">
                                  <p className="wallet-name">Ethereum</p>
                                  <p className="address">0x934...N06c</p>
                                </div>
                              </div>
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                                <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>

                            </div> */}
                            <div
                              className="available-wallet-item"
                              onClick={() =>
                                setIsShowingAvailableWallets(false)
                              }
                            >
                              <div className="wallet-info">
                                <img src={network?.icon} alt="" />
                                <div className="wallet-info-inner">
                                  <p className="wallet-name">
                                    {network?.chainName}
                                  </p>
                                  <p className="address">
                                    {!!localStorage &&
                                    localStorage.getItem("accounts")
                                      ? `${localStorage
                                          .getItem("accounts")
                                          .slice(0, 5)}...${localStorage
                                          .getItem("accounts")
                                          .slice(-4)}`
                                      : ""}
                                  </p>
                                </div>
                              </div>
                              <svg
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
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="wallet-info">
                              <img src={network?.icon} alt="" />
                              <div className="w-100 px-2">
                                <p className="wallet-title">
                                  {network?.chainName}
                                </p>
                                <div className="address">
                                  <p className="content">
                                    {!!localStorage &&
                                    localStorage.getItem("accounts")
                                      ? `${localStorage
                                          .getItem("accounts")
                                          .slice(0, 5)}...${localStorage
                                          .getItem("accounts")
                                          .slice(-4)}`
                                      : ""}
                                    <ArrowDropDownIcon
                                      onClick={() =>
                                        setIsShowingAvailableWallets(true)
                                      }
                                    />
                                  </p>
                                  <div onClick={handleCopyAddress}>
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
                                        d="M1.59091 0.125C0.712274 0.125 0 0.837274 0 1.71591V8.53409C0 9.41273 0.712276 10.125 1.59091 10.125H3.5V10.875C3.5 11.9796 4.39543 12.875 5.5 12.875H10.8333C11.9379 12.875 12.8333 11.9796 12.8333 10.875V4.625C12.8333 3.52043 11.9379 2.625 10.8333 2.625H9V1.71591C9 0.837274 8.28773 0.125 7.40909 0.125H1.59091ZM8 2.625V1.71591C8 1.38956 7.73544 1.125 7.40909 1.125H1.59091C1.26456 1.125 1 1.38956 1 1.71591V8.53409C1 8.86044 1.26456 9.125 1.59091 9.125H3.5V4.625C3.5 3.52043 4.39543 2.625 5.5 2.625H8ZM4.5 4.625C4.5 4.07272 4.94772 3.625 5.5 3.625H10.8333C11.3856 3.625 11.8333 4.07272 11.8333 4.625V10.875C11.8333 11.4273 11.3856 11.875 10.8333 11.875H5.5C4.94772 11.875 4.5 11.4273 4.5 10.875V4.625Z"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="wallet-balance">
                              <img
                                src={
                                  network?.smartContracts
                                    ?.CHALLENGE_UTILITY_TOKEN?.logo
                                }
                                alt=""
                              />
                              <p className="balance">
                                {userBalance}{" "}
                                {
                                  network?.smartContracts
                                    ?.CHALLENGE_UTILITY_TOKEN?.symbol
                                }
                              </p>
                            </div>
                            <div className="wallet-balance">
                              <img src={network?.icon} alt="" />
                              <p className="balance">
                                {userMainBalance}{" "}
                                {network?.nativeCurrency?.symbol}
                              </p>
                            </div>
                            {/* <div className="wallet-balance">
                              <img src="/images/balanceWhite.png" alt="" />
                              <p className="balance">{userMainBalance} {network?.nativeCurrency?.symbol}</p>
                            </div> */}

                            <div className="add-fund-btn">
                              {/* <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M10.8571 4.85714H7.14286V1.14286C7.14286 0.514286 6.62857 0 6 0C5.37143 0 4.85714 0.514286 4.85714 1.14286V4.85714H1.14286C0.514286 4.85714 0 5.37143 0 6C0 6.62857 0.514286 7.14286 1.14286 7.14286H4.85714V10.8571C4.85714 11.4857 5.37143 12 6 12C6.62857 12 7.14286 11.4857 7.14286 10.8571V7.14286H10.8571C11.4857 7.14286 12 6.62857 12 6C12 5.37143 11.4857 4.85714 10.8571 4.85714Z" />
                              </svg> */}
                              <p
                                onClick={() => {
                                  setAnchorEl(null);
                                  setAnchorElMobile(null);
                                  setShowNetworkSwitcher(!showNetworkSwitcher);
                                }}
                              >
                                Switch Network
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mobile-show header-content-mobile">
          <Link to="/">
            <img src="/images/bullzLogoBig.png" alt="Logo" className="logo" />
            {/* <p className="slogan">NFT Marketplace</p> */}
          </Link>
          <div className="m-logo-search-group">
            {/* <div onClick={() => setShowMobileSearch(!showMobileSearch)}>
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-15"
              >
                <path
                  d="M8 0C3.59 0 0 3.59 0 8C0 12.41 3.59 16 8 16C9.84 16 11.54 15.37 12.9 14.31L15.07 16.49L16.49 15.07L14.31 12.9C15.37 11.54 16 9.84 16 8C16 3.59 12.41 0 8 0ZM8 2C11.33 2 14 4.67 14 8C14 11.33 11.33 14 8 14C4.67 14 2 11.33 2 8C2 4.67 4.67 2 8 2Z"
                  fill="white"
                />
              </svg>
            </div> */}

            {!isWeb3Connected ? (
              <span className="mr-15">
                <ConnectButton
                  connectWallet={connectWallet}
                  handleLogout={disconnectWallet}
                />
              </span>
            ) : (
              <button
                id="createButton"
                style={{ width: 109 }}
                className="btn-continue mr-15"
                onClick={() => {
                  // setShowMobileMenu(!showMobileMenu);
                  history.push("/create");
                }}
              >
                Create
              </button>
            )}

            {/* <div onClick={() => setShowMobileMenu(!showMobileMenu)}> */}
            <div onClick={handleClickMobile}>
              <svg
                width="24"
                height="8"
                viewBox="0 0 24 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="24" height="2" fill="white" />
                <rect y="6" width="24" height="2" fill="white" />
              </svg>
            </div>
          </div>
        </div>

        <Menu
          id="account-menu"
          anchorEl={anchorElMobile}
          keepMounted
          open={Boolean(anchorElMobile)}
          onClose={handleClose}
          className="account-menu"
        >
          {isWeb3Connected ? (
            <>
              <MenuItem onClick={handleClose} className="header-menu-item">
                <div className="menu-profile">
                  <img
                    src={
                      userData?.avatar_img
                        ? userData.avatar_img
                        : "/images/default-profile-cover.png"
                    }
                    alt="User"
                  />
                  <p className="username">@{userData.username}</p>
                </div>
              </MenuItem>
              <MenuItem
                className="menu-list-item"
                onClick={() => {
                  handleClose();
                  history.push(`/profile/${metaMaskAddress}`);
                }}
              >
                My Profile
              </MenuItem>
              <MenuItem className="menu-list-item" onClick={goToChat}>
                My Messages
              </MenuItem>
              <MenuItem
                className="menu-list-item"
                onClick={() => {
                  handleClose();
                  history.push("/mychallenge");
                }}
              >
                My Challenges
              </MenuItem>
              <MenuItem
                className="menu-list-item"
                onClick={() => {
                  handleClose();
                  history.push("/edit-profile");
                }}
              >
                My Settings
              </MenuItem>
              <MenuItem
                className="menu-list-item"
                onClick={() => {
                  handleClose();
                  history.push("/discover");
                }}
              >
                Discover Challenges
              </MenuItem>
              <MenuItem
                className="menu-list-item"
                onClick={() => {
                  handleClose();
                  history.push("/how-it-works");
                }}
              >
                How it works
              </MenuItem>
              <MenuItem className="menu-list-item" onClick={disconnectWallet}>
                Log Out
              </MenuItem>
              <MenuItem
                className="menu-wallet-section"
                style={{ marginBottom: 90 }}
              >
                <div className="header">
                  <p className="title">Connected Wallets</p>
                  {/* <p className="manage" onClick={() => { setAnchorEl(null); history.push('/manage-wallet') }}>Manage Wallets</p> */}
                  {/* <p className="manage" onClick={() => { }}>Manage Wallets</p> */}
                </div>
                <div className="wallet-details">
                  {isShowingAvailableWallets ? (
                    <div>
                      {/* <div className="available-wallet-item" onClick={()=> setIsShowingAvailableWallets(false)}>
                              <div className="wallet-info" >
                                <img src="/images/balance-ether.png" alt="" />
                                <div className="wallet-info-inner">
                                  <p className="wallet-name">Ethereum</p>
                                  <p className="address">0x934...N06c</p>
                                </div>
                              </div>
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                                <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>

                            </div> */}
                      <div
                        className="available-wallet-item"
                        onClick={() => setIsShowingAvailableWallets(false)}
                      >
                        <div className="wallet-info">
                          <img src={network?.icon} alt="" />
                          <div className="wallet-info-inner">
                            <p className="wallet-name">{network?.chainName}</p>
                            <p className="address">
                              {!!localStorage &&
                              localStorage.getItem("accounts")
                                ? `${localStorage
                                    .getItem("accounts")
                                    .slice(0, 5)}...${localStorage
                                    .getItem("accounts")
                                    .slice(-4)}`
                                : ""}
                            </p>
                          </div>
                        </div>
                        <svg
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
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="wallet-info">
                        <img src={network?.icon} alt="" />
                        <div className="w-100 px-2">
                          <p className="wallet-title">{network?.chainName}</p>
                          <div className="address">
                            <p className="content">
                              {!!localStorage &&
                              localStorage.getItem("accounts")
                                ? `${localStorage
                                    .getItem("accounts")
                                    .slice(0, 5)}...${localStorage
                                    .getItem("accounts")
                                    .slice(-4)}`
                                : ""}
                              <ArrowDropDownIcon
                                onClick={() =>
                                  setIsShowingAvailableWallets(true)
                                }
                              />
                            </p>
                            <div onClick={handleCopyAddress}>
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
                                  d="M1.59091 0.125C0.712274 0.125 0 0.837274 0 1.71591V8.53409C0 9.41273 0.712276 10.125 1.59091 10.125H3.5V10.875C3.5 11.9796 4.39543 12.875 5.5 12.875H10.8333C11.9379 12.875 12.8333 11.9796 12.8333 10.875V4.625C12.8333 3.52043 11.9379 2.625 10.8333 2.625H9V1.71591C9 0.837274 8.28773 0.125 7.40909 0.125H1.59091ZM8 2.625V1.71591C8 1.38956 7.73544 1.125 7.40909 1.125H1.59091C1.26456 1.125 1 1.38956 1 1.71591V8.53409C1 8.86044 1.26456 9.125 1.59091 9.125H3.5V4.625C3.5 3.52043 4.39543 2.625 5.5 2.625H8ZM4.5 4.625C4.5 4.07272 4.94772 3.625 5.5 3.625H10.8333C11.3856 3.625 11.8333 4.07272 11.8333 4.625V10.875C11.8333 11.4273 11.3856 11.875 10.8333 11.875H5.5C4.94772 11.875 4.5 11.4273 4.5 10.875V4.625Z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="wallet-balance">
                        <img
                          src={
                            network?.smartContracts?.CHALLENGE_UTILITY_TOKEN
                              ?.logo
                          }
                          alt=""
                        />
                        <p className="balance">
                          {userBalance}{" "}
                          {
                            network?.smartContracts?.CHALLENGE_UTILITY_TOKEN
                              ?.symbol
                          }
                        </p>
                      </div>
                      <div className="wallet-balance">
                        <img src={network?.icon} alt="" />
                        <p className="balance">
                          {userMainBalance} {network?.nativeCurrency?.symbol}
                        </p>
                      </div>
                      {/* <div className="wallet-balance">
                              <img src="/images/balanceWhite.png" alt="" />
                              <p className="balance">{userMainBalance} {network?.nativeCurrency?.symbol}</p>
                            </div> */}

                      <div className="add-fund-btn">
                        {/* <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M10.8571 4.85714H7.14286V1.14286C7.14286 0.514286 6.62857 0 6 0C5.37143 0 4.85714 0.514286 4.85714 1.14286V4.85714H1.14286C0.514286 4.85714 0 5.37143 0 6C0 6.62857 0.514286 7.14286 1.14286 7.14286H4.85714V10.8571C4.85714 11.4857 5.37143 12 6 12C6.62857 12 7.14286 11.4857 7.14286 10.8571V7.14286H10.8571C11.4857 7.14286 12 6.62857 12 6C12 5.37143 11.4857 4.85714 10.8571 4.85714Z" />
                              </svg> */}
                        <p
                          onClick={() => {
                            setAnchorEl(null);
                            setAnchorElMobile(null);
                            setShowNetworkSwitcher(!showNetworkSwitcher);
                          }}
                        >
                          Switch Network
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={handleClose} className="menu-list-item-header">
                <Link to="/">
                  {/* <img src="/images/bullzLogo.svg" alt="Logo" className="logo" /> */}
                  <img
                    src="/images/bullzLogoBig.png"
                    alt="Logo"
                    className="logo"
                  />
                  <p className="slogan">Challenge Launchpad</p>
                </Link>
              </MenuItem>
              <MenuItem
                className="menu-list-item"
                onClick={() => {
                  handleClose();
                  history.push("/discover");
                }}
              >
                Discover Challenges
              </MenuItem>

              <MenuItem
                className="menu-list-item"
                onClick={() => {
                  handleClose();
                  history.push("/how-it-works");
                }}
              >
                How it works
              </MenuItem>

              <MenuItem
                className="menu-list-item mb-4"
                onClick={() => {
                  handleClose();
                  connectWalletClick();
                }}
              >
                Connect Wallet
              </MenuItem>
            </>
          )}

          <div className="bottom-social-container">
            <svg
              className="twitter"
              width="30"
              height="25"
              viewBox="0 0 30 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                handleSocialLinks("twitter_url");
              }}
            >
              <path
                d="M29.9985 2.89558C28.8749 3.39258 27.6834 3.71898 26.4634 3.86399C27.7493 3.0949 28.7118 1.88451 29.1714 0.458374C27.9646 1.17658 26.6415 1.67992 25.2625 1.95219C24.3362 0.96109 23.1084 0.303787 21.7699 0.0824688C20.4315 -0.13885 19.0575 0.0882178 17.8615 0.72837C16.6654 1.36852 15.7144 2.38589 15.1562 3.62231C14.598 4.85874 14.4639 6.24494 14.7748 7.56542C12.3275 7.44275 9.93328 6.80677 7.74767 5.69875C5.56207 4.59074 3.63392 3.03547 2.0884 1.1339C1.54134 2.07354 1.25386 3.14169 1.2554 4.22898C1.2554 6.363 2.34154 8.24831 3.99284 9.35211C3.01561 9.32135 2.0599 9.05744 1.20536 8.58239V8.65892C1.20565 10.0802 1.69746 11.4576 2.5974 12.5577C3.49734 13.6577 4.75002 14.4127 6.14305 14.6945C5.23589 14.9404 4.28469 14.9766 3.36146 14.8005C3.75422 16.0239 4.51973 17.0938 5.55081 17.8604C6.58189 18.6271 7.82691 19.0521 9.11156 19.0759C7.83479 20.0787 6.37291 20.8199 4.80948 21.2573C3.24605 21.6947 1.61175 21.8196 0 21.625C2.81353 23.4344 6.08874 24.395 9.43387 24.3918C20.756 24.3918 26.9476 15.0124 26.9476 6.87811C26.9476 6.6132 26.9402 6.34534 26.9285 6.08337C28.1336 5.21235 29.1738 4.13334 30 2.89705L29.9985 2.89558Z"
                fill={"white"}
              />
            </svg>
            <svg
              className="discord"
              width="30"
              height="23"
              viewBox="0 0 30 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                handleSocialLinks("discord_url");
              }}
            >
              <path
                d="M25.4126 1.88472C23.4709 1.00367 21.3943 0.364456 19.2229 0C18.9557 0.46664 18.6451 1.09564 18.4295 1.5952C16.1221 1.25913 13.8358 1.25913 11.5706 1.5952C11.3562 1.09564 11.0374 0.46664 10.7691 0C8.59526 0.364456 6.51638 1.00594 4.5746 1.88927C0.658237 7.62405 -0.403471 13.2158 0.127383 18.7292C2.7254 20.6094 5.24256 21.7504 7.71871 22.4975C8.33042 21.6823 8.87533 20.816 9.34408 19.9031C8.44995 19.5739 7.59332 19.1674 6.78356 18.6962C6.99801 18.5418 7.20777 18.3806 7.41168 18.2148C12.3476 20.4515 17.7112 20.4515 22.5885 18.2148C22.7935 18.3806 23.0033 18.5418 23.2166 18.6962C22.4045 19.1697 21.5455 19.5762 20.6514 19.9054C21.1213 20.816 21.6639 21.6846 22.2767 22.4998C24.7541 21.7527 27.2747 20.6105 29.8728 18.7292C30.495 12.3381 28.8075 6.7975 25.4126 1.88472ZM10.0156 15.3378C8.53432 15.3378 7.3191 13.9981 7.3191 12.3654C7.3191 10.7327 8.50854 9.3907 10.0156 9.3907C11.5237 9.3907 12.739 10.7304 12.712 12.3654C12.7155 13.9981 11.5237 15.3378 10.0156 15.3378ZM19.9834 15.3378C18.5022 15.3378 17.287 13.9981 17.287 12.3654C17.287 10.7327 18.4764 9.3907 19.9834 9.3907C21.4916 9.3907 22.7068 10.7304 22.6799 12.3654C22.6799 13.9981 21.4904 15.3378 19.9834 15.3378Z"
                fill={"white"}
              />
            </svg>
            <InstagramIcon
              className="instagram"
              style={{ fontSize: 30, color: "white" }}
              onClick={() => {
                handleSocialLinks("instagram_url");
              }}
            />
          </div>
        </Menu>

        {/* <div
          className={`mobile-menu-container ${showMobileMenu
            ? "mobile-menu-container-show"
            : "mobile-menu-container-hide"
            }`}
        >
          <div className="mobile-nav">
            <div className="mobile-nav-buttons-box">
              <div
                className="nav-hidden-items-box"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  width="13.200000000000001"
                  height="13.200000000000001"
                  xlmns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L12 4"
                    stroke="currentColor"
                    strokeWidth="2"
                  ></path>
                  <path
                    d="M12 12L4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="d-flex  flex-column justify-content-between ">
            {!isWeb3Connected ? (
              <div className="d-flex flex-column">
                <Link
                  to="/discover"
                  className="community-dropdown-link"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  Discover Challenges
                </Link>

                <Link
                  to="/how-it-works"
                  className="community-dropdown-link"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  How it works
                </Link>
              </div>
            ) : (
              <div>
                <div className="account-wrapper p-24">
                  <img src={userData.avatar_img} alt="User" />
                  <CustomTooltip
                    title={`@${userData.username}`}
                    placement={""}
                  >
                    <p className="username">
                      @{userData.username}
                    </p>
                  </CustomTooltip>

                </div>
                <div className="m-header-menu-item">
                  <div className="menu-header-wrapper">
                    <div className="menu-item">
                      <div>
                        <p className="menu-title">BULLZ</p>
                        <p className="menu-lead">
                          {`${localStorage
                            .getItem("accounts")
                            .slice(0, 10)}...${localStorage
                              .getItem("accounts")
                              .slice(-5)}`}
                        </p>
                      </div>
                    </div>
                    <div className="menu-item">
                      <div className="icon-menu">
                        <img src="/images/balance.png" alt="Icon" />
                        <div>
                          <p className="menu-title">{network?.smartContracts?.CHALLENGE_UTILITY_TOKEN?.symbol} Balance</p>
                          <p className="menu-lead">{userBalance} {network?.smartContracts?.CHALLENGE_UTILITY_TOKEN?.symbol}</p>
                        </div>
                      </div>
                    </div>
                    <div className="menu-item">
                      <div className="icon-menu">
                        <img src="/images/jewelery.png" alt="Icon" />
                        <div>
                          <p className="menu-title">ETH Balance</p>
                          <p className="menu-lead">
                            {userMainBalance} ETH
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  to="/discover"
                  className="community-dropdown-link"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  Discover Challenges
                </Link>
                
                <Link
                  className="community-dropdown-link"
                  onClick={() => {
                    history.push(`/profile/${metaMaskAddress}`)
                    setShowMobileMenu(!showMobileMenu);
                  }}
                >
                  My Profile
                </Link>
                <Link
                  className="community-dropdown-link"
                  onClick={() => {
                    goToChat();
                    setShowMobileMenu(!showMobileMenu);
                  }}
                >
                  My Messages
                </Link>
                <Link
                  className="community-dropdown-link"
                  onClick={() => {
                    setShowMobileMenu(!showMobileMenu);
                    history.push("/mychallenge");
                  }}
                >
                  My Challenges
                </Link>
                <Link
                  className="community-dropdown-link"
                  onClick={() => {
                    setShowMobileMenu(!showMobileMenu);
                    history.push("/edit-profile");
                  }}
                >
                  My Settings
                </Link>
                <p
                  onClick={() => {
                    setShowMobileMenu(!showMobileMenu);
                    disconnectWallet();
                  }}
                  className="community-dropdown-link"
                >
                  Sign Out
                </p>
              </div>
            )}

            {isWeb3Connected ? (
              <div className="btn-view1">
                <button
                  style={{ width: 109 }}
                  className="btn-continue mr-15"
                  onClick={() => {
                    setShowMobileMenu(!showMobileMenu);
                    history.push("/create");
                  }}
                >
                  Create
                </button>
              </div>
            ) : (
              <div className="btn-view" onClick={() => setShowMobileMenu(false)}>
                <ConnectButton
                  connectWallet={connectWallet}
                  handleLogout={disconnectWallet}
                  network={network}
                ></ConnectButton>
               
              </div>
            )}
          </div>
        </div> */}

        {showNetworkSwitcher && (
          <NetworkSwitcher
            show={showNetworkSwitcher}
            setShowNetworkSwitcher={setShowNetworkSwitcher}
            hideShow={() => setShowNetworkSwitcher(false)}
            disconnectWallet={disconnectWallet}
          />
        )}

        {/* {showSocialLinkDialog ? (
          <SocialConnect
            show={showSocialLinkDialog}
            hideShow={() => setShowSocialLinkDialog(false)}
          />
        ) : undefined} */}
        <WalletConnectModal />
        <NetworkSwitchDialog />
      </div>
    </div>
  );
};

export default React.memo(Header);
