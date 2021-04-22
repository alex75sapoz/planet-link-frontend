import dayjs from 'dayjs';

import { apiHeader } from './api-configuration';

import ApiController from './api-controller';

export const prepare = {
    /**@param {UserSessionContract} json */
    userSession: (json) => {
        json.tokenExpiresOn = dayjs(json.tokenExpiresOn);

        prepare.user(json.user)
    },
    /**@param {UserContract} json */
    user: (json) => {
        json.stocktwits && (json.stocktwits.createdOn = dayjs(json.stocktwits.createdOn));
    }
}

export default class UserController extends ApiController {
    static authenticate = {
        /**
         * @param {{ userTypeId: number, token: string, code: string, subdomain: string, page: string }}
         * @returns {Promise<import('./api-controller').Response<UserSessionContract>>}
        */
        get: ({ userTypeId, token, code, subdomain, page }) => this.request({
            method: 'GET',
            path: '/User/Authenticate',
            headers: {
                [apiHeader.userTypeId]: userTypeId,
                [apiHeader.token]: token,
                [apiHeader.code]: code,
                [apiHeader.subdomain]: subdomain,
                [apiHeader.page]: page
            },
            isValid: () => userTypeId && (token || (code && page && subdomain)) && !(token && code),
            onSuccess: (session) => prepare.userSession(session)
        })
    }

    static revoke = {
        /**
         * @returns {Promise<import('./api-controller').Response<undefined>>}
        */
        post: () => this.request({
            method: 'POST',
            path: '/User/Revoke'
        })
    }

    static consentUrl = {
        /**
         * @param {{ userTypeId: number, subdomain: string, page: string }}
         * @returns {Promise<import('./api-controller').Response<string>>}
        */
        get: ({ userTypeId, subdomain, page }) => this.request({
            method: 'GET',
            path: '/User/ConsentUrl',
            parameters: {
                userTypeId,
                subdomain,
                page
            },
            isValid: () => (userTypeId || userTypeId === 0) && page
        })
    }

    static stocktwits = {
        search: {
            /**
             * @param {{ keyword: string }}
             * @returns {Promise<import('./api-controller').Response<UserContract[]>>}
            */
            get: ({ keyword }) => this.request({
                method: 'GET',
                path: '/User/Stocktwits/Search',
                parameters: { keyword },
                isValid: () => keyword,
                onSuccess: (users) => users.forEach(user => prepare.user(user))
            })
        }
    }
}