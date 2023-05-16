import http from './http.service';
export class OfferService{
    constructor(backend_api){
        this.api = backend_api+'/offers'
    }
    async saveOffer(offer){
        const reponse = await http.post(this.api, offer);
        return reponse.data;
    }
    async updateOffer(offer){
        const reponse = await http.put(this.api, offer);
        return reponse.data;
    }
    async getOffers(){
        const result = await http.get(this.api);
        return result.data;
    }
    async getOffersByNFT(nft_id){
        const result = await http.get(this.api+"/getbynft/"+nft_id);
        return result.data;
    }
    async deleteOffer(id){
        const result = http.remove(this.api, { data: {id} });
        return result.data;
    }

}
