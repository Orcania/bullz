import React, { useState } from "react";
import { Modal, Row } from "react-bootstrap";
import './style.scss';
import ERC1155ChallengeMinter from "common/ERC1155/erc1155ChallengeMinter";
import { UserService } from "../../../services/user.service";
import { NftService } from "../../../services/nft.service";
import { shares } from "../../../config";
import { ChatService } from "../../../services/chat.service";
// import { uniqueNamesGenerator, adjectives, colors } from 'unique-names-generator';
import ButtonLoader from "../../../components/ButtonLoader/buttonLoader";
import { useSelector, useDispatch } from "react-redux";
import { setNetworkSwitchConfig } from "redux/actions/web3action";
import { getNetworkByChainId } from "common/utils";
import { printLog } from "utils/printLog";
function TransferNFT(props) {
  const dispatch = useDispatch();
  const [show] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState('');
  const web3Object = useSelector((state) => state.web3.web3object);
  const wcPopupConfig = useSelector((state) => state.web3.wcPopupConfig);
  const wcProvider = useSelector((state) => state.web3.wcProvider);
  const networkSwitchConfig = useSelector((state) => state.web3.networkSwitchConfig);
  const network = useSelector((state) => state.web3.network);
  const userData = useSelector((state) => state.auth.userData);
  const [showLoader, setShowLoader] = useState(false);

  const checkNetwork = () => {
    const connectedWith = localStorage.getItem("connectedWith");
    let currentChainId = 0;
    if (connectedWith === "walletConnect") {
      currentChainId = wcProvider.chainId;
    } else if (connectedWith === "metamask") {        
      currentChainId = window.ethereum.networkVersion;
    }
    if(parseInt(props.nft.chain_id) == currentChainId) {
      return true;
    } else {
      dispatch(setNetworkSwitchConfig({
        ...networkSwitchConfig,
        show: true, 
        currentNetwork: network,
        newNetwork: getNetworkByChainId(parseInt(props.nft.chain_id))
      }));
      return false;      
    }
  }

  const handleTransfer = async () => {
    if (!checkNetwork()) {        
      return;
    }
    if (!receiverAddress) {
      props.showNotification('Please input recipient\'s wallet address');
      return;
    }
    const nft = props.nft;
    printLog([nft], 'success');
    const accounts = await web3Object.eth.getAccounts();
    try {
      if (accounts[0]) {
        const owner = accounts[0];
        if (owner.toLowerCase() !== nft.holderData.address) {
          props.showNotification('You are not the owner of NFT.');
          return;
        }

        if (receiverAddress.toLowerCase() === nft.holderData.address.toLowerCase()) {
          props.showNotification('You are trying to send the NFT to your own account.');
          return;
        }
        setShowLoader(true);
        const newHolderAddress = receiverAddress.toLowerCase();
        const userService = new UserService(network.backendUrl);
        const nftService = new NftService(network.backendUrl);
        const chatService = new ChatService(network.chatUrl);
        let userDB = await userService.getUser(newHolderAddress);
        if(!userDB) {
          
          // const randomName = uniqueNamesGenerator({
          //   dictionaries: [adjectives, colors],
          //   separator: '-'
          // });
    
          const userCount = await userService.getUserCount();
          const firstName = 'bullz';
          const lastName = (userCount + 1) + process.env.REACT_APP_USERNAME_SUFFIX;
          const user = {
            address: newHolderAddress,
            firstname: firstName,
            lastname: lastName,
            email: "famous@tiktok.com",
            username: firstName + lastName,
          };
          userDB = await userService.saveUser(user);                    
        }
        const nftSupply = 1;
        let ercMinter = new ERC1155ChallengeMinter(
          web3Object,
          nft.collectionType.address,
          wcPopupConfig,
          dispatch
        );
        const connectedWith = localStorage.getItem("connectedWith");

        const transferCallback = async (success, data) => {
          if (success) {
            let newNFT = {
              id: nft.id,
              holder: newHolderAddress,
              supply: 1,
            };
            let nftIdForRoom = nft.id;
            if (nft.contractType === "ERC1155") {
              let supply;
              if (parseInt(nft.supply) === nftSupply) {
                
                const existingNFT = await nftService.getByHolderAndAsssetId(newHolderAddress, nft.assetId);
                printLog(['existingNFT', existingNFT], 'success');
                
                if(existingNFT) {                  
                  const nftObj = {
                    id: existingNFT.id,
                    views: existingNFT.views + nft.views,                
                    supply: parseInt(existingNFT.supply) + nftSupply,
                  }
                  nftIdForRoom = existingNFT.id;                                    
                  await nftService.updateNFT(nftObj);                  
                  await nftService.deleteNFT(nft.id);      
                } else {
                  newNFT = {
                    ...newNFT,
                    supply: nft.supply,
                  };                                                      
                  nftIdForRoom = nft.id;
                  await nftService.updateNFT(newNFT);                  
                }                 
                // Need to fetch buyer and seller realtime data   
                const sender = await userService.getUserById(userData.id);
                const receiver = await userService.getUserById(userDB.id);
      
      
                let receiverObj = {
                  ...userDB,
                  totalSold: receiver.totalSold,
                  totalBought: parseFloat(receiver.totalBought),
                  ownedNFTCount: receiver.ownedNFTCount + parseInt(nft.supply),
                  createdNFTCount: receiver.createdNFTCount
                };
                let senderObj = {
                  ...userData,
                  totalBought: sender.totalBought,
                  totalSold: parseFloat(sender.totalSold),
                  ownedNFTCount: sender.ownedNFTCount - parseInt(nft.supply),
                  createdNFTCount: sender.createdNFTCount
                };
                await userService.updateUser(receiverObj);
                await userService.updateUser(senderObj);                
              } else {
                supply = parseInt(nft.supply) - nftSupply;
                newNFT = {
                  ...newNFT,
                  supply: supply,
                  holder: nft.holder,
                };
                
                await nftService.updateNFT(newNFT);                
      
                const existingNFT = await nftService.getByHolderAndAsssetId(newHolderAddress, nft.assetId);
                printLog(['existingNFT', existingNFT], 'success');
                if(existingNFT) {
                  const nftObj = {
                    id: existingNFT.id,
                    supply: parseInt(existingNFT.supply) + parseInt(nftSupply),
                  }
                  nftIdForRoom = existingNFT.id;
                  await nftService.updateNFT(nftObj);
                } else {
                  const nftObj = {
                    name: nft.name,
                    description: nft.description,
                    expiry: nft.expiry,
                    type: nft.type,
                    file: nft.file,
                    audio: nft.audio,
                    cover: nft.cover,
                  };
                  nftObj.assetId = nft.assetId;
                  nftObj.uri = nft.uri;
                  nftObj.contractType = "ERC1155";
                  nftObj.isForSell = false;
                  nftObj.isForAuction = false;
                  nftObj.holder = newHolderAddress;
                  nftObj.creator = nft.creator;
                  nftObj.price = 0;
                  nftObj.lockedData = "";
                  nftObj.ownerShare = shares[nft.type];
                  nftObj.shareindex = shares[nft.type];
                  nftObj.nftType = nft.nftType;
                  nftObj.supply = nftSupply;
                  nftObj.totalSupply = nft.totalSupply;
        
                  nftObj.externalLink = nft.externalLink;
                  nftObj.collectionType = nft.collectionType.address;
        
                  nftObj.resale = nft.resale;
                  nftObj.resaleCurrency = nft.resaleCurrency;
                  nftObj.loyaltyPercentage = nft.loyaltyPercentage;
                  nftObj.collabStart = nft.collabStart;
                  nftObj.collabEnd = nft.collabEnd;
        
                  nftObj.eventOrganizer = nft.eventOrganizer;
                  nftObj.eventType = nft.eventType;
                  nftObj.eventMode = nft.eventMode;
                  nftObj.eventStartTime = nft.eventStartTime;
                  nftObj.eventEndTime = nft.eventEndTime;
                  nftObj.eventVenue = nft.eventVenue;
                  nftObj.eventConferenceLink = nft.eventConferenceLink;
                  nftObj.eventUnblockContent = nft.eventUnblockContent;
                  nftObj.chain_id = nft.chain_id;
                  const savedNFT  = await nftService.saveNFT(nftObj);
                  nftIdForRoom = savedNFT.id;
                  
                }          
                // Need to fetch buyer and seller realtime data 
                const sender = await userService.getUserById(userData.id);
                const receiver = await userService.getUserById(userDB.id);
                let receiverObj = {
                  ...userDB,
                  totalSold: receiver.totalSold,
                  totalBought: parseFloat(receiver.totalBought),
                  ownedNFTCount: receiver.ownedNFTCount + parseInt(nft.supply),
                  createdNFTCount: receiver.createdNFTCount
                };
                let senderObj = {
                  ...userData,
                  totalBought: sender.totalBought,
                  totalSold: parseFloat(sender.totalSold),
                  ownedNFTCount: sender.ownedNFTCount - parseInt(nft.supply),
                  createdNFTCount: sender.createdNFTCount
                };
                await userService.updateUser(receiverObj);
                await userService.updateUser(senderObj);  
              }

              try {
                await chatService.createRoom({
                  accepted: true,
                  nft_id: nft.assetId,
                  nft_uuid: nftIdForRoom,
                  sender_id: userData.id,
                  receiver_id: userDB.id,
                });
              } catch(error) {
                printLog(['error', error])
              }
              setReceiverAddress('');
              setShowLoader(false);
              props.hideShow();
              props.loadNftData();              
            }           
          } else {
            setShowLoader(false);            
            props.showNotification("Transaction Failed!");
            return;
          }
        }
        ercMinter.transfer(owner, newHolderAddress, nft.assetId, nftSupply, [], connectedWith, transferCallback);
      }
    } catch (e) {
      setShowLoader(false);
      printLog([e]);
      props.showNotification("Transaction Failed!");
      return;
    }
  };

  return (
    <>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={!show}
        onHide={() => props.hideShow()}
        dialogClassName="dialog-container"
      >
        <Modal.Body>
            <div className="transfer-nft-modal">
                <p className="modal-title">
                    Transfer NFT
                </p>
                <p className="subtitle">
                    You are about to transfer this NFT to another wallet. Please enter the wallet address you want to transfer the NFT to.
                </p>
                <div className="input-group">
                    <p className="label">Your wallet</p>
                    <input type="text" onChange={(e)=>{setReceiverAddress(e.target.value)}}/>
                    {/* <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
                      printLog('clicked');                      
                    }}>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.59091 0C0.712274 0 0 0.712274 0 1.59091V8.40909C0 9.28773 0.712276 10 1.59091 10H3.5V10.75C3.5 11.8546 4.39543 12.75 5.5 12.75H10.8333C11.9379 12.75 12.8333 11.8546 12.8333 10.75V4.5C12.8333 3.39543 11.9379 2.5 10.8333 2.5H9V1.59091C9 0.712274 8.28773 0 7.40909 0H1.59091ZM8 2.5V1.59091C8 1.26456 7.73544 1 7.40909 1H1.59091C1.26456 1 1 1.26456 1 1.59091V8.40909C1 8.73544 1.26456 9 1.59091 9H3.5V4.5C3.5 3.39543 4.39543 2.5 5.5 2.5H8ZM4.5 4.5C4.5 3.94772 4.94772 3.5 5.5 3.5H10.8333C11.3856 3.5 11.8333 3.94772 11.8333 4.5V10.75C11.8333 11.3023 11.3856 11.75 10.8333 11.75H5.5C4.94772 11.75 4.5 11.3023 4.5 10.75V4.5Z" fill="white"/>
                    </svg> */}
                </div>
                <div className="actions">
                    <div className="btn-continue" onClick={handleTransfer}> 
                    { showLoader ? <ButtonLoader color={"black"} /> : 'Transfer' }
                    </div>
                    <div className="btn-continue cancel" onClick={() => props.hideShow()}>Cancel</div>
                </div>
            </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default React.memo(TransferNFT);