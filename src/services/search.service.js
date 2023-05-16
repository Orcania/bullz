import http from "./http.service";
export class SearchService {
  constructor(backend_api) {
    this.api = backend_api;
  }
  async getSearchData(query) {
    const result = await http.get(this.api + "/collection/getSearch/" + query);
    return result.data;
  }

  async searchOnNFTType(nftType, query) {
    const result = await http.get(
      `${this.api}/nfts/getSearchByType/${nftType}/${query}`
    );
    return result.data;
  }

  async getSearchDataNFT(query, page, limit) {
    const result = await http.get(
      `${this.api}/nfts/getSearchNft/${query}?page=${page}&limit=${limit}`
    );
    return result.data;
  }

  async getSearchDataNFTByCollection(collection, query, page, limit) {
    const result = await http.get(
      `${this.api}/nfts/getSearchNftByCollection/${query}/${collection}?page=${page}&limit=${limit}`
    );
    return result.data;
  }

  async getSearchDataChallengeByUser(useraddress, query, page, limit) {
    const result = await http.get(
      `${this.api}/challenges/getSearchChallengeByUser/${useraddress}/${query}?page=${page}&limit=${limit}`
    );
    return result.data;
  }
  async getSearchDataChallenge(query, page, limit) {
    const result = await http.get(
      `${this.api}/challenges/getSearchChallenge/${query}?page=${page}&limit=${limit}`
    );
    return result.data;
  }

  async getSearchDataCollection(query, page, limit) {
    const result = await http.get(
      `${this.api}/collection/getSearchCollection/${query}?page=${page}&limit=${limit}`
    );
    return result.data;
  }
  async getSearchDataUser(query, page, limit) {
    const result = await http.get(
      `${this.api}/users/getSearchUser/${query}?page=${page}&limit=${limit}`
    );
    return result.data;
  }
}

