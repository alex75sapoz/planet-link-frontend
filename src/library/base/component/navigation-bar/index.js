import { Fragment } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import cn from 'classnames';

import style from './style.module.scss';

/**@param {Props}*/
export default function NavigationBar({
    links
}) {
    const navigate = useNavigate();
    
    return (
        <Container className='pt-4 pb-5 ps-0 pe-0'>
            <Row className='gx-0'>
                {links.map((link, index) =>
                    <Fragment key={index}>
                        <div className={style.separator} />
                        <Col>
                            <p onClick={() => navigate(link.path)} className={cn(style.link, 'fw-bold text-center p-1')}>{link.name}</p>
                        </Col>
                        {index === links.length - 1 && <div className={style.separator} />}
                    </Fragment>
                )}
            </Row>
        </Container>
    )
}

/**Props
 * @typedef Props
 * @property {Link[]} links
*/

/**Link
 * @typedef Link
 * @property {string} path
 * @property {string} name
 */