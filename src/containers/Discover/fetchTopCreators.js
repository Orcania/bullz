import { useSelector } from "react-redux";

import { useEffect, useState } from "react";

import { UserService } from "../../services/user.service";


export function useFetchTopCreators(startDate, endDate) {

    const [topCreators, setTopCreators] = useState("");
    const [loading, setLoading] = useState(false)

    const network = useSelector((state) => state.web3.network);
    const userService = new UserService(network.backendUrl);
    const [hasError, setHasError] = useState(false)
    useEffect(() => {
        setLoading(true)
        userService.getTopCreators(startDate, endDate)
            .then((res) => {
                let temp = res;
                    if (res && res.length < 12) {
                    for (let i = res.length; i < 12; i++) {
                        temp.push({
                        username: "Coming Soon",
                        });
                    }
                    }
                    setTopCreators(res ? temp : []);
            setLoading(false)
        }).catch(() => {
                setHasError(true)
                setLoading(false)
            })
    }, [ network , startDate, endDate])
    return [ topCreators, loading, hasError ]
}