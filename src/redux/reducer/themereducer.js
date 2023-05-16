import { Theme_Color, Theme_Color_Boolean } from "../constants";
const initialState = {
  theme_color: "dark",
  theme_color_boolean: false,
};
const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case Theme_Color:
      return {
        ...state,
        theme_color: action.payload,
      };
    case Theme_Color_Boolean:
      return {
        ...state,
        theme_color_boolean: action.payload,
      };

    default:
      return state;
  }
};

export default themeReducer;
