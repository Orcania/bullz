import React, { useEffect } from "react";
import { collectibles } from "../../data/tokenTypes";
import "./style.scss";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useMediaQuery } from "@material-ui/core";
import { scrollToTop } from 'common/utils';
import { networks } from '../../constants/networks';
import { useSelector } from "react-redux";

const SelectNetwork = ({
  selectedNetwork,
  setSelectedNetwork,
  collectible,
  setCollectible,
  setStep,
  collectibleType,
  step,
  goPreviousStep,
  setForm,
  form,
}) => {
  const isWeb3Connected = useSelector((state) => state.web3.web3connected);

  const connectWallet = async (e) => {
    if (document.getElementById("connectButton")) {
      document.getElementById("connectButton").click();
    }
  };

  return (
    <div className="create-step2 select-blockchain">
      <div className="d-flex align-items-center mb-4">
        <KeyboardBackspaceIcon
          onClick={goPreviousStep}
          style={{ color: "#FFFFFF", cursor: "pointer" }}
        />
        <span className="step-lead">Back</span>
      </div>
      <p className="collectible-title">Start creating your Challenge</p>
      <p className="collectible-lead">
        Select on which blockchain you would like to create your Challenge:
      </p>
      <div className="d-flex flex-column align-items-center mt-4">
        <div className="collectible-group select-network">
        {
        Object.keys(networks).map((key, index)=>(
            <div
              className={`collectible-card networks-container ${
                selectedNetwork !== null && networks[key].chainId === selectedNetwork?.chainId
                  ? "active"
                  : ""
              }`}
              key={index}
              onClick={() => {
                if (!isWeb3Connected) {
                  connectWallet();
                } else {
                  setSelectedNetwork(networks[key])
                  setForm({ ...form, chain_id: parseInt(networks[key].chainId, 16) })   
                }                           
              }}
            >
              {/* <img src={networks[key].icon} alt="" className="wallet-item" /> */}
              {
                networks[key].chainName.toLowerCase() === "eth" ? (
                  <svg className="network-svg" width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="36" cy="36" r="36" fill="black"/>
                    <path d="M23.375 36.5949L35.9996 15.4471L48.6242 36.5949L35.9996 44.1382L23.375 36.5949Z" fill="white"/>
                    <path d="M35.9988 46.5144L48.2191 38.7331L35.9988 56.5528L23.4902 38.7331L35.9988 46.5144Z" fill="white"/>
                  </svg>
                ) : networks[key].chainName.toLowerCase() === "polygon" ? (
                  <svg className="network-svg" width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="36" cy="36" r="36" fill="black"/>
                    <path d="M46.9674 28.6727C46.1993 28.2388 45.2171 28.2388 44.3483 28.6727L38.2286 32.2425L34.0733 34.5108L28.067 38.0683C27.2989 38.5021 26.3167 38.5021 25.4479 38.0683L20.7511 35.2546C19.983 34.8207 19.4416 33.9531 19.4416 32.9862V27.5819C19.4416 26.7142 19.8823 25.859 20.7511 25.3136L25.4479 22.6114C26.216 22.1776 27.1981 22.1776 28.067 22.6114L32.7637 25.4251C33.5318 25.859 34.0733 26.7266 34.0733 27.6935V31.2633L38.2286 28.8834V25.2144C38.2286 24.3467 37.7879 23.4915 36.9191 22.9461L28.1803 17.864C27.4122 17.4302 26.43 17.4302 25.5612 17.864L16.6084 23.0576C15.7395 23.4915 15.2988 24.3591 15.2988 25.2144V35.3661C15.2988 36.2338 15.7395 37.0891 16.6084 37.6345L25.4605 42.7165C26.2286 43.1503 27.2107 43.1503 28.0796 42.7165L34.0859 39.2582L38.2412 36.8783L44.2475 33.4201C45.0156 32.9862 45.9978 32.9862 46.8666 33.4201L51.5634 36.1222C52.3315 36.5561 52.873 37.4237 52.873 38.3906V43.7949C52.873 44.6626 52.4322 45.5178 51.5634 46.0632L46.98 48.7654C46.2119 49.1992 45.2297 49.1992 44.3608 48.7654L39.6515 46.0632C38.8834 45.6294 38.3419 44.7617 38.3419 43.7949V40.3366L34.1866 42.7165V46.2863C34.1866 47.154 34.6273 48.0093 35.4962 48.5547L44.3483 53.6367C45.1164 54.0706 46.0985 54.0706 46.9674 53.6367L55.8195 48.5547C56.5876 48.1208 57.129 47.2532 57.129 46.2863V36.0231C57.129 35.1554 56.6883 34.3001 55.8195 33.7547L46.9674 28.6727Z" fill="white"/>
                  </svg>
                ) : networks[key].chainName === "Binance Smart Chain" ? (
                  <svg className="network-svg" width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="36" cy="36" r="36" fill="black"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M43.6978 39.6304L48.1779 44.1095L35.9992 56.3076L23.8334 44.1095L28.3135 39.6304L35.9992 47.3365L43.6978 39.6304ZM35.9992 31.9114L40.5437 36.4679L35.9992 41.0245L31.4676 36.4808V36.4679L32.2658 35.6676L32.652 35.2804L35.9992 31.9114ZM20.6793 31.9759L25.1594 36.4679L20.6793 40.947L16.1992 36.455L20.6793 31.9759ZM51.3191 31.9759L55.7992 36.4679L51.3191 40.947L46.839 36.455L51.3191 31.9759ZM35.9992 16.6153L48.165 28.8134L43.6849 33.3054L35.9992 25.5864L28.3135 33.2925L23.8334 28.8134L35.9992 16.6153Z" fill="white"/>
                  </svg>
                ) : networks[key].chainName === "Avalanche C-CHAIN" ? (
                  <svg className="network-svg" width="81" height="80" viewBox="0 0 81 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40.5 80C62.5914 80 80.5 62.0914 80.5 40C80.5 17.9086 62.5914 0 40.5 0C18.4086 0 0.5 17.9086 0.5 40C0.5 62.0914 18.4086 80 40.5 80Z" fill="black"/>
                    <path d="M51.4538 39.9307C52.5296 38.0805 54.2656 38.0805 55.3414 39.9307L62.0408 51.6404C63.1167 53.4906 62.2365 55 60.0848 55H46.5882C44.461 55 43.5808 53.4906 44.6321 51.6404L51.4538 39.9307ZM38.4951 17.3876C39.5709 15.5375 41.2824 15.5375 42.3582 17.3876L43.8497 20.0655L47.3706 26.2247C48.2263 27.9775 48.2263 30.0468 47.3706 31.7996L35.561 52.176C34.4852 53.8315 32.7003 54.8783 30.7198 55H20.9152C18.7635 55 17.8833 53.515 18.9592 51.6404L38.4951 17.3876Z" fill="white"/>
                  </svg>
                ) : networks[key].chainName === "Arbitrum One" ? (
                  <svg
                    id="katman_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 42.9 33.1"
                    style={{
                      enableBackground: "new 0 0 42.9 33.1",
                    }}
                    xmlSpace="preserve"
                  >
                    <style type="text/css">
                      {
                        "\n\t.st0{fill:#000;}\n\t.st1{fill-rule:evenodd;clip-rule:evenodd;fill:#FFFFFF;}\n\t.st2{fill:#fff;}\n\t.st3{fill-rule:evenodd;clip-rule:evenodd;fill:#fff;}\n\t.st4{fill:#FFFFFF;}\n"
                      }
                    </style>
                    <path
                      className="st0"
                      d="M21.4,27.9c6.3,0,11.3-5.1,11.3-11.3c0-6.3-5.1-11.3-11.3-11.3c-6.3,0-11.3,5.1-11.3,11.3 C10.1,22.8,15.2,27.9,21.4,27.9z"
                    />
                    <path
                      className="st1"
                      d="M27.6,12.5c-0.1-0.1-5-3-5.6-3.2c-0.2-0.1-0.7-0.2-1-0.1c-0.3,0.1-5.5,3.1-5.7,3.3c-0.1,0.1-0.2,0.3-0.3,0.4 c-0.1,0.2-0.1,0.3-0.1,3.8l0,3.6l0.7,0.4c0.4,0.2,0.7,0.4,0.7,0.4c0.1,0,4.8-7.5,4.8-7.6c0-0.1-1.1-0.1-1.4,0 c-0.4,0.1-0.7,0.3-0.9,0.5c-0.1,0.1-0.7,1.1-1.5,2.2c-0.7,1.1-1.3,2.1-1.3,2.1c0,0,0-1,0-2.4v-2.5l0.1-0.1c0.2-0.2,5.3-3.1,5.5-3.1 c0.1,0,0.2,0,1.4,0.7c0.4,0.2,1.5,0.8,2.4,1.4c0.9,0.5,1.7,1,1.8,1.1l0.1,0.1v5.2l-2.5-3.9c-0.1-0.2-0.2-0.4-0.3-0.5l0,0l0,0 c0,0,0,0,0,0c0,0-0.1,0.2-0.7,1.2c-0.1,0.1-0.2,0.3-0.2,0.4l-0.1,0.2l0,0l0,0l0.1,0.1l0.1,0.1c0,0,0,0.1,0.1,0.1l0.2,0.3 c0,0,0,0.1,0.1,0.1c0.1,0.1,0.2,0.3,0.2,0.4c0,0,0,0,0,0.1l2.1,3.4l-0.2,0.1c-0.1,0.1-0.2,0.1-0.3,0.1l-2.6-4l-0.1-0.1l-0.2,0.4l0,0 l-1,1.6l0,0l2,3.2c-0.3,0.2-2,1.4-2.1,1.4c-0.1,0-2.4-1.5-2.3-1.6c0,0,0.7-1.2,1.5-2.6l0,0c0.7-1.2,1.6-2.7,2.2-3.7 c0.7-1.2,1-1.8,1-1.8c0,0-0.5,0-1.1,0l-1,0l-2.3,3.8c-0.8,1.4-1.6,2.7-2,3.4l0,0C17.2,21,17,21.2,17,21.2l-0.1,0.2l1.8,1 c1,0.6,1.9,1.1,2.1,1.2c0.3,0.2,0.8,0.2,1,0.2c0.2-0.1,5.4-3.1,5.7-3.3c0.1-0.1,0.2-0.2,0.3-0.4l0.1-0.3l0-3.3l0-3.3l-0.1-0.2 C27.8,12.8,27.6,12.6,27.6,12.5z M27,18.6L27,18.6L27,18.6L27,18.6z"
                    />
                    <path
                      className="st2"
                      d="M27.1,18.6l-3-4.6l-1.1,1.8l2.9,4.7l1.3-0.6L27.1,18.6z"
                    />
                    <path
                      className="st2"
                      d="M25.7,21.1l-3-4.6l-1.3,2l2.4,3.8l1.5-0.6L25.7,21.1z"
                    />
                    <path
                      className="st3"
                      d="M15.9,13.4l5.5-3.2l5.5,3.2v6.4l-5.5,3.2l-4.1-2.3l-0.5,0.9l4.5,2.6c0.1,0.1,0.2,0.1,0.3,0l6.3-3.6 c0.1-0.1,0.2-0.2,0.2-0.3v-7.2c0-0.1-0.1-0.2-0.2-0.3l-6.3-3.6c-0.1-0.1-0.2-0.1-0.3,0L15,12.7c-0.1,0.1-0.2,0.2-0.2,0.3v7.2 c0,0.1,0.1,0.2,0.2,0.3l1.3,0.7l0.6-0.9l-0.9-0.5V13.4z"
                    />
                    <path className="st4" d="M23.8,13.4l-2.1,0l-4.9,8l1.7,1L23.8,13.4z" />
                    <path
                      className="st4"
                      d="M18.5,14.2c0.5-0.8,1.9-0.8,2.5-0.7l-4.8,7.7c-0.2-0.1-0.6-0.3-0.9-0.5c-0.4-0.2-0.5-0.2-0.5-0.5v-0.4 C15.9,18.2,18,15,18.5,14.2z"
                    />
                  </svg>
                ) : null
              }
              <p className="wallet-name d-block">{networks[key].chainName === "Binance Smart Chain" ? "BNB CHAIN" : networks[key].chainName === "Arbitrum One" ? "Arbitrum" : networks[key].chainName}</p>
            </div>
          ))}
        </div>
        {/* {collectible !== null && isMobile && (
          <button className="btn-continue" onClick={() => setStep(3)}>
            Continue
          </button>
        )} */}
      </div>

      <p className="collectible-lead">
        Depending on which blockchain you select, you will need to connect a compatible wallet. 
      </p>
      
    </div>
  );
};

export default React.memo(SelectNetwork);
