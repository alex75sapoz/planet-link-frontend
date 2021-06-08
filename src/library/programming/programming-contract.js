/**ProgrammingLanguageContract
 * @typedef ProgrammingLanguageContract
 * @property {number} languageId
 * @property {string} name
*/

/**ProgrammingJobContract
 * @typedef ProgrammingJobContract
 * @property {number} jobId
 * @property {string} name
*/

/**ProgrammingTechnologyStackContract
 * @typedef ProgrammingTechnologyStackContract
 * @property {number} technologyStackId
 * @property {string} name
*/

/**ProgrammingProjectTypeContract
 * @typedef ProgrammingProjectTypeContract
 * @property {number} projectTypeId
 * @property {string} name
*/

/**ProgrammingProjectContract
 * @typedef ProgrammingProjectContract
 * @property {number} projectId
 * @property {string} name
 * @property {string} description
 * @property {boolean} isImportant
 * @property {import('dayjs').Dayjs} createdOn
 * @property {ProgrammingProjectTypeContract} type
 * @property {ProgrammingJobContract} job
 * @property {ProgrammingTechnologyStackContract} technologyStack
 * @property {ProgrammingLanguageContract[]} languages
*/

/**ProgrammingConfigurationContract
 * @typedef ProgrammingConfigurationContract
 * @property {ProgrammingLanguageContract[]} languages
 * @property {ProgrammingJobContract[]} jobs
 * @property {ProgrammingTechnologyStackContract[]} technologyStacks
 * @property {ProgrammingProjectTypeContract[]} projectTypes
*/