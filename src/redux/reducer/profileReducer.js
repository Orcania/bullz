import {
  SET_PROFILE_NFTS,
  SET_REPORT_COLLECTIONS,
  SET_REPORT_NFTS,
  SET_REPORT_USERS,
  SET_SELECTED_PAGE_PROFILE,
  SET_SELECTED_TYPE_PROFILE,
  SET_REPORT_CHALLENGES,
} from "../constants";

const initialState = {
  profileNfts: [],
  selectedPage: "",
  selectedNftType: "",
  reportNfts:[],
  reportUsers:[],
  reportCollections: [],
  reportChallenges: []
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILE_NFTS:
      return {
        ...state,
        profileNfts: action.payload,
      };

    case SET_SELECTED_PAGE_PROFILE:
      return {
        ...state,
        selectedPage: action.payload,
      };

    case SET_SELECTED_TYPE_PROFILE:
      return {
        ...state,
        selectedNftType: action.payload,
      };

    case SET_REPORT_NFTS:
      return {
        ...state,
        reportNfts: action.payload,
      };

    case SET_REPORT_USERS:
      return {
        ...state,
        reportUsers: action.payload,
      };

    case SET_REPORT_COLLECTIONS:
      return {
        ...state,
        reportCollections: action.payload,
      };

    case SET_REPORT_CHALLENGES:
      return {
        ...state,
        reportChallenges: action.payload,
      };

    default:
      return state;
  }
};

export default profileReducer;
