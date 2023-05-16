import { Checkbox, DialogContent, FormControlLabel, Menu, Typography, useMediaQuery } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Select, MenuItem } from "@material-ui/core";

import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import Dropzone from "react-dropzone";

import S3 from "react-aws-s3";

import ReactPlayer from "react-player/lazy";

import { useSnackbar } from "notistack";

import { useDispatch, useSelector } from "react-redux";

import { Spinner } from "react-bootstrap";

import ReactPaginate from "react-paginate";

import { capitalize, getNetworkByChainId, scrollToTop } from "common/utils";

import { S3Config } from "../../config";
import {
  SET_EXPLORE_NFTS,
  SET_USER_DATA,
  SET_SELECTED_PAGE,
  SET_REPORT_COLLECTIONS,
} from "../../redux/constants";
import { CollectionService } from "../../services/collection.service";
import { NftService } from "../../services/nft.service";
import { UserService } from "../../services/user.service";
import SubFilters from "../../components/SubFilters/subFiltersNew";
import NftCard from "../../components/Common/ExploreCard/index";

import "./style.scss";
import CustomTooltip from "components/Common/Tooltip/CustomTooltip";
import { ArrowDownwardOutlined } from "@material-ui/icons";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { SearchService } from "../../services/search.service";
import { ReportService } from "services/report.service";
import { ShareService } from "services/share.service";
import { printLog } from "utils/printLog";

const notificationConfig = {
  preventDuplicate: true,
  vertical: "bottom",
  horizontal: "right",
};
const Collection = (props) => {
  const dispatch = useDispatch();
  const history = useHistory()

  const { enqueueSnackbar } = useSnackbar();
  const metaMaskAddress = useSelector((state) => state.web3.metaMaskAddress);
  const isWeb3Connected = useSelector((state) => state.web3.web3connected);
  const loggedInUserData = useSelector((state) => state.auth.userData);

  const network = useSelector((state) => state.web3.network);

  const nftService = new NftService(network.backendUrl);
  const collectionService = new CollectionService(network.backendUrl);
  const userService = new UserService(network.backendUrl);
  const searchService = new SearchService(network.backendUrl);
  const reportService = new ReportService(network.backendUrl);
  const shareService = new ShareService(network.backendUrl);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const [showProfileButton, setShowProfileButton] = useState(false);

  //old
  const [collectionData, setCollectionData] = useState("");
  const [nfts, setNfts] = useState([]);

  const [nftsLoading, setNftsLoading] = useState(true);
  const [collectionLoading, setCollectionLoading] = useState(true);

  const [limit, setLimit] = useState(8);
  const [totalCount, setTotalCount] = useState(0);

  const [recordsFrom, setRecordsFrom] = useState(0);
  const [recordsTo, setRecordsTo] = useState(0);

  const [selectedPage, setSelectedPage] = useState(1);

  const [isOwner, setIsOwner] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isMoreOptionOpen, setIsMoreOptionOpen] = useState(false);
  const [isShowingFilter, setIsShowingFilter] = useState(false);
  const [reportValues, setReportValues] = useState({});
  const [query, setSearchQuery] = useState("");
  const isMobile = useMediaQuery('(min-width:350px) and (max-width:1023px)');


  const [selectedSubFilter, setSelectedSubFilter] = useState({
    sortBy: "all",
    collectionType: props.match.params?.id?.toLowerCase()
  });

  const is570 = useMediaQuery("(max-width:575px)");

  // for report
  const reportCollections = useSelector((state) => state.profile.reportCollections);

  const url = window.location.href;

  const getCollection = async () => {
    collectionService
      .getCollectionsByAddress(props.match.params.id)
      .then((res) => {
        if (res) {
          setCollectionData(res);
          setCollectionLoading(false);
        } else {
          setCollectionLoading(false);
        }
      })
      .catch((err) => {
        printLog([err]);
        setCollectionLoading(false);
      });
  };

  async function getUserNFT() {
    setNftsLoading(true);

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


    const response = await nftService.getExploreNftWithFilter(
      limit,
      selectedPage,
      selectedSubFilter.sortBy,
      queryString
    );
    await setData(response); 

    setNftsLoading(false);

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

      setNfts(arr.length > 0 ? arr : []);
      setNftsLoading(false);
    }
    else {
      setNfts([]);
      setNftsLoading(false);
    }
    dispatch({
      type: SET_EXPLORE_NFTS,
      payload: arr.length ? arr : null,
    });

    dispatch({
      type: SET_SELECTED_PAGE,
      payload: selectedPage,
    });
  }

  useEffect(() => {
    scrollToTop();
  }, [selectedPage])

  useEffect(() => {
    getUserNFT();
  }, [selectedPage, selectedSubFilter]);

  useEffect(() => {
    getUserNFT();
  }, [limit]);


  const setSelectedSubFilterFun = (obj) => {
    setSelectedSubFilter({
      ...obj,
      collectionType: props.match.params?.id?.toLowerCase()
    });
    setSelectedPage(1);
  };

  useEffect(() => {
    getCollection();
  }, []);

  useEffect(() => {
    if (
      metaMaskAddress && collectionData &&
      metaMaskAddress.toLowerCase() === collectionData.user?.address?.toLowerCase()
    ) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [collectionData, metaMaskAddress]);

  const handlePageClick = (page) => {
    setSelectedPage(page.selected + 1);
  };

  const handleChangeLimit = (e) => {
    setSelectedPage(1);
    setLimit(e.target.value);
  };

  const likeNFT = async (nft) => {
    if (isWeb3Connected) {
      const body = {
        assetId: nft.id,
        user_id: loggedInUserData.id,
      };
      let res = await nftService.likeUnlikeNFT(body);
      if (res) {
        printLog([res], 'success');
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
      let likedUpdatedUserData = { ...loggedInUserData };
      likedUpdatedUserData.likes = [...res.data.likedUpdated.likes];
      dispatch({
        type: SET_USER_DATA,
        payload: { ...likedUpdatedUserData },
      });
    }
  };

  const showNotification = (msg, varient = "") => {
    enqueueSnackbar(msg, {
      ...notificationConfig,
      variant: varient ? varient : "error",
    });
  };

  const handleFileUpload = async (files, comingFor) => {
    if (files.length > 0 && files[0]) {
      if (
        comingFor === "isProfile" &&
        ((files[0].type !== "image/png" &&
          files[0].type !== "image/jpeg" &&
          files[0].type !== "image/jpg") ||
          files[0].size > 5242880)
      ) {
        showNotification(
          "Only Png, Jpg, Jpeg files with size not more then 5mb allowed."
        );
        return;
      }

      if (
        comingFor === "isCover" &&
        ((files[0].type !== "image/png" &&
          files[0].type !== "image/jpeg" &&
          files[0].type !== "image/jpg") ||
          files[0].size > 5242880)
      ) {
        showNotification(
          "Only Png, Jpg, Jpeg files with size not more then 5mb allowed."
        );
        return;
      }
      let _file = files[0];
      const ReactS3Client = new S3(S3Config);
      let newFileName = new Date().getTime() + _file.name;
      ReactS3Client.uploadFile(_file, newFileName).then(async (data) => {
        if (data.status === 204) {
          if (comingFor === "isCover") {
            let _user = {
              ...collectionData,
              coverImage: data.location,
              coverFileType: files[0].type,
              user: loggedInUserData.id,
            };
            let response = await collectionService.saveCollecion(_user);
            if (response) {
              setCollectionData((prevState) => ({
                ...prevState,
                coverImage: data.location,
                coverFileType: files[0].type,
              }));
            }
          } else {
            let _user = {
              ...collectionData,
              image: data.location,
              user: loggedInUserData.id,
            };
            let response = await collectionService.saveCollecion(_user);
            if (response) {
              setCollectionData((prevState) => ({
                ...prevState,
                image: data.location,
              }));
            }
          }
        } else printLog(["fail"]);
      });
    }
  };

  const handleReportSubmit = async () => {
    if (Object.values(reportValues).find(item => item === true)) {
      if (!reportCollections.includes(collectionData.id)) {
        let feedbacks = [];
        for (const [key, value] of Object.entries(reportValues)) {
          if (value) {
            feedbacks.push(key);
          }
        }
        
        const reportData = {
          report_for: 'collection',
          reporter_id: loggedInUserData.id,
          reported_id: collectionData.id,
          report_list: feedbacks
        };
        const addReport = await reportService.saveReport(reportData).then(res =>{
          printLog([res.data], 'success');
          return res.data;
        }).catch(function (error) {
          if (error.response) {
            showNotification(error.response?.data?.message ? error.response?.data?.message : error.response?.data?.error, "error");
          } else if (error.request) {
            showNotification("request error", "error");
          } else {
            showNotification(error.message, "error");
          }
        });
        if (addReport) {
          dispatch({
            type: SET_REPORT_COLLECTIONS,
            payload: [...reportCollections, collectionData.id],
          })
          showNotification("Your report has been submitted.", "success");
          setIsReportOpen(false);
          setReportValues({});        
        }
      } else {
        showNotification("You have already reported this collection.", "error");
      }
    } else {
      showNotification("Please write something.")
    }
  }
  const emailShareClicked = async () => {
    const shareData = {
      shared_by: loggedInUserData.address,
      link: url,
      share_on: 'email'
    }
    await shareService.addShare(shareData);
  }

  const hadleOnShareClick = async (type) => {
    let extUrl = "";
    if (type === "twitter") {
      extUrl = `http://twitter.com/share?text=Check this awesome nft collection&url=${url}`
    } else if (type === "facebook") {
      extUrl = `https://www.facebook.com/sharer.php?display=page&u=${url}`
      // extUrl = `https://www.facebook.com/sharer/sharer.php?display=page&u=${url}`

    } else if (type === "telegram") {
      extUrl = `https://telegram.me/share/url?url=${url}&text=Check out this awesome NFT collection, thought you might like this.`
    } else if (type === "instagram") {
      showNotification('Instagram sharing is not supported yet');
      return;
    }
    const shareData = {
      shared_by: loggedInUserData.address,
      link: extUrl,
      share_on: type
    }
    await shareService.addShare(shareData);
    setIsShareOpen(false);
    window.open(extUrl, "_blank")
  }

  const handleMoreOptionClose = async () => {
    setAnchorEl(null);
    setIsMoreOptionOpen(false);
  }

  const handleReportCheckboxChange = (e) => {
    setReportValues({ ...reportValues, [e.target.name]: e.target.checked })
  }

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
      setNftsLoading(true);
      let res = await searchService.getSearchDataNFTByCollection(collectionData?.address?.toLowerCase(), q, selectedPage, limit);     
      printLog(['getSearchData output', res], 'success');
      await setData(res); 
      setNftsLoading(false);
    } else if (q.length == 0) {
      getUserNFT();
    } else {
    }
  }

  const connectWallet = async (e) => {
    if (document.getElementById("connectButton")) {
      document.getElementById("connectButton").click();
    }
  };

  return (
    <div className="collection-page">
      {
        !collectionLoading ? (
          <div className="photo-profile-page">
            {collectionData ? (
              <>
                <div className="top-content">
                  <div className="avatar-wrapper">

                    {metaMaskAddress &&
                      showProfileButton &&
                      Object.keys(loggedInUserData).length > 0 &&
                      collectionData.user &&
                      collectionData.user !== null
                      ? loggedInUserData.id === collectionData.user.id && (
                        <Dropzone
                          name="file"
                          className="avatar-drop-zone"
                          multiple={false}
                          onDrop={(value) => handleFileUpload(value, "isProfile")}
                        >
                          {/* <img src="/images/upload-green.png" alt="" className="dropzone-image" /> */}

                          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10.7556" cy="10.7556" r="10.7556" fill="#4353FF"/>
                  <path d="M10.0373 13.4758H8.56446V12.0264C8.56289 11.205 8.89454 10.4176 9.48555 9.83908L13.3334 6.05078H13.5943C14.9838 6.05078 16.1092 7.15834 16.1092 8.52578V8.78256L12.2614 12.5693C11.6735 13.1525 10.8719 13.4789 10.0373 13.4758ZM9.82192 12.2383H10.0373C10.5387 12.2398 11.0181 12.0434 11.3717 11.6938L14.8298 8.29066C14.7323 7.79411 14.3378 7.40584 13.8332 7.30994L10.3752 10.7131C10.02 11.0611 9.82035 11.5329 9.82192 12.0264V12.2383Z" fill="white"/>
                  <path d="M13.5946 15.9516H7.30726C6.61252 15.9516 6.0498 15.3978 6.0498 14.7141V8.52656C6.0498 7.84284 6.61252 7.28906 7.30726 7.28906H9.19345V8.52656H7.30726V14.7141H13.5946V12.8578H14.852V14.7141C14.852 15.3978 14.2893 15.9516 13.5946 15.9516Z" fill="white"/>
                </svg>
                        </Dropzone>
                      ) : null}
                    <img className="avatar-img" src={collectionData?.image ? collectionData.image : "/images/default-profile-cover.png"} alt="" />

                  </div>
                  <div className="header">
                    <div className="content">

                      <CustomTooltip
                        title={`${capitalize(collectionData.name)}}`}
                        placement={"top"}
                      >
                        <p className="username">
                          {capitalize(collectionData.name)}
                        </p>
                      </CustomTooltip>
                    </div>
                  </div>
                  <div className="profile-info">
                    <p className="description">
                      {collectionData?.totalVolume?.toFixed(4)} {getNetworkByChainId(collectionData?.chain_id).nativeCurrency.symbol}
                    </p>
                  </div>

                  <div className="account-options">

                    {
                      !isOwner && (
                        <svg className="mr-0" width="13" height="4" viewBox="0 0 13 4" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setIsMoreOptionOpen(true);
                        }}>
                          <path d="M1.40651 0.652344C0.665693 0.652344 0.0595703 1.25847 0.0595703 1.99928C0.0595703 2.7401 0.665693 3.34622 1.40651 3.34622C2.14733 3.34622 2.75345 2.7401 2.75345 1.99928C2.75345 1.25847 2.14733 0.652344 1.40651 0.652344ZM10.8351 0.652344C10.0943 0.652344 9.48814 1.25847 9.48814 1.99928C9.48814 2.7401 10.0943 3.34622 10.8351 3.34622C11.5759 3.34622 12.182 2.7401 12.182 1.99928C12.182 1.25847 11.5759 0.652344 10.8351 0.652344ZM6.12079 0.652344C5.37998 0.652344 4.77386 1.25847 4.77386 1.99928C4.77386 2.7401 5.37998 3.34622 6.12079 3.34622C6.86161 3.34622 7.46773 2.7401 7.46773 1.99928C7.46773 1.25847 6.86161 0.652344 6.12079 0.652344Z" />
                        </svg>
                      )
                    }


                    <div className="more-options">
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={isMoreOptionOpen}
                        onClose={handleMoreOptionClose}
                        // MenuListProps={{
                        //   'aria-labelledby': 'basic-button',
                        // }}
                        className="more-menu"
                        style={{ top: 40, left: isMobile ? 0 : -156 }}
                      >
                        <MenuItem className="more-item" onClick={async () => {
                          handleMoreOptionClose();
                          if(isWeb3Connected){
                            setIsShareOpen(true)
                          } else {
                            connectWallet();
                          }
                        } }>
                          Share
                        </MenuItem>
                        <MenuItem className="more-item" onClick={async () => {
                          if(isWeb3Connected){
                            setIsReportOpen(true)
                          }else {
                            await handleMoreOptionClose();
                            connectWallet();
                          }
                        }}>
                          Report
                        </MenuItem>

                      </Menu>
                    </div>

                  </div>

                  <div className="search-bar">
                    <div className="challenge-search-input">
                      <input
                        className="search-input"
                        type="text"
                        placeholder="Search by NFT name"
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
                <div className="divider"></div>
                </div>
                <div className="profile-content">
                  <div className="position-relative">
                    {/* <div className="togglebar-container">
                    <div className="profile-nav-menu1">
                      {mainFilters.map((filter, index) => (
                        <div
                          key={index}
                          className={`nav-menu ${selectedFilter === filter.key ? "active" : ""
                            }`}
                          onClick={() => onChangeMainFilter(filter)}
                        >
                          {filter.value}
                        </div>
                      ))}
                    </div>
                    <div className="filter-wrapper">
                      <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.97528 11.6672C4.38652 11.6672 2.28315 9.56387 2.28315 6.9751C2.28315 4.38634 4.38652 2.28297 6.97528 2.28297C9.56404 2.28297 11.6674 4.38634 11.6674 6.9751C11.6674 9.56387 9.56404 11.6672 6.97528 11.6672ZM12.5483 11.182C13.4292 10.0133 13.9685 8.5573 13.9685 6.9751C13.9685 3.12791 10.8225 0 6.97528 0C3.12809 0 0 3.12791 0 6.9751C0 10.8225 3.12809 13.9504 6.97528 13.9504C8.41348 13.9504 9.7618 13.5009 10.8764 12.7459C10.8944 12.764 10.8944 12.764 10.9124 12.7818L13.9685 15.838C14.1843 16.0538 14.4899 16.1798 14.7775 16.1798C15.0652 16.1798 15.3708 16.0717 15.5865 15.838C16.036 15.3886 16.036 14.6695 15.5865 14.22L12.5483 11.182Z" />
                      </svg>
                      <p>Filter</p>
                    </div>
                  </div> */}


                    <>
                    <div className="position-relative">

                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mobile-filter-btn" onClick={() => setIsShowingFilter(!isShowingFilter)}>
                            <rect x="0.5" y="0.5" width="39" height="39" rx="3.5" fill="black" stroke="#373737"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.9746 14.4423C18.9746 12.5412 20.5158 11 22.4169 11C24.0605 11 25.435 12.1519 25.7773 13.6924L28.6991 13.6924C29.1133 13.6924 29.4491 14.0282 29.4491 14.4424C29.4491 14.8566 29.1133 15.1924 28.6991 15.1924L25.7773 15.1924C25.4349 16.7328 24.0604 17.8846 22.4169 17.8846C20.5158 17.8846 18.9746 16.3434 18.9746 14.4423ZM22.4169 12.5C21.3442 12.5 20.4746 13.3696 20.4746 14.4423C20.4746 15.515 21.3442 16.3846 22.4169 16.3846C23.4896 16.3846 24.3592 15.515 24.3592 14.4423C24.3592 13.3696 23.4896 12.5 22.4169 12.5ZM10.75 13.6923C10.3358 13.6923 10 14.0281 10 14.4423C10 14.8565 10.3358 15.1923 10.75 15.1923H16.1346C16.5488 15.1923 16.8846 14.8565 16.8846 14.4423C16.8846 14.0281 16.5488 13.6923 16.1346 13.6923H10.75ZM10.75 25.9609H12.7733C13.1156 27.5013 14.4902 28.6532 16.1337 28.6532C18.0348 28.6532 19.576 27.112 19.576 25.2109C19.576 23.3097 18.0348 21.7686 16.1337 21.7686C14.4902 21.7686 13.1156 22.9204 12.7733 24.4609H10.75C10.3358 24.4609 10 24.7966 10 25.2109C10 25.6251 10.3358 25.9609 10.75 25.9609ZM16.1337 27.1532C15.0715 27.1532 14.2085 26.3006 14.1917 25.2424C14.1921 25.2319 14.1923 25.2214 14.1923 25.2109C14.1923 25.2003 14.1921 25.1898 14.1917 25.1793C14.2085 24.1212 15.0715 23.2686 16.1337 23.2686C17.2064 23.2686 18.076 24.1382 18.076 25.2109C18.076 26.2836 17.2064 27.1532 16.1337 27.1532ZM22.416 24.4609C22.0018 24.4609 21.666 24.7967 21.666 25.2109C21.666 25.6252 22.0018 25.9609 22.416 25.9609H28.6981C29.1123 25.9609 29.4481 25.6252 29.4481 25.2109C29.4481 24.7967 29.1123 24.4609 28.6981 24.4609H22.416Z" fill="white"/>
                          </svg>
                      {
                        isShowingFilter && (
                          <div className="mb-3">
                            <SubFilters
                              setSelectedSubFilterFun={setSelectedSubFilterFun}
                              nftTypeFilter={false}
                              collectionTypeFilter={false}
                              saleTypeFilter={true}
                              priceRangeFilter={true}
                              currencyTypeFilter={true}
                              sortByFilter={true}
                            />
                         </div>
                        )
                      }

                    </div>


                      <div className="row items-row position-relative">
                      
                        {nftsLoading ? (
                          <div className="spinnerStyle">
                            <Spinner animation="border" />
                          </div>
                        ) : nfts && nfts.length > 0 ? (
                          <>
                          
                            {nfts.map((nft, index) => (
                              <div key={index} className="explore-item">
                                <NftCard
                                  item={nft}
                                  key={index}
                                  user={nft.holderData}
                                  loggedInUser={loggedInUserData}
                                  likeNFT={likeNFT}
                                  showMenu={true}
                                />
                              </div>
                            ))}

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
                          </>
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
                              <p className="no-items-lead mobile-show">
                                Browse our marketplace to discover challenges
                              </p>
                              <button
                                className="btn-continue mobile-show"
                                onClick={() => history.push("/discover")}
                              >
                                Browse Marketplace
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  </div>
                </div>
              </>
            ) : !collectionData ? (
              <div className="profile-content">
                <div className="container position-relative">
                  <div className="no-items">
                    <p className="no-items-title">No Items Found</p>
                    <p className="no-items-lead">
                      Browse our marketplace to discover challenges
                    </p>
                    <button
                      className="btn-continue"
                      onClick={() => history.push("/discover")}
                    >
                      Browse Marketplace
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="spinnerStyle">
                <Spinner animation="border" />
              </div>
            )}
          </div>
        ) : (
          <div className="spinnerStyle">
            <Spinner animation="border" />
          </div>
        )
      }


      <Dialog
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        className="s-modal"
        fullWidth={true}
        maxWidth={"xs"}
      >
        <DialogContent style={{ backgroundColor: "#1B1B1B" }}>
          <MuiDialogTitle className="share-modal-header">
            <Typography className="main-title">
              Share a link to this page
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setIsShareOpen(false)}
              className="close_button"
            >
              <CloseIcon />
            </IconButton>
          </MuiDialogTitle>
          <div
            className="share-modal-menu"
            style={{ marginBottom: 15 }}
          >
            <div className="d-flex flex-column align-items-center modal-share">
              <a
                onClick={() => hadleOnShareClick("twitter")}
                rel="noopener noreferrer"
                className="social-share-anchor">
                <svg
                  width="21"
                  height="17"
                  viewBox="0 0 21 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.383 1.96745C19.6196 2.30514 18.81 2.52692 17.981 2.62545C18.8548 2.10288 19.5087 1.28046 19.821 0.31145C19.001 0.79945 18.102 1.14145 17.165 
					1.32645C16.5356 0.653029 15.7014 0.206413 14.792 0.0560348C13.8826 -0.0943437 12.9489 0.0599411 12.1363 0.494903C11.3236 0.929865 10.6774 1.62113 10.2981 
					2.46124C9.91884 3.30135 9.82775 4.24323 10.039 5.14045C8.37611 5.0571 6.74933 4.62497 5.26429 3.87211C3.77924 3.11925 2.46913 2.0625 1.419 0.77045C1.04729 
					1.4089 0.851955 2.13468 0.853 2.87345C0.853 4.32345 1.591 5.60445 2.713 6.35445C2.04901 6.33355 1.39963 6.15423 0.819 5.83145V5.88345C0.8192 6.84915 1.15337 
					7.78507 1.76485 8.53251C2.37633 9.27995 3.22748 9.79293 4.174 9.98445C3.55761 10.1515 2.91131 10.1761 2.284 10.0564C2.55087 10.8877 3.07101 11.6146 3.77159 
					12.1356C4.47218 12.6565 5.31813 12.9452 6.191 12.9614C5.32348 13.6428 4.33018 14.1464 3.26788 14.4436C2.20558 14.7408 1.09513 14.8257 0 14.6934C1.9117 15.9229 
					4.1371 16.5756 6.41 16.5734C14.103 16.5734 18.31 10.2005 18.31 4.67345C18.31 4.49345 18.305 4.31145 18.297 4.13345C19.1159 3.54162 19.8226 2.80847 20.384 
					1.96845L20.383 1.96745Z"
                  />
                </svg>
                <span className="text-modal-share">Twitter</span>
              </a>
            </div>
            <div className="d-flex flex-column align-items-center modal-share">
              <a
                onClick={() => hadleOnShareClick("facebook")}
                rel="noopener noreferrer"
                className="social-share-anchor"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 0C4.477 0 0 4.477 0 10C0 14.991 3.657 19.128 8.438 19.879V12.89H5.898V10H8.438V7.797C8.438 5.291 9.93 3.907 12.215 3.907C13.309 3.907 14.453 4.102 14.453 4.102V6.562H13.193C11.95 6.562 11.563 7.333 11.563 8.124V10H14.336L13.893 12.89H11.563V19.879C16.343 19.129 20 14.99 20 10C20 4.477 15.523 0 10 0Z" />
                </svg>

                <span className="text-modal-share">Facebook</span>
              </a>
            </div>
            <div className="d-flex flex-column align-items-center modal-share">
              <a
                onClick={() => hadleOnShareClick("telegram")}
                rel="noopener noreferrer"
                className="social-share-anchor"
              >
                <svg
                  width="20"
                  height="17"
                  viewBox="0 0 20 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5.25485 9.96563L0.712904 8.53332C-0.268942 8.22994 -0.274397 7.54596 0.93291 7.05504L18.6298 0.141703C19.6571 -0.281188 20.2389 0.25386 19.9062 1.59424L16.8934 15.9725C16.6824 16.9966 16.0733 17.2412 15.2279 16.7686L10.5895 13.2973L8.42766 15.408C8.20584 15.625 8.02583 15.8107 7.68401 15.8567C7.344 15.9045 7.06399 15.8015 6.85853 15.2315L5.27667 9.95276L5.25485 9.96563Z" />
                </svg>

                <span className="text-modal-share">Telegram</span>
              </a>
            </div>
            <div className="d-flex flex-column align-items-center modal-share">
              <a
                href={` mailto:?to=&body=Check out this awesome NFT collection, thought you might like this. ${url}&subject=Check out this awesome NFT collection, thought you might like this.`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-share-anchor"
              >
                <svg
                  width="20"
                  height="18"
                  viewBox="0 0 20 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={emailShareClicked}
                >
                  <path d="M1 0H19C19.2652 0 19.5196 0.105357 19.7071 0.292893C19.8946 0.48043 20 0.734784 20 1V17C20 17.2652 19.8946 17.5196 19.7071 17.7071C19.5196 17.8946 19.2652 18 19 18H1C0.734784 18 0.48043 17.8946 0.292893 17.7071C0.105357 17.5196 0 17.2652 0 17V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0ZM10.06 8.683L3.648 3.238L2.353 4.762L10.073 11.317L17.654 4.757L16.346 3.244L10.061 8.683H10.06Z" />
                </svg>

                <span className="text-modal-share">Email</span>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        className="s-modal report"
      >
        <MuiDialogTitle className="share-modal-header">
          <div className="d-flex flex-column">
            <Typography className="main-title">
              Why are you reporting?
            </Typography>
            <Typography className="share-subtitle">
              Tell us how this user violates the rules of this site
            </Typography>
          </div>
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setIsReportOpen(false)}
            className="close_button"
          >
            <path
              d="M4.5 3.50016L8.00016 0L9 0.999843L5.49984 4.5L9 8.00016L8.00016 9L4.5 5.49984L0.999843 9L0 8.00016L3.50016 4.5L0 0.999843L0.999843 0L4.5 3.50016Z"
              fill="#D2D2D2"
            />
          </svg>
        </MuiDialogTitle>
        <DialogContent>
          <div className="report-content">
            <div className="report-item">
              <FormControlLabel
                control={
                  <Checkbox
                    checkedIcon={<svg className="checkbox-checked-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                      <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    }
                    onChange={handleReportCheckboxChange}
                    checked={reportValues?.doesNotFollowRequirements}
                    name="doesNotFollowRequirements" />
                }
                label="Does not follow the requirements"
              />
            </div>
            <div className="report-item">
              <FormControlLabel
                control={
                  <Checkbox
                    checkedIcon={<svg className="checkbox-checked-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                      <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    }
                    checked={reportValues?.copyright}
                    onChange={handleReportCheckboxChange}
                    name="copyright" />
                }
                label="Copyright infringement"
              />
            </div>
            <div className="report-item">
              <FormControlLabel
                control={
                  <Checkbox
                    checkedIcon={<svg className="checkbox-checked-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                      <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    }
                    checked={reportValues?.poorQuality}
                    onChange={handleReportCheckboxChange}
                    name="poorQuality" />
                }
                label="Poor quality"
              />
            </div>
            <div className="report-item">
              <FormControlLabel
                control={
                  <Checkbox
                    checkedIcon={<svg className="checkbox-checked-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                      <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    }
                    checked={reportValues?.inappropriate}
                    onChange={handleReportCheckboxChange}
                    name="inappropriate" />
                }
                label="Inappropriate"
              />
            </div>
            <div className="report-item">
              <FormControlLabel
                control={
                  <Checkbox
                    checkedIcon={<svg className="checkbox-checked-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                      <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    }
                    checked={reportValues?.other}
                    onChange={handleReportCheckboxChange}
                    name="other" />
                }
                label="Other"
              />
            </div>


            <div className="actions">
              <button
                className={`btn-report ${!Object.values(reportValues).find(item => item === true) ? "" : "btn-active"}`}
                onClick={handleReportSubmit}
              >
                Report
              </button>
              <button
                className={`btn-continue btn-cancel`}
                onClick={() => setIsReportOpen(false)}
              >
                CANCEL
              </button>
            </div>


          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Collection;
