import { Container, Row, Col } from 'react-bootstrap';
import cn from 'classnames';

import { WeatherAsset } from '../../../../api/weather-controller';

import style from './style.module.scss';

export default function WeatherContribution() {
    return (
        <Container className={style.container}>
            <Row>
                <Col className='ps-0 pe-0'>
                    <a href='https://openweathermap.org' rel='noopener noreferrer' target='_blank' className={style.link}>
                        <div className='text-center p-2'>
                            <p className={cn(style.title, 'fw-bold pb-2')}>Powered By</p>
                            <img className={style.logo} src={WeatherAsset.extra.openWeatherLogo} alt=''></img>
                        </div>
                    </a>
                </Col>
            </Row>
        </Container>
    )
}