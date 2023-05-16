import React, { useState } from "react";
import { Modal, Row } from "react-bootstrap";
import walletconnect from "../../assets/images/walletconnect.png";
import metamask from "../../assets/images/metamask.png";
import './style.scss';
import { Checkbox, useMediaQuery } from "@material-ui/core";
import { Link } from 'react-router-dom';
import { networks } from '../../constants/networks';
import { setNetwork, setWcPopupConfig } from "../../redux/actions/web3action";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { printLog } from "utils/printLog";

function NetworkSwitcher(props) {
  const [show] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const dispatch = useDispatch();
  const wcProvider = useSelector((state) => state.web3.wcProvider);
  const wcPopupConfig = useSelector((state) => state.web3.wcPopupConfig);
  const isMobile = useMediaQuery('(min-width:350px) and (max-width:1023px)');

  async function switchToCustomNetwork(ethereum, newNetwork, connectedWith){
    try {

      if (connectedWith == 'walletConnect') {
        dispatch(setWcPopupConfig({...wcPopupConfig, show: true, message: "Please confirm network switching from wallet app in your device."}))
      }
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: newNetwork.chainId }],
      });
      dispatch(setNetwork(newNetwork));
      localStorage.setItem(process.env.REACT_APP_CURRENT_NETWORK, JSON.stringify(newNetwork));  
      localStorage.setItem(process.env.REACT_APP_CURRENT_CHAIN, parseInt(newNetwork.chainId, 16));
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
          dispatch(setNetwork(newNetwork));
          localStorage.setItem(process.env.REACT_APP_CURRENT_NETWORK, JSON.stringify(newNetwork));  
          localStorage.setItem(process.env.REACT_APP_CURRENT_CHAIN, parseInt(newNetwork.chainId, 16));
        } catch (addError) {
          // handle "add" error
          printLog([addError]);
        }
      }
      // handle other "switch" errors
    }
    dispatch(setWcPopupConfig({...wcPopupConfig, show: false}))    
  }

  const handleSelectWallet = async (network) => {
    if (network.chainName !== selectedWallet){     
      setSelectedWallet(network.chainName);
    }
    if(network && network?.chainId){      
      const connectedWith = localStorage.getItem("connectedWith");
      if (connectedWith == 'walletConnect') {
        await switchToCustomNetwork(wcProvider, network, connectedWith);
      } else {
        await switchToCustomNetwork(window.ethereum, network, connectedWith);
      }
          
    }
    props.setShowNetworkSwitcher(false);
  }

  return (
    <>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={!show}
        onHide={() => props.hideShow()}
        dialogClassName="dialog-container"
      >        
        <Modal.Body>
            <div className="network-switcher-container">
              <img src={'/images/bullzLogoBig.png'} alt="" className="logo-img" />
              <p className="subtitle">Change Network</p>
              <p className="title">Please, switch to Polygon Network in your wallet.</p>
              <div className="wallet-items-container">
                {
                  Object.keys(networks).map((key, index)=>(
                    <div onClick={()=> handleSelectWallet(networks[key])} className={`wallet-item-wrapper ${networks[key].chainName === selectedWallet ? "selected" : ""}`}>
                      <img src={`${networks[key].icon.split(".")[0]}${isMobile ? ".png" : ".svg"}`} alt="" className="wallet-item" />
                      <p className="wallet-name">{networks[key].chainName === "Binance Smart Chain" ? "BNB CHAIN" : networks[key].chainName === "Arbitrum One" ? "Arbitrum" : networks[key].chainName}</p>
                    </div>
                  ))
                }
              </div>
            </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default React.memo(NetworkSwitcher);