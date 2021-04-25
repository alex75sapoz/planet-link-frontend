import dayjs from 'dayjs';

import ApiController from './api-controller';

export const prepare = {
    /**@param {WeatherCityObservationContract} json */
    cityObservation: (json) => {
        json.createdOn = dayjs(json.createdOn);
        json.sunriseOn = dayjs(json.sunriseOn);
        json.sunsetOn = dayjs(json.sunsetOn);
    },
    /**@param {WeatherCityForecastContract} json */
    cityForecast: (json) => {
        json.createdOn = dayjs(json.createdOn);
        json.sunriseOn = dayjs(json.sunriseOn);
        json.sunsetOn = dayjs(json.sunsetOn);
    },
    /**@param {WeatherCityUserEmotionContract} json */
    cityUserEmotion: (json) => {
        json.createdOn = dayjs(json.createdOn)
    }
}

export default class WeatherController extends ApiController {
    static city = {
        observation: {
            /**
             * @param {{ cityId: number, latitude: number, longitude: number }}
             * @returns {Promise<import('./api-controller').Response<WeatherCityObservationContract>>}
             */
            get: ({ cityId, latitude, longitude }) => this.request({
                method: 'GET',
                path: '/Weather/City/Observation',
                parameters: { cityId, latitude, longitude },
                isValid: () => cityId || (latitude && longitude),
                onSuccess: (cityObservation) => prepare.cityObservation(cityObservation)
            })
        },
        forecasts: {
            /**
             * @param {{ cityId: number, latitude: number, longitude: number }}
             * @returns {Promise<import('./api-controller').Response<WeatherCityForecastContract[]>>}
            */
            get: ({ cityId, latitude, longitude }) => this.request({
                method: 'GET',
                path: '/Weather/City/Forecasts',
                parameters: { cityId, latitude, longitude },
                isValid: () => cityId || (latitude && longitude),
                onSuccess: (cityForecasts) => cityForecasts.forEach(cityForecast => prepare.cityForecast(cityForecast))
            })
        },
        emotion: {
            counts: {
                /**
                 * @param {{ cityId: number }}
                 * @returns {Promise<import('./api-controller').Response<WeatherCityEmotionCountContract[]>>}
                */
                get: ({ cityId }) => this.request({
                    method: 'GET',
                    path: '/Weather/City/Emotion/Counts',
                    parameters: { cityId },
                    isValid: () => cityId
                })
            }
        },
        userEmotion: {
            /**
             * @param {{ cityId: number, emotionId: number }}
             * @returns {Promise<import('./api-controller').Response<WeatherCityUserEmotionContract>>}
            */
            post: ({ cityId, emotionId }) => this.request({
                method: 'POST',
                path: '/Weather/City/UserEmotion',
                parameters: { cityId, emotionId },
                isValid: () => cityId && emotionId,
                onSuccess: (cityUserEmotion) => prepare.cityUserEmotion(cityUserEmotion)
            })
        },
        userConfiguration: {
            /**
             * @param {{ cityId: number }}
             * @returns {Promise<import('./api-controller').Response<WeatherCityUserConfigurationContract>>}
            */
            get: ({ cityId }) => this.request({
                method: 'GET',
                path: '/Weather/City/UserConfiguration',
                parameters: { cityId },
                isValid: () => cityId
            })
        }
    };

    static configuration = {
        /**
         * @returns {Promise<import('./api-controller').Response<WeatherConfigurationContract>>}
         */
        get: () => this.request({
            method: 'GET',
            path: '/Weather/Configuration'
        })
    };
}

export class WeatherAsset extends ApiController {
    /**@param {string} conditionKey @returns {string} */
    static condition = (conditionKey) => this.storage.library(`/weather/condition/${conditionKey?.toLowerCase()}.svg`)

    static extra = {
        humidity: this.storage.library('/weather/extra/humidity.png'),
        windDirection: this.storage.library('/weather/extra/wind-direction.png'),
        cloudiness: this.storage.library('/weather/extra/cloudiness.png'),
        rain: this.storage.library('/weather/extra/rain.png'),
        snow: this.storage.library('/weather/extra/snow.png'),
        windSpeed: this.storage.library('/weather/extra/wind-speed.png'),
        pressure: this.storage.library('/weather/extra/pressure.png'),
        openWeatherLogo: this.storage.library('/weather/extra/open-weather-logo.png')
    }
}