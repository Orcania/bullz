import http from './http.service';
export class PhylloService{
    constructor(backend_api){
        this.api = backend_api+'/phyllo'
    }
    async createToken(tokenData) {
        const result = await http.post(this.api + '/create-token', tokenData);
        return result.data;
    }

    async getUserProfile(account_id) {
        const result = await http.post(this.api + '/phyllo-profile', {account_id});
        return result.data;
    }
}
