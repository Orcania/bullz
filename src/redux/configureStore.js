import { createStore, combineReducers, applyMiddleware } from "redux";
import { routerMiddleware } from "react-router-redux";
import { connectRouter } from "connected-react-router";
import thunk from "redux-thunk";
import * as History from "history";
// import logger from "redux-logger";

import themeReducer from "../redux/reducer/themereducer";
import web3Reducer from "../redux/reducer/web3reducer";
import authReducer from "../redux/reducer/authReducer";
import profileReducer from "../redux/reducer/profileReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import jwtReducer from "./reducer/jwtReducer";
import currencyReducer from "./reducer/currencyPriceReducer"

export const history = History.createBrowserHistory();

const middleware = [thunk, routerMiddleware(history)];

export const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    profile: profileReducer,
    theme: themeReducer,
    web3: web3Reducer,
    jwt: jwtReducer,
    currencyReducer: currencyReducer
  });

const Store = createStore(
  rootReducer(history),
  // composeWithDevTools(applyMiddleware(logger, thunk))
  composeWithDevTools(applyMiddleware(...middleware))
);
export default Store;
