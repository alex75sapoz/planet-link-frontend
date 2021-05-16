import { Fragment, useEffect, useMemo, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Emoji from 'a11y-react-emoji';
import cn from 'classnames';

import { technologyStackEnum } from '../../../../library/programming/programming-enum';

import ProgrammingController from '../../../../api/programming-controller';

import Loader from '../../../../library/base/base-loader';

import style from './style.module.scss';
import ProgrammingProject from '../../../../library/programming/programming-project';

export default function HomeMain() {
    /**@type {[Data, React.Dispatch<React.SetStateAction<Data>>]} */
    const [data, setData] = useState({});
    /**@type {[ProgrammingProjectTypeContract, React.Dispatch<React.SetStateAction<ProgrammingProjectTypeContract>>]} */
    const [selectedProjectType, setSelectedProjectType] = useState(undefined);
    /**@type {[ProgrammingLanguageContract, React.Dispatch<React.SetStateAction<ProgrammingLanguageContract>>]} */
    const [selectedLanguage, setSelectedLanguage] = useState(undefined);
    /**@type {[ProgrammingJobContract, React.Dispatch<React.SetStateAction<ProgrammingJobContract>>]} */
    const [selectedJob, setSelectedJob] = useState(undefined);
    /**@type {[ProgrammingTechnologyStackContract, React.Dispatch<React.SetStateAction<ProgrammingTechnologyStackContract>>]} */
    const [selectedTechnologyStack, setSelectedTechnologyStack] = useState(undefined);
    /**@type {[ProgrammingProjectContract, React.Dispatch<React.SetStateAction<ProgrammingProjectContract>>]} */
    const [selectedProject, setSelectedProject] = useState(undefined);

    //Step 1
    //Load configuration
    useEffect(() => {
        var isDisposed = false;

        const load = async () => {
            const [
                configurationResponse
            ] = await Promise.all([
                ProgrammingController.configuration.get()
            ]);

            if (isDisposed) return;

            setData((data) => ({
                ...data,
                configuration: configurationResponse.data,
                isConfigurationLoaded: true
            }));
        };

        const dispose = () => {
            isDisposed = true;
            setData((data) => ({ ...data, configuration: undefined, isConfigurationLoaded: false }));
        };

        load();
        return dispose;
    }, []);

    //Step 2
    //Load projects
    useEffect(() => {
        if (!data.configuration) return;

        var isDisposed = false;

        const load = async () => {
            setSelectedProject(undefined);

            const [
                projectsResponse
            ] = await Promise.all([
                ProgrammingController.project.search.get({
                    projectTypeId: selectedProjectType?.typeId,
                    languageId: selectedLanguage?.languageId,
                    jobId: selectedJob?.jobId,
                    technologyStackId: selectedTechnologyStack?.technologyStackId
                })
            ]);

            if (isDisposed) return;

            setData((data) => ({
                ...data,
                projects: projectsResponse.data,
                isProjectsLoaded: true
            }));
        };

        const dispose = () => {
            isDisposed = true;
            setData((data) => ({
                ...data,
                projects: undefined,
                isProjectsLoaded: false
            }));
        };

        load();
        return dispose;
    }, [data.configuration, selectedProjectType, selectedLanguage, selectedJob, selectedTechnologyStack]);

    const metadata = useMemo(() => ({
        filters: {
            isReady: Boolean(data.configuration)
        },
        projects: {
            isReady: Boolean(data.configuration),
            container: {
                isReady: data.isProjectsLoaded && data.projects,
                isLoading: !data.isProjectsLoaded,
                isError: data.isProjectsLoaded && !data.projects
            }
        }
    }), [data.configuration, data.isProjectsLoaded, data.projects]);

    return (
        <Fragment>
            <Container className='ps-0 pe-0'>
                <Row>
                    <Col>
                        <p className={cn(style.name, 'fs-4 fw-bold fst-italic text-center p-4')}>Alex Sapozhnikov</p>
                    </Col>
                </Row>
            </Container>
            {metadata.filters.isReady &&
                <Container className='ps-0 pe-0 pt-3 pb-3'>
                    <Row className='gy-3 gx-3 pb-3'>
                        <Col xs={3} md={2}>
                            <p className={cn(style.filterName, 'fw-bold')}>Job</p>
                        </Col>
                        {data.configuration.jobs.map((job) =>
                            <Col xs={3} md={2} key={job.jobId}>
                                <p
                                    className={cn(style.filter, { [style.active]: selectedJob?.jobId === job.jobId }, 'fw-bold')}
                                    onClick={() => selectedJob?.jobId === job.jobId
                                        ? setSelectedJob(undefined)
                                        : setSelectedJob(job)
                                    }
                                >
                                    {job.name}
                                </p>
                            </Col>
                        )}
                    </Row>
                    <Row className='gy-3 gx-3 pb-3'>
                        <Col xs={3} md={2}>
                            <p className={cn(style.filterName, 'fw-bold')}>Tech Stack</p>
                        </Col>
                        {data.configuration.technologyStacks.map((technologyStack) =>
                            <Col xs={3} md={2} key={technologyStack.technologyStackId}>
                                <p
                                    className={cn(style.filter,
                                        {
                                            [style.active]: selectedTechnologyStack?.technologyStackId === technologyStack.technologyStackId,
                                            [style.filterFrontend]: technologyStack.technologyStackId === technologyStackEnum.frontend,
                                            [style.filterBackend]: technologyStack.technologyStackId === technologyStackEnum.backend,
                                            [style.filterFull]: technologyStack.technologyStackId === technologyStackEnum.full
                                        }, 'fw-bold')
                                    }
                                    onClick={() => selectedTechnologyStack?.technologyStackId === technologyStack.technologyStackId
                                        ? setSelectedTechnologyStack(undefined)
                                        : setSelectedTechnologyStack(technologyStack)
                                    }
                                >
                                    {technologyStack.name}
                                </p>
                            </Col>
                        )}
                    </Row>
                    <Row className={cn(style.mobileFilter, 'gy-3 gx-3 pb-3')}>
                        <Col xs={4} md={2}>
                            <p className={cn(style.filterName, 'fw-bold')}>Project Type</p>
                        </Col>
                        {data.configuration.projectTypes.map((projectType) =>
                            <Col md={2} key={projectType.typeId}>
                                <p
                                    className={cn(style.filter, { [style.active]: selectedProjectType?.typeId === projectType.typeId }, 'fw-bold')}
                                    onClick={() => selectedProjectType?.typeId === projectType.typeId
                                        ? setSelectedProjectType(undefined)
                                        : setSelectedProjectType(projectType)
                                    }
                                >
                                    {projectType.name}
                                </p>
                            </Col>
                        )}
                    </Row>
                    <Row className={cn(style.mobileFilter, 'gy-3 gx-3')}>
                        <Col xs={4} md={2}>
                            <p className={cn(style.filterName, 'fw-bold')}>Language</p>
                        </Col>
                        {data.configuration.languages.map((language) =>
                            <Col md={2} key={language.languageId}>
                                <p
                                    className={cn(style.filter, { [style.active]: selectedLanguage?.languageId === language.languageId }, 'fw-bold')}
                                    onClick={() => selectedLanguage?.languageId === language.languageId
                                        ? setSelectedLanguage(undefined)
                                        : setSelectedLanguage(language)
                                    }
                                >
                                    {language.name}
                                </p>
                            </Col>
                        )}
                    </Row>
                </Container>
            }
            {metadata.projects.isReady &&
                <Container className={cn(style.projectContainer, 'p-3 position-relative')}>
                    {metadata.projects.container.isReady &&
                        <Fragment>
                            {!selectedProject &&
                                <Row className='gy-3 gx-3'>
                                    {data.projects.map((project) =>
                                        <Col key={project.projectId} xs={4} md={3} lg={2}>
                                            <div
                                                className={cn(style.projectTile, {
                                                    [style.projectFrontend]: project.technologyStack.technologyStackId === technologyStackEnum.frontend,
                                                    [style.projectBackend]: project.technologyStack.technologyStackId === technologyStackEnum.backend,
                                                    [style.projectFull]: project.technologyStack.technologyStackId === technologyStackEnum.full,
                                                })}
                                                key={project.projectId}
                                                onClick={() => setSelectedProject(project)}
                                            >
                                                <p className='fw-bold'>
                                                    {project.tag}
                                                </p>
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            }
                            {selectedProject &&
                                <Fragment>
                                    <Row className='position-absolute'>
                                        <i
                                            onClick={() => setSelectedProject(undefined)}
                                            className={cn(style.arrow, 'fas fa-long-arrow-alt-left align-middle ms-lg-4 ms-md-2')}
                                        />
                                    </Row>
                                    <Row className='ps-3 pe-3'>
                                        <ProgrammingProject project={selectedProject} />
                                    </Row>
                                </Fragment>
                            }
                        </Fragment>
                    }
                    {metadata.projects.container.isLoading &&
                        <Loader isRelative={true} height={200} />
                    }
                    {metadata.projects.container.isError &&
                        <p className={cn(style.error, 'fs-4 fw-bold text-center')}>
                            Problem loading projects
                        <br />
                            Try refreshing in a few seconds <Emoji symbol='😐' label='sad' />
                        </p>
                    }
                </Container>
            }
            <div className='mb-5'></div>
        </Fragment>
    )
}

/**Data
 * @typedef Data
 * @property {ProgrammingConfigurationContract} configuration
 * @property {ProgrammingProjectContract[]} projects
 * @property {boolean} isConfigurationLoaded
 * @property {boolean} isProjectsLoaded
*/