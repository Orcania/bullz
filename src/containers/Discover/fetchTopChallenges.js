import { useSelector } from "react-redux";

import { useEffect, useState } from "react";

import { CollectionService } from "../../services/collection.service";
import { NftService } from "../../services/nft.service";
import { UserService } from "../../services/user.service";
import { ChallengeService } from "services/challenge.service";
import { printLog } from "utils/printLog";


export function useFetchTopChallenges(chainId) {

    const [loading, setLoading] = useState(false)

    const [topChallengeNfts, setTopChallengeNfts] = useState("");
    const network = useSelector((state) => state.web3.network);
    const collectionService = new CollectionService(network.backendUrl);
    const userService = new UserService(network.backendUrl);
    const nftService = new NftService(network.backendUrl);
    const challengeService = new ChallengeService(network.backendUrl);
    const [hasError, setHasError] = useState(false)
    const getTopChallenges = async () => {
      setLoading(!loading);      
      const response = await challengeService.getTopChallengeNfts(10, chainId);
      let arr = [];
      if (response) {
        let challenges = response;        
        for (let i = 0; i < challenges.length; i++) {
          let item = challenges[i];
          printLog(['challenge', item], 'success');

          if (item.asset_type == 1) {
            const holderData = await userService.getUser(item.nft.holder);
            const collectionType = await collectionService.getCollectionsByAddress(
              item.nft.collectionType
            );
            item.nft.holderData = holderData;
            item.nft.collectionType = collectionType ? collectionType : "";
          }          
          arr.push(item);
        }
  
        for (let i = arr.length; i < 10; i++) {
          let item = {};
          item.cover = `/images/image19${i+1}.png`
          item.name = "Coming Soon"
          arr.push(item);
        }
      }
      setTopChallengeNfts(arr);
      setLoading(!loading);
    }
    useEffect(() => {
      getTopChallenges()
    }, [ network, chainId])
    return [ topChallengeNfts, loading, hasError ]
}