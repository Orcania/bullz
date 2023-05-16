import { networkType } from "../../networkType";

let add = "";
if (networkType === "testnet") {
  add = ""; // test net
} else if (networkType === "mainnet") {
  add = ""; // main net
}

export default add;
