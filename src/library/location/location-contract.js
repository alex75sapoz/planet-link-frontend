/**LocationCountryContract
 * @typedef LocationCountryContract
 * @property {string} countryId
 * @property {string} name
 * @property {string} twoLetterCode
 * @property {string} threeLetterCode
*/

/**LocationStateContract
 * @typedef LocationStateContract
 * @property {number} stateId
 * @property {string} name
 * @property {string} twoLetterCode
*/

/**LocationCityContract
 * @typedef LocationCityContract
 * @property {number} cityId
 * @property {string} name
 * @property {string} county
 * @property {string} zipcode
 * @property {number} latitude
 * @property {number} longitude
 * @property {LocationCountryContract} country
 * @property {LocationStateContract} state
*/