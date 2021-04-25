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
            csv: this.storage.library('/location/city/archive/cities-csv.zip'),
            json: this.storage.library('/location/city/archive/cities-json.zip'),
            xlsx: this.storage.library('/location/city/archive/cities-xlsx.zip')
        }
    }

    static country = {
        /**@param {string} countryTwoLetterCode @returns {string} */
        flag: (countryTwoLetterCode) => this.storage.library(`/location/country/flag/${countryTwoLetterCode?.toLowerCase()}.png`),
        archive: {
            csv: this.storage.library('/location/country/archive/countries-csv.zip'),
            json: this.storage.library('/location/country/archive/countries-json.zip'),
            xlsx: this.storage.library('/location/country/archive/countries-xlsx.zip')
        }
    }

    static state = {
        archive: {
            csv: this.storage.library('/location/state/archive/states-csv.zip'),
            json: this.storage.library('/location/state/archive/states-json.zip'),
            xlsx: this.storage.library('/location/state/archive/states-xlsx.zip')
        }
    }

    static continent = {
        archive: {
            csv: this.storage.library('/location/continent/archive/continents-csv.zip'),
            json: this.storage.library('/location/continent/archive/continents-json.zip'),
            xlsx: this.storage.library('/location/continent/archive/continents-xlsx.zip')
        }
    }

    static subContinent = {
        archive: {
            csv: this.storage.library('/location/sub-continent/archive/sub-continents-csv.zip'),
            json: this.storage.library('/location/sub-continent/archive/sub-continents-json.zip'),
            xlsx: this.storage.library('/location/sub-continent/archive/sub-continents-xlsx.zip')
        }
    }

    static areaCode = {
        archive: {
            csv: this.storage.library('/location/area-code/archive/area-codes-csv.zip'),
            json: this.storage.library('/location/area-code/archive/area-codes-json.zip'),
            xlsx: this.storage.library('/location/area-code/archive/area-codes-xlsx.zip')
        }
    }

    static currency = {
        archive: {
            csv: this.storage.library('/location/currency/archive/currencies-csv.zip'),
            json: this.storage.library('/location/currency/archive/currencies-json.zip'),
            xlsx: this.storage.library('/location/currency/archive/currencies-xlsx.zip')
        }
    }

    static language = {
        archive: {
            csv: this.storage.library('/location/language/archive/languages-csv.zip'),
            json: this.storage.library('/location/language/archive/languages-json.zip'),
            xlsx: this.storage.library('/location/language/archive/languages-xlsx.zip')
        }
    }
}