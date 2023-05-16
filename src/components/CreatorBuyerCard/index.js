import React from "react";
import { useHistory, useParams } from "react-router";
import "./style.scss";
import { useMediaQuery } from '@material-ui/core';
import ComingUser from './../Common/ComingUser/index';
import CustomTooltip from "components/Common/Tooltip/CustomTooltip";
import { capitalize } from "common/utils";

const FollowCard = ({ info, count=0, ...props }) => {
  const history = useHistory();
  const isMobile = useMediaQuery('(min-width:350px) and (max-width:1023px)');
  
  return <>
  {
    isMobile 
      ? (
        <ComingUser
          info={info}
          count={count}
          history={history}
          comingfor={props.comingFor}
        />
      )
      : (
        <>
          <ComingUser
          info={info}
          count={count}
          history={history}
          comingfor={props.comingFor}
        />
        {/* <div
          className="following-card"
          {...props}
          onClick={() => history.push(`/profile/${info.address}`)}
        >
          {
            (props.comingFor === "creators" || props.comingFor === "buyers") && (
              <div className="counter-part">
                <p>{count}</p>
              </div>
            )
          }
          <img
            src={
              info.avatar_img
                ? info.avatar_img
                : `/images/avatars/${info.image}.jpg`
            }
            alt="Avatar"
            className="user-avatar"
          />
          <CustomTooltip 
            title={`${capitalize(info.firstname)} ${capitalize(info.lastname)}`}
            placement={"top"}
          >
            <p className="user-name">{capitalize(info.firstname) + " " + capitalize(info.lastname)}</p>
          </CustomTooltip>

          {info.followResponse && info.followResponse !== "currentUser" && (
            <button className="btn-sign mb-0">UnFollow</button>
          )}
          {!info.followResponse && info.followResponse !== "currentUser" && (
            <button className="btn-continue mb-0">Follow</button>
          )}
        </div> */}
        </>
        
      )
    }
  </> 
};

export default React.memo(FollowCard);
