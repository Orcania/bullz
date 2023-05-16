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

export const setMetaMask = (content) => ({
  type: SET_META_MASK_ADDRESS,
  payload: content,
});

export const setNetwork = (content) => ({
  type: SET_NETWORK,
  payload: content,
});

export const deleteMetaMask = () => ({ type: DELETE_META_MASK_ADDRESS });

export function Web3Object(value) {
  return {
    type: Web_3_Object,
    payload: value,
  };
}

export function setWcProvider(value) {
  return {
    type: WC_PROVIDER,
    payload: value,
  };
}

export function setWcPopupConfig(value) {
  return {
    type: WC_POPUP_CONFIG,
    payload: value,
  };
}

export function web3Connected(value) {
  return {
    type: WEB_3_CONNECTED,
    payload: value,
  };
}

export function setNetworkSwitchConfig(value) {
  return {
    type: NETWORK_SWITCH_CONFIG,
    payload: value,
  };
}

export function setUserChainId(value) {
  return {
    type: USER_CHAIN_ID,
    payload: value,
  };
}


// export default {Web3Object, web3Connected};
