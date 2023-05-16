// import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
// import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { networks } from "../../constants/networks";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// import WalletConnect from "@walletconnect/client";
// import QRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { setWcProvider, setWcPopupConfig } from "../../redux/actions/web3action";
import { printLog } from "utils/printLog";

const useAuth = () => {
  const [provider, setProvider] = useState(null);
  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState(1);
  const dispatch = useDispatch();
  const wcPopupConfig = useSelector((state) => state.web3.wcPopupConfig);
  const network = useSelector((state) => state.web3.network);
  const dispatchNetwork = network ? network: networks[process.env.REACT_APP_DEFAULT_NETWORK];
  
  async function switchToCustomNetwork(provider, _network) {
    printLog(['switchToCustomNetwork', _network.chainId], 'success');
    try {
      dispatch(setWcPopupConfig({...wcPopupConfig, show: true, message: "Please confirm network switching from wallet app in your device."}))
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: _network.chainId}],
      });      
    } catch (switchError) {
      printLog(['switchError', switchError.message], 'success');
      printLog(['switchError', JSON.stringify(switchError)], 'success');
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902 || switchError.message.includes('Unrecognized chain ID')) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: _network.chainName,
                chainId: _network.chainId,
                rpcUrls: [_network.rpcUrl],
                nativeCurrency: _network.nativeCurrency,
              },
            ],
          });          
        } catch (addError) {
          // handle "add" error          
          printLog(['addError', addError]);
        }
      } else {
        printLog(['switchError else']);
        logout(provider)
      }
    }
    dispatch(setWcPopupConfig({...wcPopupConfig, show: false}));
  }
  const login = async () => {
    printLog(['login'], 'success');
      try {
        const chainId = parseInt(dispatchNetwork.chainId, 16);
        const _provider = new WalletConnectProvider({
          // infuraId: process.env.REACT_APP_INFURA_ID,
          bridge:  "https://bridge.walletconnect.org",
          rpcUrl: dispatchNetwork.rpcUrl,
          rpc: {
            [chainId]: dispatchNetwork.rpcUrl,
            [parseInt(networks['goerli'].chainId, 16)] : networks['goerli'].rpcUrl,
            [parseInt(networks['bsctestnet'].chainId, 16)] : networks['bsctestnet'].rpcUrl,
            [parseInt(networks['polygon'].chainId, 16)] : networks['polygon'].rpcUrl,
            [parseInt(networks['avalanche'].chainId, 16)] : networks['avalanche'].rpcUrl,
            [parseInt(networks['arbitrum'].chainId, 16)] : networks['arbitrum'].rpcUrl,
          },
        });
    
        await _provider.enable().then((result => {
          printLog(['result', result], 'success');
          return result;
        })).catch(error => {
          printLog(['error', error]);
          dispatch(setWcPopupConfig({...wcPopupConfig, show: false}));
          return error;
        });

        _provider.on("connect", () => {
          printLog(["connect"], 'success');
        });
        
        // await _provider.disconnect();
        _provider.on("accountsChanged", (accounts) => {
          printLog(['accountsChanged',accounts], 'success');
          setProvider(_provider)
          dispatch(setWcProvider(_provider)); 
        });
        
        // Subscribe to chainId change
        _provider.on("chainChanged", async (chainId) => {
          printLog(['chainChanged',chainId], 'success');
          setChainId(chainId);
          setProvider(_provider)
          dispatch(setWcProvider(_provider)); 
          // logout(_provider);         
        });
        
        // Subscribe to session disconnection
        _provider.on("disconnect", (code, reason) => {
          printLog(['disconnect',code, reason], 'success');

          setConnected(false)
          setProvider(null);
          dispatch(setWcProvider(null)); 
          localStorage.removeItem('walletconnect');
        });

        printLog([_provider], 'success')        
        if (_provider.chainId == chainId) {
          setChainId(_provider.chainId);
          setProvider(_provider);
          setConnected(_provider.connected);
        } else {          
          switchToCustomNetwork(_provider, dispatchNetwork);
        }        
      } catch (err) {
        printLog(['exception', err]);
      }
  };

  const logout = async (provider) => {
    printLog(['logout', provider], 'success');
    if (provider && provider.connected) {     
      printLog(['logout 1', 'success']) 
      await provider.disconnect()

    }
  };

  return { login, logout, provider, connected, chainId };
};

export default useAuth;
