import http from './http.service';
export class ReportService{
    constructor(backend_api){
        this.api = backend_api+'/reports'
    }
    async saveReport(report){
        return http.post(this.api, report);
    }
    async updateReport(report){
        const reponse = await http.put(this.api, report);
        return reponse.data;
    }
    async getReports(){
        const result = await http.get(this.api);
        return result.data;
    }

}
