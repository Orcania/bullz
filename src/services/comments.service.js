import { printLog } from "utils/printLog";
import http from "./http.service";
export class CommentsService {
  constructor(backend_url) {
    this.api = backend_url + "/comments";
    this.backend_url = backend_url;
  }
  async addComment(data) {
      printLog(["post comment"], 'success')
    const reponse = await http.post(this.api + "/addComment", data);
    return reponse.data;
  }

  async likeUnlikeNFTComment(data) {
    const reponse = await http
      .post(this.backend_url + "/commentsLike/commentLikeDislike", data)
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

  async getNFTComments(nftId, userId) {
    const result = await http.get(
      this.api + "/getByNFTId/" + nftId + "/" + userId
    );
    return result.data;
  }

  async getChallengeComments(challengeId, userId) {
    const result = await http.get(
      this.api + "/getByChallengeId/" + challengeId + "/" + userId
    );
    return result.data;
  }
}
