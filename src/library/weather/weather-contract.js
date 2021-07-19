/**WeatherCityObservationContract
 * @typedef WeatherCityObservationContract
 * @property {string} title
 * @property {string} longTitle
 * @property {string} icon
 * @property {number} current
 * @property {number} feelsLike
 * @property {number} min
 * @property {number} max
 * @property {number} windSpeed
 * @property {number} windDegrees
 * @property {number} pressure
 * @property {number} humidity
 * @property {number} cloudiness
 * @property {number} rain
 * @property {number} snow
 * @property {import('dayjs').Dayjs} createdOn
 * @property {import('dayjs').Dayjs} sunriseOn
 * @property {import('dayjs').Dayjs} sunsetOn
*/

/**WeatherCityForecastContract
 * @typedef WeatherCityForecastContract
 * @property {string} title
 * @property {string} longTitle
 * @property {string} icon
 * @property {number} current
 * @property {number} feelsLike
 * @property {number} min
 * @property {number} max
 * @property {number} windSpeed
 * @property {number} windDegrees
 * @property {number} pressure
 * @property {number} humidity
 * @property {number} cloudiness
 * @property {number} rain
 * @property {number} snow
 * @property {import('dayjs').Dayjs} createdOn
 * @property {import('dayjs').Dayjs} sunriseOn
 * @property {import('dayjs').Dayjs} sunsetOn
*/

/**WeatherCityUserEmotionConfigurationContract
 * @typedef WeatherCityUserConfigurationContract
 * @property {number} selectionsToday
 * @property {number} limitToday
 * @property {WeatherEmotionContract} emotion
*/

/**WeatherConfigurationContract
 * @typedef WeatherConfigurationContract
 * @property {WeatherEmotionContract[]} emotions
*/

/**WeatherCityUserEmotionContract
 * @typedef WeatherCityUserEmotionContract
 * @property {number} cityUserEmotionId
 * @property {import('dayjs').Dayjs} createdOn
 * @property {LocationCityContract} city
 * @property {AccountUserContract} user
 * @property {WeatherEmotionContract} emotion
*/

/**WeatherCityUserEmotionCountContract
 * @typedef WeatherCityEmotionCountContract
 * @property {number} cityCount
 * @property {number} globalCount
 * @property {WeatherEmotionContract} emotion
*/

/**WeatherEmotionContract
 * @typedef WeatherEmotionContract
 * @property {number} emotionId
 * @property {string} name
 * @property {string} emoji
*/