import { useMediaQuery } from '@material-ui/core';

import React from 'react';

import { Link } from 'react-router-dom';

import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import { useHistory } from "react-router";

import './style.scss';
import CustomAlert from 'components/CustomAlert';


const notificationConfig = {
  preventDuplicate: true,
  vertical: "bottom",
  horizontal: "right",
};
const Footer = () => {
  let history = useHistory();

  const isTablet = useMediaQuery('(min-width:1024px) and (max-width:1439px)');
  const [contactEmail, setContactEmail] = useState("");
  const pathname = useSelector((state) => state.router.location.pathname);
  const isWeb3Connected = useSelector((state) => state.web3.web3connected);
  const [isConnectWalletAlertOpen, setIsConnectWalletAlertOpen] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(()=>{
    setContactEmail("");
  },[pathname])

  const showNotification = (msg, variant="") => {
    enqueueSnackbar(msg, {
      ...notificationConfig,
      variant: variant ? variant : "error",
    });
  };

  const handleEmailSubscription = () => {
    const pattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i;
    if(pattern.test(contactEmail)){
      showNotification("Subscribed successfully!", 'success');
      setContactEmail("");
    }else{
      showNotification("Please input the valid email address.")
    }
  }

  const hadleSubmitOnEnterKeyPress = (e) => {
    if(e.key === "Enter" || e.keyCode === 13){
      handleEmailSubscription();
    }
  }

  const handleContactEmailChange = (e) => {
    setContactEmail(e.target.value);
  }

  const connectWallet = async (e) => {
    if (document.getElementById("connectButton")) {
      document.getElementById("connectButton").click();
    }
  };
  const handleCreate = () => {
    if (!isWeb3Connected) {
      connectWallet();
      return;
    }
    history.push('/create')
  };

  return <div className="page-footer" style={{paddingBottom: history.location.pathname.includes("nft-challenge/") ? 100 : ""}}>
    <div className="container">
      <div className="footer-container">
      

        {/* <img className="footer-logo mobile-view" src="/images/bullzLogo.svg" alt="" /> */}
        <img className="footer-logo" src="/images/bullzLogoBig.png" alt="" />
        <p className="title">
          © WOM Protocol Pte. Ltd. All Rights reserved
        </p>
        <p className="subtitle">
        The information contained on this website is not investment advice. A purchase of tokens is a high-risk endeavor and
         {/* <br /> */}
         one for which we strongly advise you to consult with your registered investment advisor.
        </p>
        <div className="static-content">
          {/* <Link to="/how-it-works" className="footer-link">How it works</Link> */}
          <Link to="/privacy" className="footer-link mr-5">Privacy Policy</Link>
          <Link to="/terms-and-conditions" className="footer-link ">Terms and Conditions</Link>
        </div>
      </div>

      <CustomAlert isDialogOpen={isConnectWalletAlertOpen} title="You're not logged in" message={"Please log in or sign up to create challenge"} btnText="Connect Wallet" customDialogAlertClose={handleCreate}/>
      {/* {
        isTablet
          ? <div className="fooder-padding">
            <div className="d-flex flex-column">
              <div className="logo-wrapper">
                <img src="/images/logo.png" alt="Logo" className="footer-logo" />
              </div>
              <div className="links-group">
                <div className="links-item">
                  <p className="link-title mb-4">BULLZ</p>
                  <Link className="link-name" to="/discover"><p>Discover Challenges</p></Link>
                  <Link className="link-name" to="/how-it-works"><p>How It Works</p></Link>
                  <p style={{
                   fontSize: 16,
                   fontWeight: 700,
                   color: "#A6ADB7",
                   lineHeight: "184%",
                   marginBottom: "24px !important",
                   height: 29,
                   whiteSpace: "nowrap"
                 }} onClick={handleCreate}>Create</p>
                  <a className="link-name" href="https://yeaywom.atlassian.net/servicedesk/customer/portals" target="_blank"><p>Support</p></a>
                </div>
                <div className="links-item links-item-end">
                  <p rel="noopener noreferrer" className="link-title mb-4">Community</p>
                  <a rel="noopener noreferrer" className="link-name" href="http://womprotocol.io" target="_blank"><p>WOM Token</p></a>
                  <a rel="noopener noreferrer" className="link-name" href="https://yeaywom.atlassian.net/servicedesk/customer/portals" target="_blank"><p>Feedback</p></a>
                </div>
              </div>
            </div>

            <div className="">
              <p className="link-title" style={{ marginBottom: 8 }}>Get the latest BULLZ updates</p>
              <div className="email-wrapper">
                <input type="text" placeholder="Your email" className="footer-email-input" value={contactEmail} onKeyDown={hadleSubmitOnEnterKeyPress} onChange={handleContactEmailChange}/>
                <button className="btn-continue footer-btn" onClick={handleEmailSubscription}>BULLZ !</button>
              </div>
            </div>
          </div>
          : <div className="fooder-padding">
            <div className="logo-wrapper">
              <img src="/images/logo.png" alt="Logo" className="footer-logo" />
            </div>
            <div className="links-group">
              <div className="links-item">
                <p className="link-title mb-4">BULLZ</p>
                <Link className="link-name" to="/discover"><p>Discover Challenges</p></Link>
                <Link className="link-name" to="/how-it-works"><p>How It Works</p></Link>
                 <p style={{
                   fontSize: 16,
                   fontWeight: 700,
                   color: "#A6ADB7",
                   lineHeight: "184%",
                   marginBottom: "24px !important",
                   height: 29,
                   whiteSpace: "nowrap"
                 }} onClick={handleCreate}>Create</p>
                <a className="link-name" href="https://yeaywom.atlassian.net/servicedesk/customer/portals" target="_blank"><p>Support</p></a>
              </div>
              <div className="links-item" style={{ marginRight: 209 }}>
                <p className="link-title mb-4">Community</p>
                <a rel="noopener noreferrer" className="link-name" href="http://womprotocol.io" target="_blank"><p>WOM Token</p></a>
                <a rel="noopener noreferrer" className="link-name" href="https://yeaywom.atlassian.net/servicedesk/customer/portals" target="_blank"><p>Feedback</p></a>
              </div>
            </div>
            <div className="">
              <p className="link-title" style={{ marginBottom: 8 }}>Get the latest BULLZ updates</p>
              <div className="email-wrapper">
                <input type="text" placeholder="Your email" className="footer-email-input" value={contactEmail} onKeyDown={hadleSubmitOnEnterKeyPress} onChange={handleContactEmailChange}/>
                <button className="btn-continue footer-btn" onClick={handleEmailSubscription}>BULLZ !</button>
              </div>
            </div>
          </div>
      }
      
      <div className="fooder-padding1">
        <div className="d-flex justify-content-between align-items-center" >
          <div className="d-flex">
            <Link className="terms-lead" to="/terms">Terms</Link>
            <Link className="terms-lead mr-0" to="/privacy">Privacy</Link>
          </div>
          <p className="link-title mb-0 mobile-view">@WOM Protocol Pte. Ltd. &nbsp; All rights reserved.</p>
          <div className="d-md-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <a rel="noopener noreferrer" href="https://www.instagram.com/yaaasnft" target="_blank">
                <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer', marginRight: 27 }} >
                  <path fillRule="evenodd" clipRule="evenodd" d="M15 2H6C3.79086 2 2 3.79086 2 6V16C2 18.2091 3.79086 20 6 20H15C17.2091 20 19 18.2091 19 16V6C19 3.79086 17.2091 2 15 2ZM6 0C2.68629 0 0 2.68629 0 6V16C0 19.3137 2.68629 22 6 22H15C18.3137 22 21 19.3137 21 16V6C21 2.68629 18.3137 0 15 0H6ZM11 14.5C12.933 14.5 14.5 12.933 14.5 11C14.5 9.067 12.933 7.5 11 7.5C9.067 7.5 7.5 9.067 7.5 11C7.5 12.933 9.067 14.5 11 14.5ZM11 16C13.7614 16 16 13.7614 16 11C16 8.23858 13.7614 6 11 6C8.23858 6 6 8.23858 6 11C6 13.7614 8.23858 16 11 16ZM16 7C17.1046 7 18 6.10457 18 5C18 3.89543 17.1046 3 16 3C14.8954 3 14 3.89543 14 5C14 6.10457 14.8954 7 16 7Z" fill="white" />
                </svg>
              </a>
              <a rel="noopener noreferrer" href="https://twitter.com/yaaasnft" target="_blank">
                <svg width="26" height="21" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
                  <path d="M25.2121 2.43357C24.2678 2.85127 23.2664 3.1256 22.241 3.24747C23.3218 2.60109 24.1307 1.58383 24.517 0.385238C23.5027 0.988854 22.3907 1.41188 21.2317 1.64071C20.4532 0.807743 19.4213 0.255316 18.2964 0.0693104C17.1716 -0.116695 16.0168 0.0741422 15.0116 0.612154C14.0064 1.15017 13.2071 2.00521 12.7379 3.04435C12.2688 4.0835 12.1561 5.24853 12.4174 6.35831C10.3606 6.25522 8.34837 5.72071 6.51149 4.78949C4.67461 3.85826 3.05411 2.55114 1.75519 0.952983C1.29541 1.74269 1.0538 2.64042 1.05509 3.55422C1.05509 5.34775 1.96794 6.93224 3.35576 7.85993C2.53446 7.83408 1.73123 7.61228 1.01304 7.21302V7.27734C1.01328 8.47184 1.42662 9.62949 2.18297 10.554C2.93932 11.4785 3.99213 12.113 5.16289 12.3499C4.40048 12.5566 3.60105 12.587 2.82512 12.439C3.15521 13.4672 3.79858 14.3664 4.66515 15.0107C5.53172 15.655 6.57809 16.0122 7.65776 16.0322C6.58471 16.875 5.35607 17.498 4.0421 17.8656C2.72813 18.2332 1.35458 18.3382 0 18.1746C2.36461 19.6953 5.11725 20.5026 7.92864 20.5C17.4443 20.5 22.648 12.6171 22.648 5.78067C22.648 5.55803 22.6418 5.33291 22.6319 5.11274C23.6448 4.38069 24.5189 3.47385 25.2133 2.43481L25.2121 2.43357Z" fill="white" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mobile-footer-txt">
          <p className="link-title1 mb-0 text-center">@WOM Protocol Pte. Ltd. &nbsp; All rights reserved.</p>
        </div>
      </div> */}
    </div>
  </div>
};

export default Footer;
