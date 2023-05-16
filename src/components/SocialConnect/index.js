import React, { useState, useEffect } from "react";
import { Modal, Row } from "react-bootstrap";
import walletconnect from "../../assets/images/walletconnect.png";
import metamask from "../../assets/images/metamask.png";
import './style.scss';
import { Checkbox } from "@material-ui/core";
import { useLocation, useHistory } from 'react-router-dom';
// import { createUser, createUserToken, getUserProfile } from '../../services/sociallink.service';
import {UserService} from "../../services/user.service";
import { useDispatch, useSelector } from "react-redux";
import { InstagramLogin } from '@amraneze/react-instagram-login';
import InstagramIcon from '@material-ui/icons/Instagram';

function SocialConnect({getUserProfileData, connectWithWallet, hideShow, isInstagramSelected, isTwitterSelected, twitterUrl, instagramUrl, twitterLogin, instagramLogin}) {
    const network = useSelector((state) => state.web3.network);
    const userService = new UserService(network.backendUrl);

    const [show] = useState(false);
    
    const history = useHistory();

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
                        <div className="social-connect-container">
                            <img src={'/images/bullzLogoBig.png'} alt="" className="logo-img" />
                            <p className="subtitle">Profile Information</p>
                            <p className="title">
                                {
                                    (isInstagramSelected && isTwitterSelected)
                                        ? 'You have successfully connected your socials! Let’s move on. You will be able to personalize your profile in the next step.'
                                        : isTwitterSelected
                                            ? 'You have successfully connected your Twitter profile. We advise you to also connect your Instagram to participate in more challenges!'
                                            : isInstagramSelected
                                                ? 'You have successfully connected your Instagram profile. We advise you to also connect your Twitter to participate in more challenges!'
                                                : 'Depending on the challenge, you will be required to verify your social media profile. Please make sure to connect your BULLZ account for credibility.'
                                }
                            </p>
                            <div className="social-items-container">
                                {
                                    isTwitterSelected ? <div className="social-input">
                                        {/* <img src="/images/twitter.png" alt="" /> */}
                                        <svg style={{ marginRight: 8 }} width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.9388 0.00728525C15.245 0.496661 14.4768 0.870955 13.6639 1.11575C13.2275 0.614053 12.6476 0.25846 12.0026 0.0970684C11.3576 -0.064323 10.6786 -0.023726 10.0574 0.213369C9.43623 0.450463 8.90284 0.872616 8.5294 1.42273C8.15595 1.97285 7.96047 2.62438 7.96938 3.28922V4.01371C6.69619 4.04672 5.43459 3.76435 4.29695 3.19174C3.15931 2.61913 2.18094 1.77405 1.44898 0.731774C1.44898 0.731774 -1.44898 7.25217 5.07142 10.1501C3.57936 11.1629 1.80192 11.6708 0 11.5991C6.5204 15.2216 14.4898 11.5991 14.4898 3.26749C14.4891 3.06568 14.4697 2.86438 14.4318 2.66616C15.1712 1.93696 15.693 1.01629 15.9388 0.00728525Z" fill="white"/>
                                        </svg>
                                        <input type="text" placeholder="Enter your Twitter url" value={twitterUrl} />
                                        <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 8.36364L5.46667 12L15 2" stroke="#3333FF" stroke-width="3" stroke-linecap="round" />
                                        </svg>
                                    </div> : <button className="btn-continue btn-insta" onClick={() => {
                                        //setInTwitterSelected(true);
                                        
                                        // phylloSDKConnect('7645460a-96e0-4192-a3ce-a1fc30641f72');
                                        twitterLogin();
                                    }}>
                                        {/* <img src="/images/twitter-inner.png" alt="" className="mr-2" /> */}
                                        <svg style={{ marginRight: 8 }} width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.9388 0.00728525C15.245 0.496661 14.4768 0.870955 13.6639 1.11575C13.2275 0.614053 12.6476 0.25846 12.0026 0.0970684C11.3576 -0.064323 10.6786 -0.023726 10.0574 0.213369C9.43623 0.450463 8.90284 0.872616 8.5294 1.42273C8.15595 1.97285 7.96047 2.62438 7.96938 3.28922V4.01371C6.69619 4.04672 5.43459 3.76435 4.29695 3.19174C3.15931 2.61913 2.18094 1.77405 1.44898 0.731774C1.44898 0.731774 -1.44898 7.25217 5.07142 10.1501C3.57936 11.1629 1.80192 11.6708 0 11.5991C6.5204 15.2216 14.4898 11.5991 14.4898 3.26749C14.4891 3.06568 14.4697 2.86438 14.4318 2.66616C15.1712 1.93696 15.693 1.01629 15.9388 0.00728525Z" fill="white"/>
                                        </svg>
                                        Connect Twitter
                                    </button>
                                }

                                {
                                    isInstagramSelected ? <div className="social-input">
                                        <svg
                                            style={{ marginRight: 8 }}
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            >
                                            <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M15.2525 5H8.4175C6.53007 5 5 6.53007 5 8.4175V15.2525C5 17.1399 6.53007 18.67 8.4175 18.67H15.2525C17.1399 18.67 18.67 17.1399 18.67 15.2525V8.4175C18.67 6.53007 17.1399 5 15.2525 5ZM12.205 9.49475C11.7194 9.42274 11.2234 9.50568 10.7877 9.73179C10.3519 9.9579 9.99853 10.3156 9.77781 10.7542C9.5571 11.1927 9.48027 11.6896 9.55827 12.1743C9.63626 12.659 9.8651 13.1068 10.2122 13.4539C10.5594 13.801 11.0071 14.0299 11.4918 14.1079C11.9765 14.1859 12.4735 14.109 12.912 13.8883C13.3505 13.6676 13.7082 13.3142 13.9343 12.8785C14.1604 12.4427 14.2434 11.9468 14.1714 11.4611C14.0979 10.9658 13.8671 10.5072 13.513 10.1531C13.1589 9.79902 12.7003 9.5682 12.205 9.49475ZM10.4192 9.02169C11.0043 8.71809 11.6703 8.60671 12.3223 8.7034C12.9875 8.80203 13.6032 9.11197 14.0787 9.58743C14.5542 10.0629 14.8641 10.6787 14.9627 11.3438C15.0594 11.9959 14.948 12.6618 14.6444 13.2469C14.3408 13.832 13.8605 14.3065 13.2716 14.6029C12.6828 14.8993 12.0155 15.0024 11.3647 14.8977C10.7139 14.793 10.1127 14.4857 9.64655 14.0196C9.18043 13.5535 8.87315 12.9522 8.76843 12.3014C8.6637 11.6506 8.76686 10.9833 9.06323 10.3945C9.35959 9.80567 9.83408 9.3253 10.4192 9.02169ZM15.5899 7.57033C15.3138 7.57033 15.0899 7.79418 15.0899 8.07033C15.0899 8.34647 15.3138 8.57033 15.5899 8.57033H15.596C15.8721 8.57033 16.096 8.34647 16.096 8.07033C16.096 7.79418 15.8721 7.57033 15.596 7.57033H15.5899Z"
                                                fill="white"
                                            />
                                        </svg>

                                        <input type="text" placeholder="Enter your Instagram url" value={instagramUrl} />
                                        <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 8.36364L5.46667 12L15 2" stroke="#3333FF" stroke-width="3" stroke-linecap="round" />
                                        </svg>
                                    </div> : 
                                    <InstagramLogin
                                    clientId={process.env.REACT_APP_INSTAGRAM_CLIENT_ID}
                                    buttonText="Login"
                                    onSuccess={instagramLogin}
                                    onFailure={instagramLogin}
                                    cssClass="btn-continue btn-twitter"
                                  >
                                    <svg style={{marginRight: "0.5rem"}} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7525 5H8.9175C7.03007 5 5.5 6.53007 5.5 8.4175V15.2525C5.5 17.1399 7.03007 18.67 8.9175 18.67H15.7525C17.6399 18.67 19.17 17.1399 19.17 15.2525V8.4175C19.17 6.53007 17.6399 5 15.7525 5ZM12.705 9.49475C12.2194 9.42274 11.7234 9.50568 11.2877 9.73179C10.8519 9.9579 10.4985 10.3156 10.2778 10.7542C10.0571 11.1927 9.98027 11.6896 10.0583 12.1743C10.1363 12.659 10.3651 13.1068 10.7122 13.4539C11.0594 13.801 11.5071 14.0299 11.9918 14.1079C12.4765 14.1859 12.9735 14.109 13.412 13.8883C13.8505 13.6676 14.2082 13.3142 14.4343 12.8785C14.6604 12.4427 14.7434 11.9468 14.6714 11.4611C14.5979 10.9658 14.3671 10.5072 14.013 10.1531C13.6589 9.79902 13.2003 9.5682 12.705 9.49475ZM10.9192 9.02169C11.5043 8.71809 12.1703 8.60671 12.8223 8.7034C13.4875 8.80203 14.1032 9.11197 14.5787 9.58743C15.0542 10.0629 15.3641 10.6787 15.4627 11.3438C15.5594 11.9959 15.448 12.6618 15.1444 13.2469C14.8408 13.832 14.3605 14.3065 13.7716 14.6029C13.1828 14.8993 12.5155 15.0024 11.8647 14.8977C11.2139 14.793 10.6127 14.4857 10.1466 14.0196C9.68043 13.5535 9.37315 12.9522 9.26843 12.3014C9.1637 11.6506 9.26686 10.9833 9.56323 10.3945C9.85959 9.80567 10.3341 9.3253 10.9192 9.02169ZM16.0899 7.57033C15.8138 7.57033 15.5899 7.79418 15.5899 8.07033C15.5899 8.34647 15.8138 8.57033 16.0899 8.57033H16.096C16.3721 8.57033 16.596 8.34647 16.596 8.07033C16.596 7.79418 16.3721 7.57033 16.096 7.57033H16.0899Z" fill="white"/>
                                    </svg>

                                    {/* <InstagramIcon style={{marginRight: "0.5rem"}}/> */}
                                    <span>Connect Instagram</span>
                                  </InstagramLogin>
                                    // <button onClick={() => {
                                    //     // setIsInstagramSelected(true);
                                    //     phylloSDKConnect('9bb8913b-ddd9-430b-a66a-d74d846e6c66');
                                    // }} className="btn-continue btn-twitter">
                                    //     <img src="/images/insta-inner.png" alt="" className="mr-2" />
                                    //     Connect Instagram
                                    // </button>
                                }



                            </div>

                            {
                                (isInstagramSelected && isTwitterSelected)
                                    ? <button className="btn-continue" onClick={() => {
                                        history.push("/edit-profile");
                                        hideShow()
                                    }}>Continue</button>
                                    : <button className="btn-continue btn-later" onClick={() => {
                                        history.push("/edit-profile");
                                        hideShow()
                                    }}>Maybe Later</button>
                            }
                        </div>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default React.memo(SocialConnect);
