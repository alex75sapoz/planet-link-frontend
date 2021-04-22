export const cache = {
    /**
     * @param {number} userTypeId
     * @returns {string}
    */
    userSessionTokenKey: (userTypeId) => `{session}.{token}.{userTypeId:${userTypeId}}`,
    /**
     * @param {import('dayjs').Dayjs} expiresOn
    */
    userSessionCookieOptions: (expiresOn) => ({
        path: '/',
        expires: expiresOn?.toDate(),
        domain: window.location.host.replace(`${window.location.host.split('.')[0]}.`, ''),
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict'
    })
}

export const interval = {
    authenticateInMilliseconds: 300000
}