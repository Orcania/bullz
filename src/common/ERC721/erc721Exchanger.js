import { printLog } from "utils/printLog";
import ERC721_EXCHANGER_ABI from "../../abis/ERC721Exchange.json";

class ERC721Exchanger {
  constructor(web3, address) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(
      ERC721_EXCHANGER_ABI,
      address
    );
  }
  async addOffer(
    seller,
    collection,
    assetId,
    token,
    price,
    isForSell,
    isForAuction,
    expiresAt,
    shareIndex
  ) {
    const data = await this.contract.methods
      .addOffer(
        seller,
        collection,
        assetId,
        token,
        price,
        isForSell,
        isForAuction,
        expiresAt,
        shareIndex
      )
      .send({ from: seller });
    return data;
  }
  async addLoyaltyOffer(
    seller,
    collection,
    assetId,
    token,
    price,
    isForSell,
    isForAuction,
    expiresAt,
    shareIndex,
    loyaltyPercent
  ) {
    const data = await this.contract.methods
      .addLoyaltyOffer(
        seller,
        collection,
        assetId,
        token,
        price,
        isForSell,
        isForAuction,
        expiresAt,
        shareIndex,
        loyaltyPercent
      )
      .send({ from: seller });
    return data;
  }
  async buyOffer(buyer, collection, assetId, value) {
    const data = await this.contract.methods
      .buyOffer(collection, assetId)
      .send({ from: buyer, value })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return data;
  }
  async placeBid(bidder, collection, assetId, token, price) {
    const data = await this.contract.methods
      .safePlaceBid(collection, assetId, token, price)
      .send({ from: bidder })
      .then((res) => {
        printLog([res], 'success');
        return res;
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return data;
  }
  async cancelBid(collection, assetId, bidder, offerId) {
    const data = await this.contract.methods
      .cancelBid(collection, assetId, bidder)
      .send({ from: bidder })
      .then((res) => {
        printLog([res], 'success');
        return res;
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return data;
  }
  async acceptBid(owner, collection, assetId, bidder, offerId) {
    const data = await this.contract.methods
      .acceptBid(collection, assetId, bidder)
      .send({ from: owner })
      .then((res) => {
        printLog([res], 'success');
        return res;
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return data;
  }
  async setBid(owner, collection, assetId, bidder, offerId) {
    const data = await this.contract.methods
      .acceptBid(collection, assetId, bidder)
      .send({ from: owner });
    return data;
  }
  async getShareByIndex(index) {
    const data = await this.contract.methods
      .shares(index)
      .call();
    return data;
  }
  async setOfferPrice(owner, collection, assetId, price, offerId) {
    const data = await this.contract.methods
      .setOfferPrice(collection, assetId, price)
      .send({ from: owner });
    return data;
  }
  async setForSell(owner, collection, assetId, isForSell, offerId) {
    const data = await this.contract.methods
      .setForSell(collection, assetId, isForSell)
      .send({ from: owner });
    return data;
  }

  async cancelOffer(owner, collection, assetId, offerId) {
    const data = await this.contract.methods
      .cancelOffer(collection, assetId)
      .send({ from: owner });
    return data;
  }

  async setForAuction(owner, collection, assetId, isForAuction, offerId) {
    const data = await this.contract.methods
      .setForAuction(collection, assetId, isForAuction)
      .send({ from: owner });
    return data;
  }

  async setExpiresAt(owner, collection, assetId, time, offerId) {
    const data = await this.contract.methods
      .setExpiresAt(collection, assetId, time)
      .send({ from: owner });
    return data;
  }
}
export default ERC721Exchanger;
