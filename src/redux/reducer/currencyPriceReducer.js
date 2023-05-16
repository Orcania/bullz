import { SET_TOKEN_PRICE, SET_WOM_TO_ETH_RATE } from "../constants";

const initialState = {
  ethPrice: 0,
  womPrice: 0,
  womToEthPrice: 0,
};

const currenyReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOKEN_PRICE:
      return {
        ...state,
        ethPrice: action.payload.eth,
        womPrice: action.payload.wom,
      };

    case SET_WOM_TO_ETH_RATE:
      return {
        ...state,
        womToEthPrice: action.payload,
      };

    default:
      return state;
  }
};

export default currenyReducer;
