import ApiController from './api-controller';

export class Asset extends ApiController {
    static file = {
        xlsx: this.asset('/global/file/xlsx.png'),
        json: this.asset('/global/file/json.png'),
        csv: this.asset('/global/file/csv.png'),
        sql: this.asset('/global/file/sql.png')
    }
}