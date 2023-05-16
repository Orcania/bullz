import React, { useState } from "react";
import { Modal, Row } from "react-bootstrap";
import './style.scss';
import { useDispatch, useSelector } from "react-redux";
import { setNetwork, setWcPopupConfig, setNetworkSwitchConfig } from "../../redux/actions/web3action";
import { printLog } from "utils/printLog";

function NetworkSwitchDialog(props) {
  const networkSwitchConfig = useSelector((state) => state.web3.networkSwitchConfig);
  const dispatch = useDispatch();
  const wcProvider = useSelector((state) => state.web3.wcProvider);
  const wcPopupConfig = useSelector((state) => state.web3.wcPopupConfig);

  const switchNetworkCalled = async () => {
    const connectedWith = localStorage.getItem("connectedWith");
    if (connectedWith === "walletConnect") {
      await switchToCustomNetwork(wcProvider, networkSwitchConfig.newNetwork, connectedWith);          
    } else if (connectedWith === "metamask"){        
      await switchToCustomNetwork(window.ethereum, networkSwitchConfig.newNetwork, connectedWith);
    }  
  }
 
  async function switchToCustomNetwork(ethereum, newNetwork, connectedWith){
    try {

      if (connectedWith == 'walletConnect') {
        dispatch(setWcPopupConfig({...wcPopupConfig, show: true, message: "Please confirm network switching from wallet app in your device."}))
      }
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: newNetwork.chainId }],
      });
      localStorage.setItem(process.env.REACT_APP_CURRENT_NETWORK, JSON.stringify(newNetwork));
      localStorage.setItem(process.env.REACT_APP_CURRENT_CHAIN, parseInt(newNetwork.chainId, 16));
      dispatch(setNetwork(newNetwork))
      
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
          localStorage.setItem(process.env.REACT_APP_CURRENT_NETWORK, JSON.stringify(newNetwork));
          localStorage.setItem(process.env.REACT_APP_CURRENT_CHAIN, parseInt(newNetwork.chainId, 16));
          dispatch(setNetwork(newNetwork))
        } catch (addError) {
          // handle "add" error
          printLog([addError]);
        }
      }
      // handle other "switch" errors
    }
    dispatch(setWcPopupConfig({...wcPopupConfig, show: false}))
    dispatch(setNetworkSwitchConfig({
      ...networkSwitchConfig,
      show: false    
    }));    
  } 

  return (
    <>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={networkSwitchConfig.show}
        onHide={() => {}}
        dialogClassName="dialog-container"
      >
        <Modal.Body>
          <Row>
            <div className="wallet-connect-container">
              <img src={'/images/bullzLogoBig.png'} alt="" className="logo-img" />
              <p className="subtitle">Please switch to {networkSwitchConfig.newNetwork?.chainName} network</p>
              <p className="title mb-2">In order to submit transactions, please switch to {networkSwitchConfig.newNetwork?.chainName} network within your wallet.</p>
              {/* <div className="wallet-items-container">
                
              </div> */}
              {/* <div className="agreement-container">
                
              </div> */}
              <button className={`btn-continue`} onClick={() => {switchNetworkCalled()}}>
                Switch Network
              </button>
              <button className={`btn-cancel mb-0 mt-3`} onClick={() => {
                dispatch(setNetworkSwitchConfig({
                  ...networkSwitchConfig,
                  show: false, 
                  currentNetwork: null,
                  newNetwork: null
                }));
              }}>
                CANCEL
              </button>
            </div>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default React.memo(NetworkSwitchDialog);