import { useSelector } from "react-redux";

import { useEffect, useState } from "react";

import { CollectionService } from "../../services/collection.service";
import { NftService } from "../../services/nft.service";
import { UserService } from "../../services/user.service";


export function useFetchLiveAuctions() {

    const [loading, setLoading] = useState(false)

    const [liveAuctionsNfts, setLiveAuctionsNfts] = useState("");
    const network = useSelector((state) => state.web3.network);
    const collectionService = new CollectionService(network.backendUrl);
    const userService = new UserService(network.backendUrl);
    const nftService = new NftService(network.backendUrl);
    const [hasError, setHasError] = useState(false)
    const getLiveAuctions = async () => {
      setLoading(!loading);
      const response = await nftService.getLiveAuctions();
      let arr = [];
      if (response) {
        let nftss = response;
        for (let i = 0; i < nftss.length; i++) {
          let item = nftss[i];
          let hash = item.uri.split("/ipfs/")[1];
          const holderData = await userService.getUser(item.holder);
          const collectionType = await collectionService.getCollectionsByAddress(
            item.collectionType
          );
          item.holderData = holderData;
          item.collectionType = collectionType ? collectionType : "";
          arr.push(item);
        }
  
        for (let i = arr.length; i < 10; i++) {
          let item = {};
          item.cover = `/images/image19${i+1}.png`
          item.name = "Coming Soon"
          arr.push(item);
        }
      }
      setLiveAuctionsNfts(arr);
      setLoading(!loading);
    }
    useEffect(() => {
      getLiveAuctions()
    }, [ network])
    return [ liveAuctionsNfts, loading, hasError ]
}