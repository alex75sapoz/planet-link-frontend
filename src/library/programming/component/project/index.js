import { Container, Row, Col } from 'react-bootstrap';
import cn from 'classnames';

import style from './style.module.scss';

/**@param {Params} */
export default function Project({
    project
}) {
    return (
        <Container className='ps-0 pe-0'>
            <Row className='pb-3 ps-5 pe-5'>
                <Col className={cn(style.name, 'fs-4 fw-bold text-center')}>
                    {project.name}
                </Col>
            </Row>
            <Row className='pb-3'>
                <Col className={cn(style.description, 'fs-6 fw-bold text-center')}>
                    {project.description}
                </Col>
            </Row>
            <Row className='pb-3'>
                <Col className={cn(style.createdOn, 'fs-6 fw-bold text-center')}>
                    <p>Created</p>
                    {project.createdOn.format('MM-DD-YYYY')}
                </Col>
            </Row>
            <Row className={cn(style.extraRow, 'pt-3')}>
                <Col xs={6} md={3} className={cn(style.extra, 'fs-6 fw-bold text-center')}>
                    <p className={style.extraName}>Project Type</p>
                    <p className={style.extraValue}>{project.projectType.name}</p>
                </Col>
                <Col xs={6} md={3} className={cn(style.extra, 'fs-6 fw-bold text-center')}>
                    <p className={style.extraName}>Tech Stack</p>
                    <p className={style.extraValue}>{project.technologyStack.name}</p>
                </Col>
                <Col xs={6} md={3} className={cn(style.extra, 'fs-6 pt-2 pt-md-0 fw-bold text-center')}>
                    <p className={style.extraName}>Job</p>
                    <p className={style.extraValue}>{project.job.name}</p>
                </Col>
                <Col xs={6} md={3} className={cn(style.extra, 'fs-6 pt-2 pt-md-0 fw-bold text-center')}>
                    <p className={style.extraName}>Language</p>
                    <p className={style.extraValue}>{project.languages.map(language => language.name).join(', ')}</p>
                </Col>
            </Row>
        </Container>
    )
}

/**Params
 * @typedef Params
 * @property {ProgrammingProjectContract} project
*/