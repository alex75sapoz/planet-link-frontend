import ApiController from './api-controller';

export default class LocationController extends ApiController {
    static country = {
        /**
         * @param {{ countryId: number }}
         * @returns {Promise<import('./api-controller').Response<LocationCountryContract>>}
        */
        get: ({ countryId }) => this.request({
            method: 'GET',
            path: '/Location/Country',
            parameters: { countryId },
            isValid: () => countryId
        }),
        search: {
            /**
             * @param {{ keyword: string }}
             * @returns {Promise<import('./api-controller').Response<LocationCountryContract[]>>}
            */
            get: ({ keyword }) => this.request({
                method: 'GET',
                path: '/Location/Country/Search',
                parameters: { keyword },
                isValid: () => keyword
            })
        }
    }

    static city = {
        /**
         * @param {{ cityId: number, latitude: number, longitude: number }}
         * @returns {Promise<import('./api-controller').Response<LocationCityContract>>}
        */
        get: ({ cityId, latitude, longitude }) => this.request({
            method: 'GET',
            path: '/Location/City',
            parameters: { cityId, latitude, longitude },
            isValid: () => cityId || (latitude && longitude)
        }),
        search: {
            /**
             * @param {{ keyword: string }}
             * @returns {Promise<import('./api-controller').Response<LocationCityContract[]>>}
            */
            get: ({ keyword }) => this.request({
                method: 'GET',
                path: '/Location/City/Search',
                parameters: { keyword },
                isValid: () => keyword
            })
        }
    }
}

export class LocationAsset extends ApiController {
    static city = {
        archive: {
            csv: this.asset('/location/city/archive/cities-csv.zip'),
            json: this.asset('/location/city/archive/cities-json.zip'),
            sql: this.asset('/location/city/archive/cities-sql.zip'),
            xlsx: this.asset('/location/city/archive/cities-xlsx.zip')
        }
    }

    static country = {
        /**@param {string} countryTwoLetterCode @returns {string} */
        flag: (countryTwoLetterCode) => this.asset(`/location/country/flag/${countryTwoLetterCode?.toLowerCase()}.png`),
        archive: {
            csv: this.asset('/location/country/archive/countries-csv.zip'),
            json: this.asset('/location/country/archive/countries-json.zip'),
            sql: this.asset('/location/country/archive/countries-sql.zip'),
            xlsx: this.asset('/location/country/archive/countries-xlsx.zip')
        }
    }

    static state = {
        archive: {
            csv: this.asset('/location/state/archive/states-csv.zip'),
            json: this.asset('/location/state/archive/states-json.zip'),
            sql: this.asset('/location/state/archive/states-sql.zip'),
            xlsx: this.asset('/location/state/archive/states-xlsx.zip')
        }
    }

    static continent = {
        archive: {
            csv: this.asset('/location/continent/archive/continents-csv.zip'),
            json: this.asset('/location/continent/archive/continents-json.zip'),
            sql: this.asset('/location/continent/archive/continents-sql.zip'),
            xlsx: this.asset('/location/continent/archive/continents-xlsx.zip')
        }
    }

    static subContinent = {
        archive: {
            csv: this.asset('/location/sub-continent/archive/sub-continents-csv.zip'),
            json: this.asset('/location/sub-continent/archive/sub-continents-json.zip'),
            sql: this.asset('/location/sub-continent/archive/sub-continents-sql.zip'),
            xlsx: this.asset('/location/sub-continent/archive/sub-continents-xlsx.zip')
        }
    }

    static areaCode = {
        archive: {
            csv: this.asset('/global/area-code/archive/area-codes-csv.zip'),
            json: this.asset('/global/area-code/archive/area-codes-json.zip'),
            sql: this.asset('/global/area-code/archive/area-codes-sql.zip'),
            xlsx: this.asset('/global/area-code/archive/area-codes-xlsx.zip')
        }
    }

    static currency = {
        archive: {
            csv: this.asset('/global/currency/archive/currencies-csv.zip'),
            json: this.asset('/global/currency/archive/currencies-json.zip'),
            sql: this.asset('/global/currency/archive/currencies-sql.zip'),
            xlsx: this.asset('/global/currency/archive/currencies-xlsx.zip')
        }
    }

    static language = {
        archive: {
            csv: this.asset('/global/language/archive/languages-csv.zip'),
            json: this.asset('/global/language/archive/languages-json.zip'),
            sql: this.asset('/global/language/archive/languages-sql.zip'),
            xlsx: this.asset('/global/language/archive/languages-xlsx.zip')
        }
    }
}