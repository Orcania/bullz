import { creators, parseAbi } from "../utils";
import ERC721_ABI from "../../abis/ERC721.json";
import {Web3TransactionService} from '../../services/web3transaction.service';
import { printLog } from "utils/printLog";
class ERC721Minter {
  constructor(web3, collection, wcPopupConfig, dispatch) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(
      parseAbi(ERC721_ABI),
      collection
    );
    this.address = collection;
    this.web3TransactionService = new Web3TransactionService(web3, wcPopupConfig,
      dispatch);
  }
  async mintERC721(tokenId, tokenURI, minters, fees, minter, connectedWith, cb) {
    const zeroWord =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    printLog([minters], 'success');
    try {
      if (connectedWith == 'walletConnect') {
        const abiData = await this.contract.methods
            .mintAndTransfer(
              [tokenId, tokenURI, creators(minters), fees, [zeroWord]],
              minter
            )
            .encodeABI();
        this.submitTracsaction(abiData, minter, cb);
      } else {
        const data = await this.contract.methods
          .mintAndTransfer(
            [tokenId, tokenURI, creators(minters), fees, [zeroWord]],
            minter
          )
          .send({ from: minter });
        if (data) {
          cb(true, data)
        } else {
          cb(false)
        }            
      } 
    } catch (ex) {
      printLog('ex', ex)
      cb(false, 'Transaction failed');
    }      
  }
  async mintBasicERC721(assetId, minter, tokenURI, connectedWith, cb) {
    printLog([minter], 'success');
    try {
      if (connectedWith == 'walletConnect') {
        const abiData = await this.contract.methods
          .awardItem(assetId, minter, tokenURI)
          .encodeABI();
        this.submitTracsaction(abiData, minter, cb);
      } else {
        const data = await this.contract.methods
          .awardItem(assetId, minter, tokenURI)
          .send({ from: minter });
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
  async setApprovalForAll(owner, approvalAdd, connectedWith, cb) {
    try {
      if (connectedWith == 'walletConnect') {
        const abiData = await this.contract.methods
          .setApprovalForAll(approvalAdd, true)
          .encodeABI();
        this.submitTracsaction(abiData, owner, cb);
      } else {
        const data = await this.contract.methods
          .setApprovalForAll(approvalAdd, true)
          .send({ from: owner });
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
  async ownerOf(assetId, owner) {
    const data = await this.contract.methods.ownerOf(assetId).call();
    return data;
  }
  async isSetApprovalForAll(owner, approvalAdd) {
    const data = await this.contract.methods
      .isApprovedForAll(owner, approvalAdd)
      .call();
    return data;
  }

  async transfer(from, to, assetId, connectedWith, cb){
    try {
      if (connectedWith == 'walletConnect') {
        const abiData = await this.contract.methods
          .safeTransferFrom(from, to, assetId)
          .encodeABI();
        this.submitTracsaction(abiData, from, cb);
      } else {
        const data  = await this.contract.methods
          .safeTransferFrom(from, to, assetId)
          .send({from: from});
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

  submitTracsaction(abiData, from, callback) {
    this.web3TransactionService.callSCFunction(
      abiData,
      from,          
      0,
      this.address,
      callback,
    );
  }
}
export default ERC721Minter;
