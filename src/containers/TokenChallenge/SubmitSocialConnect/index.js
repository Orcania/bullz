import React, { useState, useEffect } from "react";
import { Modal, Row } from "react-bootstrap";
import "./style.scss";
import { InstagramLogin } from '@amraneze/react-instagram-login';
import { useHistory, useLocation } from "react-router-dom";
// import {
//   createUser,
//   createUserToken,
//   getUserProfile,
// } from "../../../services/sociallink.service";
import { isInstagramLinked, isTwitterLinked } from "../../../common/utils";
import { useDispatch, useSelector } from "react-redux";
import { UserService } from "../../../services/user.service";
import { setUserData } from "../../../redux/actions/authAction";
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterLogin from '../../../components/TwitterLogin';
import { useSnackbar } from "notistack";
import { printLog } from "utils/printLog";

const notificationConfig = {
  preventDuplicate: true,
  vertical: "bottom",
  horizontal: "left",
};
function SubmitSocialConnect() {
  const history = useHistory();
  const [show] = useState(false);
  const [continueDisabled, setcontinueDisabled] = useState(false);
  const [isInstagramSelected, setIsInstagramSelected] = useState(false);
  const [isTwitterSelected, setInTwitterSelected] = useState(false);
  const [twitterUrl, setTwitterUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isTwitterNeeded, setTwitterNeeded] = useState(true);
  const [isInstagramNeeded, setInstagramNeeded] = useState(true);
  const userData = useSelector((state) => state.auth.userData);
  const network = useSelector((state) => state.web3.network);
  const userService = new UserService(network.backendUrl);
  const nftId = history?.location?.state?.nftId;
  const _isTwitterNeeded = history?.location?.state?.isTwitterNeeded;
  const _isInstagramNeeded = history.location?.state?.isInstagramNeeded;
  const fetchTokenURL = network.backendUrl + "/auth/twitter/request_token";
  const loginUrl = network.backendUrl + "/auth/twitter/access_token";
  const { enqueueSnackbar } = useSnackbar();

  // const search = useLocation().search;
  //   const urlParams = new URLSearchParams(search);
  //   const twitter_oauth_token = urlParams.get('oauth_token');
  //   const twitter_oauth_verifier = urlParams.get('oauth_verifier');
  const dispatch = useDispatch();
    



  useEffect(() => {
    if (nftId) {
      localStorage.setItem("TempNFTId", nftId);
      setInstagramNeeded(_isInstagramNeeded);
      setTwitterNeeded(_isTwitterNeeded);
    }
  }, [nftId])  

  useEffect(() => {
    setcontinueDisabled((isTwitterNeeded && !isTwitterSelected) || (isInstagramNeeded && !isInstagramSelected));
  });

  const showNotification = (msg, variant = "") => {
    enqueueSnackbar(msg, {
      ...notificationConfig,
      variant: variant ? variant : "error",
    });
  };
  const instagramLogin = async (code) => {
      printLog(['responseInstagram'], 'success')
      printLog([code], 'success');    
      if (code.error != null) {
        showNotification(code.error_description);
        return;
      }    

      const mainUrl = window.location.href.split('?')[0]
      const instgramData = await userService.getInstagramAccessToken(
          {
              code: code,
              redirect_url: mainUrl,
          });
      printLog(['responseInstagram', instgramData], 'success');
      if (instgramData) {
      
    
        
        if(instgramData) {
          setIsInstagramSelected(true);
          const iUrl = 'https://www.instagram.com/' + instgramData.username;
          setInstagramUrl(iUrl);
          userData.instagram_url = iUrl;
          await userService.updateUser(userData);
          dispatch(setUserData(userData))
        }
      }
  }

  const onTwitterSuccess = async (response) => {
    response.json().then( async twitterData => {
        printLog([twitterData], 'success');
        printLog(['twitterData', twitterData], 'success');
        if(twitterData) {
          setInTwitterSelected(true);
          const tUrl = 'https://twitter.com/' + twitterData.screen_name;
          setTwitterUrl(tUrl);
          userData.twitter_url = tUrl;
          await userService.updateUser(userData);
          dispatch(setUserData(userData))
        }
    });
}

const onTwitterFailed = (error) => {
    printLog([error]);
    showNotification(error.message)
}

const submitContinue = () => {
  localStorage.setItem('addSubmission', 'true');
  history.push({pathname: `/token-challenge/${localStorage.getItem("TempNFTId")}`})
}

  return (
    <>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={!show}
        // onHide={() => props.hideShow()}
        dialogClassName="dialog-container"
      >
        <Modal.Body>
        <Row>
          <div className="social-connect-container-challenge">
            <p className="subtitle">Submit to Challenge</p>
            <p className="title">
              {isInstagramSelected && isTwitterSelected
                ? "You have successfully connected your social! Let’s continue to submit to the challenge."
                : "This challenge requires you to connect your social media profile for credibility. Please connect to continue to submit."}
            </p>
            <div className="social-items-container">
              {isTwitterNeeded && (
                <>
                  {isTwitterSelected ? (
                    <div className="social-input">
                      <img src="/images/twitter.png" alt="" />
                      <input
                        type="text"
                        placeholder="Enter your Twitter url"
                        value={twitterUrl}
                      />
                      <svg
                        width="17"
                        height="15"
                        viewBox="0 0 17 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 8.36364L5.46667 12L15 2"
                          stroke="#3333FF"
                          stroke-width="3"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <TwitterLogin
                        loginUrl={loginUrl}
                        onFailure={onTwitterFailed}
                        onSuccess={onTwitterSuccess}
                        requestTokenUrl={fetchTokenURL}
                        className="btn-continue btn-insta"
                    >
                        <img src="/images/twitter-inner.png" alt="" className="mr-2" />
                        Connect Twitter
                    </TwitterLogin>     
                  )}
                </>
              )}

              {isInstagramNeeded && (
                <>
                  {isInstagramSelected ? (
                    <div className="social-input">
                      <img src="/images/instagram.png" alt="" />
                      <input
                        type="text"
                        placeholder="Enter your Instagram url"
                        value={instagramUrl}
                      />
                      <svg
                        width="17"
                        height="15"
                        viewBox="0 0 17 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 8.36364L5.46667 12L15 2"
                          stroke="#3333FF"
                          stroke-width="3"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <InstagramLogin
                          clientId={process.env.REACT_APP_INSTAGRAM_CLIENT_ID}
                          buttonText="Login"
                          onSuccess={instagramLogin}
                          onFailure={instagramLogin}
                          cssClass="btn-continue btn-twitter"
                      >
                        <InstagramIcon style={{marginRight: "0.5rem"}}/>
                        <span>Connect Instagram</span>
                      </InstagramLogin>
                    // <button
                    //   onClick={() => {
                        
                    //   }}
                    //   className="btn-continue btn-twitter"
                    // >
                    //   <img
                    //     src="/images/insta-inner.png"
                    //     alt=""
                    //     className="mr-2"
                    //   />
                    //   Connect Instagram
                    // </button>
                  )}
                </>
              )}
            </div>
            <button
              className={`btn-continue ${continueDisabled ? "disabled" : ""}`}
              onClick={() => {
                submitContinue();
              }}
              disabled={continueDisabled}
            >
              Continue
            </button>

            <button
              className="btn-continue btn-later"
              onClick={() => {
                history.goBack();
              }}
            >
              CANCEL
            </button>
          </div>
        </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default React.memo(SubmitSocialConnect);
