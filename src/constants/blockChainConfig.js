import { networkType } from "./networkType";
import ConAdd from "./networkChain/contractAddress/contractTokenAdd";
import ConAbi from "./networkChain/abi/contractAbi";

export const blockChainConfig = [
  {
    name: "Etherium",
    key: "etherium",
    networkIdTestNet: networkType === "testnet" ? "4" : "4",
    networkIdMainNet: networkType === "testnet" ? "4" : "4",
    providerUrl:
      networkType === "testnet"
        ? "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
        : "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    providerUrlForMainnet:
      "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    ConConfig: { add: ConAdd, abi: ConAbi },
  },
];
