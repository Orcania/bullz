import { printLog } from "utils/printLog";
import ERC20 from "../../abis/ERC20.json";
import {Web3TransactionService} from '../../services/web3transaction.service';
class ERC20Exchanger{
    constructor(web3, address, wcPopupConfig,
        dispatch){
        this.web3 = web3;
        this.contract = new this.web3.eth.Contract(ERC20, address)
        this.address = address;
        this.web3TransactionService = new Web3TransactionService(web3, wcPopupConfig,
            dispatch);
    }
    async approve(
        bidder,
        collection,
        price,
        connectedWith, 
        cb
    ){
        printLog([bidder,
            collection,
            price,
            connectedWith], 'success');
        try {
            if (connectedWith == 'walletConnect') {
                const abiData = await this.contract.methods
                    .approve(collection, price)
                    .encodeABI();
                this.submitTracsaction(abiData, bidder, cb);
            } else {
                const data  = await this.contract.methods
                .approve(collection, price)
                .send({from: bidder})
                .then((res) => {return res})
                .catch(err=>{
                printLog([err])
                return false;   
                })
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
    async decimals(){
        return await this.contract.methods.decimals().call();
    }

    async balanceOf(add){
        return await this.contract.methods.balanceOf(add).call();
    }

    async getAllowance(owner, spender){
        return await this.contract.methods.allowance(owner, spender).call();
    }

    async increaseApproval(
        owner,
        spender,
        value,
        connectedWith,
        cb
    ){
        try {
            if (connectedWith == 'walletConnect') {
                const abiData = await this.contract.methods
                .increaseApproval(spender, value)
                .encodeABI();
                this.submitTracsaction(abiData, owner, cb);
            } else {
                const data  = await this.contract.methods
                    .increaseApproval(spender, value)
                    .send({from: owner})
                    .then((res) => {return res})
                    .catch(err=>{
                        printLog([err])
                        return false;   
                    })            
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
export default ERC20Exchanger;
