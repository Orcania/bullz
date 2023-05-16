import { useSelector } from "react-redux";

import { useEffect, useState } from "react";

import { UserService } from "../../services/user.service";


export function useFetchTopBuyers(creator) {

    const [topBuyers, setTopBuyers] = useState("");
    const [loading, setLoading] = useState(false)

    const network = useSelector((state) => state.web3.network);
    const userService = new UserService(network.backendUrl);
    const [hasError, setHasError] = useState(false)
    useEffect(() => {
        setLoading(true)
        userService.getTopBuyers()
            .then((res) => {
                let temp = res;
                    if (res && res.length < 12) {
                    for (let i = res.length; i < 12; i++) {
                        temp.push({
                        firstname: "Coming",
                        lastname: "Soon",
                        username: "Coming Soon",
                        });
                    }
                    }
                    setTopBuyers(res ? temp : []);
            setLoading(false)
        }).catch(() => {
                setHasError(true)
                setLoading(false)
            })
    }, [ network , creator])
    return [ topBuyers, loading, hasError ]
}