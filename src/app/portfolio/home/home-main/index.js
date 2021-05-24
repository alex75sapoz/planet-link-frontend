import React, { Fragment, useEffect, useMemo, useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Emoji from 'a11y-react-emoji';
import cn from 'classnames';

import { technologyStackEnum } from '../../../../library/programming/programming-enum';

import ProgrammingController, { ProgrammingAsset } from '../../../../api/programming-controller';
import { Asset } from '../../../../api/asset-controller';

import Loader from '../../../../library/base/base-loader';
import ProgrammingProject from '../../../../library/programming/programming-project';

import style from './style.module.scss';

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
    const [projectsContainerScrollPosition, setProjectsContainerScrollPosition] = useState(0);

    /**@type {React.MutableRefObject<HTMLDivElement>} */
    const projectsContainer = useRef(undefined);

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

    useEffect(() => {
        if (!projectsContainer.current || selectedProject) return;

        projectsContainer.current.scrollTop = projectsContainerScrollPosition;
    }, [selectedProject, projectsContainerScrollPosition])

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
        },
        loader: {
            isReady: !data.isConfigurationLoaded
        },
        error: {
            isReady: data.isConfigurationLoaded && !data.configuration
        }
    }), [data.isConfigurationLoaded, data.configuration, data.isProjectsLoaded, data.projects]);

    return (
        <Fragment>
            {/* Name */}
            <Container className='ps-0 pe-0'>
                <Row>
                    <Col>
                        <p className={cn(style.name, 'fs-2 fw-bold fst-italic text-center p-4')}>- - Alex Sapozhnikov - -</p>
                    </Col>
                </Row>
            </Container>

            {/* Contact */}
            <Container>
                <Row className='pb-3'>
                    <Col>
                        <div className='d-flex justify-content-center'>
                            <a href='https://www.linkedin.com/in/alex-sapozhnikov-7449081b8' rel='noopener noreferrer' target='_blank' className={cn(style.imageContainer, style.imageHover, 'm-3')}>
                                <img src={Asset.technology.linkedin} style={{ padding: '5px' }} height={40} alt='' />
                                <p>LinkedIn</p>
                            </a>
                            <a href='https://lsk.planet-link.com' rel='noopener noreferrer' target='_blank' className={cn(style.imageContainer, style.imageHover, 'm-3')}>
                                <img src={Asset.technology.planetLink} style={{ padding: '5px' }} height={40} alt='' />
                                <p>LSK</p>
                                <p className={cn(style.personalSite)}>
                                    Personal
                                    <br />
                                    Website
                                </p>
                            </a>
                            <a href='https://github.com/SovietAlex' rel='noopener noreferrer' target='_blank' className={cn(style.imageContainer, style.imageHover, 'm-3')}>
                                <img src={Asset.technology.github} style={{ padding: '5px' }} height={40} alt='' />
                                <p>Github</p>
                            </a>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className='d-flex justify-content-center'>
                            <a href={ProgrammingAsset.resume.alexSapozhnikovResume} rel='noopener noreferrer' target='_blank' className={cn(style.resumeContainer)}>
                                <p className={cn(style.resume, 'fs-3 ps-3 pe-3 m-auto fw-bold text-center')}>Resume</p>
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>

            <div className='mb-4' />

            {/*Bio */}
            <Container className={cn(style.container, 'p-3')}>

                {/* Bio Description*/}
                <Container className='ps-0 pe-0'>
                    <Row className='pb-3'>
                        <Col>
                            <p className={cn(style.bioDescription, 'fs-6 fw-bold text-left')}>
                                My name is Alex. I grew up in Moldova, a country that consumes the most alcohol per capita.
                                But don't worry, I drink apple juice.
                                Growing up, I liked building designs from a blueprint and playing sports such as swimming, tennis, and soccer.
                                I enjoyed soccer and tennis the most because of the ability to interpret a player's move and use that to my advantage.
                                When I was 10, I moved to the United States of America near the suburbs of Chicago.
                                I still remember the feeling I had when I saw a skyscraper for the very first time.
                                I started liking working on projects when I was in High School, and around that time, I got involved with programming.
                                I developed many different projects like games, android apps, console apps, and scripts. Each project kept improving my skills, and I always want to do another one.
                                I like solving problems, learning about solutions, and I mostly enjoy seeing someone use my application.
                                Don't you love hearing someone say, "That looks cool! Did you do that?"
                                </p>
                            <p className={cn(style.bioDescription, 'fs-6 pt-3 fw-bold text-center')}>
                                If you search "Sapozhnikov meaning" in google, you will discover an interesting fact!
                                </p>
                        </Col>
                    </Row>
                </Container>

                <div className='mb-2' />

                {/* Bio Stats */}
                <Container className='ps-0 pe-0'>
                    <Row className='gy-3 gx-3'>
                        <Col xs={12} md={6}>
                            <div className={cn(style.bioContainer, 'text-center h-100 ps-0 pe-0 pt-2 pb-2')}>
                                <Row>
                                    <Col>
                                        <p className={cn(style.bioTitle, 'fs-4 fw-bold pb-2')}>Skill</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6} md={4}>
                                        <p className={cn(style.bioName, 'fs-6 fw-bold')}>Language</p>
                                        <p className={cn(style.bioValue, 'fs-6 fw-bold')}>English</p>
                                        <p className={cn(style.bioValue, 'fs-6 fw-bold')}>Russian</p>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <p className={cn(style.bioName, 'fs-6 fw-bold')}>Sport</p>
                                        <p className={cn(style.bioValue, 'fs-6 fw-bold')}>Tennis</p>
                                        <p className={cn(style.bioValue, 'fs-6 fw-bold')}>Soccer</p>
                                    </Col>
                                    <Col xs={12} md={4} className='d-none d-md-block'>
                                        <p className={cn(style.bioName, 'fs-6 fw-bold')}>Music</p>
                                        <p className={cn(style.bioValue, 'fs-6 fw-bold')}>Piano</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col xs={12} md={6}>
                            <div className={cn(style.bioContainer, 'text-center h-100 ps-0 pe-0 pt-2 pb-2')}>
                                <Row>
                                    <Col>
                                        <p className={cn(style.bioTitle, 'fs-4 fw-bold pb-2')}>Personality</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6} md={4}>
                                        <p className={cn(style.bioName, 'fs-6 fw-bold')}>Social</p>
                                        <p className={cn(style.bioValue, 'fs-6 fw-bold')}>Funny</p>
                                        <p className={cn(style.bioValue, 'fs-6 fw-bold')}>Engaging</p>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <p className={cn(style.bioName, 'fs-6 fw-bold')}>Traits</p>
                                        <p className={cn(style.bioValue, 'fs-6 fw-bold')}>Listener</p>
                                        <p className={cn(style.bioValue, 'fs-6 fw-bold')}>Competitive</p>
                                    </Col>
                                    <Col xs={12} md={4} className='d-none d-md-block'>
                                        <p className={cn(style.bioName, 'fs-6 fw-bold')}>Work</p>
                                        <p className={cn(style.bioValue, 'fs-6 fw-bold')}>Fast Worker</p>
                                        <p className={cn(style.bioValue, 'fs-6 fw-bold')}>Fast Learner</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>

            <div className='mb-4' />

            {/*Projects */}
            <Container className={cn(style.container, 'p-3')}>
                {/* Title */}
                <Row className='pb-4'>
                    <Col>
                        <p className={cn(style.pageTitle, 'fs-2 fw-bold text-center')}>Projects</p>
                    </Col>
                </Row>

                {/* Filters */}
                {
                    metadata.filters.isReady &&
                    <Container className='ps-0 pe-0'>
                        {/* Jobs */}
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

                        {/* Tech Stacks */}
                        <Row className='gy-3 gx-3 pb-0 pb-md-3'>
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

                        {/* Project Types */}
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

                        {/* Languages */}
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

                <div className='mb-3' />

                {/* Projects */}
                {
                    metadata.projects.isReady &&
                    <Container ref={projectsContainer} className={cn(style.projectContainer, 'pt-3 position-relative')} onScroll={() => {
                        if (selectedProject) return;

                        setProjectsContainerScrollPosition(projectsContainer.current.scrollTop);
                    }}>
                        {
                            metadata.projects.container.isReady &&
                            <Fragment>

                                {/* Grid */}
                                {
                                    !selectedProject &&
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
                                                    onClick={() => {
                                                        setSelectedProject(project);
                                                        projectsContainer.current.scrollTop = 0;
                                                    }}
                                                >
                                                    <p className='fw-bold'>
                                                        {project.tag}
                                                    </p>
                                                    <p className={cn(style.projectTileYear, 'fw-bold')}>
                                                        {project.createdOn.format('YYYY')}
                                                    </p>
                                                    {project.isImportant && <i className={cn(style.projectTileStar, 'fas fa-star fw-bold')}></i>}
                                                </div>
                                            </Col>
                                        )}
                                    </Row>
                                }

                                {/* Project */}
                                {
                                    selectedProject &&
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
                        {
                            metadata.projects.container.isLoading &&
                            <Loader isRelative={true} height={300} />
                        }
                        {
                            metadata.projects.container.isError &&
                            <p className={cn(style.error, 'fs-4 fw-bold text-center')}>
                                Problem loading projects
                            <br />
                            Try refreshing in a few seconds <Emoji symbol='😐' label='sad' />
                            </p>
                        }
                    </Container>
                }
            </Container>

            <div className='mb-4' />

            {/* Work */}
            <Container className={cn(style.container, 'p-3')}>
                <Row className='pb-4'>
                    <Col>
                        <p className={cn(style.pageTitle, 'fs-2 fw-bold text-center')}>Work</p>
                    </Col>
                </Row>
                <Row className='gx-3 gy-3'>
                    <Col xs={3}>
                        <div className={style.imageContainer}>
                            <img src={Asset.technology.bitbucket} style={{ padding: '5px' }} height={40} alt='' />
                            <p>Bitbucket</p>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div className={style.imageContainer}>
                            <img src={Asset.technology.jira} height={40} alt='' />
                            <p>Jira</p>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div className={style.imageContainer}>
                            <img src={Asset.technology.git} style={{ padding: '2px' }} height={40} alt='' />
                            <p>Git</p>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div className={style.imageContainer}>
                            <img src={Asset.technology.lucidchart} style={{ padding: '2px' }} height={40} alt='' />
                            <p>Lucid Chart</p>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div className={style.imageContainer}>
                            <img src={Asset.technology.visualStudio} style={{ padding: '3px' }} height={40} alt='' />
                            <p>Visual Studio</p>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div className={style.imageContainer}>
                            <img src={Asset.technology.visualStudioCode} style={{ padding: '3px' }} height={40} alt='' />
                            <p>Visual Studio Code</p>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div className={style.imageContainer}>
                            <img src={Asset.technology.teams} style={{ padding: '4px' }} height={40} alt='' />
                            <p>Teams</p>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div className={style.imageContainer}>
                            <img src={Asset.technology.excel} style={{ padding: '4px' }} height={40} alt='' />
                            <p>Excel</p>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div className={style.imageContainer}>
                            <img src={Asset.technology.netCore} height={40} alt='' />
                            <p>.Net Core</p>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div className={style.imageContainer}>
                            <img src={Asset.technology.sqlServer} height={40} alt='' />
                            <p>Sql Server</p>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div className={style.imageContainer}>
                            <img src={Asset.technology.react} height={40} alt='' />
                            <p>React</p>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div className={style.imageContainer}>
                            <img src={Asset.technology.chrome} style={{ padding: '3px' }} height={40} alt='' />
                            <p>Chrome</p>
                        </div>
                    </Col>
                </Row>
            </Container>

            <div className='mb-4' />

            {/* Ending */}
            <Container>
                <Row>
                    <Col className='text-center'>
                        <p className={cn(style.endingText, 'fs-3 fw-bold text-center')}>
                            Interested?
                            <br />
                            Want to work on a project together?
                            <br />
                            Send me a message!
                        </p>
                        <Emoji className='fs-3 fw-bold' symbol='😎' />
                    </Col>
                </Row>
            </Container>

            <div className='mb-4' />

            {/* Loader */}
            {
                metadata.loader.isReady &&
                <Loader isRelative={true} height={200} />
            }

            {/* Error */}
            {
                metadata.error.isReady &&
                <p className={cn(style.error, 'fs-4 fw-bold text-center pt-4')}>
                    Problem loading page configuration
                    <br />
                    Try refreshing in a few seconds <Emoji symbol='😐' label='sad' />
                </p>
            }
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