import { printLog } from "utils/printLog";
import mainAuthHeader from "./auth-main-header";
import http from "./http.service";

export class ChallengeService {
  constructor(backend_url) {
    this.api = backend_url + "/challenges";
    this.apiWithOutChallenge = backend_url
  }

  async getAllChallenges() {
    const reponse = await http.get(this.api);
    return reponse.data;
  }

  async getChallengeByAssetId(assetId) {
    //get the other nfts owned by the same user
    const result = await http
      .get(this.api + "/asset/" + assetId)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return result.data;
  }

  async getChallengesWithFilters(sortBy, page, limit, status, chainId = 0) {
    const reponse = await http.get(
      `${
        this.api
      }/orderBy/${sortBy}/filters?page=${page}&limit=${limit}&${status}=${new Date().getTime()}&chainId=${chainId}`
    );
    return reponse.data;
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

  async getUserChallengesWithFilters(sortBy, page, limit, status, userId, chainId = 0) {
    printLog(["userId", userId], 'success')
    const reponse = await http.get(
      `${
        this.api
      }/${userId}/orderBy/${sortBy}/filters?page=${page}&limit=${limit}&${status}=${new Date().getTime()}&chainId=${chainId}`,
      { headers: mainAuthHeader()}
    );
    return reponse.data;
  }

  async getUserChallengesWithFilters(sortBy, page, limit, status, userId, chainId = 0) {
    const reponse = await http.get(
      `${
        this.api
      }/${userId}/orderBy/${sortBy}/filters?page=${page}&limit=${limit}&${status}=${new Date().getTime()}&chainId=${chainId}`,
      { headers: mainAuthHeader()}
    );
    return reponse.data;
  }

  async count() {
    const reponse = await http.get(this.api + "/count");
    return reponse.data;
  }

  async addSubmission(obj) {
    try{
      return http.post(this.apiWithOutChallenge + "/submits", obj)
      .then((res) => {
        return {success: true, data: res.data};
      })
      .catch(function (error) {
        if (error.response) {
          return {success: false, data: error.response.data.message};
        } else if (error.request) {
          return {success: false, data: error.request};
        } else {
          return {success: false, data: error.message};
        }
      });
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return {success: false, data: exeption.message};
    }
  }

  async updateSubmission(obj) {
    try {
      const reponse = await http.put(this.apiWithOutChallenge + "/submits", obj);
      return reponse.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  }

  async updateBuklSubmission(obj) {
    try {
      const reponse = await http.put(this.apiWithOutChallenge + "/submits/update-bulk", obj);
      return reponse.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  }

  async updateSubmissionsByHash(obj) {
    try {
      const reponse = await http.put(this.apiWithOutChallenge + "/submits/update-by-hash", obj);
      return reponse.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  }
  
  async getSubmitbyUserAndNFT(user_id, nft_id) {
    const reponse = await http.get(
      `${this.apiWithOutChallenge}/submits/filter/user/${user_id}/nft/${nft_id}`,
      { headers: mainAuthHeader()}
    );
    return reponse.data;
  }

  async getSubmissions(
    challengeId,
    sortBy = "DESC",
    page = 1,
    limit = 10000,
    status
  ) {
    const reponse = await http.get(
      `${this.apiWithOutChallenge}/submits/getbychallenge/${challengeId}/orderBy/${sortBy}/filters?page=${page}&limit=${limit}`
    );
    return reponse.data;
  }

  async getSubmissionsWithFilters(
    challengeId,
    sortBy = "DESC",
    page = 1,
    limit = 1000,
    status
  ) {
    const reponse = await http.get(
      `${this.apiWithOutChallenge}/submits/getbychallenge/${challengeId}/orderBy/${sortBy}/filters?page=${page}&limit=${limit}${status === 'all' ? '' : '&status=' + status}`
    );
    return reponse.data;
  }

  async getChallengeFromNFT(nftId) {
    const reponse = await http.get(this.api + "/nft/" + nftId);
    return reponse.data[0];
  }

  async cancelChallenge(id) {
    try {
      const reponse = http.put(`${this.api}/cancelled/${id}`, {});
      return reponse.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  }

  async update(challange) {
    try {
      const reponse = await  http.put(this.api, challange);
      return reponse.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  }

  async getChallengeById(id) {
    const result = await http.get(this.api + "/getbyid/" + id);
    return result.data;
  }

  async getSpotlightChallenges(limit, page, chainId=0) {
    const result = await http
      .get(`${this.api}/spotlight?chainId=${chainId}&page=${page}&limit=${limit}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return result.data;
  }
}
