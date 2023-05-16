import { networkType } from "../../networkType";

let abi = "";
if (networkType === "testnet") {
  abi = [];
} else if (networkType === "mainnet") {
  abi = [];
}
export default abi;
