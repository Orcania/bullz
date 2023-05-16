import axios from "axios";
import { printLog } from "utils/printLog";

import http from './http.service';
export class ChatUserService {
  constructor(chat_backend_url) {
    this.chat_backend_url = chat_backend_url;
    this.api = chat_backend_url + "/users";
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
  async updateUser(user) {
    const reponse = await http.put(this.api, user);
    return reponse.data;
  }
  async getUser(address) {
    const result = await http.get(this.api + "/" + address);
    return result.data;
  }
  async login(address, signature){
    const result = await axios.post(this.chat_backend_url + "/auth/login", {
        address: address,
		    signature: signature
    });
    return result.data;
  }
  
}
