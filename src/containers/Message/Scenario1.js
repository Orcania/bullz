import FavoriteIcon from '@material-ui/icons/Favorite';

import React, {useState} from 'react';

import { useSelector } from 'react-redux';

import "./style.scss";
import CountDown from "../../components/AuctionTimmer/auctionTimmer";
import { DialogContent } from '@material-ui/core';
import  MuiDialogTitle  from '@material-ui/core/DialogTitle';
import { Dialog, Typography } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import  CloseIcon from '@material-ui/icons/Close';
import { DialogActions } from '@material-ui/core';
import { getUrl } from 'common/utils';
import { Link } from 'react-router-dom';

const Scenario1 = ({
  ...props
}) => {

  const userData = useSelector((state) => state.auth.userData);
  const [submitNftUrl, setSubmitNftUrl] = useState('');
  const [isLinkSubmitModalOpen, setLinkSubmitModalOpen] = useState(false);
  const isWeb3Connected = useSelector((state) => state.web3.web3connected);

  const handleSubmit = () => {
    if(submitNftUrl){
      /* eslint-disable */
		  const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
		  if(!urlRegex.test(submitNftUrl)){
        props.showNotification("Enter valid URL.")
        return;
		  }
      if(props.room.nft?.buyer?.id === userData?.id) {
        props.submitBuyerLink(submitNftUrl, ()=>{
          setSubmitNftUrl('');
          setLinkSubmitModalOpen(false);
          props.showNotification('Link submitted successfully', 'success');
        });
      } else {
        props.submitOwnerLink(submitNftUrl, ()=>{
          setSubmitNftUrl('');
          setLinkSubmitModalOpen(false);
          props.showNotification('Link submitted successfully', 'success');
        });
      }      
	  } else {
      props.showNotification('Please enter an URL.');
    }
   
  }

  const handleSubmittedLink = (link) => {
    if(link.length > 0){
      window.open(getUrl(link), '_blank');
    }else{
      props.showNotification('Link is empty.');
    }
  }

  const viewNFT = (nft) => {
    let buyUrl = "";  
    if (nft?.id) {          
      if (nft.nftType === "art") {
        buyUrl = `/art/${nft.id}`;
      } else if (nft.nftType === "nft_challenge" || nft.challengeId) {
        buyUrl = `/token-challenge/${props?.room?.challenge.id}`;
      } 
      
      // sessionStorage.setItem("selectedNft", JSON.stringify(nft));
      // let url =
      //   loggedInUser.id === user.id && isWeb3Connected
      //     ? `/profile/${nft.id}`
      //     : buyUrl;
      let url = buyUrl;
      //history.push({ pathname: url, state: { nft: nft } });
    }
    return buyUrl;
  };

  return (
    <>
      <div className="pro-card">

        {props?.room?.challenge ? (<>
        <img src={props.room.challenge?.cover} alt="Item" className="card-content-image" />
        <div className="card-content">
          <p className="item-title" >{props.room.challenge?.name}</p>
          <div className="card-footer">
            <div className="d-flex">
              <div className={`like-wrapper`}>
                <p className="card-lead" >{props.room.challenge?.asset_type === 1 ? props.room.challenge?.amountToAirdrop: props.room.challenge?.winnerCount}</p>
              </div>
            </div>
            <div className="detail-box">
              <div>
                <p className="status-title">Reference Number</p>
                <p className="status-val">{props.room.challenge?.id}</p>
              </div>
              <Link to={viewNFT(props.room.challenge)}>View Details</Link>
            </div>
          </div>
        </div>
        </>) : props?.room?.nft ? (<>
        <img src={props.room.nft?.cover} alt="Item" className="card-content-image" />
        <div className="card-content">
          <p className="item-title" >{props.room.nft?.name}</p>
          <div className="card-footer">
            <div className="d-flex">
              <div className={`like-wrapper`}>
                <p className="card-lead" >{props.room.nft?.contractType === "ERC721" ? 1: props.room.nft?.supply} of {props.room.nft?.totalSupply}</p>
              </div>
            </div>
            <div className="detail-box">
              <div>
                <p className="status-title">Reference Number</p>
                <p className="status-val">{props.room.nft?.id}</p>
              </div>             
              <Link to={viewNFT(props.room.nft)}>View Details</Link>
            </div>
          </div>
        </div>
        </>) : (<div className="card-content">
          <p className="item-title" >Seems this nft has been sold again.</p>
        </div>)
        }

               
      </div>
      <Dialog
        open={isLinkSubmitModalOpen}
        onClose={setLinkSubmitModalOpen}
        className="place-bid-modal"
      >
        <MuiDialogTitle className="share-modal-header">
          <Typography className="main-title">Submit Link</Typography>
          <IconButton
            aria-label="close"
            onClick={() => setLinkSubmitModalOpen(false)}
            className="close_button"
          >
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>
        <DialogContent>
         
          <div style={{ color: "white" }}>
            <p className="buy-now-sub-lead mb-2" style={{ textAlign: "center" }}>
              You are about to submit a link for NFT: <span>{props.room.nft?.name}</span>
            </p>
            <div className="mb-1">Enter URL</div>
            <div>
              <input
                type={"text"}
                className="bid-input text-center w-100 mb-3"
                value={submitNftUrl}
                onChange={(e) => setSubmitNftUrl(e.target.value)}
              />
            </div>
            <p style={{ color: "#B0B3D0" }}>
              Please enter the URL to the finished service of your NFT. This link will appear in the chat information box, so that the buyer can view it.
            </p>
          </div>
        </DialogContent>    
        
        <DialogActions>
          <button
            className="btn-continue mb-0 mx-auto"
            onClick={() =>
              isWeb3Connected ? handleSubmit() : null
            }
          >
            Submit
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Scenario1;
