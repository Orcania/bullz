import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useMediaQuery } from '@material-ui/core';

import React, { useEffect, useState } from "react";

import CollectionDropDown from "../CollectionDropDown/collectionDropDown";
import { collectibleTypes } from "../../data/tokenTypes";
import { useRef } from "react";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { networks } from "constants/networks";
import { useSelector } from "react-redux";
import { printLog } from "utils/printLog";

const saleTypeFilters = [
  { key: "sale", value: "Sale" },
  { key: "auction", value: "Auction" },
  { key: "notSale", value: "Not for Sale" },
];

const networkTypeFilters = [
  { key: "all", value: "All" , chainId: 0},
  { key: "ethereum", value: "Ethereum", chainId: parseInt(networks['goerli'].chainId, 16)},
  { key: "polygon", value: "Polygon",  chainId: parseInt(networks['polygon'].chainId, 16) },
  { key: "Binance Smart Chain", value: "BNB CHAIN", chainId: parseInt(networks['bsctestnet'].chainId, 16) },
  { key: "Avalanche C-CHAIN", value: "Avalanche C-CHAIN", chainId: parseInt(networks['avalanche'].chainId, 16) },
  { key: "Arbitrum One", value: "Arbitrum One", chainId: parseInt(networks['arbitrum'].chainId, 16) },
];

const submissionCountFilters = [
  { key: "highestSubmit", value: "Highest number submission" },
  { key: "lowestSubmit", value: "Smallest number of submission" },
];

const sortByFilters = [
  { key: "all", value: "All" },
  { key: "recent", value: "Recently Added" },
  // { key: "priceLowToHigh", value: "Price: Low To High" },
  // { key: "priceHighToLow", value: "Price: High To Low" },
  { key: "auctionEND", value: "Auction Ending Soon" },
];

const sortByTimes = [
  { key: "recent", value: "Newly Added" },
  { key: "challengeEND", value: "Challenge Ending Soon" },
];

const priceRangeFilters = [
  {key: "priceLowToHigh", value: "High to Low"},
  {key: "priceHighToLow", value: "Low to High"}
]

const SubFilter = ({ setSelectedSubFilterFun, ...props }) => {
  const [selectedSubFilter, setSelectedSubFilter] = useState({
    sortBy: "all",
  });

  const userChainId = useSelector((state) => state.web3.userChainId);

  const filterRef = useRef();

  const [nftType, setNftType] = useState("");

  const [collectionType, setCollectionType] = useState("");

  const [saleType, setSaleType] = useState("");
  const [networkType, setNetworkType] = useState(null);
  const [submitCount, setSubmitCount] = useState('');

  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currency, setCurrency] = useState("");

  const [sortBy, setSortBy] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const [minvalue, setMinValue] = useState(0);
  const [maxvalue, setMaxValue] = useState(80);
  const [isMobileFilter, setIsMobileFilter] = useState(true);

  const [selectedFilter, setSelectedFilter] = useState("");

  const isMobile = useMediaQuery("(min-width:350px) and (max-width:1023px)");

  const clearCollectionFilter = () => {
    setCollectionType("");
  };

  useEffect(() => {
    if (userChainId != null && userChainId != undefined) {
      const _networkType = networkTypeFilters.filter(item => item.chainId == userChainId ? item : null )
      printLog(['_networkType', _networkType[0]], 'success');
      if (_networkType.length > 0) {
        handleSelectedSubFilter("chain_id", _networkType[0])
      }
    }
  }, [userChainId]);

  const handleSelectedSubFilter = (key, value) => {
    let obj = { ...selectedSubFilter };
    if (key === "nftType") {
      obj.nftType = value.type;
      setNftType(value.name);
    } else if (key === "collectionType") {
      obj.collectionType = value;
    } else if (key === "saleType") {
      if (value.key === "auction") {
        obj.isForAuction = true;
        obj.isForSell = true;
      } else if (value.key === "sale") {
        obj.isForSell = true;
        obj.isForAuction = false;
      } else if (value.key === "notSale") {
        obj.isForSell = false;
        obj.isForAuction = false
      }
      setSaleType(value);
    } else if (key === "priceRange") {
      //obj.price = value.key;
      obj.sortBy = value.key;   //NOTE: As for now we are using priceRange only for data sorting, it's sent to sortBy field insted of price field
      setPriceRange(value);
    } else if (key === "currency") {
      obj.currency = value.currencyKey;
      setCurrencyOpen(false);
      setCurrency(value);
    } else if (key === "sortBy") {
      obj.sortBy = value.key;
      setSortBy(value);
    } else if (key === "submitCount") {
      obj.submitCount = value.key;
      setSubmitCount(value);
    } else if (key === "chain_id") {
      setNetworkType(value);
      obj.chain_id = value.chainId
    }

    setSelectedFilter("");
    setSelectedSubFilter(obj);
    setSelectedSubFilterFun(obj);
  };

  const handleClearSubFilter = () => {
    setSelectedSubFilter({
      sortBy: "all",
      chain_id: 0,
    });

    setSelectedSubFilterFun({
      sortBy: "all",
      chain_id: 0,
    });

    setNftType("");
    setCollectionType("");
    setSaleType("");
    setNetworkType(null);
    setSubmitCount("");
    setCurrency("");
    setSortBy("");
    setPriceRange("");

    setCurrencyOpen(false);

    setSelectedFilter("");
    setMinValue(0);
    setMaxValue(80);
  };

  const onOutsideClickOfFilter = (e) => {
    if ( filterRef.current && !filterRef.current.contains(e.target)) {
      setSelectedFilter("");
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', onOutsideClickOfFilter);
    return () => document.removeEventListener('mousedown', onOutsideClickOfFilter);
  });

  printLog([selectedSubFilter], 'success');

  const {
    nftTypeFilter,
    collectionTypeFilter,
    saleTypeFilter,
    submissionCountFilter,
    priceRangeFilter,
    currencyTypeFilter,
    sortByFilter,
    sortByTime,
    sortByNetwork,
  } = props;
  return (
    <>
      <div
        className=" justify-content-between d-none"
        ref={filterRef}
      >
        <div
          className="d-flex"
          // onClick={() => setIsMobileFilter(!isMobileFilter)}
        >
          {/* <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.14175 14.0004C4.31392 13.5125 4.6332 13.0899 5.05558 12.7911C5.47797 12.4922 5.98265 12.3317 6.50008 12.3317C7.01751 12.3317 7.5222 12.4922 7.94458 12.7911C8.36697 13.0899 8.68625 13.5125 8.85842 14.0004H17.3334V15.6671H8.85842C8.68625 16.155 8.36697 16.5776 7.94458 16.8764C7.5222 17.1753 7.01751 17.3358 6.50008 17.3358C5.98265 17.3358 5.47797 17.1753 5.05558 16.8764C4.6332 16.5776 4.31392 16.155 4.14175 15.6671H0.666748V14.0004H4.14175ZM9.14175 8.16708C9.31392 7.67914 9.6332 7.25661 10.0556 6.95774C10.478 6.65887 10.9827 6.49837 11.5001 6.49837C12.0175 6.49837 12.5222 6.65887 12.9446 6.95774C13.367 7.25661 13.6862 7.67914 13.8584 8.16708H17.3334V9.83375H13.8584C13.6862 10.3217 13.367 10.7442 12.9446 11.0431C12.5222 11.342 12.0175 11.5025 11.5001 11.5025C10.9827 11.5025 10.478 11.342 10.0556 11.0431C9.6332 10.7442 9.31392 10.3217 9.14175 9.83375H0.666748V8.16708H9.14175ZM4.14175 2.33375C4.31392 1.8458 4.6332 1.42328 5.05558 1.12441C5.47797 0.825536 5.98265 0.665039 6.50008 0.665039C7.01751 0.665039 7.5222 0.825536 7.94458 1.12441C8.36697 1.42328 8.68625 1.8458 8.85842 2.33375H17.3334V4.00041H8.85842C8.68625 4.48836 8.36697 4.91089 7.94458 5.20976C7.5222 5.50863 7.01751 5.66912 6.50008 5.66912C5.98265 5.66912 5.47797 5.50863 5.05558 5.20976C4.6332 4.91089 4.31392 4.48836 4.14175 4.00041H0.666748V2.33375H4.14175Z"
              fill="white"
            />
          </svg> */}
          <p className="filter-txt">Filters</p>
        </div>
        {isMobileFilter && (
          <div className="d-flex">
            <p className="clear-txt mr-15" onClick={handleClearSubFilter}>
              Clear
            </p>
          </div>
        )}
      </div>
      {(!isMobile || isMobileFilter) && (
        <div className="position-relative">
          
          <div className="filter-bar w-100" style={{height: isMobile && selectedFilter ? 470 : 'auto'}} onClick={onOutsideClickOfFilter} ref={filterRef}>
          {nftTypeFilter && (
            <div className="ntf-type dropdown-item">
              <div
                className={`dropdown-content ${nftType ? "active" : ""}`}
                // onClick={() => () => setSelectedFilter(selectedFilter === "nftType"? "" : "nftType")}
                onClick={() =>
                  setSelectedFilter(
                    selectedFilter === "nftType" ? "" : "nftType"
                  )
                }
              >
                <p className="dropdown-lead">
                  {nftType ? nftType : "NTF Type"}
                </p>
                {/* <ExpandMoreIcon /> */}
                <ArrowDropDownIcon />
              </div>
              <div
                className={`dropdown-card ntf-type ${
                  selectedFilter === "nftType" ? "open" : ""
                }`}
              >
                <p className="primary-lead pt-3 px-2">All</p>
                {collectibleTypes.map((item, index) => {
                  if (item.forTypeList) {
                    return (
                      <div
                        className="ntf-dropdown-item"
                        key={index}
                        onClick={() => handleSelectedSubFilter("nftType", item)}
                      >
                        <img
                          src={`/images/${item.image}.png`}
                          alt="Collectible Icon"
                        />
                        <p className="primary-lead">{item.name}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}

          {collectionTypeFilter && (
            <CollectionDropDown
              setCollectionType={setCollectionType}
              collectionType={collectionType}
              clearCollectionFilter={clearCollectionFilter}
              handleSelectedSubFilter={handleSelectedSubFilter}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          )}

          {saleTypeFilter && (
            <div className="sale-type dropdown-item">
              <div
                className={`dropdown-content ${saleType ? "active" : ""}`}
                onClick={() =>
                  setSelectedFilter(
                    selectedFilter === "saleType" ? "" : "saleType"
                  )
                }
              >
                <p className="dropdown-lead">
                  {saleType ? saleType.value : "Sale Type"}
                </p>
                {/* <ExpandMoreIcon /> */}
                <ArrowDropDownIcon />
              </div>
              <div
                className={`dropdown-card collection ${
                  selectedFilter === "saleType" ? "open" : ""
                }`}
              >
                <div className="collection-body">
                  {saleTypeFilters.map((filter) => {
                    return (
                      <div className="collection-item">
                        <p
                          className="dropdown-lead"
                          onClick={() =>
                            handleSelectedSubFilter("saleType", filter)
                          }
                        >
                          {filter.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {sortByNetwork && (
            <div className="sale-type dropdown-item">
              <div
                className={`dropdown-content ${networkType ? "active" : ""}`}
                onClick={() =>
                  setSelectedFilter(
                    selectedFilter === "chain_id" ? "" : "chain_id"
                  )
                }
              >
                <p className="dropdown-lead">
                  {networkType ? networkType.value : "Blockchain"}
                </p>
                {/* <ExpandMoreIcon /> */}
                <ArrowDropDownIcon />
              </div>
              <div
                className={`dropdown-card collection ${
                  selectedFilter === "chain_id" ? "open" : ""
                }`}
              >
                <div className="collection-body">
                  {networkTypeFilters.map((filter) => {
                    return (
                      <div className="collection-item">
                        <p
                          className="dropdown-lead"
                          onClick={() =>
                            handleSelectedSubFilter("chain_id", filter)
                          }
                        >
                          {filter.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {submissionCountFilter && (
            <div className="sale-type dropdown-item">
              <div
                className={`dropdown-content ${submitCount ? "active" : ""}`}
                onClick={() =>
                  setSelectedFilter(
                    selectedFilter === "submitCount" ? "" : "submitCount"
                  )
                }
              >
                <p className="dropdown-lead">
                  {submitCount ? submitCount.value : "Submissions"}
                </p>
                {/* <ExpandMoreIcon /> */}
                <ArrowDropDownIcon />
              </div>
              <div
                className={`dropdown-card collection ${
                  selectedFilter === "submitCount" ? "open" : ""
                }`}
              >
                <div className="collection-body">
                  {submissionCountFilters.map((filter) => {
                    return (
                      <div className="collection-item">
                        <p
                          className="dropdown-lead"
                          onClick={() =>
                            handleSelectedSubFilter("submitCount", filter)
                          }
                        >
                          {filter.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {sortByTime && (
            <div className="most-recent dropdown-item">
              <div
                className={`dropdown-content ${sortBy ? "active" : ""}`}
                onClick={() =>
                  setSelectedFilter(selectedFilter === "sortBy" ? "" : "sortBy")
                }
              >
                <p className="dropdown-lead">
                  {sortBy ? sortBy.value : "Time"}
                </p>

                <ArrowDropDownIcon />
              </div>
              <div
                className={`dropdown-card most-recent ${
                  selectedFilter === "sortBy" ? "open" : ""
                }`}
              >
                <div className="most-recent-body">
                  <p className="most-recent-title">Time</p>
                  {sortByTimes.map((filter) => {
                    return (
                      <div className="collection-item">
                        <p
                          className="dropdown-lead"
                          onClick={() => {
                            setPriceRange('');
                            handleSelectedSubFilter("sortBy", filter);
                          }}
                        >
                          {filter.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}          


          {sortByFilter && (
            <div className="most-recent dropdown-item">
              <div
                className={`dropdown-content ${sortBy ? "active" : ""}`}
                onClick={() =>
                  setSelectedFilter(selectedFilter === "sortBy" ? "" : "sortBy")
                }
              >
                <p className="dropdown-lead">
                  {sortBy ? sortBy.value : "Most Recent"}
                </p>

                <ArrowDropDownIcon />
              </div>
              <div
                className={`dropdown-card most-recent ${
                  selectedFilter === "sortBy" ? "open" : ""
                }`}
              >
                <div className="most-recent-body">
                  <p className="most-recent-title">Sort by</p>
                  {sortByFilters.map((filter) => {
                    return (
                      <div className="collection-item">
                        <p
                          className="dropdown-lead"
                          onClick={() =>
                            handleSelectedSubFilter("sortBy", filter)
                          }
                        >
                          {filter.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {priceRangeFilter && (
            <div className="price-range dropdown-item">
              <div
                className={`dropdown-content ${priceRange ? "active" : ""}`}
                onClick={() =>
                  setSelectedFilter(
                    selectedFilter === "priceRange" ? "" : "priceRange"
                  )
                }
              >
                <p className="dropdown-lead">{priceRange ? priceRange.value : "Price Range"}</p>
                <ArrowDropDownIcon />
              </div>
              <div
                className={`dropdown-card most-recent ${
                  selectedFilter === "priceRange" ? "open" : ""
                }`}
              >
                <div className="most-recent-body">
                  <p className="most-recent-title">Price Range</p>
                  {priceRangeFilters.map((filter) => {
                    return (
                      <div className="collection-item">
                        <p
                          className="dropdown-lead"
                          onClick={() => {
                            setSortBy('');
                            handleSelectedSubFilter("priceRange", filter);
                          }
                            
                          }
                        >
                          {filter.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* <div
                className={`dropdown-card collection ${
                  selectedFilter === "priceRange" ? "open" : ""
                }`}
                style={{ width: 210 }}
              >
                <p className="collection-title">Change Currency</p>
                <div className="price-range-body">
                  {currencyTypeFilter && (
                    <div className="filter-bar" style={{ marginTop: 10 }}>
                      <div className="dropdown-item2">
                        <div
                          className="dropdown-content"
                          onClick={() => setCurrencyOpen(!currencyOpen)}
                        >
                          <p className="dropdown-lead">
                            {currency
                              ? currency.currencyKey
                              : "Select Currency"}
                          </p>
                          <svg
                            width="9"
                            height="6"
                            viewBox="0 0 9 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.24333 2.829L7.07133 -6.18516e-08L8.48633 1.414L4.24333 5.657L0.000328002 1.414L1.41533 -3.09083e-07L4.24333 2.829Z"
                              fill="#8A8A8A"
                            />
                          </svg>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            paddingTop: 8,
                            paddingBottom: 8,
                          }}
                          className={`dropdown-card most-recent ${
                            currencyOpen ? "open" : ""
                          }`}
                        >
                          <div className="most-recent-body">
                            {tokens.map((filter) => {
                              return (
                                <div
                                  className="collection-item"
                                  onClick={() =>
                                    handleSelectedSubFilter("currency", filter)
                                  }
                                >
                                  <p className="dropdown-lead">
                                    {filter.currencyKey}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="d-flx align-items-center">
                    <input
                      className="range-input"
                      type="text"
                      placeholder="Min Price"
                      onChange={(e) => setMinValue(e.target.value)}
                      value={minvalue}
                      maxLength={3}
                    />
                    <span className="input-between">to </span>
                    <input
                      className="range-input"
                      type="text"
                      placeholder="Max Price"
                      onChange={(e) => setMaxValue(e.target.value)}
                      value={maxvalue}
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className="collection-footer">
                  <div className="footer-item">
                    <p className="footer-lead">Clear</p>
                  </div>
                  <div className="footer-item">
                    <p
                      className="footer-lead"
                      onClick={() =>
                        handleSelectedSubFilter(
                          "priceRange",
                          minvalue + "-" + maxvalue
                        )
                      }
                    >
                      Apply
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          )}

          <p
            className="clear-filter"
            onClick={handleClearSubFilter}
          >
            Clear
          </p>
          </div>
          <div className="mobile-bar"></div>
        </div>
        
      )}
    </>
  );
};

export default React.memo(SubFilter);
