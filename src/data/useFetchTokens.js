import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

export function useFetchTokens(network){
    // const network = useSelector((state) => state.web3.network);
    const [tokens, setTokens] = useState([]);
    useEffect(()=>{
        if(network && !(Object.keys(network).length === 0)){
          let fetchTokens = [];
          for(let token of network.smartContracts.BID_UTILITY_TOKENS){
            fetchTokens.push(
              {
                value: token.address,
                currencyKey: token.symbol,
                image:token.logo        
              }
            )
          } 
          setTokens(fetchTokens);
        }
    },[network])
    return tokens;
}