import { capitalize, getNetworkByChainId } from "common/utils";
import React from "react";
import ReactPlayer from "react-player/lazy";
import CustomTooltip from "../Tooltip/CustomTooltip";
import { useSelector } from "react-redux";

import "./style.scss";

const CollectionCard = ({ info, count, ...props }) => {
  let pathName = props?.history?.location.pathname;
  const network = useSelector((state) => state.web3.network);
  return (
    <>
    <div
      // className={`small_coming_card ${pathName.includes("creators") || pathName.includes("buyers") || pathName.includes("search") ? "mr-0" : ""}`}
      className={`small_coming_card`}
      style={{ cursor: "pointer" }}
      key={count}
      onClick={() => {
        if (info.address) {
          props.history.push(`/collection/${info.address}`);
        }
      }}
    >
      <p className="card-number">{count < 10 ? "0" + count : count}</p>
      <img
        src={info.image ? info.image : `/images/default-profile-cover-light.png`}
        alt=""
        className="card-avatar"
      />

      <div className="card-info">
        <CustomTooltip 
          title={`${capitalize(info.name)}`}
          placement={"top"}
        >
          <p className="card-name">@{capitalize(info.name)}</p>
        </CustomTooltip>
        
        <p className="card-eth">
          {info.totalVolume ? info.totalVolume.toFixed(4) + ' ' + getNetworkByChainId(info?.chain_id).nativeCurrency.symbol :"Only on BULLZ"}
        </p>
      </div>
    </div>
    </>
  );
};

export default CollectionCard;
