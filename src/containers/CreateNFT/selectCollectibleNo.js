import React, { useEffect } from "react";
import { collectibles } from "../../data/tokenTypes";
import "./style.scss";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useMediaQuery } from "@material-ui/core";
import { scrollToTop } from 'common/utils';

const SelectCollectibleType = ({
  collectible,
  setCollectible,
  setStep,
  collectibleType,
  step,
  goPreviousStep,
  setForm,
  form,
  assetType
}) => {
  const isMobile = useMediaQuery("(min-width:350px) and (max-width:1023px)");

  useEffect(() => {

    if (!collectibleType.addMultiple) {
      setCollectible(collectibles[0]);
      setStep(3);
    } else if (collectibleType.addMultiple && !collectibleType.addSingle) {
      setCollectible(collectibles[1]);
      setStep(3);
    }
    scrollToTop();
  }, []);

  if (collectibleType) {
    if (!collectibleType.addMultiple) {
      return <></>;
    } else if (collectibleType.addMultiple && !collectibleType.addSingle) {
      return <></>
    }
  }
  return (
    <div className="create-step2">
      <div className="d-flex align-items-center mb-4">
        <KeyboardBackspaceIcon
          onClick={goPreviousStep}
          style={{ color: "#FFFFFF", cursor: "pointer" }}
        />
        
        <span className="step-lead">Step {step-2} of {assetType?.creationStep}</span>
        
      </div>
      <p className="collectible-title">Start creating your NFT Challenge</p>
      <p className="collectible-lead">
        How many NFTs would you like to airdrop in this challenge?
      </p>
      <div className="d-flex flex-column align-items-center mt-4">
        <div className="collectible-group">
          {collectibles.map((item, index) => (
            <div
              className={`collectible-card ${
                collectible !== null && item.name === collectible.name
                  ? "active"
                  : ""
              }`}
              key={index}
              onClick={() => {
                setCollectible(item)
                if (item.name === "Multiple") {
                  setForm({ ...form, nftSupply: 2 })
                }
                else if (item.name === "Single") {
                  setForm({ ...form, nftSupply: 1 })
                }
              }}
            >
              <img
                src={`/images/${item.image}${collectible !== null && item.name === collectible.name
                  ? '_white' : ''}.png`}
                alt="Collectible Icon"
                className={`${index === 0 ? "" : "image1"}`}
              />
              <p className="text-white">{item.name === "Single" ? "One" : item.name}</p>
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
      Please select “one” if you want to airdrop a single NFT. Please select “multiple” if you want to airdrop more than 1 NFT. 
      </p>
      <p className="collectible-lead">
        OR select “Own NFT/s” if you have existing NFTs you would like to airdrop.
      </p>
      {/* {collectible !== null && !isMobile && (
        <button className="btn-continue" onClick={() => setStep(3)}>
          Continue
        </button>
      )} */}
    </div>
  );
};

export default React.memo(SelectCollectibleType);
