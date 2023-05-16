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

const sortByFilters = [
  { key: "1d", value: "1D" },
  { key: "7d", value: "7D" },
  { key: "30d", value: "30D" },
];

const Profile = (props) => {
  const history = useHistory();

  const metaMaskAddress = useSelector((state) => state.web3.metaMaskAddress);
  const loggedInUserData = useSelector((state) => state.auth.userData);

  const network = useSelector((state) => state.web3.network);
  const userService = new UserService(network.backendUrl);

  const [nfts, setNfts] = useState([]);

  const [nftsLoading, setNftsLoading] = useState(true);

  const [selectedPage, setSelectedPage] = useState(1);

  const [limit, setLimit] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [recordsFrom, setRecordsFrom] = useState(0);
  const [recordsTo, setRecordsTo] = useState(0);

  const [comingFor, setComingFor] = useState("");

  const [creator, setCreator] = useState("1d");

  const [counterStart, setCounterStart] = useState(1);

  useEffect(() =>{
    scrollToTop();
  },[selectedPage])

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
  };

  const checkForUserFollowed = async (currentUser, profileUser) => {
    let res = await userService.checkForUserFollowed(currentUser, profileUser);
    return res;
  };

  const handlePageClick = (page) => {
    setSelectedPage(page.selected + 1);
    setCounterStart(page.selected*limit+1)
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

  return (
    <>
      <div className="photo-profile-page following-page">
        <>
          <div className="profile-content">
            <div className="container position-relative">
              <div className="follow-content">
                <div className="follow-header">
                  <p className="follow-title mt-0">Top 100 {comingFor}</p>
                  <div className="button-group mt-0">
                    {
                      sortByFilters?.map(item =>(
                        <button
                          className={`btn-continue ${creator === item.key ? "" : "not-allow"}`}
                          onClick={() => setCreator(item.key)}
                        >
                          {item.value}
                        </button>
                      ))
                    }
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
                        <ComingUser
                          info={nft}
                          count={counterStart+index}
                          history={history}
                          comingfor={propscomingFor}
                        />
                        {/* <FollowCard info={nft} comingFor={comingFor} count={counterStart+index}/> */}
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
                        <p className="no-items-title">No Items Found</p>
                        <p className="no-items-lead">
                          Browse our marketplace to discover challenges
                        </p>
                        <button className="btn-continue" onClick={()=>history.push("/discover")}>
                          Browse Marketplace
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {!nftsLoading && totalCount > 12 && (
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

export default Profile;
