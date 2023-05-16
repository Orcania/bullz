import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { capitalize } from "common/utils";
import CustomTooltip from "../Tooltip/CustomTooltip";
import "./style.scss";

const ChallengeCard = ({ loggedInUser, challenge, key, ...props }) => {
  const history = useHistory();
  const network = useSelector((state) => state.web3.network);
  const [timeLeft, setTimeLeft] = useState('Closed');

  const viewNFT = (_challange) => {
    if (!props.disableView && _challange.id) {
      let buyUrl = "";
      if (!props.customUrl) {
        buyUrl = `/token-challenge/${_challange.id}`;
      } else {
        buyUrl = `/mychallenge/${_challange.id}`;
      }
      let url = buyUrl;
      history.push({ pathname: url, state: { nft: _challange.nft, challenge: challenge } });
    }
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

  useEffect(() => {
    if (challenge) {
      calculateExpireTime(parseInt(challenge.expiresAt))
    }
  }, [challenge]);

  return (
    <div
      key={key}
      className={`profile-card multiple-card`}
      onClick={() => viewNFT(challenge)}
    >
      <div className="card-image">
        <img
          src={challenge.cover}
          alt="Item"
          className="card-content-image"
          onClick={() => viewNFT(challenge)}
        />

        <div className="card-summary">
          <div className="summary-wrapper">      
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
          </div>
        </div> 
        { challenge?.asset_type == 2 && 
         <svg className='token' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
         <circle opacity="0.4" cx="18" cy="18" r="18" fill="black"/>
         <g opacity="0.8">
         <path d="M19.4363 13.8825C20.7466 12.8986 22.3755 12.3157 24.14 12.3157C28.4711 12.3157 31.9821 15.8267 31.9821 20.1579C31.9821 24.489 28.4711 28 24.14 28C20.486 28 17.4157 25.5012 16.5449 22.1188" stroke="white" stroke-miterlimit="10"/>
         <path d="M21.5784 24.1223C22.2903 24.6435 23.1684 24.9506 24.1181 24.9506C25.0101 24.9506 25.8389 24.6794 26.5267 24.215" stroke="white" stroke-miterlimit="10" stroke-linecap="square"/>
         <path d="M11.8422 23.6843C16.1733 23.6843 19.6843 20.1733 19.6843 15.8422C19.6843 11.5111 16.1733 8 11.8422 8C7.51105 8 4 11.5111 4 15.8422C4 20.1733 7.51105 23.6843 11.8422 23.6843Z" stroke="white" stroke-miterlimit="10"/>
         <path d="M12.8333 20.4575C13.7053 20.3223 14.5434 19.9188 15.2149 19.2473C15.8459 18.6162 16.2401 17.8385 16.3978 17.0241" stroke="white" stroke-miterlimit="10" stroke-linecap="square"/>
         </g>
       </svg>}                
      </div>
      
      <div className="card-content" onMouseEnter={handleOnHover}>
        <div className="d-flex justify-content-end">
          {challenge.asset_type == 1 ? 
          <p className="item-count">{`${challenge?.nft?.supply} of ${challenge?.nft?.totalSupply}`}</p>
          :
          <p className="item-count">{`${challenge.winnerCount}`}</p>
        }

        </div>
        <div className="d-flex justify-content-center">
          {!isAuctionStarted(parseInt(challenge.expiresAt)) &&
          challenge?.creator?.address?.toLowerCase() !==
            loggedInUser?.address?.toLowerCase() ? (
            <button className="btn-continue mb-0">Submit</button>
          ) : (
            <button className="btn-continue mb-0">View</button>
          )}
        </div>
        <div>

          {challenge.asset_type == 1 ? 
          <p className="item-count mobile">{`${challenge?.nft?.supply} of ${challenge?.nft?.totalSupply}`}</p>
          :
          <p className="item-count mobile">{`${challenge.winnerCount}`}</p>
          }
          <CustomTooltip
            title={`${capitalize(challenge?.name)}`}
            placement={"top-start"}
          >
            
            <p
              className="item-title"
              title={challenge?.name}
              style={{ cursor: "pointer" }}
            >
              { challenge?.name}
            </p>
          </CustomTooltip>
          <p
            onClick={(e) => {
              e.stopPropagation();
              history.push(`/profile/${challenge?.creator.address}`);
            }}
            className="avatar-name"
          >
            @{challenge?.creator?.username}
          </p>
          {challenge?.nft?.status == 2 && <p className="avatar-name">
            Status: hidden
          </p>}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChallengeCard);
