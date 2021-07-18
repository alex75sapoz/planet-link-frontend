/**AccountUserSessionContract
 * @typedef AccountUserSessionContract
 * @property {string} token
 * @property {import('dayjs').Dayjs} tokenExpiresOn
 * @property {AccountUserContract} user
*/

/**AccountUserContract
 * @typedef AccountUserContract
 * @property {number} userId
 * @property {boolean} isGuest
 * @property {AccountUserTypeContract} userType
 * @property {AccountUserGoogleContract} google
 * @property {AccountUserStocktwitsContract} stocktwits
*/

/**AccountUserTypeContract
 * @typedef AccountUserTypeContract
 * @property {number} userTypeId
 * @property {string} name
*/

/**AccountUserGoogleContract
 * @typedef AccountUserGoogleContract
 * @property {string} name
 * @property {string} username
*/

/**AccountUserStocktwitsContract
 * @typedef AccountUserStocktwitsContract
 * @property {string} name
 * @property {string} username
 * @property {number} followersCount
 * @property {number} followingsCount
 * @property {number} postsCount
 * @property {number} likesCount
 * @property {number} watchlistQuotesCount
 * @property {import('dayjs').Dayjs} createdOn
*/