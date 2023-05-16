import { printLog } from "utils/printLog";
import http from "./http.service";
export class ShareService {
  constructor(backend_url) {
    this.api = backend_url + "/shares";
  }

  async addShare(data) {
    try {
      const result = await http.post(this.api, data);
      return result.data;
    } catch(exeption) {
      printLog(['exeption', exeption], 'success');
      return null;
    }
  } 
}
