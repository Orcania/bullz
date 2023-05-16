import React from "react";

import "./style.scss";

const CreatorCard = ({ info, ...props }) => (
  <div
    className="creator-card"
    style={{ cursor: "pointer" }}
    onClick={() => {
      if (info.address) {
        props.history.push(`/profile/${info.address}`);
      }
    }}
  >
    <p className="card-number">{props.count}</p>
    <img
      style={{
        width: 45,
        height: 46,
        borderRadius: 50,
      }}
      src={info.avatar_img ? info.avatar_img : `/images/avatar.png`}
      alt="Avatar"
      className="card-avatar"
    />
    <div className="card-info">
      <p className="card-name">@{info.username}</p>
      <p className="card-eth">{props.comingfor === 'creators' ? info.totalSold ? info.totalSold.toFixed(4) : 0 :
        info.totalBought ? info.totalBought.toFixed(4) : 0
      }ETH</p>
    </div>
  </div>
);

export default CreatorCard;
