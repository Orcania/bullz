import { useSelector } from "react-redux";

import { useEffect, useState } from "react";

import { CollectionService } from "../../services/collection.service";
import { ChallengeService } from "../../services/challenge.service";
import { UserService } from "../../services/user.service";


export function useFetchSpotlightChallenges(chainId) {

    const [loading, setLoading] = useState(false)

    const [spotlightChallenges, setSpotlightChallenges] = useState("");
    const network = useSelector((state) => state.web3.network);
    const collectionService = new CollectionService(network.backendUrl);
    const userService = new UserService(network.backendUrl);
    const challengeService = new ChallengeService(network.backendUrl);
    const [hasError, setHasError] = useState(false)
    const getSpotlightChallenges = async () => {
      setLoading(!loading);      
      const response = await challengeService.getSpotlightChallenges(20, 1, chainId);
      let arr = [];
      if (response) {
        let challenges = response.data;        
        for (let i = 0; i < challenges.length; i++) {
          const challange = challenges[i]
          if (challenges[i].asset_type == 1) {
            let item = challange.nft;
            const holderData = await userService.getUser(item.holder);
            const collectionType = await collectionService.getCollectionsByAddress(
              item.collectionType
            );
            item.holderData = holderData;
            item.collectionType = collectionType ? collectionType : "";
            challange.nft = item;
          }
          arr.push(challange);
        }
  
        for (let i = arr.length; i < 10; i++) {
          let item = {};
          item.cover = `/images/image19${i+1}.png`
          item.name = "Coming Soon"
          arr.push(item);
        }
      }
      setSpotlightChallenges(arr);
      setLoading(!loading);
    }
    useEffect(() => {
      getSpotlightChallenges()
    }, [ network, chainId])
    return [ spotlightChallenges, loading, hasError ]
}