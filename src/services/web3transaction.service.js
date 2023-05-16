import {apiGetGasPrices} from '../common/TokenPriceApi/api';
import BigNumber from 'bignumber.js';
import { useSelector, useDispatch } from "react-redux";
import { setWcPopupConfig } from "../redux/actions/web3action";
import { printLog } from 'utils/printLog';
export class Web3TransactionService {
  constructor(web3Object, wcPopupConfig, dispatch) {
    this.timer = null;
    this.callback = null;
    this.transactionHash = '';
    this.web3 = web3Object;
    this.timerCounter = 0;
    this.maxTimerCounter = 40;
    this.wcPopupConfig = wcPopupConfig;
    this.dispatch = dispatch;
  }
  sanitizeHex = hex => {
    hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
    if (hex === '') {
      return '';
    }
    hex = hex.length % 2 !== 0 ? '0' + hex : hex;
    return '0x' + hex;
  };

  convertStringToHex = value => {
    return new BigNumber(`${value}`).toString(16);
  };

  convertAmountToRawNumber = (value, decimals = 18) => {
    return new BigNumber(`${value}`)
      .times(new BigNumber('10').pow(decimals))
      .toString();
  };

  getReceipt = async () => {
    printLog(['getReceipt3'], 'success');
    const receipt = await this.web3.eth.getTransactionReceipt(
      this.transactionHash,
    );
    printLog(['receipt', receipt], 'success');
    if (receipt && receipt.blockNumber) {
      clearInterval(this.timer);
      this.timerCounter = 0;
      if (receipt.status) {
        this.callback(true,  receipt);
      } else {
        this.callback(false, 'transaction failed.');
      }
    } else {
      if (this.timerCounter < this.maxTimerCounter) {
        this.timerCounter++;
      } else {
        clearInterval(this.timer);
        this.timerCounter = 0;
        this.callback(false);
      }
    }
  };

  async getGasPrice() {
    // gasPrice
    const gasPrices = await apiGetGasPrices();
    const _gasPrice = gasPrices.fast.price;
    printLog(['_gasPrice', _gasPrice], 'success');
    const gasPrice = this.sanitizeHex(
      this.convertStringToHex(this.convertAmountToRawNumber(_gasPrice, 9)),
    );
    printLog(['gasPrice', gasPrice], 'success');
    return gasPrice;
  }

  async getGasLimit() {
     // gasLimit
     const _gasLimit = 6000000;
     const gasLimit = this.sanitizeHex(this.convertStringToHex(_gasLimit));
     return gasLimit;
  }

  async deployContract(abi, data, collectionName, collectionSymbol, from, cb) {
    this.callback = cb;
    const deployment = new this.web3.eth.Contract(abi).deploy({data: data, arguments: [collectionName, collectionSymbol]});    

    const encodedABI = deployment.encodeABI();
    const _nonce = await this.web3.eth.getTransactionCount(from);
    const nonce = this.sanitizeHex(this.convertStringToHex(_nonce));

    // gasPrice
    // const gasPrice = await this.getGasPrice();

    // gasLimit
    const gasLimit = await this.getGasLimit();

    // value
    const _value = 0;
    const value = this.sanitizeHex(this.convertStringToHex(_value));

    // test transaction
    const tx = {
      from: from,
      nonce,
      gasLimit: gasLimit,
      value,
      data: encodedABI,
    };
    printLog(['tx', tx], 'success');
    try {
      // send transaction
      this.dispatch(setWcPopupConfig({...this.wcPopupConfig, show: true, message: "Please confirm transaction from wallet app in your device."}));
      const result = await this.web3.currentProvider.wc.sendTransaction(tx);

      this.dispatch(setWcPopupConfig({...this.wcPopupConfig, show: false}));
      printLog(['testSendTransaction', result], 'success');

      this.transactionHash = result;

      this.timer = setInterval(this.getReceipt, 5000);
    } catch (error) {
      printLog(['err', error]);
      this.dispatch(setWcPopupConfig({...this.wcPopupConfig, show: false}));
      this.callback(false, error.message);
    }
  }

  async callSCFunction(data, from, _value, contractAddress, cb) {    
    this.callback = cb;
    // const _nonce = await this.web3.eth.getTransactionCount(from);
    // const nonce = this.sanitizeHex(this.convertStringToHex(_nonce));

    // // gasPrice
    // const gasPrices = await apiGetGasPrices();
    // const _gasPrice = gasPrices.fast.price;
    // const gasPrice = this.sanitizeHex(
    //   this.convertStringToHex(this.convertAmountToRawNumber(_gasPrice, 9)),
    // );

    // gasLimit
    const _gasLimit = 6000000;
    const gasLimit = this.sanitizeHex(this.convertStringToHex(_gasLimit));

    // value
    const value = this.sanitizeHex(this.convertStringToHex(_value));

    // transaction
    const tx = {
      from: from,
      to: contractAddress,
      // nonce,
      // gasPrice: 1500032279,
      gasLimit,
      value,
      data: data,
    };
    printLog(['tx', tx], 'success');
    try {
      // send transaction
      this.dispatch(setWcPopupConfig({...this.wcPopupConfig, show: true, message: "Please confirm transaction from wallet app in your device."}));
      const result = await this.web3.currentProvider.wc.sendTransaction(tx);
      this.dispatch(setWcPopupConfig({...this.wcPopupConfig, show: false}));
      printLog(['testSendTransaction', result], 'success');
      this.transactionHash = result;
      this.timer = setInterval(this.getReceipt, 5000);
    } catch (error) {
      printLog(['testSendTransaction err:', error.message]);
      this.dispatch(setWcPopupConfig({...this.wcPopupConfig, show: false}));
      this.callback(false, error.message);
    }
  }

  async callInstantFunction(data, from, _value, contractAddress, cb) {    
    this.callback = cb;

    // gasLimit
    const _gasLimit = 6000000;
    const gasLimit = this.sanitizeHex(this.convertStringToHex(_gasLimit));

    // value
    const value = this.sanitizeHex(this.convertStringToHex(_value));

    // transaction
    const tx = {
      from: from,
      to: contractAddress,
      // nonce,
      // gasPrice: 1500032279,
      gasLimit,
      value,
      data: data,
    };
    printLog(['tx', tx], 'success');
    try {
      // send transaction
      this.dispatch(setWcPopupConfig({...this.wcPopupConfig, show: true, message: "Please confirm transaction from wallet app in your device."}));
      const result = await this.web3.currentProvider.wc.sendTransaction(tx);
      this.dispatch(setWcPopupConfig({...this.wcPopupConfig, show: false}));
      printLog(['testSendTransaction', result], 'success');
      this.callback(true, result);
    } catch (error) {
      printLog(['testSendTransaction err:', error.message]);
      this.dispatch(setWcPopupConfig({...this.wcPopupConfig, show: false}));
      this.callback(false, error.message);
    }
  }
}
