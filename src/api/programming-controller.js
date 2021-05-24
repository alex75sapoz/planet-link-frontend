import dayjs from 'dayjs';

import ApiController from './api-controller';

const prepare = {
    /**@param {ProgrammingProjectContract} json */
    project: (json) => {
        json.createdOn = dayjs(json.createdOn);
    }
}

export default class ProgrammingController extends ApiController {
    static configuration = {
        /**
         * @returns {Promise<import('./api-controller').Response<ProgrammingConfigurationContract>>}
         */
        get: () => this.request({
            method: 'GET',
            path: '/Programming/Configuration'
        })
    }

    static project = {
        search: {
            /**
             * @param {{ projectTypeId: number, languageId: number, jobId: number, technologyStackId: number }}
             * @returns {Promise<import('./api-controller').Response<ProgrammingProjectContract[]>>}
             */
            get: ({ projectTypeId, languageId, jobId, technologyStackId }) => this.request({
                method: 'GET',
                path: '/Programming/Project/Search',
                parameters: {
                    projectTypeId,
                    languageId,
                    jobId,
                    technologyStackId
                },
                onSuccess: (projects) => projects.forEach(project => prepare.project(project))
            })
        }
    }
}

export class ProgrammingAsset extends ApiController {
    static resume = {
        alexSapozhnikovResume: this.storage.library('/programming/resume/alex-sapozhnikov-resume.pdf')
    }
}