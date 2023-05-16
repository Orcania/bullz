import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import { useHistory } from "react-router";

import { Spinner } from "react-bootstrap";

import { NftService } from "../../services/nft.service";
import { UserService } from "../../services/user.service";

import "./style.scss";
import { id } from "date-fns/locale";
import { useSnackbar } from 'notistack';

import { getLatestOffer } from '../../common/utils'

const notificationConfig = {
  preventDuplicate: true,
  vertical: "bottom",
  horizontal: "right",
};

function OwnersComponent({ nft, ...props }) {
  const history = useHistory();
  const loggedInUser = useSelector((state) => state.auth.userData);
  const isWeb3Connected = useSelector((state) => state.web3.web3connected);
  const network = useSelector((state) => state.web3.network);

  const nftService = new NftService(network.backendUrl);
  const userService = new UserService(network.backendUrl);

  const [otherOwners, setOtherOwners] = useState("");
  const [nfts, setNFT] = useState("");
  const [isloading, setIsLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setIsLoading(true);
    if (nfts) {
      getOtherNftHoldByOtherOwners(nft.assetId);
    }
  }, [loggedInUser, nfts]);

  useEffect(() => {
    getOtherNft();
  }, []);

  const getOtherNft = async () => {
    const owner = await nftService.getMultipleNFT(nft.assetId);
    if (owner) {
      let temp = [];
      for (let i = 0; i < owner.length; i++) {
        if (
          owner[i].collectionType.toLowerCase() ===
          nft.collectionType.address.toLowerCase()
        ) {
          let item = owner[i];
          const holderData = await userService.getUser(owner[i].holder);
          item.holderData = holderData;
          temp.push(item);
        }
      }
      setNFT([...temp]);
      //   setIsLoading(false);
    }
  };

  const getOtherNftHoldByOtherOwners = async (nftId) => {
    // setIsLoading(true);
    const owner = nfts;
    if (owner) {
      let temp = [];
      for (let i = 0; i < owner.length; i++) {
        let item = owner[i];
        const holderData = await userService.getUser(owner[i].holder);
        item.holderData = holderData;
        // if (nft.id !== item.id) {
        //   if (isWeb3Connected) {
        //     if (
        //       localStorage.getItem("accounts") &&
        //       item.holder.toLowerCase() !==
        //         localStorage.getItem("accounts").toLowerCase()
        //     ) {
        //       temp.push(item);
        //     }
        //   } else {
        //     temp.push(item);
        //   }
        // }
        temp.push(item);
      }
      setIsLoading(false);
      setOtherOwners([...temp]);
    }
  };

  const viewNFT = (nft) => {
    let buyUrl = "";
    if (nft.nftType === "art") {
      buyUrl = `/art/${nft.id}`;
    } else if (nft.nftType === "tiktok_duet") {
      buyUrl = `/duet/${nft.id}`;
    } else if (nft.nftType === "tiktok_collab") {
      buyUrl = `/collab/${nft.id}`;
    } else if (nft.nftType === "music_promo") {
      buyUrl = `/promo/${nft.id}`;
    } else if (nft.nftType === "exclusive_content") {
      buyUrl = `/exclusive/${nft.id}`;
    } else if (nft.nftType === "event_tickets") {
      buyUrl = `/event/${nft.id}`;
    } else if (nft.nftType === "merchandise") {
      buyUrl = `/merchandise/${nft.id}`;
    }

    let url = buyUrl;
    history.push({ pathname: url, state: { nft: nft } });
  };


  const nftValidForBuy = (item) => {
    return (
      localStorage.getItem("accounts") &&
      item.holder.toLowerCase() !==
        localStorage.getItem("accounts").toLowerCase() &&
      nft.id !== item.id &&
      item.offers &&
      item.offers.length > 0 &&
      item.offers[0].isForSell
    );
  };

  const showNotification = (msg, variant="") => {
    enqueueSnackbar(msg, {
      ...notificationConfig,
      variant: variant ? variant : "error",
    });
  };

  const handleUserNameClick = (address) => {
    if(address){
      history.push(`/profile/${address}`);
    }else{
      showNotification("No user found.");
    }
  }

  const getOfferValue = (nft) => {
    if(nft.contractType === "ERC721") {
      return "1";
    } else {
      if(nft.offers.length) {
        const latestOffer = getLatestOffer(nft.offers);
        if (latestOffer.isForAuction) {
          return `total: ${nft.totalSupply}, owned: ${nft.supply}, on auction: ${latestOffer.supply}`
        } else if (latestOffer.isForSell) {
          return `total: ${nft.totalSupply}, owned: ${nft.supply}, on sale: ${latestOffer.supply} for ${latestOffer.price} ${latestOffer.currency} each`
        } else {
          return `total: ${nft.totalSupply}, owned: ${nft.supply}, not for sale`
        }
      } else {
        return `total: ${nft.totalSupply}, owned: ${nft.supply}, not for sale`
      }
    }     
  }

  return (
    <React.Fragment>
      <>
        {/* <>
        Creator
          <div className="owner-item">
            <div className="owner-user" onClick={()=>handleUserNameClick(nft?.creatorData?.address)}>
              <img
                src={
                  nft.creatorData.avatar_img
                    ? nft.creatorData.avatar_img
                    : `/images/avatar.png`
                }
                alt="User"
              />
              <div className="owner-info">
                <p className="owner-name">
                  {nft.creatorData.firstname + " " + nft.creatorData.lastname}
                </p>
              </div>
            </div>
          </div>
        </> */}

        {!isloading ? (
          otherOwners.length > 0 ? (
            otherOwners.map((owner, index) => (
              <div className="owner-item" key={index}>
                <div className="owner-user" onClick={()=>handleUserNameClick(nft?.creatorData?.address)}>
                  <img
                    src={
                      owner.holderData.avatar_img
                        ? owner.holderData.avatar_img
                        : `/images/avatar.png`
                    }
                    alt="User"
                  />
                  <div className="owner-info">
                    <p className="owner-name">
                      @{owner.holderData.username}
                      {/* {owner.holderData.firstname +
                        " " +
                        owner.holderData.lastname} */}
                    </p>
                    <p className="owner-lead">
                      Amount- &nbsp;
                      {getOfferValue(owner)}
                    </p>
                  </div>
                </div>
                {nftValidForBuy(owner) && isWeb3Connected && (
                  <button className="btn-buy" onClick={() => viewNFT(owner)}>
                    Buy
                  </button>
                )}
              </div>
            ))
          ) : (
            "No Data Found"
          )
        ) : (
          <div className="w-100 d-flex justify-content-center">
            <Spinner animation="border"/>
          </div>
        )}
      </>
    </React.Fragment>
  );
}

export default React.memo(OwnersComponent);
