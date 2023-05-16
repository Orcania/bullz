import { useSelector } from "react-redux";

import { useEffect, useState } from "react";

import { CollectionService } from "../../services/collection.service";

export function useFetchHotCollection() {

    const [trendingCollections, setTrendingCollections] = useState("");
    const [loading, setLoading] = useState(false)

    const network = useSelector((state) => state.web3.network);
    const collectionService = new CollectionService(network.backendUrl);
    const [hasError, setHasError] = useState(false)
    useEffect(() => {
        setLoading(true)
        collectionService.getTrendingCollections()
            .then((res) => {
                let temp = res;
                if (res && res.length < 10) {
                  for (let i = res.length; i < 10; i++) {
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
    }, [ network ])
    return [ trendingCollections, loading, hasError ]
}