import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import React, { useEffect, useState } from "react";

import { Spinner } from "react-bootstrap";

import { useSelector } from 'react-redux';

import { CollectionService } from "../../services/collection.service";

// import  {} from 'react-dropdown'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { getNetworkByChainId } from "common/utils";
import { printLog } from "utils/printLog";

function CollectionDropDown({
  collectionType,
  setCollectionType,
  clearCollectionFilter,
  handleSelectedSubFilter,
  selectedFilter,
  setSelectedFilter,
  ...props
}) {
  const [collectionOpen, setCollectionOpen] = useState(false);

  const [collectionsList, setCollectionsList] = useState("");
  const [collectionsFilteredList, setCollectionsFilteredList] = useState([]);

  const network = useSelector((state) => state.web3.network);

  const collectionService = new CollectionService(network.backendUrl);

  const [limit, setLimit] = useState(1000);
  const [selectedPage, setSelectedPage] = useState(1);
  const [nftsLoading, setNftsLoading] = useState("");

  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query) {
      let found = [];
      for (let i = 0; i < collectionsList.length; i++) {
        if (
          collectionsList[i].name.toLowerCase().startsWith(query.toLowerCase())
        ) {
          found.push(collectionsList[i]);
        }
      }
      setCollectionsFilteredList(found);
    } else {
      setCollectionsFilteredList([...collectionsList]);
    }
  }, [query]);

  const getAllCollections = async () => {
    setNftsLoading(true);
    const response = await collectionService.getAllCollections(
      limit,
      selectedPage
    );
    if (response && response.data) {
      setCollectionsList(
        response.data.length > 0 ? [...collectionsList, ...response.data] : []
      );
      setCollectionsFilteredList(
        response.data.length > 0 ? [...collectionsList, ...response.data] : []
      );
      setNftsLoading(false);
    }
  };

  useEffect(() => {
    if (collectionOpen) {
      getAllCollections();
    } else if (!collectionOpen) {
      setCollectionsList("");
    }
  }, [collectionOpen]);

  const handleOpen = () => {
    if (
      document.getElementById("collectionDropDown") &&
      document.getElementById("collectionDropDown").classList.contains("open")
    ) {
      //   document.getElementById("collectionDropDown").classList.remove("open");
      //   setCollectionOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOpen);
    return () => {
      document.removeEventListener("click", handleOpen);
    };
  }, []);

  const handleOnClick = () => {
    setCollectionOpen(!collectionOpen);
    setSelectedFilter(collectionOpen ? "" : "collectionType")
  };

  const handleOnCollectionSelect = (collection) => {
    printLog([collection], 'success');
    setCollectionType(collection);
    handleSelectedSubFilter("collectionType", collection.address);
    setCollectionOpen(false);
    setSelectedFilter("")
  };

  useEffect(()=>{
    if(selectedFilter !== "collectionType"){
      setCollectionOpen(false);
    }else{
      setCollectionOpen(true)
    }
  },[selectedFilter])

  return (
    <div className="collection dropdown-item">
      <div className={`dropdown-content ${collectionType ? "active" : ""}`} onClick={handleOnClick}>
        <p className="dropdown-lead">
          {collectionType ? collectionType.name : "Collection"}
        </p>
        <ArrowDropDownIcon/>
      </div>
      <div
        id={"collectionDropDown"}
        className={`dropdown-card collection  ${collectionOpen && selectedFilter === "collectionType" ? "open" : ""}`}
        style={{maxHeight:400,overflowY:'scroll'}}
  >
        <div className="collection-header">
          <div className="icon-search-input ml-0">
            <input
              className="search-input"
              type="text"
              placeholder="Search in Collections"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />

          <svg className="search-icon" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0.755859C3.59 0.755859 0 4.34586 0 8.75586C0 13.1659 3.59 16.7559 8 16.7559C9.84 16.7559 11.54 16.1259 12.9 15.0659L15.07 17.2459L16.49 15.8259L14.31 13.6559C15.37 12.2959 16 10.5959 16 8.75586C16 4.34586 12.41 0.755859 8 0.755859ZM8 2.75586C11.33 2.75586 14 5.42586 14 8.75586C14 12.0859 11.33 14.7559 8 14.7559C4.67 14.7559 2 12.0859 2 8.75586C2 5.42586 4.67 2.75586 8 2.75586Z" fill="white"/>
          </svg>

          </div>
        </div>
        <div className="collection-body">
          {nftsLoading ? (
            <div
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                // height: "100vh",
                display: "flex",
              }}
            >
              <Spinner animation="border" />
            </div>
          ) : collectionsFilteredList && collectionsFilteredList.length > 0 ? (
            collectionsFilteredList.map((collection, index) => {
              return (
                <div
                  className="collection-item"
                  key={index}
                  onClick={() => handleOnCollectionSelect(collection)}
                >
                  <p className="dropdown-lead">{`${collection.name} (${getNetworkByChainId(parseInt(collection?.chain_id)).chainName})`}</p>
                </div>
              );
            })
          ) : (
            <div style={{ color: "white", textAlign: "center" }}>
              {" "}
              No Data Found
            </div>
          )}
        </div>
        {/* <div className="collection-footer">
          <div className="footer-item">
            <p className="footer-lead">Clear</p>
          </div>
          <div className="footer-item">
            <p
              className="footer-lead"
              onClick={() => {
                setCollectionOpen(false);
                setSelectedFilter("")
              }}
            >
              Apply
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default React.memo(CollectionDropDown);
