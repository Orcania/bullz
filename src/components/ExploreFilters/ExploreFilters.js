import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useMediaQuery } from '@material-ui/core';

import React, { useEffect, useState } from "react";
import { useRef } from "react";

const sortByFilters = [
  { key: "recent", value: "Recently Added" },
  // { key: "priceLowToHigh", value: "Price: Low To High" },
  // { key: "priceHighToLow", value: "Price: High To Low" },
  { key: "auctionEND", value: "Auction Ending Soon" },
];

const ExploreFilters = ({ ...props }) => {

  const filterRef = useRef();

  const handleSelectedSubFilter = (key, value) => {
    let obj = { key: key };
    if (key === "sortBy") {
      obj.value = value;
      setSortByOpen(false);
      setSortBy(value);
    } else if (key === "clear") {
      obj.value = "clear";
      obj.key = "clear";
      setSortBy("");
      setIsMobileFilter(false);
    }
    props.setSelectedSubFilterFun(obj, type);
  };

  const [sortByOpen, setSortByOpen] = useState(false);

  const [sortBy, setSortBy] = useState("");
  const [isMobileFilter, setIsMobileFilter] = useState(false);

  const isMobile = useMediaQuery('(min-width:350px) and (max-width:1023px)');

  const { type, name } = props;

  const onOutsideClickOfFilter = (e) => {
    if (!filterRef.current.contains(e.target)) {
      setSortByOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', onOutsideClickOfFilter);
    return () => document.removeEventListener('mousedown', onOutsideClickOfFilter);
  });

  return (
      <div className={`filter-bar`} key={type} ref={filterRef}>
        <div className="title-container">
          <span className="explor2-title">{name}</span>
          {
            isMobile && !isMobileFilter && <div
              className={`d-flex justify-content-between mobile-show`}
              style={{
                padding: '0 16px'
              }}
            >
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
                <p className="filter-txt mb-0">Filters</p>
              </div>

            </div>
          }
        </div>


        {
          isMobileFilter && <div
            className={`d-flex justify-content-between mobile-show w-100`}
            style={{ marginTop: 24 }}
          >
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
                  onClick={() => handleSelectedSubFilter("clear", "clear")}
                >
                  Clear
                </p>
                <p className="clear-txt" onClick={() => setIsMobileFilter(false)}>
                  Done
                </p>
              </div>
            )}
          </div>
        }


        {(!isMobile || isMobileFilter) && <> <div className="dropdown-item">

          <div
            className="dropdown-content"
            onClick={() => setSortByOpen(!sortByOpen)}
          >
            <p className="dropdown-lead">{sortBy ? sortBy.value : "Sort By"}</p>

            <ExpandMoreIcon />
          </div>
          <div
            className={`dropdown-card most-recent ${sortByOpen ? "open" : ""}`}
          >
            <div className="most-recent-body">
              {sortByFilters.map((filter) => {
                return (
                  <div
                    className="collection-item"
                    onClick={() => handleSelectedSubFilter("sortBy", filter)}
                  >
                    <p className="dropdown-lead">{filter.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

          {
            !isMobile && <p
              className="clear-filter"
              onClick={() => handleSelectedSubFilter("clear", "clear")}
            >
              Clear
            </p>
          }


        </>
        }
      </div>
  );
};

export default React.memo(ExploreFilters);
