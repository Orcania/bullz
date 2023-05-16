import { Menu, MenuItem } from "@material-ui/core";

import React, { useEffect, useState } from "react";

import { useHistory } from "react-router";

import { useSelector } from "react-redux";

import { capitalize } from "common/utils";

import CustomTooltip from "../../components/Common/Tooltip/CustomTooltip";

import "./style.scss";

import { getLatestOffer } from "../../common/utils";
import { ChallengeService } from "../../services/challenge.service";
import { printLog } from "utils/printLog";

const NFTCard = ({  item, key, selectedNft, onClickNft, ...props }) => {

  const history = useHistory();
  const network = useSelector((state) => state.web3.network);
  const challengeService = new ChallengeService(network.backendUrl);
  const [challenge, setChallenge] = useState("");
  const [timeLeft, setTimeLeft] = useState('Closed');

  const selectNft = (nft) => {
    onClickNft(nft);
  }

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
  printLog(['lastOffer', lastOffer], 'success');

  const getChallenge = async () => {


    if (item?.nftType === "nft_challenge") {
      if(item?.challenges?.length > 0) {
        let challenge = item.challenges[0];
        setChallenge(challenge);
        calculateExpireTime(parseInt(challenge.expiresAt))
      } else {
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
      className={`profile-card profile-card-created ${
        item.contractType === "ERC1155" ? "multiple-card" : ""
      } ${selectedNft && selectedNft.id == item.id ? "selected" : ""}`}
      onClick={() => selectNft(item)}

    >
      {lastOffer && (
        <>
          <div className="card-image">
            <img
              src={item.cover}
              alt="Item"
              className="card-content-image"
              onClick={() => selectNft(item)}
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
              <>
              
              </>
            </div>
            <div>
            <p className="item-count mobile">{`${item.supply} of ${item.totalSupply}`}</p>
              <CustomTooltip
                title={`${capitalize(item.name)}`}
                placement={"top-start"}
              >
                
                <p
                  className="item-title"
                  title={item.name}
                  style={{ cursor: "pointer" }}
                >
                  {item.name}
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(NFTCard);
