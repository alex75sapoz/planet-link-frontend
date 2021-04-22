import { Fragment, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import cn from 'classnames';

import Modal from '../base-modal';

import style from './style.module.scss';

/**@param {Props}*/
export default function GlobalArchiveViewer({
    sections
}) {
    /**@type {[Group, React.Dispatch<React.SetStateAction<Group>>]} */
    const [selectedGroup, setSelectedGroup] = useState(undefined);

    return (
        <Container className='ps-0 pe-0'>
            {sections.map((section, sectionIndex) =>
                <Fragment key={sectionIndex}>
                    <Row className='mb-3'>
                        <Col>
                            <p className={cn(style.section, 'fs-4 fw-bold text-center p-3')}>{section.name}</p>
                        </Col>
                    </Row>
                    {section.groups.map((groups, groupsIndex) =>
                        <Container key={groupsIndex} className='mb-5'>
                            <Row>
                                {groups.map((group, index) =>
                                    <Col key={index} xs={12 / groups.length} className='m-auto'>
                                        <p className={cn(style.title, 'fs-4 fw-bold text-center')}>{group.title}</p>
                                    </Col>
                                )}
                                {groups.map((group, index) =>
                                    <Col key={index} xs={12 / groups.length} className='m-auto'>
                                        <p className={cn(style.description, 'fw-bold text-center')}>{group.description}</p>
                                    </Col>
                                )}
                                {groups.map((group, index) =>
                                    <Col key={index} xs={12 / groups.length} className='m-auto'>
                                        <small className={cn(style.info, 'fw-normal text-center')}>{group.info}</small>
                                    </Col>
                                )}
                                {groups.map((group, index) =>
                                    <Col key={index} xs={12 / groups.length}>
                                        <div>
                                            <p onClick={() => setSelectedGroup(group)} className={cn(style.download, 'fw-bold text-center m-auto mt-2 pt-2 pb-2')}>Download</p>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </Container>
                    )}
                </Fragment>
            )}
            {selectedGroup &&
                <Modal onClose={() => setSelectedGroup(undefined)} title={selectedGroup.title} content={
                    <Container className={cn(style.fileContainer, 'pb-2 pt-2')}>
                        <Row>
                            {selectedGroup.archives.map((archive, index) =>
                                <Col key={index} xs={12 / selectedGroup.archives.length} className='g-4 m-auto'>
                                    <a onClick={() => setSelectedGroup(undefined)} href={archive.path} download={archive.name} className={style.file}>
                                        <img src={archive.icon} className='m-auto p-3' alt='' />
                                        <small className='fw-bold text-center'>{archive.name}</small>
                                    </a>
                                </Col>
                            )}
                        </Row>
                    </Container>}
                />
            }
        </Container>
    )
}

/**Props
 * @typedef Props
 * @property {Section[]} sections
*/

/**Section
 * @typedef Section
 * @property {string} name
 * @property {Group[][]} groups
*/

/**Group
 * @typedef Group
 * @property {string} title
 * @property {string} description
 * @property {string} info
 * @property {Archive[]} archives
*/

/**Archive
 * @typedef Archive
 * @property {string} path
 * @property {string} name
 * @property {string} icon
*/