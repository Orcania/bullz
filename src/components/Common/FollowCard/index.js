import React from "react";
import { useHistory, useParams } from "react-router";
import "./style.scss";
import ComingUser from './../ComingUser/index';
import { useMediaQuery } from '@material-ui/core';
import CustomTooltip from "../Tooltip/CustomTooltip";
import { capitalize } from "common/utils";

const FollowCard = ({ info, ...props }) => {
  const history = useHistory();
  const isMobile = useMediaQuery('(min-width:350px) and (max-width:1023px)');

  return ( <>
    {
      isMobile ? (
        <ComingUser
          info={info}
          // count={count}
          history={history}
          // comingfor={props.comingFor}
        />
      ) 
      :  <div
      className="following-card"
      {...props}
    >
      <img
        src={
          info.avatar_img
            ? info.avatar_img
            : `/images/avatars/${info.image}.jpg`
        }
        alt="Avatar"
        style={{cursor:'pointer'}}
        className="user-avatar"
        onClick={() => history.push(`/profile/${info.address}`)}
      />
      <CustomTooltip 
          title={`@${info.username}`}
          placement={"top"}
      >
        <p className="user-name">@{info.username}</p>
      </CustomTooltip>

      {info.followResponse && info.followResponse !== "currentUser" && (
        <button className="btn-sign mb-0" onClick={()=>props.followUnfollowUserList(info)}>UnFollow</button>
      )}
      {!info.followResponse && info.followResponse !== "currentUser" && (
        <button className="btn-continue mb-0" onClick={()=>props.followUnfollowUserList(info)}>Follow</button>
      )}
    </div>
    }
  </>
   
  );
};

export default React.memo(FollowCard);
