import utcPlugin from 'dayjs/plugin/utc';
import timezonePlugin from 'dayjs/plugin/timezone';
import dayjs from 'dayjs'

import ApiController from './api-controller';
import { prepare as accountPrepare } from './account-controller';

import { easternTimezoneId } from '../library/base/base-extension';

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

const prepare = {
    /**@param {StockMarketQuoteCompanyContract} json */
    quoteCompany: (json) => {
        json.initialPublicOfferingOn && (json.initialPublicOfferingOn = dayjs(json.initialPublicOfferingOn).tz(easternTimezoneId))
    },
    /**@param {StockMarketQuotePriceContract} json */
    quotePrice: (json) => {
        json.createdOn = dayjs(json.createdOn).tz(easternTimezoneId);
        json.earningsPerShareAnnouncedOn && (json.earningsPerShareAnnouncedOn = dayjs(json.earningsPerShareAnnouncedOn).tz(easternTimezoneId));
    },
    /**@param {StockMarketQuoteCandleContract} json */
    quoteCandle: (json) => {
        json.createdOn = dayjs(json.createdOn).tz(easternTimezoneId);
        json.quoteUserAlerts.forEach(quoteUserAlert => prepare.quoteUserAlert(quoteUserAlert));
    },
    /**@param {StockMarketQuoteUserAlertContract} json */
    quoteUserAlert: (json) => {
        json.createdOn = dayjs(json.createdOn).tz(easternTimezoneId);
        json.completedOn && (json.completedOn = dayjs(json.completedOn).tz(easternTimezoneId));
        accountPrepare.user(json.user);
    },
    /**@param {StockMarketQuoteUserEmotionContract} json */
    quoteUserEmotion: (json) => {
        json.createdOn = dayjs(json.createdOn).tz(easternTimezoneId);
        accountPrepare.user(json.user);
    },
    /**@param {StockMarketUserContract} json */
    profile: (json) => {
        accountPrepare.user(json.user);
    }
}

export default class StockMarketController extends ApiController {
    static global = {
        /**
         * @returns {Promise<import('./api-controller').Response<StockMarketGlobalContract>>}
        */
        get: () => this.request({
            method: 'GET',
            path: '/StockMarket/Global',
        })
    }

    static quote = {
        /**
         * @param {{ quoteId: number }}
         * @returns {Promise<import('./api-controller').Response<StockMarketQuoteContract>>}
        */
        get: ({ quoteId }) => this.request({
            method: 'GET',
            path: '/StockMarket/Quote',
            parameters: { quoteId },
            isValid: () => quoteId
        }),
        search: {
            /**
             * @param {{ keyword: string }}
             * @returns {Promise<import('./api-controller').Response<StockMarketQuoteContract[]>>}
            */
            get: ({ keyword }) => this.request({
                method: 'GET',
                path: '/StockMarket/Quote/Search',
                parameters: { keyword },
                isValid: () => keyword
            })
        },
        company: {
            /**
             * @param {{ quoteId: number }}
             * @returns {Promise<import('./api-controller').Response<StockMarketQuoteCompanyContract>>}
            */
            get: ({ quoteId }) => this.request({
                method: 'GET',
                path: '/StockMarket/Quote/Company',
                parameters: { quoteId },
                isValid: () => quoteId,
                onSuccess: (company) => prepare.quoteCompany(company)
            })
        },
        price: {
            /**
             * @param {{ quoteId: number }}
             * @returns {Promise<import('./api-controller').Response<StockMarketQuotePriceContract>>}
            */
            get: ({ quoteId }) => this.request({
                method: 'GET',
                path: '/StockMarket/Quote/Price',
                parameters: { quoteId },
                isValid: () => quoteId,
                onSuccess: (price) => prepare.quotePrice(price)
            })
        },
        candles: {
            /**
             * @param {{ quoteId: number, timeframeId: number }}
             * @returns {Promise<import('./api-controller').Response<StockMarketQuoteCandleContract[]>>}
            */
            get: ({ quoteId, timeframeId }) => this.request({
                method: 'GET',
                path: '/StockMarket/Quote/Candles',
                parameters: { quoteId, timeframeId },
                isValid: () => quoteId && timeframeId,
                onSuccess: (candles) => candles.forEach(candle => prepare.quoteCandle(candle))
            })
        },
        emotion: {
            counts: {
                /**
                 * @param {{ quoteId: number }}
                 * @returns {Promise<import('./api-controller').Response<StockMarketQuoteEmotionCountContract[]>>}
                */
                get: ({ quoteId }) => this.request({
                    method: 'GET',
                    path: '/StockMarket/Quote/Emotion/Counts',
                    parameters: { quoteId },
                    isValid: () => quoteId
                })
            },
            /**
             * @param {{ quoteId: number, emotionId: number }}
             * @returns {Promise<import('./api-controller').Response<StockMarketQuoteUserEmotionContract>>}
            */
            post: ({ quoteId, emotionId }) => this.request({
                method: 'POST',
                path: '/StockMarket/Quote/UserEmotion',
                parameters: { quoteId, emotionId },
                isValid: () => quoteId && emotionId,
                onSuccess: (quoteUserEmotion) => prepare.quoteUserEmotion(quoteUserEmotion)
            })
        },
        userAlert: {
            search: {
                /**
                 * @param {{ alertTypeId: number, userId: number, quoteId: number }}
                 * @returns {Promise<import('./api-controller').Response<StockMarketQuoteUserAlertContract[]>>}
                */
                get: ({ alertTypeId, userId, quoteId }) => this.request({
                    method: 'GET',
                    path: '/StockMarket/Quote/UserAlert/Search',
                    parameters: { alertTypeId, userId, quoteId },
                    onSuccess: (quoteUserAlerts) => quoteUserAlerts.forEach(quoteUserAlert => prepare.quoteUserAlert(quoteUserAlert))
                })
            },
            /**
             * @param {{ quoteId: number, sell: number, stopLoss: number }}
             * @returns {Promise<import('./api-controller').Response<StockMarketQuoteUserAlertContract>>}
            */
            post: ({ quoteId, sell, stopLoss }) => this.request({
                method: 'POST',
                path: '/StockMarket/Quote/UserAlert',
                parameters: { quoteId, sell, stopLoss },
                isValid: () => quoteId && sell > 0.000001 && stopLoss > 0.000001,
                onSuccess: (quoteUserAlert) => prepare.quoteUserAlert(quoteUserAlert)
            }),
            /**
             * @param {{ quoteUserAlertId: number }}
             * @returns {Promise<import('./api-controller').Response<StockMarketQuoteUserAlertContract>>}
            */
            put: ({ quoteUserAlertId }) => this.request({
                method: 'PUT',
                path: '/StockMarket/Quote/UserAlert',
                parameters: { quoteUserAlertId },
                isValid: () => quoteUserAlertId,
                onSuccess: (quoteUserAlert) => prepare.quoteUserAlert(quoteUserAlert)
            })
        },
        userConfiguration: {
            /**
             * @param {{ quoteId: number }}
             * @returns {Promise<import('./api-controller').Response<StockMarketQuoteUserConfigurationContract>>}
            */
            get: ({ quoteId }) => this.request({
                method: 'GET',
                path: '/StockMarket/Quote/UserConfiguration',
                parameters: { quoteId },
                isValid: () => quoteId
            })
        }
    };

    static configuration = {
        /**
         * @returns {Promise<import('./api-controller').Response<StockMarketConfigurationContract>>}
        */
        get: () => this.request({
            method: 'GET',
            path: '/StockMarket/Configuration'
        })
    };

    static user = {
        /**
         * @param {{ userId: number }}
         * @returns {Promise<import('./api-controller').Response<StockMarketUserContract>>}
        */
        get: ({ userId }) => this.request({
            method: 'GET',
            path: '/StockMarket/User',
            parameters: { userId },
            onSuccess: (profile) => prepare.profile(profile)
        })
    };
}

export class StockMarketAsset extends ApiController {
    static extra = {
        stockTwitsLogo: this.storage.library('/stock-market/extra/stocktwits-logo.png')
    }
}