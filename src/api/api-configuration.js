/**@type {AccountUserSessionContract} */
export const guestSession = {
    token: undefined,
    tokenExpiresOn: undefined,
    user: {
        userId: 0,
        isGuest: true,
        userType: {
            userTypeId: 0,
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

/**@type {AccountUserSessionContract} */
export var userSession = guestSession;

/**@param {AccountUserSessionContract} newUserSession */
export function setUserSession(newUserSession) {
    userSession = newUserSession;
}