import React, { useEffect, useState } from "react";
import "./style.scss";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useMediaQuery } from "@material-ui/core";
import { scrollToTop } from 'common/utils';
import WalletConnectingDialog from "./walletConnectingDialog";
import useAuth from "../../components/ConnectButton/useAuth";
import { setNetwork, setWcPopupConfig } from "../../redux/actions/web3action";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { printLog } from "utils/printLog";

const ConnectWallet = ({
  step,
  goPreviousStep,
  currentNetwork,
  selectedNetwork,
  setSwitchNetwork,
  setSelectedNetwork
}) => {
  const isMobile = useMediaQuery("(min-width:350px) and (max-width:1023px)");
  const [showWalletConnectingDialog, setShowWalletConnectingDialog] = useState(false);
  const { login, provider, chainId, connected } = useAuth();
  const dispatch = useDispatch();
  const wcProvider = useSelector((state) => state.web3.wcProvider);
  const wcPopupConfig = useSelector((state) => state.web3.wcPopupConfig);

  useEffect(() => {
    scrollToTop();
  }, []);

  const connectWalletClicked = async () => {
    // setShowWalletConnectDialog(true);
    const connectedWith = localStorage.getItem("connectedWith");
    setShowWalletConnectingDialog(true);

    if (connectedWith === "walletConnect") {
      await switchToCustomNetwork(wcProvider, selectedNetwork, connectedWith);
    } else if (connectedWith === "metamask") {
      await switchToCustomNetwork(window.ethereum, selectedNetwork, connectedWith);
    }
  }

  async function switchToCustomNetwork(ethereum, newNetwork, connectedWith) {
    try {

      if (connectedWith == 'walletConnect') {
        dispatch(setWcPopupConfig({ ...wcPopupConfig, show: true, message: "Please confirm network switching from wallet app in your device." }))
      }
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: newNetwork.chainId }],
      });
      dispatch(setNetwork(selectedNetwork))
      localStorage.setItem(process.env.REACT_APP_CURRENT_NETWORK, JSON.stringify(selectedNetwork));
      localStorage.setItem(process.env.REACT_APP_CURRENT_CHAIN, parseInt(selectedNetwork.chainId, 16));
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902 || switchError.message.includes('Unrecognized chain ID')) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: newNetwork.chainName,
                chainId: newNetwork.chainId,
                rpcUrls: [newNetwork.rpcUrl],
                nativeCurrency: newNetwork.nativeCurrency
              }
            ],
          });
          dispatch(setNetwork(selectedNetwork))
          localStorage.setItem(process.env.REACT_APP_CURRENT_NETWORK, JSON.stringify(selectedNetwork));
          localStorage.setItem(process.env.REACT_APP_CURRENT_CHAIN, parseInt(selectedNetwork.chainId, 16));
        } catch (addError) {
          // handle "add" error
          printLog([addError]);
        }
      }
      // handle other "switch" errors
    }
    dispatch(setWcPopupConfig({ ...wcPopupConfig, show: false }))
    setSwitchNetwork(false);
    setSelectedNetwork(null);
  }

  return (
    <div className="create-step2">
      {
        showWalletConnectingDialog ? (
          <WalletConnectingDialog
            show={showWalletConnectingDialog}
            hideShow={() => setShowWalletConnectingDialog(false)}
            networkName={selectedNetwork.chainName}
          />
        ) : <>
          <div className="d-flex align-items-center mb-4">
            <KeyboardBackspaceIcon
              onClick={goPreviousStep}
              style={{ color: "#FFFFFF", cursor: "pointer" }}
            />
            <span className="step-lead">
              Back
            </span>
          </div>
          <p className="collectible-title">Switch Network</p>
          <p className="collectible-lead switch-network">
            Your are currently connected with your <span className="network-name">{currentNetwork.chainName}</span>  wallet. Please connect your <span className="network-name">{selectedNetwork.chainName}</span>  wallet to continue creating a challenge on the {selectedNetwork.chainName} Blockchain.
          </p>
          <button className="btn-continue" onClick={connectWalletClicked}>
            Switch Network
          </button>
        </>
      }
    </div>
  );
};

export default React.memo(ConnectWallet);
