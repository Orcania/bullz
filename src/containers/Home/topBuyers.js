import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { UserService } from "../../services/user.service";
import FollowCard from "../../components/CreatorBuyerCard/index";
import { Select, MenuItem } from "@material-ui/core";

import "./topBuyer.scss";
import { scrollToTop } from "common/utils";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { SearchService } from "../../services/search.service";
import { setUserData } from "redux/actions/authAction";

const sortByFilters = [
  { key: "1d", value: "1D" },
  { key: "7d", value: "7D" },
  { key: "30d", value: "30D" },
];

const TopCreators = (props) => {
  const history = useHistory();

  const metaMaskAddress = useSelector((state) => state.web3.metaMaskAddress);
  const loggedInUserData = useSelector((state) => state.auth.userData);

  const network = useSelector((state) => state.web3.network);
  const userService = new UserService(network.backendUrl);
  const searchService = new SearchService(network.backendUrl);

  const [nfts, setNfts] = useState([]);

  const [nftsLoading, setNftsLoading] = useState(true);

  const [selectedPage, setSelectedPage] = useState(1);

  const [limit, setLimit] = useState(8);
  const [totalCount, setTotalCount] = useState(0);
  const [recordsFrom, setRecordsFrom] = useState(0);
  const [recordsTo, setRecordsTo] = useState(0);

  const [comingFor, setComingFor] = useState("");

  const [creator, setCreator] = useState("1d");

  const [counterStart, setCounterStart] = useState(1);
  const [query, setSearchQuery] = useState("");

  useEffect(() => {
    scrollToTop();
  }, [selectedPage])

  useEffect(() => {
    if (selectedPage !== 0) {
      if (props.history.location.pathname === "/top_buyers") {
        setComingFor("buyers");
      } else if (props.history.location.pathname === "/creators") {
        setComingFor("creators");
      }
      getUser();
    }
  }, [selectedPage, loggedInUserData]);

  const getUser = async () => {
    setNftsLoading(true);
    let response;
    if (props.history.location.pathname === "/top_buyers") {
      response = await userService.getAllTopBuyers(selectedPage, limit);
    } else if (props.history.location.pathname === "/creators") {
      response = await userService.getAllTopCreators(selectedPage, limit);
    }

    setData(response);
  };

  const checkForUserFollowed = async (currentUser, profileUser) => {
    let res = await userService.checkForUserFollowed(currentUser, profileUser);
    return res;
  };

  const handlePageClick = (page) => {
    setSelectedPage(page.selected + 1);
    setCounterStart(page.selected * limit + 1)
  };

  const handleChangeLimit = (e) => {
    setSelectedPage(0);
    setLimit(e.target.value);
    setTotalCount(0);
    setTimeout(() => {
      setSelectedPage(1);
    }, 20);
    setCounterStart(1);
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

  const setData = async (response) => {
    if (response) {
      let arr = [];
      setTotalCount(response.totalCount);
      setRecordsFrom((selectedPage - 1) * limit + 1);
      setRecordsTo((selectedPage - 1) * limit + response.data.length);

      for (let i = 0; i < response.data.length; i++) {
        let item = response.data[i];
        if (item) {
          let followResponse = false;
          if (loggedInUserData.id === item.id) {
            followResponse = "currentUser";
          } else if (
            Object.keys(loggedInUserData).length !== 0
          ) {
            followResponse = await checkForUserFollowed(
              loggedInUserData.id,
              item.id
            );
          }
          // let followResponse = true
          arr.push({ ...item, followResponse: followResponse });
        }
      }
      setNfts(arr.length > 0 ? arr : []);
      setNftsLoading(false);
    } else {
      setNfts([]);
      setNftsLoading(false);
    }
  }
  async function getSearchData(q) {
    if (q.length > 2) {
      setNftsLoading(true);
      let response = await searchService.getSearchDataUser(q, selectedPage, limit);     
      setData(response)
    } else if (q.length == 0) {
      getUser();      
    }
  }

  return (
    <>
      <div className="photo-profile-page following-page">
        <>
          <div className="profile-content">
            <div className="container position-relative">
              <div className="follow-content">
                <div className="follow-header">
                  <div className="d-flex step-crumb cursor-pointer" onClick={() => history.goBack()}>
                    <KeyboardBackspaceIcon
                      style={{ color: "white", marginRight: 10 }}
                    />
                    <p className="step-lead">Explore all NFTs</p>
                  </div>
                  <p className="collection-page-title">Top Creators</p>
                  <div className="search-bar">
                    <div className="challenge-search-input">
                      <input
                        className="search-input"
                        type="text"
                        placeholder="Search by creator name"
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
                  </div>
                  <div className="divider">
                    
                  </div>
                </div>
                <div className="follow-item-container">
                  {nftsLoading ? (
                    <div className="spinnerStyle">
                      <Spinner animation="border" />
                    </div>
                  ) : nfts.length > 0 ? (
                    nfts.map((nft, index) => (
                      <div className="follow-item" key={index}>
                        <FollowCard info={nft} comingFor={comingFor} count={counterStart + index} />
                      </div>
                    ))
                  ) : (
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
                        <p className="no-items-title">No Creators Found</p>
                        <p className="no-items-lead">
                          Browse our marketplace to discover challenges
                        </p>
                        <button className="btn-continue" onClick={() => history.push("/discover")}>
                          Browse Marketplace
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {!nftsLoading && totalCount > 8 && (
                  <div className="pagination-wrapper">
                    <span className="result-info">
                      {`Results: ${recordsFrom} - ${recordsTo} of ${totalCount}`}
                    </span>
                    {totalCount > limit && (
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
                    )}
                    <Select value={limit} onChange={handleChangeLimit}>
                      <MenuItem value={8}>8</MenuItem>
                      <MenuItem value={12}>12</MenuItem>
                      <MenuItem value={16}>16</MenuItem>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default TopCreators;
