import ERC1155_EXCHANGER_ABI from "../../abis/ERC1155Exchange.json";
import {Web3TransactionService} from '../../services/web3transaction.service';
import { printLog } from 'utils/printLog';
class ERC1155Exchanger {
  constructor(web3, address, wcPopupConfig,
    dispatch) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(
      ERC1155_EXCHANGER_ABI,
      address
    );
    this.address = address;
    this.web3TransactionService = new Web3TransactionService(web3, wcPopupConfig,
      dispatch);
  }
  async addOffer(
    seller,
    collection,
    assetId,
    token,
    price,
    nftSupply,
    isForSell,
    isForAuction,
    expiresAt,
    shareIndex,
    eventIdListed,
    connectedWith,
    cb
  ) {
    
    try{  
      const offer = [
        collection,
        assetId,
        token,
        price,
        nftSupply,
        isForSell,
        isForAuction,
        expiresAt,
        shareIndex,
        eventIdListed];
        
        printLog(['addOffer', offer], 'success');
      if (connectedWith == 'walletConnect') {
        const abiData = await this.contract.methods
          .addOffer(offer)
          .encodeABI();
        this.submitTracsaction(abiData, seller, cb);
      } else { 
        const data = await this.contract.methods
          .addOffer(offer)
          .send({ from: seller });
        if (data) {
            cb(true, data)
        } else {
            cb(false)
        }            
      }     
    } catch (ex) {
      printLog(['ex', ex])
      cb(false, 'Transaction failed');
    }
  }

  async buyOffer(buyer, collection, offerId, value, nftSupply, eventIdSwapped, connectedWith, cb) {
    printLog([buyer, collection, offerId, value, nftSupply, eventIdSwapped], 'success');
    try {
      if (connectedWith == 'walletConnect') {
        const abiData = await this.contract.methods
          .buyOffer(offerId, nftSupply, eventIdSwapped)
          .encodeABI();
        this.submitTracsaction(abiData, buyer, cb, value);
      } else { 
        const data = await this.contract.methods
          .buyOffer(offerId, nftSupply, eventIdSwapped)
          .send({ from: buyer, value })
          .then((data) => {
            return data;
          })
          .catch((err) => {
            printLog([err]);
            return false;
          });
        if (data) {
            cb(true, data)
        } else {
            cb(false)
        }            
      } 
    } 
    catch (exception) {
        printLog(['Exception', exception])
        cb(false, 'Transaction failed')
    }  
  }
  async placeBid(
    bidder,
    offerId,
    price,
    nftSupply,
    eventIdBidCreated,
    connectedWith,
    cb
  ) {
    try{
      if (connectedWith == 'walletConnect') {
        const abiData = await this.contract.methods
          .safePlaceBid(offerId, price, nftSupply, eventIdBidCreated)
          .encodeABI();
        this.submitTracsaction(abiData, bidder, cb);
      } else {
        const data = await this.contract.methods
          .safePlaceBid(offerId, price, nftSupply, eventIdBidCreated)
          .send({ from: bidder })
          .then((res) => {
            printLog([res], 'success');
            return res;
          })
          .catch((err) => {
            printLog([err]);
            return false;
          });
        if (data) {
          cb(true, data)
        } else {
          cb(false)
        }            
      } 
    } 
    catch (exception) {
        printLog(['Exception', exception])
        cb(false, 'Transaction failed')
  }  
  }
  async cancelBid(collection, assetId, bidder, offerId, eventIdBidCancelled, connectedWith, cb) {
    try{
      if (connectedWith == 'walletConnect') {
        const abiData = await this.contract.methods
          .cancelBid(offerId, bidder, eventIdBidCancelled)
          .encodeABI();
        this.submitTracsaction(abiData, bidder, cb);
      } else {
        const data = await this.contract.methods
          .cancelBid(offerId, bidder, eventIdBidCancelled)
          .send({ from: bidder })
          .then((res) => {
            printLog([res], 'success');
            return res;
          })
          .catch((err) => {
            printLog([err]);
            return false;
          });
        if (data) {
          cb(true, data)
        } else {
          cb(false)
        }            
      } 
    } 
    catch (exception) {
        printLog(['Exception', exception])
        cb(false, 'Transaction failed')
    }  
  }
  async acceptBid(owner, collection, assetId, bidder, offerId, eventIdBidSuccessful, connectedWith, cb) {
    printLog([owner, bidder, offerId], 'success');
    try{
      if (connectedWith == 'walletConnect') {
        const abiData = await this.contract.methods
          .acceptBid(offerId, bidder, eventIdBidSuccessful)
          .encodeABI();
        this.submitTracsaction(abiData, owner, cb);
      } else {
        const data = await this.contract.methods
          .acceptBid(offerId, bidder, eventIdBidSuccessful)
          .send({ from: owner })
          .then((res) => {
            printLog([res], 'success');
            return res;
          })
          .catch((err) => {
            printLog([err]);
            return false;
          });
        if (data) {
          cb(true, data)
        } else {
          cb(false)
        }            
      }
    } 
    catch (exception) {
        printLog(['Exception', exception])
        cb(false, 'Transaction failed')
    }   
  }
  async setBid(owner, collection, assetId, bidder, offerId, connectedWith, cb) {
    try{
      if (connectedWith == 'walletConnect') {
        const abiData = await this.contract.methods
          .acceptBid(offerId, bidder)
          .encodeABI();
        this.submitTracsaction(abiData, owner, cb);
      } else {
        const data = await this.contract.methods
          .acceptBid(offerId, bidder)
          .send({ from: owner });
        if (data) {
          cb(true, data)
        } else {
          cb(false)
        }            
      } 
    } 
    catch (exception) {
        printLog(['Exception', exception])
        cb(false, 'Transaction failed')
    }  
  }
  async getShareByIndex(index) {
    const data = await this.contract.methods.shares(index).call();
    return data;
  }
  async setOfferPrice(owner, collection, assetId, price, offerId, connectedWith, cb) {
    try{
      if (connectedWith == 'walletConnect') {
        const abiData = await this.contract.methods
          .setOfferPrice(offerId, price)
          .encodeABI();
        this.submitTracsaction(abiData, owner, cb);
      } else {
        const data = await this.contract.methods
          .setOfferPrice(offerId, price)
          .send({ from: owner });
        if (data) {
          cb(true, data)
        } else {
          cb(false)
        }            
      } 
    } 
    catch (exception) {
        printLog(['Exception', exception])
        cb(false, 'Transaction failed')
    }  
  }
  async setForSell(owner, collection, assetId, isForSell, offerId, connectedWith, cb) {
    try{
      if (connectedWith == 'walletConnect') {
        const abiData = await this.contract.methods
          .setForSell(offerId, isForSell)
          .encodeABI();
        this.submitTracsaction(abiData, owner, cb);
      } else {
        const data = await this.contract.methods
          .setForSell(offerId, isForSell)
          .send({ from: owner });
        if (data) {
          cb(true, data)
        } else {
          cb(false)
        }            
      } 
    } 
    catch (exception) {
        printLog(['Exception', exception])
        cb(false, 'Transaction failed')
    }  
  }
  async cancelOffer(owner, collection, assetId, offerId, eventIdCancelOffer, connectedWith, cb) {
    try{
      if (connectedWith == 'walletConnect') {
        const abiData = await this.contract.methods
          .cancelOffer(offerId, eventIdCancelOffer)
          .encodeABI();
        this.submitTracsaction(abiData, owner, cb);
      } else {
        const data = await this.contract.methods
          .cancelOffer(offerId, eventIdCancelOffer)
          .send({ from: owner });
        if (data) {
          cb(true, data)
        } else {
          cb(false)
        }            
      } 
    } 
    catch (exception) {
        printLog(['Exception', exception])
        cb(false, 'Transaction failed')
    }  
  }
  async setForAuction(owner, collection, assetId, isForAuction, offerId, connectedWith, cb) {
    try{
      if (connectedWith == 'walletConnect') {
        const abiData = await this.contract.methods
          .setForAuction(offerId, isForAuction)
          .encodeABI();
        this.submitTracsaction(abiData, owner, cb);
      } else {
        const data = await this.contract.methods
          .setForAuction(offerId, isForAuction)
          .send({ from: owner });
        if (data) {
          cb(true, data)
        } else {
          cb(false)
        }            
      } 
    } 
    catch (exception) {
        printLog(['Exception', exception])
        cb(false, 'Transaction failed')
    }  
  }
  async setExpiresAt(owner, collection, assetId, time, offerId, eventIdSetExpireAt, connectedWith, cb) {
    try{
      if (connectedWith == 'walletConnect') {
        const abiData = await this.contract.methods
          .setExpiresAt(offerId, time, eventIdSetExpireAt)
          .encodeABI();
        this.submitTracsaction(abiData, owner, cb);
      } else {
        const data = await this.contract.methods
          .setExpiresAt(offerId, time, eventIdSetExpireAt)
          .send({ from: owner });
        if (data) {
          cb(true, data)
        } else {
          cb(false)
        }            
      }
    } 
    catch (exception) {
        printLog(['Exception', exception])
        cb(false, 'Transaction failed')
    }   
  }
  submitTracsaction(abiData, from, callback, value = 0) {
    this.web3TransactionService.callSCFunction(
      abiData,
      from,          
      value,
      this.address,
      callback,
    );
  }
}
export default ERC1155Exchanger;
