import http from './http.service';
import { printLog } from 'utils/printLog';
export class NftScannerService{
    constructor(backend_api){
        this.api = backend_api+'/nft-scanner'
    }
    async startScanning(data){
        try {
            const reponse = await http.post(this.api+ '/start', data);
            return reponse.data;
        } catch(ex) {
            printLog([ex]);
            return null;
        }
    }

    async getTokens(data){
        try {
            const reponse = await http.post(this.api+ '/getTokens', data);
            return reponse.data;
        } catch(ex) {
            printLog([ex]);
            return null;
        }
    }

    async refreshMetadata(data){
        try {
            const reponse = await http.post(this.api+ '/refresh', data);
            return reponse.data;
        } catch(ex) {
            printLog([ex]);
            return null;
        }
    }
   
    async getScanningStatus(address, chainId = 0, assetType = 1){
        try {
            const result = await http.get(`${this.api}/getbyaddress/${address}?chainId=${chainId}&asset_type=${assetType}`);
            return result.data;
        } catch(ex) {
            printLog([ex]);
            return null;
        }
    }
}
