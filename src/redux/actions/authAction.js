import { SET_USER_DATA, SET_USER_DATA_LOADER } from "../constants";

export const setUserData = (data) => {
  return {
    type: SET_USER_DATA,
    payload: data,
  };
};

export const setUserDataLoader = (data) => {
  return {
    type: SET_USER_DATA_LOADER,
    payload: data,
  };
};
