/**@type {UserSessionContract} */
export const guestSession = {
    token: undefined,
    tokenExpiresOn: undefined,
    user: {
        userId: 0,
        isGuest: true,
        type: {
            typeId: 0,
            name: 'Guest'
        }
    }
}

export const apiHeader = {
    token: 'api-token',
    code: 'api-code',
    userTypeId: 'api-userTypeId',
    subdomain: 'api-subdomain',
    page: 'api-page',
    timezoneId: 'api-timezoneId'
}

/**@type {UserSessionContract} */
export var userSession = guestSession;

/**@param {UserSessionContract} newUserSession */
export function setUserSession(newUserSession) {
    userSession = newUserSession;
}