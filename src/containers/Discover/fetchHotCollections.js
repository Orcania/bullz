import { useSelector } from "react-redux";

import { useEffect, useState } from "react";

import { CollectionService } from "../../services/collection.service";

export function useFetchHotCollection(startDate, endDate, chainId) {

    const [trendingCollections, setTrendingCollections] = useState("");
    const [loading, setLoading] = useState(false)

    const network = useSelector((state) => state.web3.network);
    const collectionService = new CollectionService(network.backendUrl);
    const [hasError, setHasError] = useState(false)
    useEffect(() => {
        setLoading(true)
        collectionService.getTrendingCollections(startDate, endDate, chainId)
            .then((res) => {
                let temp = res;
                if (res && res.length < 12) {
                  for (let i = res.length; i < 12; i++) {
                    temp.push({
                      name: "Coming Soon",
                      image: "/images/card_yiki.png",
                    });
                  }
                }
                setTrendingCollections(res ? temp : []);
            setLoading(false)
        }).catch(() => {
                setHasError(true)
                setLoading(false)
            })
    }, [ network, startDate, endDate, chainId ])
    return [ trendingCollections, loading, hasError ]
}