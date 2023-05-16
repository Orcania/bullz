import React, { useEffect } from "react";
import { assetTypes } from "../../data/tokenTypes";
import "./style.scss";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { scrollToTop } from 'common/utils';
import { set } from "lodash";

const SelectAssetType = ({
  assetType,
  setAssetType,
  setStep,
  step,
  goPreviousStep,
  totalStep,
  setTotalStep
}) => {

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <div className="create-step1">
      <div className="d-flex align-items-center mb-4">
        <KeyboardBackspaceIcon
          onClick={goPreviousStep}
          style={{ color: "#FFFFFF", cursor: "pointer" }}
        />
        <span className="step-lead">Back</span>
      </div>      
      <p className="collectible-title">Start creating your challenge</p>
      <p className="collectible-lead">
      What would you like to airdrop in your challenge?</p>



      <div className="d-flex flex-column align-items-center mt-4">
        <div className="collectible-group justify-content-center">
        {assetTypes.map((item, index) => {
          return (
            
              <div
                key={index}
                className={`collectible-card ${item.name}
                          ${assetType !== null &&
                    item.name === assetType.name
                    ? "active"
                    : ""
                  } `}
                onClick={() => setAssetType(item)}
              >
                <img
                  src={`/images/${assetType !== null &&
                    item.name === assetType.name ? item.image + '_white' : item.image}.svg`}
                  alt="Collectible Icon"
                />
                <p className="text-white">{item.name}</p>
              </div>
            
          );
        })}
        </div>
      </div>
      <p className="collectible-lead">
      Please select “NFTs” if you want to airdrop NFTs. Please select “Tokens” if you want to airdrop your own tokens.
      </p>
    </div>
  );
};

export default React.memo(SelectAssetType);
