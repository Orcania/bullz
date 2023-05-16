import WalletConnectProvider from "@walletconnect/web3-provider";

import Web3Modal from "web3modal";

import {
  Web_3_Object,
  WEB_3_CONNECTED,
  SET_META_MASK_ADDRESS,
  DELETE_META_MASK_ADDRESS,
  SET_NETWORK,
  WC_PROVIDER,
  WC_POPUP_CONFIG,
  NETWORK_SWITCH_CONFIG,
  USER_CHAIN_ID
} from "../constants";

import {networks} from '../../constants/networks'
import { getNetworkByChainId } from "common/utils";

const providerOptions = {
  walletconnect: {
    display: {
      name: "Mobile",
    },
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID, // required
    },
  },
};

// const savedNetwork = JSON.parse(localStorage.getItem(process.env.REACT_APP_CURRENT_NETWORK));
const currentChain = localStorage.getItem(process.env.REACT_APP_CURRENT_CHAIN);


const dispatchNetwork = currentChain ? getNetworkByChainId(currentChain) : networks[process.env.REACT_APP_DEFAULT_NETWORK];

const initialState = {
  web3object: {},
  metaMaskAddress: "",
  web3connected: false,
  network:dispatchNetwork,
  web3Modal: new Web3Modal({
    network: "rinkeby",
    cacheProvider: true,
    providerOptions, // required
  }),
  wcProvider: null,
  wcPopupConfig: {
    show: false,
    title: "Wallet connect action",
    message: "Please confirm the transaction from wallet app in your device."
  },
  networkSwitchConfig: {
    show: false,
    currentNetwork: null,
    newNetwork: null
  },
  userChainId: 0
};

const web3Reducer = (state = initialState, action) => {
  switch (action.type) {
    case Web_3_Object:
      return {
        ...state,
        web3object: action.payload,
      };
    case WEB_3_CONNECTED:
      return {
        ...state,
        web3connected: action.payload,
      };

    case SET_META_MASK_ADDRESS:
      return {
        ...state,
        metaMaskAddress: action.payload,
      };

    case SET_NETWORK:
      return {
        ...state,
        network: action.payload,
      }; 

    case DELETE_META_MASK_ADDRESS:
      return {
        ...state,
        metaMaskAddress: "",
      };

    case WC_PROVIDER:
      return {
        ...state,
        wcProvider: action.payload,
      };
    
    case WC_POPUP_CONFIG:
      return {
        ...state,
        wcPopupConfig: action.payload,
      };

    case NETWORK_SWITCH_CONFIG:
      return {
        ...state,
        networkSwitchConfig: action.payload,
      };
    case USER_CHAIN_ID:
      return {
        ...state,
        userChainId: action.payload,
      };
    default:
      return state;
  }
};
export default web3Reducer;
