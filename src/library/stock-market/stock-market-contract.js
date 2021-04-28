/**StockMarketAlertCompletedTypeContract
 * @typedef StockMarketAlertCompletedTypeContract
 * @property {number} alertCompletedTypeId
 * @property {string} name
*/

/**StockMarketAlertTypeContract
 * @typedef StockMarketAlertTypeContract
 * @property {number} alertTypeId
 * @property {string} name
*/

/**StockMarketEmotionContract
 * @typedef StockMarketEmotionContract
 * @property {number} emotionId
 * @property {string} name
 * @property {string} emoji
*/

/**StockMarketExchangeContract
 * @typedef StockMarketExchangeContract
 * @property {number} exchangeId
 * @property {string} name
*/

/**StockMarketGlobalContract
 * @typedef StockMarketGlobalContract
 * @property {boolean} isStockMarketOpen
 * @property {boolean} isEuronextMarketOpen
 * @property {boolean} isForexMarketOpen
 * @property {boolean} isCryptoMarketOpen
*/

/**StockMarketQuoteCandleContract
 * @typedef StockMarketQuoteCandleContract
 * @property {number} open
 * @property {number} high
 * @property {number} low
 * @property {number} close
 * @property {number} volume
 * @property {import('dayjs').Dayjs} createdOn
 * @property {number} timeframeMultiplier
 * @property {StockMarketQuoteUserAlertContract[]} quoteUserAlerts
*/

/**StockMarketQuoteCompanyContract
 * @typedef StockMarketQuoteCompanyContract
 * @property {string} name
 * @property {string} description
 * @property {string} exchange
 * @property {string} industry
 * @property {string} websiteUrl
 * @property {string} chiefExecutiveOfficer
 * @property {string} sector
 * @property {string} country
 * @property {number} employees
 * @property {string} phone
 * @property {string} address
 * @property {string} city
 * @property {string} state
 * @property {string} zipcode
 * @property {string} logoUrl
 * @property {number} beta
 * @property {import('dayjs').Dayjs} initialPublicOfferingOn
*/

/**StockMarketQuoteContract
 * @typedef StockMarketQuoteContract
 * @property {number} quoteId
 * @property {string} name
 * @property {string} symbol
 * @property {StockMarketExchangeContract} exchange
*/

/**StockMarketQuotePriceContract
 * @typedef StockMarketQuotePriceContract
 * @property {number} current
 * @property {number} currentChange
 * @property {number} currentChangePercent
 * @property {number} open
 * @property {number} openChange
 * @property {number} openChangePercent
 * @property {number} high
 * @property {number} highChange
 * @property {number} highChangePercent
 * @property {number} low
 * @property {number} lowChange
 * @property {number} lowChangePercent
 * @property {number} previousClose
 * @property {number} volume
 * @property {number} averageVolume
 * @property {number} fiftyDayMovingAverage
 * @property {number} twoHundredDayMovingAverage
 * @property {number} oneYearHigh
 * @property {number} oneYearLow
 * @property {number} marketCapitalization
 * @property {number} sharesOutstanding
 * @property {number} earningsPerShare
 * @property {number} priceToEarningsRatio
 * @property {import('dayjs').Dayjs} earningsPerShareAnnouncedOn
 * @property {import('dayjs').Dayjs} createdOn
 */

/**StockMarketQuoteUserAlertContract
 * @typedef StockMarketQuoteUserAlertContract
 * @property {number} quoteUserAlertId
 * @property {number} buy
 * @property {number} sell
 * @property {number} sellPoints
 * @property {number} stopLoss
 * @property {number} stopLossPoints
 * @property {import('dayjs').Dayjs} createdOn
 * @property {number} completedSell
 * @property {number} completedSellPoints
 * @property {import('dayjs').Dayjs} completedOn
 * @property {StockMarketQuoteContract} quote
 * @property {UserContract} user
 * @property {StockMarketAlertTypeContract} alertType
 * @property {StockMarketAlertCompletedTypeContract} alertCompletedType
*/

/**StockMarketQuoteUserEmotionConfigurationContract
 * @typedef StockMarketQuoteUserConfigurationContract
 * @property {number} selectionsToday
 * @property {number} limitToday
 * @property {StockMarketEmotionContract} emotion
*/

/**StockMarketConfigurationContract
 * @typedef StockMarketConfigurationContract
 * @property {StockMarketTimeframeContract[]} timeframes
 * @property {StockMarketAlertTypeContract[]} alertTypes
 * @property {StockMarketAlertCompletedTypeContract[]} alertCompletedTypes
 * @property {StockMarketExchangeContract[]} exchanges
 * @property {StockMarketEmotionContract[]} emotions
 * @property {StockMarketQuoteUserAlertRequirementConfigurationContract} quoteUserAlertRequirement
*/

/**StockMarketQuoteUserAlertRequirementConfigurationContract
 * @typedef StockMarketQuoteUserAlertRequirementConfigurationContract
 * @property {number} minimumFollowersCount
 * @property {number} minimumFollowingsCount
 * @property {number} minimumStocktwitsCreatedOnAgeInMonths
 * @property {number} minimumPostsCount
 * @property {number} minimumLikesCount
 * @property {number} minimumWatchlistQuotesCount
 * @property {number} maximumAlertsInProgressCount
*/

/**StockMarketQuoteUserEmotionContract
 * @typedef StockMarketQuoteUserEmotionContract
 * @property {number} quoteUserEmotionId
 * @property {import('dayjs').Dayjs} createdOn
 * @property {StockMarketQuoteContract} quote
 * @property {UserContract} user
 * @property {StockMarketEmotionContract} emotion
*/

/**StockMarketQuoteUserEmotionCountContract
 * @typedef StockMarketQuoteEmotionCountContract
 * @property {number} quoteCount
 * @property {number} globalCount
 * @property {StockMarketEmotionContract} emotion
*/

/**StockMarketTimeframeContract
 * @typedef StockMarketTimeframeContract
 * @property {number} timeframeId
 * @property {string} name
 * @property {number} prefix
 * @property {string} suffix
 * @property {number} multiplier
*/

/**StockMarketUserAlertTypeCountContract
 * @typedef StockMarketUserAlertTypeCountContract
 * @property {number} count
 * @property {number} points
 * @property {StockMarketAlertTypeContract} alertType
*/

/**StockMarketUserContract
 * @typedef StockMarketUserContract
 * @property {StockMarketUserAlertTypeCountContract[]} alertTypeCounts
 * @property {UserContract} user
*/