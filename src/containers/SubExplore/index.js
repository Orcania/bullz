import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { Select, MenuItem, useMediaQuery } from "@material-ui/core";

import React, { useState, useEffect } from "react";

import { useHistory } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import ReactPaginate from "react-paginate";

import { Spinner } from "react-bootstrap";

import { scrollToTop } from "common/utils";

import { collectibleTypes } from "../../data/tokenTypes";
import {
  SET_EXPLORE_NFTS,
  SET_USER_DATA,
  SET_SELECTED_PAGE,
} from "../../redux/constants";
import { CollectionService } from "../../services/collection.service";
import { NftService } from "../../services/nft.service";
import { UserService } from "../../services/user.service";
import SubFilters from "../../components/SubFilters/subFiltersNew";
import NftCard from "../../components/Common/ExploreCard/index";
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { SearchService } from "../../services/search.service";

import "./style.scss";
import { printLog } from "utils/printLog";

const MyChallenge = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const network = useSelector((state) => state.web3.network);

  const nftService = new NftService(network.backendUrl);
  const collectionService = new CollectionService(network.backendUrl);
  const userService = new UserService(network.backendUrl);
  const searchService = new SearchService(network.backendUrl);

  const nfts = useSelector((state) => state.auth.exploreNfts);
  const userData = useSelector((state) => state.auth.userData);
  const selectedPageReducer = useSelector((state) => state.auth.selectedPage);
  const isWeb3Connected = useSelector((state) => state.web3.web3connected);
  const userChainId = useSelector((state) => state.web3.userChainId);

  const [selectedPage, setSelectedPage] = useState(
    selectedPageReducer ? selectedPageReducer : 1
  );
  const [limit, setLimit] = useState(8);
  const [totalCount, setTotalCount] = useState(0);
  const [recordsFrom, setRecordsFrom] = useState(0);
  const [recordsTo, setRecordsTo] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const is570 = useMediaQuery("(max-width:575px)");
  const [isShowingFilter, setIsShowingFilter] = useState(false);
  const [query, setSearchQuery] = useState("");

  const [selectedSubFilter, setSelectedSubFilter] = useState({
    sortBy: "all",
    nftType: props.match.params.nftType,
    chain_id: userChainId,
  });

  const handlePageClick = (page) => {
    setSelectedPage(page.selected + 1);
  };

  async function loadNfts() {
    setIsLoading(true);

    let queryString = "";
    for (const property in selectedSubFilter) {
      if (property !== "sortBy") {
        printLog([`${property}: ${selectedSubFilter[property]}`], 'success');
        if (selectedSubFilter[property] !== "") {
          queryString =
            queryString + `&${property}=${selectedSubFilter[property]}`;
        }
      }
    }

    if (isShowingFilter && !queryString.includes('chain_id')){
      setIsLoading(false);
      return;
    }
      

    const response = await nftService.getExploreNftWithFilter(
      limit,
      selectedPage,
      selectedSubFilter.sortBy,
      queryString
    );

    setData(response);
  }

  const setData = async (response) => {
    let arr = [];
    if (response) {
      let nftss = response.data;
      setTotalCount(response.totalCount);
      setRecordsFrom((selectedPage - 1) * limit + 1);
      setRecordsTo((selectedPage - 1) * limit + response.data.length);

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
      setIsLoading(false);
    }
    else {
      setIsLoading(false);
    }
    dispatch({
      type: SET_EXPLORE_NFTS,
      payload: arr.length ? arr : [],
    });

    dispatch({
      type: SET_SELECTED_PAGE,
      payload: selectedPage,
    });
  }

  useEffect(() => {
    if (userChainId != null && userChainId != undefined) {
      if(userChainId > 0) {
        setIsShowingFilter(true);
      }
    }
  }, [userChainId]);

  useEffect(() => {
    scrollToTop();
  }, [selectedPage])

  useEffect(() => {
    loadNfts();
  }, [selectedPage, selectedSubFilter]);

  useEffect(() => {
    loadNfts();
  }, [limit]);

  const setSelectedSubFilterFun = (obj) => {
    printLog([obj], 'success');
    setSelectedSubFilter({ ...obj, nftType: props.match.params.nftType });
    setSelectedPage(1);
  };

  const likeNFT = async (nft) => {
    if (isWeb3Connected) {
      const body = {
        assetId: nft.id,
        user_id: userData.id,
      };
      let res = await nftService.likeUnlikeNFT(body);
      if (res) {
        let tempNfts = [...nfts];
        let found = tempNfts.find((item) => item.id === nft.id);
        let foundIndex = tempNfts.findIndex((item) => item.id === nft.id);

        let updatedNft = {
          ...found,
          likes: res.data.likes,
        };
        tempNfts[foundIndex] = updatedNft;
        dispatch({
          type: SET_EXPLORE_NFTS,
          payload: [...tempNfts],
        });
      }
      let likedUpdatedUserData = { ...userData };
      likedUpdatedUserData.likes = [...res.data.likedUpdated.likes];
      dispatch({
        type: SET_USER_DATA,
        payload: { ...likedUpdatedUserData },
      });
    }
  };

  const handleChangeLimit = (e) => {
    setSelectedPage(1);
    setLimit(e.target.value);
  };

  const nftTypeName = () => {
    // let obj = collectibleTypes.find(
    //   (item) => item.type === props.match.params.nftType
    // );
    // return obj.name;
    return 'Trending NFTs';
  };

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
    printLog(['getSearchData', q], 'success');
    if (q.length > 2) {
      setIsLoading(true);
      let res = await searchService.getSearchDataNFT(q, selectedPage, limit);     
      printLog(['getSearchData output', res], 'success');
      await setData(res); 
      setIsLoading(false);
    } else if (q.length == 0) {
      loadNfts();
    }
  }


  return (
    <>
      <div className="photo-profile-page challenge-page">
        <div className="profile-content">
          <div className="container position-relative">
            <div className="explore-heading ">
              <div className="d-flex step-crumb cursor-pointer" onClick={() => history.goBack()}>
                <KeyboardBackspaceIcon
                  style={{ color: "white", marginRight: 10 }}
                />
                <p className="step-lead">Explore All NFTS</p>
              </div>
              <p className="challenge-title explorer">{nftTypeName()}</p>
              <div className="challange-subtitle-wrapper search-bar">
                <div className="challenge-search-input">                  
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Search by NFT name"
                    onChange={(e) => handleSearch(e)}
                  />

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
                <div className="filter-wrapper">
                  <SubFilters
                    setSelectedSubFilterFun={setSelectedSubFilterFun}
                    nftTypeFilter={false}
                    collectionTypeFilter={true}
                    saleTypeFilter={true}
                    priceRangeFilter={true}
                    currencyTypeFilter={true}
                    sortByFilter={true}
                    sortByNetwork={true}
                  />
                </div>
              )
            }
            </div>

            


            {isLoading ? (
              <div className="spinnerStyle">
                <Spinner animation="border"/>
              </div>
            ) : (
              <>
                {nfts && nfts.length > 0 ? (
                  <div className="row position-relative">
                    
                    {nfts.length > 0 &&
                      nfts.map((nft, index) => (
                        <div className="explore-item" key={index}>
                          <NftCard
                            item={nft}
                            key={index}
                            user={nft.holderData}
                            loggedInUser={userData}
                            likeNFT={likeNFT}
                            showMenu={true}
                          />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="no-items">
                    <p className="no-items-title">No Items Found</p>
                    <p className="no-items-lead">
                      Browse our marketplace to discover challenges
                    </p>
                    <button className="btn-continue" onClick={() => history.push("/discover")}>Browse Marketplace</button>
                  </div>
                )}

                <div className="pagination-wrapper">
                  <span className="result-info">
                    {`Results: ${recordsFrom} - ${recordsTo} of ${totalCount}`}
                  </span>
                  {!isLoading && totalCount > limit && (
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
                      marginPagesDisplayed={is570 ? 1 : 2}
                      pageRangeDisplayed={is570 ? 0 : 5}
                      onPageChange={handlePageClick}
                      containerClassName={"pagination"}
                      forcePage={selectedPage - 1}
                      activeClassName={"active"}
                    />
                  )}
                  {nfts.length > 8 && (
                    <Select value={limit} onChange={handleChangeLimit}>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={12}>12</MenuItem>
                    <MenuItem value={16}>16</MenuItem>
                  </Select>
                  )}
                  
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyChallenge;
