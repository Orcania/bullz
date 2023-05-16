import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Spinner } from "react-bootstrap";

import {ChallengeService} from "../../services/challenge.service";

import "./style.scss";

import moment from 'moment';
import EyeIcon from './../../components/Common/Icons/EyeIcon';

function OwnersComponent({ nft, challenge, ...props }) {
  const loggedInUser = useSelector((state) => state.auth.userData);
  const history = useHistory();
  const network = useSelector((state) => state.web3.network);
  const challengeService = new ChallengeService(network.backendUrl);

  const [otherOwners, setOtherOwners] = useState("");
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [loggedInUser]);

  useEffect(() => {
    getOtherNft();
  }, []);

  const getOtherNft = async () => {
    const owner = await challengeService.getSubmissions(challenge.id);
    if (owner.data) {
      let temp = [];
      for (let i = 0; i < owner.data.length; i++) {
        let item = owner.data[i];
        if (item.hasWin) {
          temp.push(item);
        }
      }
      setOtherOwners([...temp]);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const getUrl = (url) => {
    if (url.startsWith("https://") || url.startsWith("http://")) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <React.Fragment>
      <>
        {!isloading ? (
          otherOwners && otherOwners.length > 0 ? (
            otherOwners.map((item, index) => {
              return (
                <div className="submit-item" key={index}>
                  <div className="user-part">
                    <img
                      className="commmemt-avatar cursor-pointer"
                      src={item.user.avatar_img}
                      alt="Avatar"
                      onClick={()=> history.push(`/profile/${item.user.address}`)}
                    />
                    <div className="avatar-info">
                      <span className="user-name cursor-pointer" onClick={()=> history.push(`/profile/${item.user.address}`)}>
                        @{item.user.username}
                      </span>
                      <p className="submission-duration">
                      {moment(item.updatedAt).fromNow()}
                      </p>
                      {/* <div className="avatar-info-content">
                        <p>
                          {item.user.follower.length}
                          <span>Followers <span className="circle"></span> </span>
                        </p>
                        <p>
                          {nft.views}<span>Views <span className="circle"></span></span>
                        </p>
                        <p>
                          {nft.likes}<span>Likes</span>
                        </p>
                      </div> */}
                    </div>
                  </div>
                  <div className="user-part">
                    {item.linkPreview && (
                      <a href={item.linkPreview} rel="noopener noreferrer" download="" target="_blank">
                         <svg style={{marginRight: 24}} width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.45 6.61111H15.2L9.5 12.2778L3.8 6.61111H8.55V0H10.45V6.61111ZM1.9 15.1111H17.1V8.5H19V16.0556C19 16.306 18.8999 16.5463 18.7218 16.7234C18.5436 16.9005 18.302 17 18.05 17H0.95C0.698044 17 0.456408 16.9005 0.278249 16.7234C0.100089 16.5463 0 16.306 0 16.0556V8.5H1.9V15.1111Z" fill="white"/>
                        </svg>
                      </a>
                    )}

                    {item.link && (
                      <a href={getUrl(item.link)} rel="noopener noreferrer" target="_blank">
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.0041 11.0019V17.0035C16.0041 17.5341 15.7933 18.043 15.4181 18.4181C15.043 18.7933 14.5341 19.0041 14.0035 19.0041H3.00054C2.46997 19.0041 1.96112 18.7933 1.58595 18.4181C1.21077 18.043 1 17.5341 1 17.0035V6.00054C1 5.46997 1.21077 4.96112 1.58595 4.58595C1.96112 4.21077 2.46997 4 3.00054 4H9.00218" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M13.0029 1H19.0046V7.00163" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8.00098 12.003L19.004 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="not-found">
              <EyeIcon />
              <p>No winners announced yet.</p>
            </div>   
          )
        ) : (
          <div className="w-100 d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        )}
      </>
    </React.Fragment>
  );
}

export default React.memo(OwnersComponent);
