import http from "./http.service";

export class BidService{
    constructor(backend_url){
        this.api = backend_url+'/bids'
    }
    async saveBid(bid){
        const reponse = await http.post(this.api, bid);
        return reponse.data;
    }
    async updateBid(bid){
        const reponse = await http.put(this.api, bid);
        return reponse.data;
    }
    async getBids(){
        const result = await http.get(this.api);
        return result.data;
    }
    async deleteBid(id){
        const result = http.remove(this.api, { data: {id} });
        return result.data;
    }
}
