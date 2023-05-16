import ERC1155Exchanger from "./ERC1155/erc1155Exchanger";
import ERC721Exchanger from "./ERC721/erc721Exchanger";
import ERC1155Challenge from "./ERC1155/ERC1155Challenge";

export const getNFTExchangerInstance = (web3Object, ntfType, network, wcPopupConfig, dispatch)=>{
    let exchanger =  new ERC721Exchanger(web3Object, network.smartContracts.ERC721_EXCHANGER_ADDRESS);
    if (ntfType === "ERC1155") {
      exchanger = new ERC1155Exchanger(web3Object, network.smartContracts.ERC1155_EXCHANGER_ADDRESS, wcPopupConfig, dispatch);
    }
    return exchanger;
  }

  export const getNFTChallengeInstance = (web3Object, ntfType, network, wcPopupConfig, dispatch)=>{
    let exchanger = new ERC1155Challenge(web3Object, network.smartContracts.ERC1155_CHALLANGE_ADDRESS, wcPopupConfig, dispatch);
    return exchanger;
  }