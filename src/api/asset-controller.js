import ApiController from './api-controller';

export class Asset extends ApiController {
    static file = {
        xlsx: this.storage.asset('/file/xlsx.png'),
        json: this.storage.asset('/file/json.png'),
        csv: this.storage.asset('/file/csv.png'),
        sql: this.storage.asset('/file/sql.png')
    }

    static technology = {
        bitbucket: this.storage.asset('/technology/bitbucket.svg'),
        git: this.storage.asset('/technology/git.svg'),
        jira: this.storage.asset('/technology/jira.svg'),
        netCore: this.storage.asset('/technology/net-core.svg'),
        react: this.storage.asset('/technology/react.svg'),
        sqlServer: this.storage.asset('/technology/sql-server.svg'),
        teams: this.storage.asset('/technology/teams.svg'),
        visualStudioCode: this.storage.asset('/technology/visual-studio-code.svg'),
        visualStudio: this.storage.asset('/technology/visual-studio.svg'),
        excel: this.storage.asset('/technology/excel.svg'),
        lucidchart: this.storage.asset('/technology/lucidchart.svg'),
        chrome: this.storage.asset('/technology/chrome.svg'),
        github: this.storage.asset('/technology/github.svg'),
        linkedin: this.storage.asset('/technology/linkedin.svg')
    }
}