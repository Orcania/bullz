import { Menu, MenuItem } from "@material-ui/core";

import React, { useEffect, useState } from "react";

import { useHistory } from "react-router";

import { useSelector } from "react-redux";

import { capitalize } from "common/utils";

import CustomTooltip from "../Tooltip/CustomTooltip";

import "./style.scss";

import { getLatestOffer } from "../../../common/utils";
import { Link } from "react-router-dom";
import { ChallengeService } from "../../../services/challenge.service";
import { printLog } from "utils/printLog";

const ownerMenusOnSell = [
  {
    name: "Change Price",
    link: "/updateoffer",
  },
  {
    name: "Remove from Sale",
    link: "/cancelsell",
  },
];

const ownerMenusNotOnSell = [
  {
    name: "Sell NFT",
    link: "/sellnft",
  },
];

const ExploreCard = ({ user, loggedInUser, item, likeNFT, key, ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOptions, setMenuOptions] = useState([]);

  const history = useHistory();

  const isWeb3Connected = useSelector((state) => state.web3.web3connected);
  const metaMaskAddress = useSelector((state) => state.web3.metaMaskAddress);
  const currentTimeM = Math.round(new Date().getTime());
  const network = useSelector((state) => state.web3.network);
  const challengeService = new ChallengeService(network.backendUrl);
  const [challenge, setChallenge] = useState("");
  const [timeLeft, setTimeLeft] = useState('Closed');

  const handleMenuClick = (event) => {
    if (
      metaMaskAddress &&
      item.holder.toLowerCase() === metaMaskAddress.toLowerCase() &&
      item.offers &&
      item.offers.length > 0 &&
      item.offers[0].isForSell
    ) {
      setMenuOptions([...ownerMenusOnSell]);
    } else if (
      metaMaskAddress &&
      item.holder.toLowerCase() === metaMaskAddress.toLowerCase() &&
      (!item.offers ||
        item.offers.length === 0 ||
        (item.offers && item.offers.length > 0 && !item.offers[0].isForSell))
    ) {
      setMenuOptions([...ownerMenusNotOnSell]);
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOptions([]);
  };

  const handleMenuItemClick = (link) => {
    if (link) {
      history.push(`${link}/${item.id}`);
    }
  };

  const viewNFT = (nft) => {
    if (!props.disableView && nft.id) {
      let buyUrl = "";
      if (!props.customUrl) {
        if (nft.nftType === "art") {
          buyUrl = `/art/${nft.id}`;
        } else if (nft.nftType === "nft_challenge") {
          buyUrl = `/token-challenge/${challenge.id}`;
        }
      } else {
        buyUrl = `/mychallenge/${nft.id}`;
      }
      let url = buyUrl;
      history.push({ pathname: url, state: { nft: nft, challenge: challenge } });
    }
  };

  const likedByUser = (nft) => {
    return loggedInUser.likes && loggedInUser.likes.length > 0
      ? loggedInUser.likes.find((like) => like.assetId === nft.id)
      : undefined;
  };

  const isAuctionStarted = (startTime) => {
    var launchDate = new Date(startTime).getTime();
    var currDate = new Date().getTime();
    return launchDate < currDate;
  };

  const calculateExpireTime = (endTime) => {
    if (isAuctionStarted) {
      setTimeLeft('Closed');
    }
    var launchDate = new Date(endTime).toUTCString();
    var currDate = new Date();
    let daysDiff =
      (new Date(launchDate).getTime() - currDate.getTime()) /
      (1000 * 60 * 60 * 24);
    let hoursDiff = (daysDiff - parseInt(daysDiff)) * 24;
    let minDiff = (hoursDiff - parseInt(hoursDiff)) * 60;
    let secDiff = (minDiff - parseInt(minDiff)) * 60;
    const daysLeft = parseInt(daysDiff) * 24 * 60 * 60 * 1000;
    const hourLeft = parseInt(hoursDiff) * 60 * 60 * 1000;
    const minLeft = parseInt(minDiff) * 60 * 1000;
    const secLeft = parseInt(secDiff) * 1000;

    let d = daysLeft / (24 * 60 * 60 * 1000);
    let h = hourLeft / (60 * 60 * 1000);
    let m = minLeft / (60 * 1000);
    let s = secLeft / 1000;
    /* eslint-disable */
    let time = 'Closed';
    if (daysLeft >= 1) {
      time = d + "d" + " and " + h + "h";
    } else if (hourLeft > 0) {
      time = h + "h" + " and " + m + "m";
    } else if (minLeft > 0) {
      time = m + "m" + " and " + s + "s";
    } else if (secLeft > 0) {
      time = s + "s";
    } else {
      time = "Closed";
    }
    setTimeLeft(time);
  };

  const handleOnHover = () => {
    if(challenge) {
      calculateExpireTime(parseInt(challenge.expiresAt))
    } 
  }

  let lastOffer = getLatestOffer(item.offers);

  const getChallenge = async () => {
    
      if(item?.challenges?.length > 0) {
        let challenge = item.challenges[0];
        setChallenge(challenge);
        calculateExpireTime(parseInt(challenge.expiresAt))
      } else {
        if (item?.nftType === "nft_challenge") {
        let challenge = await challengeService.getChallengeFromNFT(item.id);
        printLog([challenge], 'success');
  
        if(challenge) {
          setChallenge(challenge);
          calculateExpireTime(parseInt(challenge.expiresAt))
        }
      }
      }
    
  };
  useEffect(() => {
    getChallenge();
    
    
  }, [item]);

  return (
    <div
      key={key}
      className={`profile-card ${
        item.contractType === "ERC1155" ? "multiple-card" : ""
      }`}
      onClick={() => viewNFT(item)}
    >
      {lastOffer && (
        <>
          <div className="card-image">
            <img
              src={item.cover}
              alt="Item"
              className="card-content-image"
              onClick={() => viewNFT(item)}
            />

            <div className="card-summary">
              <div className="summary-wrapper">
                {lastOffer.isForSell || lastOffer.isForAuction ? (
                  <>
                    {lastOffer.isForAuction ? (
                      <img src="/images/auction.png" alt="" />
                    ) : (
                      // <img src="/images/instant.png" alt="" />
                      <svg style={{marginRight: 4}} width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8.46429V10C12 11.1046 11.1046 12 10 12H6C3.23858 12 1 9.76142 1 7V6C1 3.23858 3.23858 1 6 1H10C11.1046 1 12 1.89543 12 3V4.14286" stroke="white"/>
                        <rect x="9.29297" y="4.70703" width="4.5" height="3.58333" rx="1.5" stroke="white"/>
                        <path d="M4.30078 4.85156V8.15156" stroke="white" stroke-linecap="round"/>
                      </svg>

                    )}
                    <p className="time">
                      {`${lastOffer.price} ${lastOffer.currency}`}
                    </p>
                  </>
                ) : (
                  <>
                    {challenge ? (
                      <>
                        {!isAuctionStarted(parseInt(challenge.expiresAt)) ? (
                          <>
                            <img src="/images/timer-icon.png" alt="" />
                            <p className="time">
                              {timeLeft}                             
                            </p>
                          </>
                        ) : (
                          <>
                            <img src="/images/expired.png" alt="" />
                            <p className="time">{challenge.status > 1 ? 'Withdrawn' : 'Closed'}</p>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <img src="/images/nosale.png" alt="" />
                        <p className="time">No Sale</p>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>            
          </div>
          
          <div className="card-content" onMouseEnter={handleOnHover}>
            <div className="d-flex justify-content-end">
              <p className="item-count">{`${item.supply} of ${item.totalSupply}`}</p>
            </div>
            <div className="d-flex justify-content-center">
              {challenge ? (
                <>
                  {!isAuctionStarted(parseInt(challenge.expiresAt)) &&
                  item.holder.toLowerCase() !==
                    loggedInUser?.address?.toLowerCase() ? (
                    <button className="btn-continue mb-0">Submit</button>
                  ) : (
                    <button className="btn-continue mb-0">View</button>
                  )}
                </>
              ) : (
                <>
                  {lastOffer && lastOffer.id ? (
                    <>
                      {item.holder.toLowerCase() !==
                      loggedInUser?.address?.toLowerCase() ? (
                        <>
                          {currentTimeM <= lastOffer?.expiresAt && (
                            <button className="btn-continue mb-0">
                              {lastOffer?.isForAuction
                                ? "Bid now"
                                : lastOffer?.isForSell
                                ? "Buy now"
                                : "View"}
                            </button>
                          )}
                          {currentTimeM > lastOffer?.expiresAt && (
                            <button className="btn-continue mb-0">
                              Time Ended
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button className="btn-continue mb-0">View</button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {item.holder.toLowerCase() ===
                        loggedInUser?.address?.toLowerCase() && item.resale ? (
                        <>
                          <button className="btn-continue mb-0">
                            Edit NFT
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn-continue mb-0">View</button>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            <div>
            <p className="item-count mobile">{`${item.supply} of ${item.totalSupply}`}</p>
              <CustomTooltip
                title={`${capitalize(item?.nftType == 'nft_challenge' ? challenge?.name : item?.name)}`}
                placement={"top-start"}
              >
                
                <p
                  className="item-title"
                  title={item?.nftType == 'nft_challenge' ? challenge?.name : item?.name}
                  style={{ cursor: "pointer" }}
                >
                  {item?.nftType == 'nft_challenge' ? challenge?.name : item?.name}
                </p>
              </CustomTooltip>
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(`/profile/${item.holder}`);
                }}
                className="avatar-name"
              >
                @{item.holderData.username}
              </p>
              {item.status == 2 && <p className="avatar-name">
                Status: hidden
              </p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(ExploreCard);
