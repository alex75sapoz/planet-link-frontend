import { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import cn from 'classnames';

import { WeatherAsset } from '../../../../api/weather-controller';

import { GeometryExtension as Geometry } from '../../../base/base-extension';

import style from './style.module.scss';

/**@param {Props}*/
export default function WeatherCityForecast({
    cityForecasts,
    thermometerScale
}) {
    const [selectedDayId, setSelectedDayId] = useState(-1);
    const [isThermometerLoaded, setIsThermometerLoaded] = useState(false);
    const data = useMemo(() => {
        /**@param {WeatherCityForecastContract} cityForecast */
        var getData = (cityForecast) => ({
            createdOn: cityForecast.createdOn,
            time: cityForecast.createdOn.format('h A'),
            weekday: cityForecast.createdOn.format('dddd'),
            condition: cityForecast.title,
            temperature: `${cityForecast.current.toFixed(0)}°F`,
            feelsLike: <div>Feels <b className={cityForecast.current > cityForecast.feelsLike ? style.cold : style.warm}>{cityForecast.current > cityForecast.feelsLike ? (cityForecast.current - cityForecast.feelsLike).toFixed(0) : (cityForecast.feelsLike - cityForecast.current).toFixed(0)}°F</b> {cityForecast.current > cityForecast.feelsLike ? `Colder` : `Warmer`}</div>,
            icon: WeatherAsset.condition(cityForecast.icon.toLowerCase()),
            humidityIcon: WeatherAsset.extra.humidity,
            windDirectionIcon: WeatherAsset.extra.windDirection,
            cloudinessIcon: WeatherAsset.extra.cloudiness,
            rainIcon: WeatherAsset.extra.rain,
            snowIcon: WeatherAsset.extra.snow,
            windSpeedIcon: WeatherAsset.extra.windSpeed,
            pressureIcon: WeatherAsset.extra.pressure,
            rain: `${cityForecast.rain.toFixed(2)} mm`,
            isSnowing: cityForecast.snow > 0,
            snow: `${cityForecast.snow.toFixed(2)} mm`,
            windSpeed: `${cityForecast.windSpeed.toFixed(0)} Mph`,
            windDirection: `${Geometry.getDegreesDirection(cityForecast.windDegrees)}`,
            pressure: `${cityForecast.pressure.toFixed(0)} hPa`,
            humidity: `${cityForecast.humidity.toFixed(0)}%`,
            cloudiness: `${cityForecast.cloudiness.toFixed(0)}%`
        });

        var days = cityForecasts.filter(day => day.createdOn.hour() === 15 || day.createdOn.hour() === 16 || day.createdOn.hour() === 17);
        var hours = cityForecasts.filter(hour => hour.createdOn.hour() >= 6 && days.map((day) => day.createdOn.day()).includes(hour.createdOn.day()));

        var thermometer = {
            scale: thermometerScale || 150,
            container: {
                marginTop: 35
            },
            text: {
                height: 20,
                margin: 5
            },
            longestThermometerHeight: 0,
            longestThermometerPaddingBottom: 0
        };

        var daysData = days.map((day) => {
            var dayHours = hours.filter(hour => hour.createdOn.day() === day.createdOn.day());

            var hoursTemperatures = hours.map((hour) => hour.current);
            var dayTemperatures = dayHours.map((hour) => hour.current);

            var weekMax = Math.max(...hoursTemperatures);
            var weekMin = Math.min(...hoursTemperatures);
            var weekDifference = weekMax - weekMin;
            var dayMax = Math.max(...dayTemperatures);
            var dayMin = Math.min(...dayTemperatures);
            var dayMaxPercentage = (dayMax - weekMin) / weekDifference;
            var dayMinPercentage = (dayMin - weekMin) / weekDifference;

            var thermometerData = {
                container: {
                    height: (thermometer.scale * (dayMaxPercentage - dayMinPercentage)) + (thermometer.scale * (1 - dayMaxPercentage)) + thermometer.container.marginTop + ((thermometer.text.height + thermometer.text.margin) * 2),
                    marginTop: thermometer.container.marginTop,
                    paddingTop: (thermometer.scale * (dayMaxPercentage - dayMinPercentage)) + (thermometer.scale * (1 - dayMaxPercentage)) + thermometer.container.marginTop + ((thermometer.text.height + thermometer.text.margin) * 2),
                    translateY: thermometer.scale * (1 - dayMaxPercentage)
                },
                thermometer: {
                    max: `${dayMax.toFixed(0)}°F`,
                    min: `${dayMin.toFixed(0)}°F`,
                    height: thermometer.scale * (dayMaxPercentage - dayMinPercentage),
                    text: {
                        height: thermometer.text.height,
                        margin: thermometer.text.margin
                    }
                }
            };

            thermometer.longestThermometerPaddingBottom = thermometer.longestThermometerHeight < thermometerData.container.height ? thermometerData.container.paddingTop : thermometer.longestThermometerPaddingBottom;
            thermometer.longestThermometerHeight = thermometer.longestThermometerHeight < thermometerData.container.height ? thermometerData.container.height : thermometer.longestThermometerHeight;

            return {
                ...getData(day),
                hoursData: dayHours.map(getData),
                thermometerData: thermometerData
            }
        });

        return {
            longestThermometerPaddingBottom: thermometer.longestThermometerPaddingBottom,
            daysData
        }
    }, [cityForecasts, thermometerScale])

    //Thermometer Animation
    useEffect(() => {
        if (isThermometerLoaded) return;

        var timeoutId;

        const load = () => {
            timeoutId = setTimeout(() =>
                setIsThermometerLoaded(true)
                , 50);
        };

        const dispose = () => {
            clearTimeout(timeoutId);
        }

        load();
        return dispose;
    }, [isThermometerLoaded])

    return (
        <Container className='ps-0 pe-0'>
            {selectedDayId === -1
                ?
                <Row style={{ paddingBottom: data.longestThermometerPaddingBottom }} className={cn(style.daysContainer, 'gx-3 gy-3 justify-content-center')}>
                    {data.daysData.map((dayData, index) =>
                        /*Day*/
                        <Col key={index} onClick={() => setSelectedDayId(index)} xs={6} md>
                            <Container className={cn(style.dayContainer, 'position-relative h-100 pt-3 pb-3 ps-0 pe-0')}>
                                {/*Weekday*/}
                                <Row>
                                    <Col>
                                        <p className={cn(style.weekday, 'fs-4 fw-bold text-center')}>{dayData.weekday}</p>
                                    </Col>
                                </Row>

                                {/*Condition*/}
                                <Row>
                                    <Col>
                                        <p className={cn(style.condition, 'fs-4 fw-bold text-center')}>{dayData.condition}</p>
                                    </Col>
                                </Row>

                                {/*Temperature*/}
                                <Row>
                                    <Col>
                                        <p className={cn(style.temperature, 'display-5 fw-bold text-center')}>{dayData.temperature}</p>
                                    </Col>
                                </Row>

                                {/*Icon*/}
                                <Row>
                                    <Col className='text-center pt-1'>
                                        <img src={dayData.icon} alt='' className={style.icon} />
                                    </Col>
                                </Row>

                                {/*Thermometer*/}
                                <Row className='d-none d-md-flex start-0 end-0 position-absolute text-center' style={{ height: 0, top: '100%', marginTop: dayData.thermometerData.container.marginTop }}>
                                    <div className={cn(style.thermometerContainer, 'd-flex flex-column')} style={{ transform: `translateY(${(isThermometerLoaded ? dayData.thermometerData.container.translateY : 0)}px)` }}>
                                        <p className={cn(style.thermometerMax, 'fw-bold')} style={{ height: dayData.thermometerData.thermometer.text.height, marginBottom: dayData.thermometerData.thermometer.text.margin }}>{dayData.thermometerData.thermometer.max}</p>
                                        <div className={style.thermometer} style={{ height: isThermometerLoaded ? dayData.thermometerData.thermometer.height : 0 }}></div>
                                        <p className={cn(style.thermometerMin, 'fw-bold')} style={{ height: dayData.thermometerData.thermometer.text.height, marginTop: dayData.thermometerData.thermometer.text.margin }}>{dayData.thermometerData.thermometer.min}</p>
                                    </div>
                                </Row>
                            </Container>
                        </Col>
                    )}
                </Row>
                :
                <Container className={cn(style.hourContainer, 'ps-4 pe-4 pt-2 pb-2')}>
                    <Row>
                        <Col>
                            {/*Header*/}
                            <Row className='position-relative pt-2'>
                                {/*Title*/}
                                <Col>
                                    <p className={cn(style.weekdayHour, 'fs-3 fw-bold text-center')}>{data.daysData[selectedDayId].weekday}</p>
                                </Col>

                                {/*Left Arrow*/}
                                <div className='position-absolute'>
                                    <i className={cn(style.arrow, 'fas fa-long-arrow-alt-left ps-1 pt-1')} onClick={() => {
                                        setSelectedDayId(-1);
                                        setIsThermometerLoaded(false);
                                    }} />
                                </div>
                            </Row>

                            {/*Table*/}
                            <Container className='pt-3 pb-3 ps-md-3 ps-1 pe-md-3 pe-1'>
                                {data.daysData[selectedDayId].hoursData.map((hourData, index) =>
                                    /*Hour*/
                                    <Row key={index} className={cn(style.hourContainer, 'p-1', { 'mb-4': index !== data.daysData[selectedDayId].hoursData.length - 1 })}>
                                        {/*Time*/}
                                        <Col xs={6} md={2} className='m-auto'>
                                            <p className={cn(style.time, 'fs-4 fw-bold text-center')}>{hourData.time}</p>
                                        </Col>

                                        {/*Condition*/}
                                        <Col xs={6} md={2} className='m-auto'>
                                            <p className={cn(style.condition, 'fs-4 fw-bold text-center')}>{hourData.condition}</p>
                                        </Col>

                                        {/*Temperature*/}
                                        <Col xs={12} md={4} className='m-auto'>
                                            <Row className='justify-content-center pt-2 pb-2'>
                                                <div className='w-auto pe-3'>
                                                    <p className={cn(style.temperature, 'display-5 fw-bold text-center')}>{hourData.temperature}</p>
                                                    <div className={cn(style.feelslike, 'fw-bold text-center')}>{hourData.feelsLike}</div>
                                                </div>
                                                <div className='w-auto align-self-center ps-3'>
                                                    <img src={hourData.icon} alt='' className={cn(style.icon, 'display-3 text-center')} />
                                                </div>
                                            </Row>
                                        </Col>

                                        {/*Extras*/}
                                        <Col xs={12} className='d-md-none'>
                                            <Row>
                                                <Col className='m-auto text-center'>
                                                    <img src={hourData.windSpeedIcon} alt='' width={25}></img>
                                                    <p className={cn(style.extra, 'd-inline-block fw-bold ps-2')}>{hourData.windSpeed}</p>
                                                </Col>
                                                <Col className='m-auto text-center'>
                                                    <img src={hourData.isSnowing ? hourData.snowIcon : hourData.rainIcon} alt='' width={20}></img>
                                                    <p className={cn(style.extra, 'd-inline-block fw-bold ps-2')}>{hourData.isSnowing ? hourData.snow : hourData.rain}</p>
                                                </Col>
                                                <Col className={cn(style.cloudiness_Col_Mobile, 'm-auto text-center')}>
                                                    <img src={hourData.cloudinessIcon} alt='' width={20}></img>
                                                    <p className={cn(style.extra, 'd-inline-block fw-bold ps-2')}>{hourData.cloudiness}</p>
                                                </Col>
                                            </Row>
                                        </Col>

                                        {/*Extras*/}
                                        <Col className={cn(style.extra_Col, 'text-start m-auto d-none d-md-block')}>
                                            <div className='pt-1'>
                                                <img src={hourData.windSpeedIcon} alt='' width={25}></img>
                                                <p className={cn(style.extra, 'd-inline-block fw-bold ps-2')}>{hourData.windSpeed}</p>
                                            </div>
                                            <div className='pt-1'>
                                                <img src={hourData.isSnowing ? hourData.snowIcon : hourData.rainIcon} alt='' width={20}></img>
                                                <p className={cn(style.extra, 'd-inline-block fw-bold ps-2')}>{hourData.isSnowing ? hourData.snow : hourData.rain}</p>
                                            </div>
                                            <div className='pt-1'>
                                                <img src={hourData.cloudinessIcon} alt='' width={20}></img>
                                                <p className={cn(style.extra, 'd-inline-block fw-bold ps-2')}>{hourData.cloudiness}</p>
                                            </div>
                                        </Col>

                                        {/*Extras*/}
                                        <Col xs={2} className={cn(style.extra2_Col, 'text-left m-auto d-none d-md-block')}>
                                            <div className='pt-1'>
                                                <img src={hourData.windDirectionIcon} alt='' width={20}></img>
                                                <p className={cn(style.extra, 'd-inline-block fw-bold ps-2')}>{hourData.windDirection}</p>
                                            </div>
                                            <div className='pt-1'>
                                                <img src={hourData.pressureIcon} alt='' width={18}></img>
                                                <p className={cn(style.extra, 'd-inline-block fw-bold ps-2')}>{hourData.pressure}</p>
                                            </div>
                                            <div className='pt-1'>
                                                <img src={hourData.humidityIcon} alt='' width={22}></img>
                                                <p className={cn(style.extra, 'd-inline-block fw-bold ps-2')}>{hourData.humidity}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                )}
                            </Container>
                        </Col>
                    </Row>
                </Container>
            }
        </Container>
    )
}

/**Props
 * @typedef Props
 * @property {WeatherCityForecastContract[]} cityForecasts
 * @property {number} thermometerScale
*/