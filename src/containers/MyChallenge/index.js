import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useMediaQuery } from "@material-ui/core";

import React, { useState, useEffect, useRef } from "react";

import { useHistory } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import ReactPaginate from "react-paginate";

import { Spinner } from "react-bootstrap";

import { ChallengeService } from "services/challenge.service";

import { collectibleTypes } from './../../data/tokenTypes';
import {
  SET_EXPLORE_NFTS,
  SET_USER_DATA,
  SET_SELECTED_PAGE,
} from "../../redux/constants";
import { CollectionService } from "../../services/collection.service";
import { NftService } from "../../services/nft.service";
import NftCard from "../../components/Common/ExploreCard/index";
import ChallengeCard from "../../components/Common/ChallengeCard/index";

import "./style.scss";
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { SearchService } from "../../services/search.service";
import { UserService } from "../../services/user.service";
import CustomLoader from "components/CustomLoader/CustomLoader";
import { networks } from "constants/networks";
const sortByFilters = [
  { key: "ASC", value: "Old to New" },
  { key: "DESC", value: "New to Old" },
];

const statusArray = [
  { key: 'all', value: "Status: All" },
  { key: "expiresAt", value: "Status: In Submission" },
  { key: "airdropStartAt", value: "Status: In Airdrop" },
  { key: "airdropEndAt", value: "Status: Airdrop finished" },
];

const networkTypeFilters = [
  { key: "all", value: "All" , chainId: 0},
  { key: "ethereum", value: "Ethereum", chainId: parseInt(networks['goerli'].chainId, 16)},
  { key: "polygon", value: "Polygon",  chainId: parseInt(networks['polygon'].chainId, 16) },
  { key: "Binance Smart Chain", value: "BNB CHAIN", chainId: parseInt(networks['bsctestnet'].chainId, 16) },
  { key: "Avalanche C-CHAIN", value: "Avalanche C-CHAIN", chainId: parseInt(networks['avalanche'].chainId, 16) },
  { key: "Arbitrum One", value: "Arbitrum One", chainId: parseInt(networks['arbitrum'].chainId, 16) },
];

const MyChallenge = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.userData);
  // const nfts = useSelector((state) => state.auth.exploreNfts);
  const selectedPageReducer = useSelector((state) => state.auth.selectedPage);
  const isWeb3Connected = useSelector((state) => state.web3.web3connected);
  const network = useSelector((state) => state.web3.network);

  const nftService = new NftService(network.backendUrl);
  const collectionService = new CollectionService(network.backendUrl);
  const challengeService = new ChallengeService(network.backendUrl);
  const searchService = new SearchService(network.backendUrl);
  const userService = new UserService(network.backendUrl);

  const filterRef = useRef();

  const [sortByOpen, setSortByOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [networkTypeOpen, setNetworkTypeOpen] = useState(false);

  const [sortBy, setSortBy] = useState(-1);
  const [isItem, setIsItem] = useState(false);


  const [selectedPage, setSelectedPage] = useState(
    selectedPageReducer ? selectedPageReducer : 1
  );
  const [limit, setLimit] = useState(8);

  const [totalCount, setTotalCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [status, setStatus] = useState(-1);
  const [networkType, setNetworkType] = useState(null);
  const [challenges, setChallenges] = useState(null);

  const [isMobileFilter, setIsMobileFilter] = useState(true);
  const [isShowingFilter, setIsShowingFilter] = useState(false);
  const [query, setSearchQuery] = useState("");

  const isMobile = useMediaQuery('(min-width:350px) and (max-width:1023px)');

  const handlePageClick = (page) => {
    setSelectedPage(page.selected + 1);
  };

  async function loadNfts() {
    setIsLoading(true);
    // sortBy, page, limit, status
    if (userData && userData.id) {
      const _sortBy = sortBy == -1 ? 1 : sortBy;
      const _status = status == -1 ? 0 : status;
      const response = await challengeService.getUserChallengesWithFilters(
        sortByFilters[_sortBy].key,
        selectedPage,
        limit,
        statusArray[_status].key,
        userData.id,
        networkType?.chainId
      );
      // const totalCount = await challengeService.count(userData.id);
    await setData(response);
    // dispatch({
    //   type: SET_EXPLORE_NFTS,
    //   payload: arr.length ? arr : null,
    // });
    dispatch({
      type: SET_SELECTED_PAGE,
      payload: selectedPage,
    });
      setIsLoading(false);
    }
  }

 

  useEffect(() => {
    loadNfts();
  }, [selectedPage, status, sortBy, userData, networkType]);

  function handleSetSortBy(index) {
    setSortBy(index);
    setSortByOpen(false);
    setStatusOpen(false);
  }

  function handleSetStatus(index) {
    setStatus(index);
    setStatusOpen(false);
    setSortByOpen(false);
  }

  function handleSetNetworkType(filter) {
    setNetworkType(filter);
    setNetworkTypeOpen(false);
  }

  function handleClearSubFilter() {
    setSortBy(-1)
    setStatus(-1);
    setStatusOpen(false);
    setSortByOpen(false);
    setNetworkType(null);
  }

  const onOutsideClickOfFilter = (e) => {
    if (!filterRef?.current?.contains(e.target)) {
      setStatusOpen(false);
      setSortByOpen(false);
      setNetworkTypeOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', onOutsideClickOfFilter);
    return () => document.removeEventListener('mousedown', onOutsideClickOfFilter);
  });

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getSearchData(query);
    }, 1000);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [query]);


  async function getSearchData(q) {
    if (q.length > 2) {
      setIsLoading(true);
      let res = await searchService.getSearchDataChallengeByUser(userData.address, q, selectedPage, limit);     
      await setData(res);
      setIsLoading(false);
    } else if (q.length == 0) {
      loadNfts();
    } else {
    }
  }

  const  setData = async (response) => {
    let arr = [];
    if (response.data) {

      let _challenges = response.data;
      setTotalCount(response.totalCount);
      for (let i = 0; i < _challenges.length; i++) {
        const _challenge = _challenges[i];
        
        if (_challenge.asset_type == 1) {
          let item = _challenge.nft;
          if (item) {
            const holderData = _challenge.creator;
            const collectionType =
              await collectionService.getCollectionsByAddress(
                item.collectionType
              );
            item.holderData = holderData;
            item.collectionType = collectionType ? collectionType : "";
            _challenge.nft = item;
          }
        }        
        arr.push(_challenge);
      }
    }

    if (arr.length) {
      setChallenges(arr)
    } else {
      setChallenges(null)
    }
    dispatch({
      type: SET_SELECTED_PAGE,
      payload: selectedPage,
    });
  }

  return (
    <>
      <div className="photo-profile-page challenge-page">
        <div className="profile-content">
          <div className="container position-relative">
            <div className="row">
              <div className="col-md-12">
                <div className="d-flex step-crumb cursor-pointer mt-4" onClick={() => history.goBack()}>
                  <KeyboardBackspaceIcon
                    style={{ color: "white", marginRight: 10 }}
                  />
                  <p className="step-lead">Go Back</p>
                </div>
                <p className="challenge-title">My Challenges</p>
                {isItem ? (
                  <div
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      // height: "100vh",
                      display: "flex",
                    }}
                  >
                    <div className="no-items">
                      <p className="no-items-title">No Challenge Found</p>
                      <p className="no-items-lead">
                        You have not created any NFT challenge
                      </p>
                      <button className="btn-continue" onclick={() => {
                        history.push({
                          pathname: '/create',
                          state: {
                            collectibleTypeState: collectibleTypes.find(item => item.type === "nft_challenge")
                          }
                        })
                      }
                      }>
                        Create Challenges
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* <p className="challenge-desc">
                      Please select your NFT Challenge to look at the submissions.
                    </p> */}

                    <div
                      className="challange-subtitle-wrapper challenge-header search-bar"
                      style={{ margin: 20, marginLeft: 0 }}
                      ref={filterRef}
                    >
                      <div className="challenge-search-input">
                        <input
                          className="search-input"
                          type="text"
                          placeholder="Search by challenge name"
                          onChange={(e) => handleSearch(e)}
                        />
                        {/* <img
                          src="/images/search.png"
                          alt="Search"
                          className="search-icon"
                        /> */}

<svg className="search-icon" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 0.755859C3.59 0.755859 0 4.34586 0 8.75586C0 13.1659 3.59 16.7559 8 16.7559C9.84 16.7559 11.54 16.1259 12.9 15.0659L15.07 17.2459L16.49 15.8259L14.31 13.6559C15.37 12.2959 16 10.5959 16 8.75586C16 4.34586 12.41 0.755859 8 0.755859ZM8 2.75586C11.33 2.75586 14 5.42586 14 8.75586C14 12.0859 11.33 14.7559 8 14.7559C4.67 14.7559 2 12.0859 2 8.75586C2 5.42586 4.67 2.75586 8 2.75586Z" fill="white"/>
                      </svg>
                      </div>



                      <div className="filter" onClick={() => setIsShowingFilter(!isShowingFilter)}>
                        <p>Filter</p>
                        {
                          isShowingFilter ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
                        }

                      </div>
                    </div>
                    <div className="divider">
                    </div>
                    <div className="position-relative">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mobile-filter-btn" onClick={() => setIsShowingFilter(!isShowingFilter)}>
                      <rect x="0.5" y="0.5" width="39" height="39" rx="3.5" fill="black" stroke="#373737"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M18.9746 14.4423C18.9746 12.5412 20.5158 11 22.4169 11C24.0605 11 25.435 12.1519 25.7773 13.6924L28.6991 13.6924C29.1133 13.6924 29.4491 14.0282 29.4491 14.4424C29.4491 14.8566 29.1133 15.1924 28.6991 15.1924L25.7773 15.1924C25.4349 16.7328 24.0604 17.8846 22.4169 17.8846C20.5158 17.8846 18.9746 16.3434 18.9746 14.4423ZM22.4169 12.5C21.3442 12.5 20.4746 13.3696 20.4746 14.4423C20.4746 15.515 21.3442 16.3846 22.4169 16.3846C23.4896 16.3846 24.3592 15.515 24.3592 14.4423C24.3592 13.3696 23.4896 12.5 22.4169 12.5ZM10.75 13.6923C10.3358 13.6923 10 14.0281 10 14.4423C10 14.8565 10.3358 15.1923 10.75 15.1923H16.1346C16.5488 15.1923 16.8846 14.8565 16.8846 14.4423C16.8846 14.0281 16.5488 13.6923 16.1346 13.6923H10.75ZM10.75 25.9609H12.7733C13.1156 27.5013 14.4902 28.6532 16.1337 28.6532C18.0348 28.6532 19.576 27.112 19.576 25.2109C19.576 23.3097 18.0348 21.7686 16.1337 21.7686C14.4902 21.7686 13.1156 22.9204 12.7733 24.4609H10.75C10.3358 24.4609 10 24.7966 10 25.2109C10 25.6251 10.3358 25.9609 10.75 25.9609ZM16.1337 27.1532C15.0715 27.1532 14.2085 26.3006 14.1917 25.2424C14.1921 25.2319 14.1923 25.2214 14.1923 25.2109C14.1923 25.2003 14.1921 25.1898 14.1917 25.1793C14.2085 24.1212 15.0715 23.2686 16.1337 23.2686C17.2064 23.2686 18.076 24.1382 18.076 25.2109C18.076 26.2836 17.2064 27.1532 16.1337 27.1532ZM22.416 24.4609C22.0018 24.4609 21.666 24.7967 21.666 25.2109C21.666 25.6252 22.0018 25.9609 22.416 25.9609H28.6981C29.1123 25.9609 29.4481 25.6252 29.4481 25.2109C29.4481 24.7967 29.1123 24.4609 28.6981 24.4609H22.416Z" fill="white"/>
                    </svg>
                    {
                      isShowingFilter && (
                        <div
                          className="filter-bar-wrapper"
                          ref={filterRef}
                        >



                          {/* Filter bar for mobile */}
                          {/* <div className="d-flex justify-content-between mobile-show" style={{ marginTop: 24 }}>
                            <div
                              className="d-flex"
                            >
                              <p className="filter-txt">Filters</p>
                            </div>
                            {isMobileFilter && (
                              <div className="d-flex">
                                <p
                                  className="clear-txt mr-15"
                                  onClick={handleClearSubFilter}
                                >
                                  Clear
                                </p>
                              </div>
                            )}
                          </div> */}
                          {/* Filter bar for mobile */}

                          <div className="position-relative">
                          {
                            (!isMobile || isMobileFilter) && <div className="filter-bar" style={{height: isMobile && (sortByOpen || statusOpen) ? 235 : 'auto'}}>
                              <div
                                className="dropdown-item"
                              >
                                <div
                                  className={`dropdown-content ${sortBy !== -1 ? "active" : ""}`}
                                  onClick={() => {
                                    setSortByOpen(!sortByOpen);
                                    setStatusOpen(false);
                                    setNetworkTypeOpen(false);
                                  }}
                                >
                                  <p className="dropdown-lead">
                                    {sortBy !== -1
                                      ? sortByFilters[sortBy].value
                                      : "Sort by submission"}
                                  </p>

                                  <ArrowDropDownIcon />
                                </div>
                                <div
                                  className={`dropdown-card most-recent ${sortByOpen ? "open" : ""
                                    }`}
                                >
                                  <div className="most-recent-body">
                                    <p className="most-recent-title">
                                      Sort by submission
                                    </p>
                                    {sortByFilters.map((filter, index) => {
                                      return (
                                        <div className="collection-item" key={index}>
                                          <p
                                            className="dropdown-lead"
                                            onClick={() => handleSetSortBy(index)}
                                          >
                                            {filter.value}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>

                              <div
                                className="dropdown-item"
                              >
                                <div
                                  className={`dropdown-content ${status !== -1 ? "active" : ""}`}
                                  onClick={() => {
                                    setStatusOpen(!statusOpen)
                                    setSortByOpen(false);
                                    setNetworkTypeOpen(false);
                                  }}
                                >
                                  <p className="dropdown-lead">
                                    {status !== -1
                                      ? statusArray[status].value
                                      : "Sort by challenge status"}
                                  </p>

                                  <ArrowDropDownIcon />
                                </div>
                                <div
                                  className={`dropdown-card most-recent ${statusOpen ? "open" : ""
                                    }`}
                                >
                                  <div className="most-recent-body">
                                    <p className="most-recent-title">
                                      Sort by challenge status
                                    </p>
                                    {statusArray.map((filter, index) => {
                                      return (
                                        <div className="collection-item" key={index}>
                                          <p
                                            className="dropdown-lead"
                                            onClick={() => {                                         
                                              handleSetStatus(index)}}
                                          >
                                            {filter.value}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>

                              <div className="dropdown-item">
                        <div
                          className={`dropdown-content ${networkType !== null ? "active" : ""}`}
                          onClick={() => {
                            setStatusOpen(false)
                            setSortByOpen(false);
                            setNetworkTypeOpen(!networkTypeOpen)
                          }}
                        >
                          <p className="dropdown-lead">
                            {networkType !== null
                              ? networkType.value
                              : "Blockchain"}
                          </p>

                          {/* <ExpandMoreIcon /> */}
                          <ArrowDropDownIcon />
                        </div>
                        <div
                          className={`dropdown-card most-recent ${networkTypeOpen ? "open" : ""
                            }`}
                        >
                          <div className="most-recent-body">
                            {/* <p className="most-recent-title">
                              Sort by challenge status
                            </p> */}
                            {networkTypeFilters.map((filter, index) => {
                              return (
                                <div
                                  className="collection-item"
                                  key={index}
                                >
                                  <p
                                    className="dropdown-lead"
                                    onClick={() => handleSetNetworkType(filter)}
                                  >
                                    {filter.value}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                             <p
                                  className="clear-filter"
                                  onClick={handleClearSubFilter}
                                >
                                  Clear
                                </p>
                              
                            </div>
                          }
                          <div className="mobile-bar"></div>

                          </div>


                          {/* <p className="clear-filter">Clear</p> */}
                        </div>
                      )
                    }
                    </div>



                  </>
                )}
              </div>
            </div>



            {!isItem && (
              <>
                {/* <div className="hot-section">
                  <div className="flex-row d-flex challenge-container"> */}
                {isLoading ? (
                  <div className="spinnerStyle">
                    <Spinner animation="border" />
                  </div>
                ) : challenges && challenges.length > 0 ? (
                  <div className="row position-relative">
                    
                    {challenges.length > 0 &&
                      challenges.map((chalenge, index) => (
                        <div className="explore-item" key={index}>
                          <ChallengeCard
                            challenge={chalenge}
                            key={index}
                            // user={nft.holderData}
                            loggedInUser={userData}
                            // likeNFT={likeNFT}
                            // showMenu={false}
                            customUrl="/mychallenge"
                          />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="no-items">
                    <p className="no-items-title">No Challenge Found</p>
                    <p className="no-items-lead">
                      You have not created any NFT challenges
                    </p>
                    <button className="btn-continue" onClick={() => {
                      history.push({
                        pathname: '/create',
                        state: {
                          collectibleTypeState: collectibleTypes.find(item => item.type === "nft_challenge")
                        }
                      })
                    }
                    }>
                      Create Challenges
                    </button>
                  </div>
                )}
                {/* </div>
                </div> */}

                {!isLoading && totalCount > limit && (
                  <div className="pagination-wrapper">
                  
                    <ReactPaginate
                    previousLabel={<svg style={{height: 25, width: 25}} width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 17.5L10.5 13L15 8.5" stroke="white" stroke-linecap="round"/>
                    </svg>}
                    nextLabel={<svg style={{height: 25, width: 25}} width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 17.5L14.5 13L10 8.5" stroke="white" stroke-linecap="round"/>
                    </svg>      }
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={totalCount / limit}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    forcePage={selectedPage - 1}
                    activeClassName={"active"}
                    />
                  
                </div>
                  
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyChallenge;
