/**UserSessionContract
 * @typedef UserSessionContract
 * @property {string} token
 * @property {import('dayjs').Dayjs} tokenExpiresOn
 * @property {UserContract} user
*/

/**UserContract
 * @typedef UserContract
 * @property {number} userId
 * @property {boolean} isGuest
 * @property {UserTypeContract} type
 * @property {UserGoogleContract} google
 * @property {UserStocktwitsContract} stocktwits
*/

/**UserTypeContract
 * @typedef UserTypeContract
 * @property {number} userTypeId
 * @property {string} name
*/

/**UserGoogleContract
 * @typedef UserGoogleContract
 * @property {string} name
 * @property {string} username
*/

/**UserStocktwitsContract
 * @typedef UserStocktwitsContract
 * @property {string} name
 * @property {string} username
 * @property {number} followersCount
 * @property {number} followingsCount
 * @property {number} postsCount
 * @property {number} likesCount
 * @property {number} watchlistQuotesCount
 * @property {import('dayjs').Dayjs} createdOn
*/