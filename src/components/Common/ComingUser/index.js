import React from "react";

import "./style.scss";
import CustomTooltip from 'components/Common/Tooltip/CustomTooltip';
import { capitalize } from "common/utils";
import { useSelector } from "react-redux";

const ComingUser = ({ info, count, ...props }) => {
  let pathName = props?.history?.location.pathname;
  const network = useSelector((state) => state.web3.network);
  return (
    <div
      // className={`small_coming_card ${pathName.includes("creators") || pathName.includes("buyers") || pathName.includes("search") ? "mr-0" : ""}`}
      className={`small_coming_card`}
      style={{ cursor: "pointer" }}
      key={count}
      onClick={() => {
        if (info.address) {
          props.history.push(`/profile/${info.address}`);
        }
      }}
    >
      <p className="card-number">{count < 10 ? "0" + count : count}</p>
      <img
        src={info.avatar_img ? info.avatar_img : `/images/default-profile-cover.png`}
        alt=""
        className="card-avatar"
      />

      <div className="card-info">
        <CustomTooltip 
          title={`@${info.username}}`}
          placement={"top"}
        >
          <p className="card-name">@{info.username}</p>
        </CustomTooltip>
        
        <p className="card-eth">
          {info.id
            ? props.comingfor === "creators"
              ? info.totalSold
                ? info.totalSold.toFixed(4) + ' ' + network.nativeCurrency.symbol
                : 0 + ' ' + network.nativeCurrency.symbol
              : info.totalBought
              ? info.totalBought.toFixed(4) + ' ' + network.nativeCurrency.symbol
              : 0 + ' ' + network.nativeCurrency.symbol
            : "Only on BULLZ"}
        </p>
      </div>

      {/* {
        (pathName.includes("creators") || pathName.includes("buyers") || pathName.includes("search")) && <>
          {info.followResponse && info.followResponse !== "currentUser" && (
            <div className="card-actions">
              <button className="btn-sign mb-0">UnFollow</button>
            </div>
          )}
          {!info.followResponse && info.followResponse !== "currentUser" && (
            <div className="card-actions">
              <button className="btn-continue mb-0">Follow</button>
            </div>
          )}
        </>
      } */}
      
    </div>
  )
};

export default ComingUser;
