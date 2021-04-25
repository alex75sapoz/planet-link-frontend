import ApiController from './api-controller';

export class Asset extends ApiController {
    static file = {
        xlsx: this.storage.asset('/file/xlsx.png'),
        json: this.storage.asset('/file/json.png'),
        csv: this.storage.asset('/file/csv.png'),
        sql: this.storage.asset('/file/sql.png')
    }
}