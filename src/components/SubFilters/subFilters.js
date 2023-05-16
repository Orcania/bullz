import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import React, { useState, useEffect } from "react";

import CollectionDropDown from "../CollectionDropDown/collectionDropDown";
import { collectibleTypes } from "../../data/tokenTypes";
import { useFetchTokens } from "../../data/useFetchTokens";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

let saleTypeFilters = [
  { key: "sale", value: "Sale" },
  { key: "auction", value: "Auction" },
  { key: "notSale", value: "Not for Sale" },
];

let sortByFilters = [
  { key: "recent", value: "Recently Added" },
  // { key: "priceLowToHigh", value: "Price: Low To High" },
  // { key: "priceHighToLow", value: "Price: High To Low" },
  { key: "auctionEND", value: "Auction Ending Soon" },
];

const SubFilter = ({ onSubFilterChange, ...props }) => {
  if (props.selectedMainFilter && props.selectedMainFilter === "sale") {
    let removed = saleTypeFilters.filter((filter) => filter.key !== "notSale");
    saleTypeFilters = removed;
  } else {
    saleTypeFilters = [
      { key: "sale", value: "Sale" },
      { key: "auction", value: "Auction" },
      { key: "notSale", value: "Not for Sale" },
    ];
  }

  const [selectedSubFilter, setSelectedSubFilter] = useState({
    key: "all",
    value: "all",
  });

  const [nftType, setNftType] = useState("");

  const [collectionType, setCollectionType] = useState("");

  const [saleType, setSaleType] = useState("");

  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currency, setCurrency] = useState("");

  const [sortBy, setSortBy] = useState("");

  const [minvalue, setMinValue] = useState(0);
  const [maxvalue, setMaxValue] = useState(80);
  const [isMobileFilter, setIsMobileFilter] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState("");
  const tokens = useFetchTokens();


  useEffect(() => {
    onSubFilterChange(selectedSubFilter);
  }, [selectedSubFilter]);

  const clearCollectionFilter = () => {
    setCollectionType("");
  };

  const handleSelectedSubFilter = (key, value) => {
    let obj = { key: key };
    if (key === "nftType") {
      obj.value = value.type;
      setNftType(value.name);
    } else if (key === "collectionType") {
      obj.value = value;
    } else if (key === "saleType") {
      obj.value = value.key;
      setSaleType(value);
    } else if (key === "priceRange") {
      obj.value = value;
    } else if (key === "currency") {
      obj.value = value.currencyKey;
      setCurrencyOpen(false);
      setCurrency(value);
    } else if (key === "sortBy") {
      obj.value = value.key;
      setSortBy(value);
    } else if (key === "p_range_detail") {
      obj.value = value.key;
    }

    setSelectedFilter("");
    setSelectedSubFilter(obj);
  };

  const handleClearSubFilter = () => {
    setSelectedSubFilter({
      key: "all",
      value: "all",
    });

    setNftType("");
    setCollectionType("");
    setSaleType("");
    setCurrency("");
    setSortBy("");

    setSelectedFilter("");
    setCurrencyOpen(false);
  };

  const onOutsideClickOfFilter = () => {
    setSelectedFilter("");
  }

  const {
    nftTypeFilter,
    collectionTypeFilter,
    saleTypeFilter,
    priceRangeFilter,
    currencyTypeFilter,
    sortByFilter,
  } = props;
  return (
    <>
      <div className="d-flex justify-content-between mobile-show" onBlur={onOutsideClickOfFilter}>
        <div
          className="d-flex"
          onClick={() => setIsMobileFilter(!isMobileFilter)}
        >
          <svg
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
          </svg>
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
            <p className="clear-txt" onClick={() => setIsMobileFilter(false)}>
              Done
            </p>
          </div>
        )}
      </div>
      {(window.innerWidth >= 960 || isMobileFilter) && (
        <div className="profile-content px-0">
          <div
            className="container position-relative"
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <>
              <div className="filter-bar">
                {nftTypeFilter && (
                  <div className="ntf-type dropdown-item">
                    <div
                      className="dropdown-content"
                      onClick={() =>
                        setSelectedFilter(
                          selectedFilter === "nftType" ? "" : "nftType"
                        )
                      }
                    >
                      <p className="dropdown-lead">
                        {nftType ? nftType : "NTF Type"}
                      </p>
                      <ArrowDropDownIcon />
                    </div>
                    <div
                      className={`dropdown-card ntf-type ${
                        selectedFilter === "nftType" ? "open" : ""
                      }`}
                    >
                      <p className="primary-lead pl-3">All</p>
                      {collectibleTypes.map((item, index) => {
                        if (item.forTypeList) {
                          return (
                            <div
                              className="ntf-dropdown-item"
                              key={index}
                              onClick={() =>
                                handleSelectedSubFilter("nftType", item)
                              }
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
                      className="dropdown-content"
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

                {priceRangeFilter && (
                  <div className="price-range dropdown-item">
                    <div
                      className="dropdown-content"
                      onClick={() =>
                        setSelectedFilter(
                          selectedFilter === "priceRange" ? "" : "priceRange"
                        )
                      }
                    >
                      <p className="dropdown-lead">Price Range</p>
                      {/* <ExpandMoreIcon /> */}
                      <ArrowDropDownIcon />
                    </div>
                    <div
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
                                          handleSelectedSubFilter(
                                            "currency",
                                            filter
                                          )
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
                          />
                          <span className="input-between">to </span>
                          <input
                            className="range-input"
                            type="text"
                            placeholder="Max Price"
                            onChange={(e) => setMaxValue(e.target.value)}
                            value={maxvalue}
                          />
                        </div>
                        {/* <div className="range-lead-wrapper">
                          <p className="range-lead">{minvalue + " WOM"}</p>
                          <div className="pointer" />
                          <p className="range-lead">{maxvalue + " WOM"}</p>
                        </div> */}
                      </div>
                      {/* <div className="collection-footer">
                        <div className="footer-item">
                          <p className="footer-lead">Clear</p>
                        </div>
                        <div className="footer-item">
                          <p
                            className="footer-lead"
                            onClick={() =>
                              handleSelectedSubFilter("priceRange", maxvalue)
                            }
                          >
                            Apply
                          </p>
                        </div>
                      </div> */}
                    </div>
                  </div>
                )}
                {sortByFilter && (
                  <div className="most-recent dropdown-item">
                    <div
                      className="dropdown-content"
                      onClick={() =>
                        setSelectedFilter(
                          selectedFilter === "sortBy" ? "" : "sortBy"
                        )
                      }
                    >
                      <p className="dropdown-lead">
                        {sortBy ? sortBy.value : "Most Recent"}
                      </p>

                      {/* <ExpandMoreIcon /> */}
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
                <p
                  className="clear-filter mobile-view"
                  onClick={handleClearSubFilter}
                >
                  Clear
                </p>
              </div>
            </>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(SubFilter);
