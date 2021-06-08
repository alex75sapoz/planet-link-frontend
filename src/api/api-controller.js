import { apiHeader, userSession } from './api-configuration';

const apiServer = process.env.REACT_APP_API_SERVER;
const storageServer = process.env.REACT_APP_STORAGE_SERVER;

export default class ApiController {
    /**Request
     * @template TContract
     * @param {{ method: string, path: string, parameters: any, headers: any, onSuccess: (json: TContract) => void, isValid: () => any }}
     * @returns {Promise<Response<TContract>>}
    */
    static async request({ method, path, parameters, headers, onSuccess, isValid }) {
        if (isValid && !isValid()) {
            return {
                data: undefined,
                error: 'Request is invalid',
                isSuccess: false,
                isError: true,
                isBadRequest: true,
                isInternalServerError: false
            }
        }

        method = method || 'GET';
        parameters = { ...parameters };
        headers = { [apiHeader.userTypeId]: userSession.user.type.userTypeId, [apiHeader.token]: userSession.token, [apiHeader.timezoneId]: Intl.DateTimeFormat().resolvedOptions().timeZone, ...headers };

        parameters && Object.keys(parameters).forEach(key => (parameters[key] === undefined || parameters[key] === null || (Array.isArray(parameters[key]) && parameters[key].length === 0)) && delete parameters[key]);
        headers && Object.keys(headers).forEach(key => (headers[key] === undefined || headers[key] === null) && delete headers[key]);

        var queryString = Object.keys(parameters).map((key, index) =>
            (index === 0
                ? '?'
                : ''
            )
            +
            (Array.isArray(parameters[key])
                ? parameters[key].map((value) => `${key}=${encodeURIComponent(value)}`).join('&')
                : `${key}=${encodeURIComponent(parameters[key])}`
            )
        ).join('&');

        var url = apiServer + path + queryString;

        var response = undefined;
        var json = undefined;

        try {
            response = await fetch(url, { method, headers: new Headers(headers) });
            json = await response.json();
        }
        catch { }

        var isSuccess = Boolean(response && response.ok);
        var isBadRequest = Boolean(response && response.status === 400);
        var isInternalServerError = Boolean(response && response.status === 500);

        isSuccess && onSuccess && onSuccess(json);
        !isSuccess && typeof json !== 'string' && (json = 'Something went wrong');

        return {
            data: isSuccess
                ? json
                : undefined,
            error: !isSuccess && json,
            isSuccess: isSuccess,
            isError: !isSuccess,
            isBadRequest: isBadRequest,
            isInternalServerError: isInternalServerError
        }
    }

    static storage = {
        /**
         * @param {string} path
         * @returns {string}
        */
        asset: (path) => `${storageServer}/asset${path}`,

        /**
         * @param {string} path
         * @returns {string}
        */
        library: (path) => `${storageServer}/library${path}`
    }
}

/**Response
 * @template TContract
 * @typedef Response
 * @property {TContract} data
 * @property {string} error
 * @property {boolean} isSuccess
 * @property {boolean} isError
 * @property {boolean} isBadRequest
 * @property {boolean} isInternalServerError
*/