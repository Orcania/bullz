import { printLog } from "utils/printLog";
import http from "./http.service";
export class CollectionService {
  constructor(backend_url) {
    this.api = backend_url + "/collection";
    this.NFTapi = backend_url + "/nfts/collection";
  }
  async saveCollecion(offer) {
    const reponse = await http
      .post(this.api + "/addCollection", offer)
      .then((res) => {
        if (res.status === 201) {
          return res.data;
        }
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return reponse;
  }
  // async getCollectionsByType(nft_id) {
  //   const result = await http
  //     .get(this.api + "/getCollections/" + nft_id)
  //     .then((res) => {
  //       if (res.status === 200) {
  //         return res.data;
  //       }
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  //   return result;
  // }


  async getCollectionsByTypePaginate(
    limit,
    selectedPage,
    type,userId, chain_id) {
    const result = await http
      .get(this.api + "/getCollectionByTypePaginated/" + type + '/' + userId + '/' + chain_id + `?page=${selectedPage}&limit=${limit}`)
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

  async getCollectionsByAddress(nft_id) {
    const result = await http
      .get(this.api + "/getCollectionsByAddress/" + nft_id)
      .then((res) => {
        if (res.status === 200) {
          return res.data[0];
        }
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return result;
  }

  // async getNFTForCollections(
  //   limit = 20,
  //   page,
  //   address,
  //   subFilterKey = "all",
  //   subFilterValue = "all"
  // ) {
  //   const result = await http
  //     .get(
  //       `${this.NFTapi}/${address}/paginated/${subFilterKey}/${subFilterValue}?page=${page}&limit=${limit}`
  //     )
  //     .then((res) => {
  //       if (res.status === 200) {
  //         return res.data;
  //       }
  //     })
  //     .catch((err) => {
  //       return false;
  //     });
  //   return result;
  // }

  async getAllCollections(limit = 20, page) {
    const result = await http
      .get(
        this.api + "/getCollectionPaginated" + `?page=${page}&limit=${limit}`
      )
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

  async getTrendingCollections(startDate, endDate, chainId=0) {
    const result = await http
      .get(this.api + `/getTrending/${startDate}/${endDate}?chainId=${chainId}`)
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
