import React, { useEffect } from "react";
import { collectibleTypes } from "../../data/tokenTypes";
import "./style.scss";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { scrollToTop } from 'common/utils';

const SelectCollectibleType = ({
  collectibleType,
  setCollectibleType,
  setStep,
  step,
  goPreviousStep
}) => {

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <div className="create-step1">
      <div className="d-flex align-items-center mb-2">
        <KeyboardBackspaceIcon
          onClick={goPreviousStep}
          style={{ color: "#fff", cursor: "pointer" }}
        />
        {(collectibleType && collectibleType.type === "tiktok_duet") ||
          (collectibleType && collectibleType.type === "tiktok_collab") ||
          (collectibleType && collectibleType.type === "nft_challenge")
          ? (
            <span className="step-lead">
              Step {step === 1 ? step : step - 1} of 4
            </span>
          ) : (
            <span className="step-lead">Step {step} of 5</span>
          )}
      </div>
      <p className="collectible-title">Select Type Of NFT</p>

      <div className="d-flex align-items-center collectible-items">
        {collectibleTypes.map((item, index) => {
          return (
            item.forTypeList && (
              <div
                key={index}
                className={`collectible-type-card 
                          ${collectibleType !== null &&
                    item.name === collectibleType.name
                    ? "active"
                    : ""
                  } `}
                onClick={() => setCollectibleType(item)}
              >
                <img
                  src={`/images/${item.image}.png`}
                  alt="Collectible Icon"
                />
                <p className="text-white">{item.name}</p>
              </div>
            )
          );
        })}
      </div>
      {collectibleType !== null && (
        <>
          <div className="collectible-content">

            <div className="question">
              <svg width="145" height="286" viewBox="0 0 145 286" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M74.3376 285.999C88.151 285.999 99.349 274.801 99.349 260.988C99.349 247.175 88.151 235.977 74.3376 235.977C60.5242 235.977 49.3262 247.175 49.3262 260.988C49.3262 274.801 60.5242 285.999 74.3376 285.999Z" fill="#191919" />
                <path d="M71.658 0.00188355C32.5685 0.277999 0.562503 32.0436 0.00722834 71.1302C0.00208469 71.491 -0.000283039 74.0285 2.6885e-05 77.3472C0.000283509 82.2133 1.93336 86.88 5.37409 90.321C8.81481 93.7619 13.4814 95.6953 18.3475 95.6958H18.3475C20.7597 95.6953 23.1481 95.2195 25.3763 94.2955C27.6045 93.3716 29.6288 92.0176 31.3336 90.311C33.0383 88.6044 34.3901 86.5787 35.3116 84.3494C36.2332 82.1202 36.7064 79.7313 36.7043 77.3191C36.7024 75.0615 36.7013 73.499 36.7013 73.4031C36.7001 67.3623 38.2713 61.4252 41.2606 56.1759C44.2498 50.9266 48.5541 46.5458 53.7499 43.4645C58.9457 40.3833 64.8542 38.7076 70.894 38.6024C76.9339 38.4972 82.8971 39.9661 88.1971 42.8646C93.4971 45.7631 97.9512 49.9913 101.121 55.1334C104.292 60.2754 106.069 66.1542 106.278 72.1913C106.487 78.2285 105.121 84.2161 102.314 89.5652C99.5071 94.9142 95.3561 99.4405 90.2694 102.699L90.2757 102.706C90.2757 102.706 64.1615 119.518 56.1999 142.581L56.2067 142.582C54.8067 147.307 54.0973 152.209 54.1006 157.137C54.1006 159.162 54.2197 176.886 54.45 191.271C54.5305 196.234 56.559 200.967 60.0978 204.448C63.6367 207.929 68.4022 209.88 73.3662 209.878H73.3663C75.8606 209.878 78.3302 209.385 80.6332 208.427C82.9361 207.469 85.0268 206.065 86.785 204.295C88.5433 202.526 89.9344 200.427 90.8782 198.118C91.822 195.809 92.3 193.336 92.2846 190.842C92.2046 177.668 92.1614 162.328 92.1614 161.215C92.1614 147.054 105.823 132.944 117.044 123.743C129.966 113.147 139.265 98.7079 143 82.4199C143.827 79.0666 144.282 75.6325 144.359 72.1797C144.359 62.657 142.475 53.2285 138.815 44.4373C135.155 35.6461 129.791 27.6661 123.033 20.9569C116.276 14.2478 108.257 8.94211 99.4397 5.34568C90.6223 1.74924 81.1804 -0.0669076 71.658 0.00188355Z" fill="#191919" />
              </svg>

            </div>

            {collectibleType.questions.map((question, index) => {
              return (
                <React.Fragment key={index}>
                  <p className="content-title">{question.que}</p>
                  <p className="content-lead">{question.ans}</p>
                </React.Fragment>
              );
            })}
          </div>
          <button className="btn-continue" onClick={() => setStep(2)}>
            Continue
          </button>
        </>
      )}
    </div>
  );
};

export default React.memo(SelectCollectibleType);
