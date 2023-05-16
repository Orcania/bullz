import { useMediaQuery } from "@material-ui/core";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router-dom";

import Carousel from "../../components/Common/Carousel";
import CollectionCard from "../../components/Common/CollectionCard";
import ComingSoonCard from "../../components/Common/ComingSoonCard";
import ComingUser from "../../components/Common/ComingUser";
import LoadingCard from "../../components/Common/LoadingCard";
import ExploreCard from "../../components/Common/ExploreCard/index";
import ChallengeCard from "../../components/Common/ChallengeCard/index"

import { useFetchHotCollection } from "./fetchHotCollections";
import { useFetchTopChallenges } from "./fetchTopChallenges";
import { useFetchTopCreators } from "./fetchTopCreators";
import { useFetchTrendingNFTs } from "./fetchTrendingNfts";
import { useFetchSpotlightChallenges } from "./fetchSpotlightChallenges";
import "./style.scss";
import moment from 'moment';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { networks } from "constants/networks";
import { setUserChainId } from "redux/actions/web3action";
import { printLog } from "utils/printLog";

const optionsCommonCard = {
  slideBy: "page",
  responsive: {
    0: {
      items: 3,
    },
    413: {
      items: 3,
      margin: 25,
    },
    450: {
      items: 3.7,
    },
    560: {
      items: 4,
    },
    769: {
      items: 2.5,
    },
    900: {
      items: 2.5,
    },
    1024: {
      items: 3.5,
    },
    1400: {
      items: 4,
    },
    1500: {
      items: 5,
    },
  },
};

const optionsUserCard = {
  responsive: {
    0: {
      items: 2,
      margin: 15,
    },
    560: {
      items: 2,
      margin: 15,
    },
    768: {
      items: 2,
    },
    900: {
      items: 2.6,
    },
    1024: {
      items: 3.7,
    },
    1440: {
      items: 5,
    },
  },
};

const renderTopContents = (items, history) => {
  let fullList = [];
  let userList = [];
  for (let i = 0; i < items.length; i++) {
    userList = [
      ...userList,
      <div className="coming">
        <ComingUser
          info={items[i]}
          count={i + 1}
          history={history}
          comingfor={"buyers"}
        />
      </div>,
    ];

    if ((i + 1) % 3 === 0) {
      fullList = [...fullList, userList];
      userList = [];
    }
  }

  return (
    <Carousel items={5} option={{ ...optionsUserCard }}>
      {fullList.map((item) => (
        <div>{item}</div>
      ))}
    </Carousel>
  );
};

const renderMobileCollections = (items, history) => {
  let fullList = [];
  let collectionList = [];
  for (let i = 0; i < items.length; i++) {
    collectionList = [
      ...collectionList,
      <div className="coming">
        <CollectionCard
          info={items[i]}
          count={i + 1}
          history={history}
          comingfor={"buyers"}
        />
      </div>,
    ];

    if ((i + 1) % 3 === 0) {
      fullList = [...fullList, collectionList];
      collectionList = [];
    }
  }

  return (
    <Carousel items={5} option={{ ...optionsUserCard }}>
      {fullList.map((item) => (
        <div>{item}</div>
      ))}
    </Carousel>
  );
};

const TopCreators = ({chainId}) => {
  const history = useHistory();
  const [creator, setCreator] = useState("1d");
  const [endDate, setEndDate] = useState(moment().endOf('day').valueOf());
  const initialStartdate = moment(endDate).subtract(1, "days").startOf('day').valueOf();
  const [startDate, setStartDate] = useState(initialStartdate);

  const [topCreators] = useFetchTopCreators(startDate, endDate);
  const opacity = false;
  const isMobile = useMediaQuery("(min-width:350px) and (max-width: 1023px)");

  const sortByFilters = [
    { key: 1, value: "1 day" },
    { key: 3, value: "3 days" },
    { key: 5, value: "5 days" },
    { key: 7, value: "7 days" },
  ];
  const [sortByOpen, setSortByOpen] = useState(false);
  const [sortBy, setSortBy] = useState("");

  const handleSelectedSubFilter = (filter) => {
    setSortByOpen(false);
    setSortBy(filter);
    setStartDate(moment(endDate).subtract(filter.key, "days").startOf('day').valueOf())
  };

  return (
    <div className="creators-section">
      <div className="container">
        <div className="section-header">
          <div className="d-flex align-items-center">
            <p className="section-title mt-0">Top Creators</p>
            <div className="dropdown-item">
              <div
                className="dropdown-content"
                onClick={() => setSortByOpen(!sortByOpen)}
              >
                <p className="dropdown-lead">{sortBy ? sortBy.value : "1 day"}</p>

                <ArrowDropDownIcon />
              </div>
              <div
                className={`dropdown-card most-recent ${sortByOpen ? "open" : ""
                  }`}
              >
                <div className="most-recent-body">
                  {sortByFilters.map((filter) => {
                    return (
                      <div
                        className="collection-item"
                        onClick={() => handleSelectedSubFilter(filter)}
                      >
                        <p className="dropdown-lead">{filter.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* <div className="button-group mt-0 mobile-view">
            <button
              className={`btn-continue ${creator === "1d" ? "" : "not-allow"}`}
              onClick={() => setCreator("1d")}
            >
              1D
            </button>
            <button
              className={`btn-continue ${creator === "7d" ? "" : "not-allow"}`}
              onClick={() => setCreator("7d")}
            >
              7D
            </button>
            <button
              className={`btn-continue ${creator === "30d" ? "" : "not-allow"}`}
              onClick={() => setCreator("30d")}
            >
              30D
            </button>
          </div> */}
          <button
            className={"see-all-btn"}
            onClick={() => history.push("/creators")}
          >
            See All
          </button>
        </div>
        <div className="row pl--15">
          {topCreators === "" ? (
            <>
            {
              !isMobile ?
                Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).map((item, index) => (
                  <div className="coming loading">
                    <img alt="" src={"/images/creator-loading.png"} />
                  </div>
                )) : <div>

                  <div className="d-flex justify-content-between">
                    {
                      Array.from([1, 2]).map(item => (
                        <div>
                          <div className="coming loading">
                            <img alt="" src={"/images/creator-loading-mobile.png"} />
                          </div>
                          <div className="coming loading">
                            <img alt="" src={"/images/creator-loading-mobile.png"} />
                          </div>
                          <div className="coming loading">
                            <img alt="" src={"/images/creator-loading-mobile.png"} />
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
            }
          </>
          ) : topCreators.length === 0 ? (
            "No Data Found"
          ) : isMobile ? (
            renderTopContents(topCreators, history)
          ) : (
            topCreators.map((item, index) => (
              <div className="coming">
                <ComingUser
                  key={index}
                  info={item}
                  count={index + 1}
                  history={history}
                  comingfor={"creators"}
                />
              </div>
            ))
          )}
        </div>

        {/* <div className="mobile-show d-flex align-items-center justify-content-center">
              <button
          className={"see-all-btn mobile-show"}
          onClick={() => history.push("/creators")}
        >
          See All
        </button>
              </div> */}

      </div>
    </div>
  );
};

const HotCollection = ({chainId}) => {
  // const [dateRangeOpen, setDateRangeOpen] = useState(false);
  // const [dateRange, setDateRange] = useState("");
  const [endDate, setEndDate] = useState(moment().endOf('day').valueOf());
  const initialStartdate = moment(endDate).subtract(1, "days").startOf('day').valueOf();
  const [startDate, setStartDate] = useState(initialStartdate);
  const sortByFilters = [
    { key: 1, value: "1 day" },
    { key: 3, value: "3 days" },
    { key: 5, value: "5 days" },
    { key: 7, value: "7 days" },
  ];
  const [sortByOpen, setSortByOpen] = useState(false);
  const [sortBy, setSortBy] = useState("");

  const handleSelectedSubFilter = (filter) => {
    // setDateRangeOpen(false);
    // setDateRange(value);
    setSortByOpen(false);
    setSortBy(filter);
    setStartDate(moment(endDate).subtract(filter.key, "days").startOf('day').valueOf())
  };

  const history = useHistory();
  const [trendingCollections] = useFetchHotCollection(startDate, endDate, chainId);
  const opacity = false;
  const isMobile = useMediaQuery("(min-width:350px) and (max-width: 1023px)");

  return (
    <div className="creators-section">
      <div className="container">
        <div className="section-header">
          <div className="d-flex align-items-center">
            <p className="section-title mt-0">Hot Collection</p>
            <div className="dropdown-item">
              <div
                className="dropdown-content"
                onClick={() => setSortByOpen(!sortByOpen)}
              >
                <p className="dropdown-lead">{sortBy ? sortBy.value : "1 day"}</p>

                <ArrowDropDownIcon />
              </div>
              <div
                className={`dropdown-card most-recent ${sortByOpen ? "open" : ""
                  }`}
              >
                <div className="most-recent-body">
                  {sortByFilters.map((filter) => {
                    return (
                      <div
                        className="collection-item"
                        onClick={() => handleSelectedSubFilter(filter)}
                      >
                        <p className="dropdown-lead">{filter.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* <div className="button-group mt-0 mobile-view">
            <button
              className={`btn-continue ${creator === "1d" ? "" : "not-allow"}`}
              onClick={() => setCreator("1d")}
            >
              1D
            </button>
            <button
              className={`btn-continue ${creator === "7d" ? "" : "not-allow"}`}
              onClick={() => setCreator("7d")}
            >
              7D
            </button>
            <button
              className={`btn-continue ${creator === "30d" ? "" : "not-allow"}`}
              onClick={() => setCreator("30d")}
            >
              30D
            </button>
          </div> */}
          <button
            className={"see-all-btn"}
            onClick={() => { history.push("/collections") }}
          >
            See All
          </button>
        </div>
        <div className="row pl--15">
          {trendingCollections === "" ? (
            <>
              {
                !isMobile ?
                  Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).map((item, index) => (
                    <div className="coming loading">
                      <img alt="" src={"/images/creator-loading.png"} />
                    </div>
                  )) : <div>
                    <div className="d-flex justify-content-between">
                      {
                        Array.from([1, 2]).map(item => (
                          <div>
                            <div className="coming loading">
                              <img alt="" src={"/images/creator-loading-mobile.png"} />
                            </div>
                            <div className="coming loading">
                              <img alt="" src={"/images/creator-loading-mobile.png"} />
                            </div>
                            <div className="coming loading">
                              <img alt="" src={"/images/creator-loading-mobile.png"} />
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
              }
            </>

          ) : trendingCollections.length === 0 ? (
            "No Data Found"
          ) : isMobile ? (
            renderMobileCollections(trendingCollections, history)
          ) : (
            trendingCollections.map((item, index) => (
              <div className="coming">
                <CollectionCard
                  key={index}
                  info={item}
                  count={index + 1}
                  history={history}
                  comingfor={"creators"}
                />
              </div>
            ))
          )}
        </div>

        {/* <button
          className={"see-all-btn mobile-show"}
          onClick={() => history.push("/creators")}
        >
          See All
        </button> */}
      </div>
    </div>
  );
};

const HotBids = ({chainId}) => {
  const userData = useSelector((state) => state.auth.userData);
  const [trendingNfts] = useFetchTrendingNFTs(chainId);
  const history = useHistory();

  return (
    <div className="collection-section">
      <div className="container">
        <div className="section-header">
          <div className="d-flex align-items-center">
            <p className="section-title mt-0" style={{ marginTop: 32 }}>Trending NFTs</p>
          </div>
          <button
            className={"see-all-btn"}
            onClick={() => { (history.push({
              pathname: '/explorer/art',
              state: {
                chainId: chainId
              }
            })) }}
          >
            See All
          </button>
        </div>
        {trendingNfts === "" ? (
          <div className="no-bg next-hide">
            <Carousel items={5} option={{ ...optionsCommonCard, margin: 50 }}>
              <LoadingCard transition="0.8s linear" />
              <LoadingCard transition="0.8s linear" />
              <LoadingCard transition="0.8s linear" />
              <LoadingCard transition="0.8s linear" />
              <LoadingCard transition="0.8s linear" />
              <LoadingCard transition="0.8s linear" />
            </Carousel>
          </div>
        ) : trendingNfts && trendingNfts.length === 0 ? (
          "No Data Found"
        ) : (
          <Carousel items={5} option={{ ...optionsCommonCard, margin: 50 }}>
            {trendingNfts.map((nft, index) =>
              nft.id ? (
                <ExploreCard
                  item={nft}
                  key={index}
                  user={nft.holderData}
                  loggedInUser={userData}
                  // likeNFT={likeNFT}
                  showMenu={true}
                />
              ) : (
                <ComingSoonCard item={nft} key={index} />
              )
            )}
          </Carousel>
        )}
      </div>
    </div>
  );
};

const TopChallenges = ({chainId}) => {
  const userData = useSelector((state) => state.auth.userData);
  const [liveAuctionsNfts] = useFetchTopChallenges(chainId);
  const history = useHistory();
  return (
    <div className="collection-section">
      <div className="container">
        <div className="section-header">
          <div className="d-flex align-items-center">
            <p className="section-title mt-0">Trending challenges</p>
          </div>
          <button
            className={"see-all-btn"}
            onClick={() => { history.push({
              pathname: '/challenges',
              state: {
                chainId: chainId
              }
            }) }}
          >
            See All
          </button>
        </div>
        {liveAuctionsNfts === "" ? (
          <div className="no-bg next-hide">
            <Carousel items={5} option={{ ...optionsCommonCard, margin: 50 }}>
              <LoadingCard transition="0.8s linear" />
              <LoadingCard transition="0.8s linear" />
              <LoadingCard transition="0.8s linear" />
              <LoadingCard transition="0.8s linear" />
              <LoadingCard transition="0.8s linear" />
              <LoadingCard transition="0.8s linear" />
            </Carousel>
          </div>
        ) : liveAuctionsNfts && liveAuctionsNfts.length === 0 ? (
          "No Data Found"
        ) : (
          <Carousel items={5} option={{ ...optionsCommonCard, margin: 50 }}>
            {liveAuctionsNfts.map((challenge, index) =>
              challenge.id ? (
                <ChallengeCard
                  challenge={challenge}
                  key={index}
                  loggedInUser={userData}
                />
              ) : (
                <ComingSoonCard item={challenge} key={index} />
              )
            )}
          </Carousel>
        )}
      </div>
    </div>
  );
};

const SpotlightChallenges = ({chainId}) => {
  const userData = useSelector((state) => state.auth.userData);
  const [spotlightChallenges] = useFetchSpotlightChallenges(chainId);

  return (
    <div className="collection-section">
      <div className="container">
        <p className="section-title mt-0">Spotlight challenges</p>
        {spotlightChallenges === "" ? (
          <div className="no-bg next-hide">
            <Carousel items={5} option={{ ...optionsCommonCard, margin: 50 }}>
              <LoadingCard transition="0.8s linear" />
              <LoadingCard transition="0.8s linear" />
              <LoadingCard transition="0.8s linear" />
              <LoadingCard transition="0.8s linear" />
              <LoadingCard transition="0.8s linear" />
              <LoadingCard transition="0.8s linear" />
            </Carousel>
          </div>
        ) : spotlightChallenges && spotlightChallenges.length === 0 ? (
          "No Data Found"
        ) : (
          <Carousel items={5} option={{ ...optionsCommonCard, margin: 50 }}>
            {spotlightChallenges.map((challenge, index) =>
              challenge.id ? (
                <ChallengeCard
                  challenge={challenge}
                  key={index}
                  loggedInUser={userData}
                />
              ) : (
                <ComingSoonCard item={challenge} key={index} />
              )
            )}
          </Carousel>
        )}
      </div>
    </div>
  );
};

const NetworkOptions = ({chainId, setChainId}) => {
  const options = [
    {
      id: 1,
      text: "All Challenges",
      value: "all",
      chainId: 0
    },
    {
      id: 2,
      text: "Ethereum",
      value: "ethereum",
      chainId: parseInt(networks['goerli'].chainId, 16)
    },
    {
      id: 3,
      text: "Polygon",
      value: "polygon",
      chainId: parseInt(networks['polygon'].chainId, 16)
    },
    {
      id: 4,
      text: "BNB",
      value: "Binance Smart Chain",
      chainId: parseInt(networks['bsctestnet'].chainId, 16)
    },
    {
      id: 5,
      text: "Avalanche",
      value: "Avalanche C-CHAIN",
      chainId: parseInt(networks['avalanche'].chainId, 16)
    },
    {
      id: 6,
      text: "Arbitrum",
      value: "Arbitrum One",
      chainId: parseInt(networks['arbitrum'].chainId, 16)
    }
  ]
  const dispatch = useDispatch();
  return (
    <div className="d-flex align-items-center justify-content-center w-100 network-options">
      {
        options.map(item=> <button className={`btn-continue mb-0 ${item.chainId != chainId ? 'btn-disable' : ''}`} onClick={() => {

          printLog(['item.chainId', item.chainId], 'success');
          dispatch(setUserChainId(item.chainId));
          setChainId(item.chainId);
        }}>{item.text}</button>)
      }
    </div>
  )
}


const Discover = () => {
  const [loadAuctionComponent, setLoadAuctionComponent] = useState(false);
  const [loadCollectionComponent, setLoadCollectionComponent] = useState(false);
  const [loadBuyerComponent, setLoadBuyerComponent] = useState(false);
  const network = useSelector((state) => state.web3.network);
  const isWeb3Connected = useSelector((state) => state.web3.web3connected);
  const userChainId = useSelector((state) => state.web3.userChainId);
  const [loadNetwork, setLoadNetwork] = useState(false);
  const [chainId, setChainId] = useState(userChainId);
  const history = useHistory();
  
  useEffect(() => {
    if (network && Object.keys(network)?.length > 0) {
      setLoadNetwork(true);
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [network]);

  const handleScroll = () => {
    if (window.scrollY > 1500) {
      setLoadBuyerComponent(true);
    } else if (window.scrollY > 1000) {
      setLoadCollectionComponent(true);
    } else if (window.scrollY > 500) {
      setLoadAuctionComponent(true);
    }
  };
  const connectWallet = async (e) => {
    if (document.getElementById("connectButton")) {
      document.getElementById("connectButton").click();
    }
  };

  const handleCreateButtonClick = () => {
    if (isWeb3Connected) {
      history.push('/create');
    } else {
      connectWallet();
    }
  }
  return (
    loadNetwork && (
      <div className="homepage">
        <h1 className="discover-page-title">Discover Challenges</h1>
        <NetworkOptions 
        chainId={chainId}
        setChainId={setChainId}
        />
        <SpotlightChallenges chainId={chainId} />
        <TopCreators chainId={chainId} />
        <TopChallenges chainId={chainId} />
        <HotBids chainId={chainId} />
        <HotCollection chainId={chainId} />

        <div className="container">
          <div className="create-section">
            <div>
              <h1 className="title">
                Create your <br /> challenge now
              </h1>

              <button className="btn-continue" onClick={handleCreateButtonClick}>
                Create
              </button>
            </div>
            <img className="img-sm" src="/images/bullz-logo-rotate.png" alt="" />
            <img className="img-lg" src="/images/bullz-logo-rotate.png" alt="" />
          </div>
        </div>
      </div>

    )
  );
};

export default Discover;
