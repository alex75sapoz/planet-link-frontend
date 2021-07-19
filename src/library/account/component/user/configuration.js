export const cache = {
    /**
     * @param {number} userTypeId
     * @returns {string}
    */
    userSessionTokenKey: (userTypeId) => `{userSession}.{token}.{userTypeId:${userTypeId}}`,
    /**
     * @param {import('dayjs').Dayjs} expiresOn
    */
    userSessionCookieOptions: (expiresOn) => ({
        path: '/',
        expires: expiresOn?.add(1, 'month').toDate(),
        domain: window.location.host.replace(`${window.location.host.split('.')[0]}.`, ''),
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict'
    })
}

export const interval = {
    authenticateInMilliseconds: 300000
}