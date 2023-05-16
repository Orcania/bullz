import React, { useEffect, useState } from "react";
import { collectibles } from "../../data/tokenTypes";
import "./style.scss";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useMediaQuery } from "@material-ui/core";
import { divideNo, scrollToTop } from "common/utils";
import { NftService } from "../../services/nft.service";
import { UserService } from "../../services/user.service";
import { CollectionService } from "../../services/collection.service";
import { Spinner } from "react-bootstrap";
import NftCard from "./nftCard";
import { Select, Menu, MenuItem } from "@material-ui/core";
import { useHistory } from "react-router";
import ReactPaginate from "react-paginate";
import { NftScannerService } from "services/nft-scanner.service";
import CustomAlert from "components/CustomAlert";
import CustomTooltip from "components/Common/Tooltip/CustomTooltip";
import { DialogContent, Dialog, Typography } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import { DebounceInput } from "react-debounce-input";
import ERC20Exchanger from "common/ERC20/erc20Exchanger";
import { useSelector, useDispatch } from "react-redux";
import { TokenService } from "services/token.service";
import { printLog } from "utils/printLog";

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
        <svg
          width="9"
          height="9"
          viewBox="0 0 9 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={onClose}
          className="close_button"
        >
          <path
            d="M4.5 3.50016L8.00016 0L9 0.999843L5.49984 4.5L9 8.00016L8.00016 9L4.5 5.49984L0.999843 9L0 8.00016L3.50016 4.5L0 0.999843L0.999843 0L4.5 3.50016Z"
            fill="#D2D2D2"
          />
        </svg>
      ) : null}
    </MuiDialogTitle>
  );
});

const SelectToken = ({
  collectibleType,
  step,
  goPreviousStep,
  selectedNft,
  onClickNft,
  showNotification,
  selectedNetwork,
  assetType,
  selectedToken,
  setSelectedToken,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const network = useSelector((state) => state.web3.network);
  const userData = useSelector((state) => state.auth.userData);
  const isMobile = useMediaQuery("(min-width:350px) and (max-width:1023px)");
  const web3Object = useSelector((state) => state.web3.web3object);
  const wcPopupConfig = useSelector((state) => state.web3.wcPopupConfig);

  const nftService = new NftService(network.backendUrl);
  const userService = new UserService(network.backendUrl);
  const collectionService = new CollectionService(network.backendUrl);
  const nftScannerService = new NftScannerService(network.backendUrl);
  const tokenService = new TokenService(network.backendUrl);

  const [tokens, setTokens] = useState([]);
  const [nftsLoading, setNftsLoading] = useState(true);

  // notification states
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationBtnText, setNotificationBtnText] = useState("");
  const [open, setOpen] = useState(false);
  const [showTokenError, setTokenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [newToken, setNewToken] = useState({});

  const getTokenBalance = async (token) => {
    const erc20Exchanger = new ERC20Exchanger(
      web3Object,
      token,
      wcPopupConfig,
      dispatch
    );

    // const [balance] = await Promise.all([
    //   erc20Exchanger.contract.methods
    //     .balanceOf(userData.address)
    //     .call()
    //     .catch(handleError),
    // ]);

    const [ decimals, balance ] = await Promise.all([
          
      erc20Exchanger.contract.methods.decimals().call().catch(handleError),
      erc20Exchanger.contract.methods
        .balanceOf(userData.address)
        .call()
        .catch(handleError)
    ]);
    const ethBalance = divideNo(balance, decimals);
    printLog(["ethBalance", ethBalance], 'success');
    return ethBalance;
  };
  const startScanning = async () => {
    setNftsLoading(true);
    const _tokens = await nftScannerService.getTokens({
      user: userData.address,
      chain_id: parseInt(selectedNetwork.chainId, 16),
    });

    printLog(["_tokens", _tokens], 'success');
    if (_tokens) {
      if (network.chainName == "Binance Smart Chain" || network.chainName == "Avalanche C-CHAIN") {
        const arr = [];
        for (let i = 0; i < _tokens.length; i++) {
          const token = _tokens[i];
          const balance = await getTokenBalance(token.address);
          token.balance = balance;
          arr.push(token);
        }

        setTokens(arr);
      } else {
        setTokens(_tokens);
      }
    } else {
      // Setting notification
      setNotificationType("error");
      setNotificationMessage(`Something went wrong, please try again after logout and relogin.`);
      setNotificationTitle("Scanning...");
      setNotificationOpen(true);
      setNotificationBtnText("Ok, Got it");
    }
    setNftsLoading(false);
  };

  const getScanningData = async () => {
    startScanning();
  };

  useEffect(() => {
    if (userData?.address) {
      getScanningData();
    }
    scrollToTop();
  }, [userData]);

  useEffect(() => {
    if (newToken.address) {

      getTokenMetadata(newToken.address);
    }
  }, [newToken.address]);

  const customDialogAlertClose = () => {
    setNotificationTitle("");
    setNotificationMessage("");
    setNotificationType("");
    setNotificationBtnText("");
    setNotificationOpen(false);
  };

  const handleClose = () => {
    setNewToken({})
    setOpen(false);
    setTokenError(false);
  };

  const handleError = (e) => {
    printLog(["handleError", e]);
    return undefined;
  };
  const getTokenMetadata = async (token) => {
    try {
      const exist = tokens.filter(
        (t) => t.address.toLowerCase() == token.toLowerCase()
      );

      if (exist.length > 0) {
        setErrorMessage("Token already exists");
        setTokenError(true);
        return;
      }

      printLog(["exist", exist], 'success');

      const erc20Exchanger = new ERC20Exchanger(
        web3Object,
        token,
        wcPopupConfig,
        dispatch
      );

      const [name, symbol, decimals, balance] = await Promise.all([
        erc20Exchanger.contract.methods.name().call().catch(handleError),
        erc20Exchanger.contract.methods.symbol().call().catch(handleError),
        erc20Exchanger.contract.methods.decimals().call().catch(handleError),
        erc20Exchanger.contract.methods
          .balanceOf(userData.address)
          .call()
          .catch(handleError),
      ]);

      printLog(["res", name, symbol, decimals], 'success');
      if (!name) {
        setErrorMessage('Token info missing.');
        setTokenError(true);
        setNewToken({ ...newToken, name: "", symbol: "", decimals: "", balance: ""});
      } else {
        setErrorMessage('');
        setTokenError(false);
        setNewToken({ ...newToken, name, symbol, decimals, balance: divideNo(balance, decimals)});
      }
    } catch (err) {
      printLog(["err", err]);
      setErrorMessage('Not a valid token.')
      setTokenError(true);
      setNewToken({ ...newToken, name: "", symbol: "", decimals: "", balance: ""});
    }
  };

  const saveToken = async () => {
    if (!showTokenError) {

      if(!newToken.name || !newToken.symbol)
        return;

      const tokenObject = {
        ...newToken,
        chain_id: parseInt(network.chainId, 16),
        decimal: newToken.decimals,
        user: userData.address,
      };
      const tokenData = await tokenService.saveToken(tokenObject);
      if (tokenData) {
        setTokens([...tokens, tokenData]);        
      }
      printLog([tokenData], 'success');
      setOpen(false);
      setNewToken({});
    }
  };

  return (
    <>
      <div className="create-step2 select-nft select-token-page">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center">
            <KeyboardBackspaceIcon
              onClick={goPreviousStep}
              style={{ color: "#FFFFFF", cursor: "pointer" }}
            />

            <span className="step-lead">
              Step {step - 2} of {assetType.creationStep}
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <p className="refresh-btn mr-4" onClick={() => setOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4762 6.47619H9.52381V1.52381C9.52381 0.685714 8.8381 0 8 0C7.1619 0 6.47619 0.685714 6.47619 1.52381V6.47619H1.52381C0.685714 6.47619 0 7.1619 0 8C0 8.8381 0.685714 9.52381 1.52381 9.52381H6.47619V14.4762C6.47619 15.3143 7.1619 16 8 16C8.8381 16 9.52381 15.3143 9.52381 14.4762V9.52381H14.4762C15.3143 9.52381 16 8.8381 16 8C16 7.1619 15.3143 6.47619 14.4762 6.47619" fill="white"/>
            </svg>

              <span>Add Tokens</span>
            </p>
            <p className="refresh-btn" onClick={startScanning}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.2296 18.0536C15.778 19.3115 13.9208 20.0027 12 20C7.5816 20 4 16.4184 4 12C4 7.5816 7.5816 4 12 4C16.4184 4 20 7.5816 20 12C20 13.7088 19.464 15.2928 18.552 16.592L16 12H18.4C18.3999 10.525 17.8903 9.09525 16.9573 7.95271C16.0244 6.81017 14.7255 6.02495 13.2803 5.72989C11.835 5.43482 10.3323 5.64801 9.02614 6.33341C7.72002 7.01881 6.69074 8.13433 6.11242 9.49126C5.5341 10.8482 5.44224 12.3632 5.85239 13.7801C6.26254 15.197 7.14951 16.4287 8.36327 17.2668C9.57702 18.105 11.043 18.4982 12.5133 18.3799C13.9836 18.2616 15.3679 17.6391 16.432 16.6176L17.2296 18.0536Z" fill="white"/>
            </svg>

              <span>Refresh</span>
            </p>
          </div>
        </div>
        <p className="collectible-title">Start creating your Token Challenge</p>
        <p className="collectible-lead">
          Below you can find your owned tokens. Select which type of tokens you would
          like to airdrop.
        </p>

        <div className="d-flex flex-column align-items-center mt-4">
          <div className="collectible-group">
            <div className="w-100">
              {nftsLoading ? (
                // {true ? (
                <div className="spinnerStyle">
                  <Spinner animation="border" />
                  <p>
                    This process might take a few minutes to gather all Tokens
                    you own ...
                  </p>
                </div>
              ) : tokens && tokens.length > 0 ? (
                <>
                  <div className="row items-row position-relative w-100">
                    {tokens.map((token, index) => (
                      <div
                        key={index}
                        className={`explore-item ${
                          selectedToken &&
                          selectedToken.address == token.address
                            ? "selected"
                            : ""
                        }`}
                      >
                        <div
                          className={`small_coming_card`}
                          style={{ cursor: "pointer" }}
                          key={index}
                          onClick={() => {
                            setSelectedToken(token);
                          }}
                        >
                          <img
                            src={`/images/default-profile-cover-light.png`}
                            alt=""
                            className="card-avatar"
                          />

                          <div className="card-info">
                            <p className="card-name">{token.name}</p>
                            <p className="card-eth">
                              {(token?.balance ? parseFloat(token.balance).toFixed(3) : 0) + " " + token.symbol}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* <p className="collectible-lead mt-4">
                    Please select exactly which tokens you would like to
                    airdrop.
                  </p> */}
                  <p className="collectible-lead mt-4">
                    You can add tokens manually by clicking “Add Tokens”.
                  </p>
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
                      Browse our marketplace to discover <br /> Challenges
                      or create your own Challenge!
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
          </div>
        </div>
      </div>
      <CustomAlert
        isDialogOpen={notificationOpen}
        customDialogAlertClose={customDialogAlertClose}
        title={notificationTitle}
        message={notificationMessage}
        type={notificationType}
        btnText={notificationBtnText}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        className="create-new-modal add-token"
      >
        <DialogTitle>Add Token Information</DialogTitle>
        <DialogContent>
          <div className="form-group" style={{ marginTop: 20 }}>
            <span className="drop-title">Token Contract Address</span>
            <DebounceInput
              className={`form-control`}
              type="text"
              value={newToken.address}
              onDrop={(e) => {
                e.preventDefault();
                return false;
              }}
              minLength={2}
              debounceTimeout={300}
              onChange={(e) =>
                setNewToken({ ...newToken, address: e.target.value })
              }
            />
            {showTokenError && (
              <p className="form-hint error">{errorMessage}</p>
            )}
          </div>

          <div className="form-group">
            <span className="drop-title">Token Name</span>
            <input
              type="text"
              value={newToken.name}
              onChange={(e) =>
                setNewToken({ ...newToken, name: e.target.value })
              }
              placeholder="ETH"
            />
          </div>
          <div className="form-group">
            <span className="drop-title">Token Symbol</span>
            <input
              type="text"
              value={newToken.symbol}
              onChange={(e) =>
                setNewToken({ ...newToken, symbol: e.target.value })
              }
              placeholder="ETH"
            />
          </div>

          <div className="form-group">
            <span className="drop-title">Token Decimal</span>
            <input
              type="text"
              value={newToken.decimals}
              onChange={(e) =>
                setNewToken({ ...newToken, decimals: e.target.value })
              }
              placeholder="18"
            />
          </div>

          <div className="d-flex flex-column justify-content-center align-items-center">
            <button
              className={`btn-continue mb-3 mt-4 'btn-disabled'}`}
              onClick={() => {
                saveToken();
              }}
            >
              Create
            </button>

            <button className="btn-cancel" onClick={handleClose}>
            CANCEL
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default React.memo(SelectToken);
