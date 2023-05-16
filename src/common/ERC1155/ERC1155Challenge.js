import { has } from "lodash";
import ERC1155_CHALLANGE_ABI from "../../abis/ERC1155Challenge.json";
import { Web3TransactionService } from "../../services/web3transaction.service";
import { printLog } from 'utils/printLog';
class ERC1155Challenge {
  constructor(web3, address, wcPopupConfig, dispatch) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(ERC1155_CHALLANGE_ABI, address);
    this.address = address;
    this.web3TransactionService = new Web3TransactionService(
      web3,
      wcPopupConfig,
      dispatch
    );
  }

  async addChallange(
    seller,
    collection,
    assetId,
    amount,
    airdropStartAt,
    airdropEndAt,
    eventIdAddChallenge,
    connectedWith,
    cb
  ) {
    try {
      if (connectedWith == "walletConnect") {
        const abiData = await this.contract.methods
          .addChallenge(
            collection,
            assetId,
            amount,
            airdropStartAt,
            airdropEndAt,
            eventIdAddChallenge
          )
          .encodeABI();
        this.submitTracsaction(abiData, seller, cb);
      } else {
        const data = await this.contract.methods
          .addChallenge(
            collection,
            assetId,
            amount,
            airdropStartAt,
            airdropEndAt,
            eventIdAddChallenge
          )
          .send({ from: seller });
        if (data) {
          cb(true, data);
        } else {
          cb(false);
        }
      }
    } catch (exception) {
      printLog(["Exception", exception]);
      cb(false, "Transaction failed");
    }
  }

  async airdropChallenge(
    challengeId,
    receiver,
    amount,
    seller,
    eventIdAirDropChallenge,
    connectedWith,
    cb
  ) {
    printLog([challengeId, receiver, amount, seller], 'success');
    try {
      if (connectedWith == "walletConnect") {
        const abiData = await this.contract.methods
          .airdropChallenge(
            challengeId,
            receiver,
            amount,
            eventIdAirDropChallenge
          )
          .encodeABI();
          this.web3TransactionService.callInstantFunction(
            abiData,
            seller,
            0,
            this.address,
            cb
          );
      } else {
        this.contract.methods
          .airdropChallenge(
            challengeId,
            receiver,
            amount,
            eventIdAirDropChallenge
          )
          .send({ from: seller })
          .on("transactionHash", function (hash) {
            printLog(["transactionHash", hash], 'success');
            cb(true, hash); 
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            printLog(["confirmation", receipt], 'success');
          })
          .on("receipt", function (receipt) {
            printLog(["receipt", receipt], 'success');
          })
          .on("error", function (error, receipt) {
            // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            printLog(["error", error, receipt]);
            cb(false, error);
          });
        // if (data) {
        //   cb(true, data);
        // } else {
        //   cb(false);
        // }
      }
    } catch (exception) {
      printLog(["Exception", exception]);
      cb(false, "Transaction failed");
    }
  }
  
  async bulkAirdropChallenge(
    challengeId,
    recipients,
    amounts,
    seller,
    eventIdAirDropChallenge,
    connectedWith,
    cb
  ) {
    printLog([challengeId, recipients, amounts, seller], 'success');
    try {
      if (connectedWith == "walletConnect") {
        const abiData = await this.contract.methods
          .bulkAirdropChallenge(
            challengeId,
            recipients,
            amounts,
            eventIdAirDropChallenge
          )
          .encodeABI();
          this.web3TransactionService.callInstantFunction(
            abiData,
            seller,
            0,
            this.address,
            cb
          );
      } else {
        this.contract.methods
          .bulkAirdropChallenge(
            challengeId,
            recipients,
            amounts,
            eventIdAirDropChallenge
          )
          .send({ from: seller })
          .on("transactionHash", function (hash) {
            printLog(["transactionHash", hash], 'success');
            cb(true, hash); 
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            printLog(["confirmation", receipt], 'success');
          })
          .on("receipt", function (receipt) {
            printLog(["receipt", receipt], 'success');
          })
          .on("error", function (error, receipt) {
            // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            printLog(["error", error, receipt]);
            cb(false, error);
          });
        // if (data) {
        //   cb(true, data);
        // } else {
        //   cb(false);
        // }
      }
    } catch (exception) {
      printLog(["Exception", exception]);
      cb(false, "Transaction failed");
    }
  }
  async getBullzFees() {
    const data = await this.contract.methods.bullzFee().call();
    return data;
  }

  async getFeeToken() {
    const data = await this.contract.methods.marketToken().call();
    return data;
  }

  async getIfNftAirdropped(collection, assetId) {
    const data = await this.contract.methods
      .airdropped(collection, assetId)
      .call();
    return data;
  }

  async cancelChallenge(
    owner,
    challengeId,
    eventIdWithdrawChallenge,
    connectedWith,
    cb
  ) {
    try {
      printLog([owner, challengeId], 'success');
      if (connectedWith == "walletConnect") {
        const abiData = await this.contract.methods
          .withdrawChallenge(challengeId, eventIdWithdrawChallenge)
          .encodeABI();
        this.submitTracsaction(abiData, owner, cb);
      } else {
        const data = await this.contract.methods
          .withdrawChallenge(challengeId, eventIdWithdrawChallenge)
          .send({ from: owner });
        if (data) {
          cb(true, data);
        } else {
          cb(false);
        }
      }
    } catch (exception) {
      printLog(["Exception", exception]);
      cb(false, "Transaction failed");
    }
  }

  submitTracsaction(abiData, from, callback) {
    this.web3TransactionService.callSCFunction(
      abiData,
      from,
      0,
      this.address,
      callback
    );
  }

  async addTokenChallange(
    seller,
    token,
    winnerCount,
    tokenAmount,
    airdropStartAt,
    airdropEndAt,
    eventIdAddTokenChallenge,
    connectedWith,
    cb
  ) {
    try {
      if (connectedWith == "walletConnect") {
        const abiData = await this.contract.methods
          .addTokenChallenge(
            token,
            winnerCount,
            tokenAmount,
            airdropStartAt,
            airdropEndAt,
            eventIdAddTokenChallenge
          )
          .encodeABI();
        this.submitTracsaction(abiData, seller, cb);
      } else {
        const data = await this.contract.methods
          .addTokenChallenge(
            token,
            winnerCount,
            tokenAmount,
            airdropStartAt,
            airdropEndAt,
            eventIdAddTokenChallenge
          )
          .send({ from: seller });
        if (data) {
          cb(true, data);
        } else {
          cb(false);
        }
      }
    } catch (exception) {
      printLog(["Exception", exception]);
      cb(false, "Transaction failed");
    }
  }

  async airdropTokenChallenge(
    challengeId,
    receiver,
    seller,
    eventIdAirDropTokenChallenge,
    connectedWith,
    cb
  ) {
    printLog([challengeId, receiver, seller], 'success');
    try {
      if (connectedWith == "walletConnect") {
        const abiData = await this.contract.methods
          .airdropTokenChallenge(
            challengeId,
            receiver,
            eventIdAirDropTokenChallenge
          )
          .encodeABI();
        this.web3TransactionService.callInstantFunction(
          abiData,
          seller,
          0,
          this.address,
          cb
        );
      } else {
        this.contract.methods
          .airdropTokenChallenge(
            challengeId,
            receiver,
            eventIdAirDropTokenChallenge
          )
          .send({ from: seller })
          .on("transactionHash", function (hash) {
            printLog(["transactionHash", hash], 'success');
            cb(true, hash); 
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            printLog(["confirmation", receipt], 'success');
          })
          .on("receipt", function (receipt) {
            printLog(["receipt", receipt], 'success');
          })
          .on("error", function (error, receipt) {
            // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            printLog(["error", error, receipt]);
            cb(false, error);
          });
      }
    } catch (exception) {
      printLog(["Exception", exception]);
      cb(false, "Transaction failed");
    }
  }

  async bulkAirdropTokenChallenge(
    challengeId,
    recipients,
    seller,
    eventIdAirDropTokenChallenge,
    connectedWith,
    cb
  ) {
    printLog([challengeId, recipients, seller], 'success');
    try {
      if (connectedWith == "walletConnect") {
        const abiData = await this.contract.methods
          .bulkAirdropTokenChallenge(
            challengeId,
            recipients,
            eventIdAirDropTokenChallenge
          )
          .encodeABI();
        this.web3TransactionService.callInstantFunction(
          abiData,
          seller,
          0,
          this.address,
          cb
        );
      } else {
        this.contract.methods
          .bulkAirdropTokenChallenge(
            challengeId,
            recipients,
            eventIdAirDropTokenChallenge
          )
          .send({ from: seller })
          .on("transactionHash", function (hash) {
            printLog(["transactionHash", hash], 'success');
            cb(true, hash); 
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            printLog(["confirmation", receipt], 'success');
          })
          .on("receipt", function (receipt) {
            printLog(["receipt", receipt], 'success');
          })
          .on("error", function (error, receipt) {
            printLog(["error", error, receipt]);
            cb(false, error);
          });
      }
    } catch (exception) {
      printLog(["Exception", exception]);
      cb(false, "Transaction failed");
    }
  }

  async withdrawTokenChallenge(
    owner,
    challengeId,
    eventIdWithdrawTokenChallenge,
    connectedWith,
    cb
  ) {
    try {
      printLog([owner, challengeId], 'success');
      if (connectedWith == "walletConnect") {
        const abiData = await this.contract.methods
          .withdrawTokenChallenge(challengeId, eventIdWithdrawTokenChallenge)
          .encodeABI();
        this.submitTracsaction(abiData, owner, cb);
      } else {
        const data = await this.contract.methods
          .withdrawTokenChallenge(challengeId, eventIdWithdrawTokenChallenge)
          .send({ from: owner });
        if (data) {
          cb(true, data);
        } else {
          cb(false);
        }
      }
    } catch (exception) {
      printLog(["Exception", exception]);
      cb(false, "Transaction failed");
    }
  }

  async getTokenAirdropFee(token) {
    printLog(["token", token], 'success');
    const data =
      parseFloat(
        await this.contract.methods.getAirdropFeePercent(token).call()
      ) / 100;
    return data;
  }
}
export default ERC1155Challenge;
