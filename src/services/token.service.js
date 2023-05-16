import axios from "axios";
import { printLog } from "utils/printLog";
import http from "./http.service";
export class TokenService {
  constructor(backend_url) {
    this.api = backend_url + "/tokens";
  }

  async saveToken(data) {
    try {
      const result = await http.post(this.api, data);
      return result.data;
    } catch(exeption) {
      printLog(['exeption', exeption]);
      return null;
    }
  } 
  async getNftByAddress(address) {
    const result = http.put(this.api + "/owner/" + address.toLowerCase());
    return result.data;
  }
}
