import { printLog } from 'utils/printLog';
import http from './http.service';
export class TempStorageService{
    constructor(backend_api){
        this.api = backend_api+'/tempstorage'
    }
    async save(storageData){
        try {
            const reponse = await http.post(this.api, storageData);
            return reponse.data;
        } catch(exeption) {
            printLog(['exeption', exeption]);
            return null;
        }
    }
    async update(storageData){
        try {
            const reponse = await http.put(this.api, storageData);
            return reponse.data;
        } catch(exeption) {
            printLog(['exeption', exeption]);
            return null;
        }
    }
    async getByEventId(eventId){
        try {
            const result = await http.get(this.api + '/getByEventId/' + eventId) ;
            return result.data;
        } catch(exeption) {
            printLog(['exeption', exeption]);
            return null;
        }
    }
}
