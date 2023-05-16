import { capitalize } from "common/utils";
import CustomTooltip from "components/Common/Tooltip/CustomTooltip";
import React from "react";
import { useSelector } from "react-redux";

import "./style.scss";

const PreeviewNFT = ({
  collectible,
  form,
  coverFile,
  selectedNft, 
  ...props
}) => {  
  const loggedInUserData = useSelector((state) => state.auth.userData);

  return (
    <>
      {/* preview panel */}
      <div className="preview-panel mobile-view">
        <p className="drop-title text-center text-white">Preview</p>
        {collectible && collectible.key == 'existing' ? 
          <div className={`preview-card`}>
          <div className="profile-card">
                  <div className="card-image">
                    <img src={selectedNft?.cover} alt="File" />
                  </div>
                  <div className="card-content" >
                    <div className="d-flex justify-content-end">
                      <p className="item-count">{`${selectedNft?.supply} of ${selectedNft?.totalSupply}`}</p>
                    </div>
                    <div className="d-flex justify-content-center">
                    </div>
                    <div>
                      <CustomTooltip
                        title={`${capitalize(selectedNft?.name ? selectedNft.name : "Nft Challenge")}`}
                        placement={"top-start"}
                      >
                        <p className="item-title" style={{ cursor: 'pointer' }}>
                          {selectedNft?.name ? selectedNft.name : "NFT Challenge"}
                        </p>
                      </CustomTooltip>
                      <p className="avatar-name">@{selectedNft?.holderData?.username}</p>
                    </div>
                  </div>
          </div>
        </div> :
        <div className={`preview-card ${coverFile === null ? "no-content" : ""}`}>
        <div className="profile-card">
          {coverFile !== null &&
            (coverFile.type === "image/png" ||
              coverFile.type === "image/gif" ||
              coverFile.type === "image/jpeg" ||
              coverFile.type === "image/jpg" ||
              coverFile.type === "image/webp") && (
              <>
                <div className="card-image">
                  <img src={coverFile.preview} alt="File" />

                </div>

                <div className="card-content" >
                  <div className="d-flex justify-content-end">
                    <p className="item-count">{`1 of ${form?.nftSupply}`}</p>
                  </div>
                  <div className="d-flex justify-content-center">

                    {/* <button className="btn-continue mb-0">
                      Submit
                    </button> */}
                  </div>
                  <div>
                    <CustomTooltip
                      title={`${capitalize(form?.name ? form.name : "Nft Challenge")}`}
                      placement={"top-start"}
                    >
                      <p className="item-title" style={{ cursor: 'pointer' }}>
                        {form?.name ? form.name : "NFT Challenge"}
                      </p>
                    </CustomTooltip>
                    <p className="avatar-name">@{loggedInUserData.username}</p>
                  </div>
                </div>
              </>
            )}

        </div>
      </div>  
      }

        
      </div>
    </>
  );
};

export default React.memo(PreeviewNFT);
