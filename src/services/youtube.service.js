import http from "./http.service";

export class YoutubeService{
    constructor(backend_url){
        this.api = backend_url
    }
    async getUserYoutubeInfo(access_token){
        const reponse = await http.post(this.api + '/auth/youtube', {access_token});
        return reponse.data;
    }
}
