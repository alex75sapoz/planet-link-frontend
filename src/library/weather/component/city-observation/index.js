import { useState, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import cn from 'classnames';

import { WeatherAsset } from '../../../../api/weather-controller';

import { GeometryExtension as Geometry } from '../../../base/base-extension';

import style from './style.module.scss';

/**@param {Props}*/
export default function CityObservation({
    city,
    cityObservation
}) {
    const [isSummaryShown, setIsSummaryShown] = useState(false);
    const [summary, setSummary] = useState('');
    const data = useMemo(() => ({
        weekday: cityObservation.createdOn.format('dddd'),
        condition: cityObservation.longTitle,
        monthday: cityObservation.createdOn.format('MMMM DD'),
        link: `https://www.google.com/maps/search/?api=1&query=${city.name},${city.state ? `+${city.state.name},` : ''}+${city.country.name}`,
        country: city.country.name,
        state: city.state?.name || '',
        city: city.name,
        countryMobile: city.country.name,
        cityMobile: `${city.name}${city.state ? `, ${city.state.name}` : ''}`,
        latitude: `N ${city.latitude.toFixed(2)}°`,
        longitude: `W ${city.longitude.toFixed(2)}°`,
        temperature: `${cityObservation.current.toFixed(0)}°F`,
        feelsLike: <p>Feels <b className={cityObservation.current > cityObservation.feelsLike ? style.cold : style.warm}>{cityObservation.current > cityObservation.feelsLike ? (cityObservation.current - cityObservation.feelsLike).toFixed(0) : (cityObservation.feelsLike - cityObservation.current).toFixed(0)}°F</b> {cityObservation.current > cityObservation.feelsLike ? `Colder` : `Warmer`}</p>,
        icon: WeatherAsset.condition(cityObservation.icon.toLocaleLowerCase()),
        extras: [
            {
                text: `${cityObservation.humidity.toFixed(0)}%`,
                summary: `Humidity is ${cityObservation.humidity.toFixed(2)}%`,
                icon: WeatherAsset.extra.humidity,
                iconWidth: 22
            },
            {
                text: `${Geometry.getDegreesDirection(cityObservation.windDegrees)}`,
                summary: `Wind Direction is ${cityObservation.windDegrees.toFixed(2)}°`,
                icon: WeatherAsset.extra.windDirection,
                iconWidth: 20
            },
            {
                text: `${cityObservation.cloudiness.toFixed(0)}%`,
                summary: `Cloudiness is ${cityObservation.cloudiness.toFixed(2)}%`,
                icon: WeatherAsset.extra.cloudiness,
                iconWidth: 20
            },
            cityObservation.snow > 0
                ?
                {
                    text: `${cityObservation.snow.toFixed(2)} mm`,
                    summary: `Snow is ${cityObservation.snow.toFixed(2)} mm`,
                    icon: WeatherAsset.extra.snow,
                    iconWidth: 20
                }
                :
                {
                    text: `${cityObservation.rain.toFixed(2)} mm`,
                    summary: `Rain is ${cityObservation.rain.toFixed(2)} mm`,
                    icon: WeatherAsset.extra.rain,
                    iconWidth: 20
                },
            {
                text: `${cityObservation.windSpeed.toFixed(0)} Mph`,
                summary: `Wind Speed is ${cityObservation.windSpeed.toFixed(2)} Mph`,
                icon: WeatherAsset.extra.windSpeed,
                iconWidth: 25
            },
            {
                text: `${cityObservation.pressure.toFixed(0)} hPa`,
                summary: `Pressure is ${cityObservation.pressure.toFixed(2)} hPa`,
                icon: WeatherAsset.extra.pressure,
                iconWidth: 18
            }
        ]
    }), [city, cityObservation]);

    return (
        <Container className={cn(style.container, 'p-4')}>
            {/*Location*/}
            <Row className='d-md-none'>
                <Col>
                    <div className='d-flex justify-content-center'>
                        <a href={data.link} rel='noopener noreferrer' target='_blank' className={style.link}>
                            <p className='fw-bold text-center'>{data.countryMobile}</p>
                            <p className='fw-bold text-center'>{data.cityMobile}</p>
                        </a>
                    </div>
                </Col>
            </Row>

            {/*Date + Condition*/}
            <Row>
                <Col className='d-md-block d-none'>
                    <p className={cn(style.weekday, 'fs-4 fw-bold text-start')}>{data.weekday}</p>
                </Col>
                <Col>
                    <p className={cn(style.condition, 'fs-4 fw-bold text-center pt-md-0 pt-2 pb-md-0 pb-2')}>{data.condition}</p>
                </Col>
                <Col className='d-md-block d-none'>
                    <p className={cn(style.monthday, 'fs-4 fw-bold text-end')}>{data.monthday}</p>
                </Col>
            </Row>

            {/*Temperature + Location*/}
            <Row className='position-relative justify-content-center pt-md-2'>
                <div className='d-md-block d-none w-auto position-absolute end-0 text-end'>
                    <a href={data.link} rel='noopener noreferrer' target='_blank' className={style.link}>
                        <p className='fw-bold'>{data.city}</p>
                        <p className={cn('fw-bold', { 'd-none': !data.state })}>{data.state}</p>
                        <p className='fw-bold'>{data.country}</p>
                        <p className='fw-bold'>{data.latitude}</p>
                        <p className='fw-bold'>{data.longitude}</p>
                    </a>
                </div>
                <div className='w-auto p-md-3 pe-3'>
                    <p className={cn(style.temperature, 'display-3 fw-bold text-center')}>{data.temperature}</p>
                    <div className={cn(style.feelslike, 'fw-bold text-center')}>{data.feelsLike}</div>
                </div>
                <div className='w-auto align-self-center p-md-3 ps-3'>
                    <img src={data.icon} alt='' className={cn(style.icon, 'display-3 text-center')} />
                </div>
            </Row>

            {/*Extras*/}
            <Row className='pt-md-4 pt-3 gy-3'>
                {data.extras.map((extra, index) =>
                    <Col key={index} xs={6} md={4}>
                        <div
                            onClick={() => {
                                if (isSummaryShown && extra.summary === summary) {
                                    setIsSummaryShown(false)
                                } else {
                                    setSummary(extra.summary);
                                    setIsSummaryShown(true);
                                }
                            }}
                            className={cn(style.extra, 'text-center h-100 d-flex justify-content-center align-items-center p-2')}
                        >
                            <img src={extra.icon} width={extra.iconWidth} alt='' className={style.extraicon} />
                            <p className='d-inline-block fw-bold ps-md-1'>{extra.text}</p>
                        </div>
                    </Col>
                )}
            </Row>

            {/*Summary*/}
            <Row>
                <Col>
                    <div className={style.summary} style={{ height: isSummaryShown ? 45 : 0 }}>
                        <p className='fs-5 fw-bold text-center' style={{ transform: 'translateY(15px)' }}>{summary}</p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

/**Props
 * @typedef Props
 * @property {LocationCityContract} city
 * @property {WeatherCityObservationContract} cityObservation
*/