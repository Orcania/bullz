import {
  SET_USER_DATA,
  SET_USER_DATA_LOADER,
  SET_USER_NFTS,
  SET_EXPLORE_NFTS,
  SET_SELECTED_PAGE,
  SET_SELECTED_TYPE,
} from "../constants";

const initialState = {
  userData: {},
  nfts: [],
  exploreNfts: [],
  isUserDataLoading: false,
  selectedPage: "",
  selectedNftType: "",
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DATA_LOADER:
      return {
        ...state,
        isUserDataLoading: action.payload,
      };

    case SET_USER_DATA:
      return {
        ...state,
        userData: action.payload,
        isUserDataLoading: false,
      };

    case SET_USER_NFTS:
      return {
        ...state,
        nfts: action.payload,
      };

    case SET_EXPLORE_NFTS:
      return {
        ...state,
        exploreNfts: action.payload,
      };

    case SET_SELECTED_PAGE:
      return {
        ...state,
        selectedPage: action.payload,
      };

    case SET_SELECTED_TYPE:
      return {
        ...state,
        selectedNftType: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
