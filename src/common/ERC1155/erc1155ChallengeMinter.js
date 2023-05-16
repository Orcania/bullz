import { creators, parseAbi } from '../utils';
import ERC1155_ABI from "../../abis/ERC1155.json";
import {Web3TransactionService} from '../../services/web3transaction.service';
import { printLog } from 'utils/printLog';
class ERC1155ChallengeMinter{
    constructor(web3, collection, wcPopupConfig,
        dispatch ){
        this.web3 = web3;
        this.contract = new this.web3.eth.Contract(parseAbi(ERC1155_ABI),collection);
        this.address = collection;
        this.web3TransactionService = new Web3TransactionService(web3, wcPopupConfig,
            dispatch);
    }
    async mintERC1155(tokenId, tokenURI, minters, fees, minter, connectedWith, cb){
        const zeroWord = "0x0000000000000000000000000000000000000000000000000000000000000000";
        printLog([minters], 'success');
        try{
            if (connectedWith == 'walletConnect') {
                const abiData = await this.contract.methods
                    .mintAndTransfer([tokenId, tokenURI, creators(minters), fees, [zeroWord]], minter)
                    .encodeABI();
                this.submitTracsaction(abiData, minter, cb);
            } else { 
                const data  = await this.contract.methods.mintAndTransfer([tokenId, tokenURI, creators(minters), fees, [zeroWord]], minter).send({from: minter});
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
    async mintBasicERC1155(assetId, minter, tokenURI, nftSupply, loyaltyPercentage,
        resaleStatus, connectedWith, cb){
        printLog([minter,tokenURI, nftSupply, loyaltyPercentage,
            resaleStatus,], 'success');
        try{
            if (connectedWith == 'walletConnect') {
                const abiData = await this.contract.methods
                    .awardItem(assetId, nftSupply, tokenURI, loyaltyPercentage,
                        resaleStatus)
                    .encodeABI();
                this.submitTracsaction(abiData, minter, cb);
            } else {            
                const data  = await this.contract.methods.awardItem(assetId, nftSupply, tokenURI, loyaltyPercentage,
                    resaleStatus).send({from: minter});            
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
    async setApprovalForAll(owner , approvalAdd, connectedWith, cb){
        try{
            if (connectedWith == 'walletConnect') {
                const abiData = await this.contract.methods
                    .setApprovalForAll(approvalAdd, true)
                    .encodeABI();
                this.submitTracsaction(abiData, owner, cb);
            } else {
                const data  = await this.contract.methods.setApprovalForAll(approvalAdd, true).send({from: owner});
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
    async ownerOf(assetId, owner){
        const data  = await this.contract.methods.ownerOf(assetId).call();
        return data;
    }
    async isSetApprovalForAll(owner, approvalAdd){
        const data = await this.contract.methods.isApprovedForAll(owner,approvalAdd ).call();
        return data;
    }
    async transfer(from, to, assetId, amount, data, connectedWith, cb){
        try{
            printLog([from, to, assetId, amount, data], 'success')
            if (connectedWith == 'walletConnect') {
                const abiData = await this.contract.methods
                    .safeTransferFrom(from, to, assetId, amount,  data)
                    .encodeABI();
                this.submitTracsaction(abiData, from, cb);
            } else {
                const data1  = await this.contract.methods.safeTransferFrom(from, to, assetId, amount,  data).send({from: from});
                if (data1) {
                    cb(true, data1)
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
    async getUrl(assetId){
        const data = await this.contract.methods.uri(assetId).call();
        return data;
    }
    async setUrl(owner , uri, connectedWith, cb){
        try{
            if (connectedWith == 'walletConnect') {
                const abiData = await this.contract.methods
                    .setURI(uri)
                    .encodeABI();
                this.submitTracsaction(abiData, owner, cb);
            } else {
                const data  = await this.contract.methods.setURI(uri).send({from: owner});            
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
export default ERC1155ChallengeMinter;