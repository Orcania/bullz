import axios from "axios";
import http from "./http.service";
import { printLog } from 'utils/printLog';
export class NftService {
  constructor(backend_url) {
    this.api = backend_url + "/nfts";
    this.apiUrlLike = backend_url + "/likes";
    // this.apiUrlPaginate = backend_url + "/nfts/paginated";
    this.challenge = backend_url + "/challenges";
  }
  async saveNFT(nft) {
    const reponse = await http.post(this.api, nft);
    return reponse.data;
  }

  async saveChallenge(nft) {
    const reponse = await http.post(this.challenge, nft);
    return reponse.data;
  }

  async likeUnlikeNFT(data) {
    const reponse = await http
      .post(this.apiUrlLike + "/addLike", data)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });

    printLog([reponse], 'success');
    return reponse;
  }

  async updateNFT(nft) {
    const reponse = await http.put(this.api, nft);
    return reponse.data;
  }

  async deleteNFT(nftId) {
    const reponse = await http.remove(this.api+`?id=${nftId}`);
    return reponse.data;
  }

  async getNftByAddress(address) {
    const result = await http.put(this.api + "/owner/" + address.toLowerCase());
    return result.data;
  }
  async getNfts() {
    const result = await http.get(this.api);
    return result.data;
  }
  async getCountNfts() {
    const result = await http.get(this.api+'/all/length');
    return result.data;
  }
  
  // async getNftsPaginate(
  //   limit = 20,
  //   page,
  //   type = "all",
  //   subFilterKey = "all",
  //   subFilterValue = "all"
  // ) {
  //   const result = await http
  //     .get(
  //       `${this.api}/explore/${subFilterKey}/${subFilterValue}?page=${page}&limit=${limit}`
  //     )
  //     .then((res) => {
  //       return res;
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  //   return result.data;
  // }

  async getExploreNftWithFilter(limit = 20, page, sortBy, queryString) {
    let url = queryString
      ? `${this.api}/owner/${sortBy}/filters?page=${page}&limit=${limit}` +
        queryString
      : `${this.api}/owner/${sortBy}/filters?page=${page}&limit=${limit}`;
    const result = await http
      .get(url)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return result.data;
  }

  async getProfileNftWithFilter(
    limit = 20,
    page,
    sortBy,
    queryString,
    profileAddress,
    isForLiked = false,
    isForLive = false
  ) {
    let url;

    if (isForLiked) {
      url = queryString
        ? `${this.api}/ownerByFilter/${sortBy}/liked/${profileAddress}/filters?page=${page}&limit=${limit}` +
          queryString
        : `${this.api}/ownerByFilter/${sortBy}/liked/${profileAddress}/filters?page=${page}&limit=${limit}`;
    } else if (isForLive) {
      url = queryString
        ? `${this.api}/ownerByFilter/${sortBy}/live/${profileAddress}/filters?page=${page}&limit=${limit}` +
          queryString
        : `${this.api}/ownerByFilter/${sortBy}/live/${profileAddress}/filters?page=${page}&limit=${limit}`;
    } else {
      url = queryString
        ? `${this.api}/ownerByFilter/${sortBy}/all/${profileAddress}/filters?page=${page}&limit=${limit}` +
          queryString
        : `${this.api}/ownerByFilter/${sortBy}/all/${profileAddress}/filters?page=${page}&limit=${limit}`;
    }
    const result = await http
      .get(url)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return result.data;
  }

  async getNftsForChallenge(
    limit = 20,
    page,
    profileAddress,
    chainId = 0
  ) {
    let url = `${this.api}/getNftsForChallenge/${profileAddress}?page=${page}&limit=${limit}&chainId=${chainId}`;
    
    const result = await http
      .get(url)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return result.data;
  }

  async getAllExploreNft(limit = 20, page) {
    const result = await http
      .get(`${this.api}/byArtwork/all`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return result.data;
  }

  async getTopChallengeNfts(limit = 20, chainId = 0) {
    const result = await http
      .get(`${this.api}/topChallenges/${limit}?chainId=${chainId}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return result.data;
  }

  // async getOwnerNftsPaginate(
  //   limit = 20,
  //   page,
  //   type = "all",
  //   address,
  //   subFilterKey = "all",
  //   subFilterValue = "all"
  // ) {
  //   const result = await axios
  //     .get(
  //       `${
  //         this.api
  //       }/owner/${address.toLowerCase()}/paginated/${type}/${subFilterKey}/${subFilterValue}?page=${page}&limit=${limit}`
  //     )
  //     .then((res) => {
  //       return res;
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  //   return result.data;
  // }

  async getMultipleNFT(nftId) {
    //get the other nfts owned by the same user
    const result = await axios
      .get(this.api + "/asset/" + nftId)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return result.data;
  }

  async getNft(id) {
    const result = await http.get(this.api + "/" + id);
    return result.data[0];
  }

  async getChallengeNFTByAssetId(asset_id) {
    const result = await http.get(this.api + "/challengeType/" + asset_id);
    return result.data;
  }

  async addViews(id) {
    await http.get(this.api + "/increaseView/" + id);
  }

  async userNFTData(add) {
    const result = await http.get(this.api + "/count/" + add);
    return result.data;
  }

  async getTrendingNfts(chainId = 0) {
    const result = await http
      .get(this.api + `/trendingNfts?chainId=${chainId}`)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return result;
  }

  async getLiveAuctions() {
    const result = await http
      .get(this.api + `/liveAuctions`)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return result;
  }

  async getByHolderAndAsssetId(holder, assetId){
    //http://localhost:3000/api/nfts/holder/0x5b855c9058291cdde5f55c274eb2c1c897124efa/assetId/5
    const result = await http
      .get(this.api + `/holder/${holder}/assetId/${assetId}`)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return result;    
  }
}
