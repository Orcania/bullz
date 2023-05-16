import axios from "axios";

import http from "./http.service";
import { printLog } from 'utils/printLog';
export class UserService {
  constructor(backend_api) {
    this.api = backend_api + "/users";
    this.backend_api = backend_api;
  }
  async saveUser(user) {
    const reponse = await axios
      .post(this.api, user)
      .then((res) => {
        printLog([res.data], 'success');
        return res.data;
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return reponse;
  }

  async getTwitterRequestToken(data) {
    try {
      const result = await http.post(this.backend_api + "/auth/twitter/request_token", data);
      return result.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  }

  async getTwitterAccessToken(data) {
    try {
      const result = await http.post(this.backend_api + "/auth/twitter/access_token", data);
      return result.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  }

  async getInstagramAccessToken(data) {
    try {
      const result = await http.post(this.backend_api + "/auth/instagram", data);
      return result.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  }

  async getInstagramUser(url) {
    try {
      const result = await http.get(url);
      printLog(['result', result], 'success');
      return result.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  }

  async updateUser(user) {
    try {
      const reponse = await http.put(this.api, user);
      return reponse.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  }


  async getUsers() {
    const result = await http.get(this.api);
    return result.data;
  }
  async getUser(address) {
    try {
      const result = await axios.get(this.api + "/" + address);
      return result.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
    
  }
  
  async getUserCount() {
    try {
      const result = await axios.get(this.api + "/count");
      return result.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
    
  }
  async deleteUser(id) {
    try {
      const result = http.delete(this.api, { data: { id } });
      return result.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  }
  async getUserById(id) {
    try {
      const result = await http.get(this.api + "/getbyid/" + id);
      return result.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
    
  }

  async getUserByName(name) {
    try {
      const result = await http.get(this.api + "/getbyusername/" + name);
      return result.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
    
  }

  async getUserFollowers(profileUserId) {
    try {
      const result = await http.get(this.api + `/getFollowers/${profileUserId}`);
      return result.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  }

  async getUserFollowings(profileUserId) {
    try {
      const result = await http.get(this.api + `/getFollowing/${profileUserId}`);
      return result.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  }

  async getOwnedNFTCountById(id) {
    try {
      const result = await http.get(this.api + `/getOwnedNFTCountById/${id}`);
      return result.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  }
  
  async checkForUserFollowed(currentUserId, profileUserId) {
    try {
      const result = await http.get(
        this.api + `/checkFollow/${currentUserId}/${profileUserId}`
      );
      return result.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  }

  async followUnfollowUser(currentUserId, profileUserId) {
    const result = await http
      .get(this.api + `/follow/${currentUserId}/${profileUserId}`)
      .then((res) => {
        printLog([res], 'success');
        if (res) {
          return res;
        }
      })
      .catch((err) => {
        printLog([err]);
        return false;
      });
    return result.data;
  }

  async getTopCreators(startDate, endDate) {
    const result = await http
      .get(this.api + `/topCreators/${startDate}/${endDate}`)
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

  async getTopBuyers(filter = 1) {
    const result = await http
      .get(this.api + `/topBuyers`)
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

  async getAllTopCreators(page, limit = 20) {
    const result = await http
      .get(this.api + `/allCreators?page=${page}&limit=${limit}`)
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

  async getAllTopBuyers(page, limit = 20) {
    const result = await http
      .get(this.api + `/allBuyers?page=${page}&limit=${limit}`)
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

  async login(address, signature) {
    const result = await axios.post(this.backend_api + "/auth/login", {
      address: address,
      signature: signature,
    });
    return result.data;
  }
}
