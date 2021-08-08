import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import cn from 'classnames';

import { page as weatherPage } from '../../weather/main/configuration';
import { page as stockMarketPage } from '../../stock-market/main/configuration';

import style from './style.module.scss';

export default function Main() {
    const navigate = useNavigate();

    return (
        <Container className='ps-0 pe-0'>
            <Row>
                <Col>
                    <p className={cn(style.logo, 'fs-4 fw-bold fst-italic text-center p-4')}>- - L S K - -</p>
                </Col>
            </Row>
            <Row className='gy-3'>
                <Col>
                    <p onClick={() => navigate(`/${weatherPage}`)} className={cn(style.page, 'fs-5 fw-bold text-center p-3')}>Weather</p>
                </Col>
                <Col>
                    <p onClick={() => navigate(`/${stockMarketPage}`)} className={cn(style.page, 'fs-5 fw-bold text-center p-3')}>Quotes</p>
                </Col>
            </Row>
            <Row className='pt-5'>
                <Col>
                    <p className={cn(style.text, 'fw-bold fs-4 text-center')}>
                        Welcome!
                    </p>
                </Col>
            </Row>
            <Row className='pt-5'>
                <Col>
                    <p className={cn(style.description, 'fw-bold fs-5 text-center')}>
                        This website contains projects that will target an existing community and
                        hopefully ease their daily browsing. This can create
                        a place where communities can meet and explore other communities
                        that they find interesting. Exploring can increase a community's popularity
                        and help them grow.
                    </p>
                </Col>
            </Row>
            <Row className='pt-5 pb-5'>
                <Col>
                    <p className={cn(style.description, 'fw-bold fs-5 text-center')}>
                        Feel Free to Explore!
                    </p>
                </Col>
            </Row>
        </Container>
    )
}