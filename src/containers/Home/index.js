import React, { useRef, useState } from "react";

import { useSelector } from "react-redux";
import "./style.scss";
import HomeSocialIcons from "./homeSocialIcons";


const Home = () => {
  const network = useSelector((state) => state.web3.network);
  const [loadNetwork, setLoadNetwork] = useState(false);
  const topSectionRef = useRef(null);
  const middleSectionRef = useRef(null);
  const bottomSectionRef = useRef(null);

  const [emailVal, setEmailVal] = useState('');
  const [displayNoti, setDisplayNoti] = useState(false);

  const startNowClicked = async (e) => {
    
    if (document.getElementById("connectButton")) {
      document.getElementById("connectButton").click();
    } else if (document.getElementById("createButton")) {
      document.getElementById("createButton").click();
    }
  };

  const handleScrollSection = (target) => {
    if(target){
      target.current.scrollIntoView({behavior: "smooth", block: "start"})
    }
  }

  const handleChange = (e) => {
    setEmailVal(e.target.value);
  }

  const onSend = () => {
    window.alert(emailVal);
  }

  return (
    <div className="homepage-landing">
      <div className="home-section top" ref={topSectionRef}>
        <div className="container home-top">
          <div>
            <p className="title">
              Airdrop <br />
              your NFTs or <br />
              tokens
            </p>
            <p className="subtitle">
              w/ Challenges
            </p>
            <p className="info">
              Use the BULLZ Challenge Launchpad to airdrop your NFTs or tokens in return “for a service” defined in your challenge.
            </p>
            <div className="input-bg">
              <input placeHolder="Enter your email" value={emailVal} onChange={handleChange}/>
              <button className="btn-noti" onClick={onSend}>
                Start Now
              </button>
            </div>

        

            
          </div>
          <HomeSocialIcons color="white" handleScrollSection={()=>handleScrollSection(middleSectionRef)}/>
        </div>

      </div>
      <div className="home-section middle" ref={middleSectionRef}>
        <div className="home-middle container">

        <div>
          <p className="title">
            What is a<br />
            Challenge?
          </p>
          <p className="info">
            Instead of simply selling your NFTs/tokens or giving them away for free, you can now airdrop them in fun challenges! 
          </p>
          <p className="info">
            Simply define what you are giving away and describe the steps a user should follow to submit to your “challenge”. 
          </p>
          <p className="info">
            You can see all submissions and select which ones pass your challenge to airdrop straight into the users wallet. Let’s go!
          </p>
        </div>

        <div className="image-section">
            <img src="/images/homePageMiddleImg.svg" alt="" />
        </div>
        <HomeSocialIcons color="black" handleScrollSection={()=>handleScrollSection(bottomSectionRef)}/>
        </div>
        <div className="image-section mobile middle-img">
            <img src="/images/homePageMiddleImg.svg" alt="" />
        </div>
      </div>
      <div className="home-section bottom" ref={bottomSectionRef}>
        <div className="home-bottom container">
        <div>
          <p className="title">
            Why use BULLZ?
          </p>
          <p className="info">
            BULLZ empowers creators and brands to better engage with their audiences by providing a fun challenge. Winning an NFT or token truly feels more special!
          </p>

          <button className="btn-continue" onClick={startNowClicked}>
            Start Now
          </button>

        </div>
        <div className="image-section">
        <img src="/images/bullz-logo-rotate.svg" alt="" className="image2" />

          <div className="inner-div">
          <img src="/images/bullz-logo-rotate.svg" alt="" className="image1" />
          <img src="/images/bullz-logo-rotate.svg" alt="" className="image2" />

          </div>
        </div>
        <HomeSocialIcons color="white" handleScrollSection={()=>handleScrollSection(bottomSectionRef)}/>

        </div>

        <div className="image-section mobile">
        <img src="/images/bullz-logo-rotate.svg" alt="" className="image2" />

          <div className="inner-div">
          <img src="/images/bullz-logo-rotate.svg" alt="" className="image1" />
          <img src="/images/bullz-logo-rotate.svg" alt="" className="image2" />

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
