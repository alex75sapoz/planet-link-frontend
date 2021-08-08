import { useEffect, useMemo, useState, Fragment } from 'react';
import cn from 'classnames';
import Emoji from 'a11y-react-emoji';

import LocationController from '../../../../api/location-controller';
import WeatherController from '../../../../api/weather-controller';

import { StorageExtension as Storage, GeometryExtension as Geometry } from '../../../../library/base/base-extension';

import { page, cache, interval } from './configuration';

import { userTypeEnum } from '../../../../library/account/account-enum';

import Loader from '../../../../library/base/component/loader';
import EmotionCount from '../../../../library/base/component/emotion-count';
import LocationCityPicker from '../../../../library/location/component/city-picker';
import AccountUser from '../../../../library/account/component/user';
import WeatherCityObservation from '../../../../library/weather/component/city-observation';
import WeatherCityForecast from '../../../../library/weather/component/city-forecast';
import WeatherContribution from '../../../../library/weather/component/contribution';

import style from './style.module.scss';

export default function Main() {
    /**@type {[Data, React.Dispatch<React.SetStateAction<Data>>]} */
    const [data, setData] = useState({});
    /**@type {[LocationCityContract, React.Dispatch<React.SetStateAction<LocationCityContract>]} */
    const [selectedCity, setSelectedCity] = useState(undefined);

    //Step 1
    //Load city if possible and configuration
    useEffect(() => {
        if (!data.isUserLoaded) return;

        var isDisposed = false;

        const load = async () => {
            /**@type {LocationCityContract} */
            var cachedCity = Storage.get(cache.cityKey);

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    if (isDisposed) return;

                    var city;

                    //If cached city is within 5 miles then default to that city
                    if (cachedCity && cachedCity.cityId && cachedCity.latitude && cachedCity.longitude && Geometry.getDistanceInMiles(position.coords, cachedCity) < 5) {
                        city = (await LocationController.city.get({ cityId: cachedCity.cityId })).data; if (isDisposed) return;
                    } else {
                        city = (await LocationController.city.get({ latitude: position.coords.latitude, longitude: position.coords.longitude })).data; if (isDisposed) return;
                    }

                    if (!city) {
                        Storage.remove(cache.cityKey);
                    } else {
                        Storage.set(cache.cityKey, city);
                        setSelectedCity(city);
                    }

                    setData((data) => ({ ...data, isCityLoaded: true }));
                },
                async () => {
                    if (isDisposed) return;

                    if (cachedCity && cachedCity.cityId && cachedCity.latitude && cachedCity.longitude) {
                        var city = (await LocationController.city.get({ cityId: cachedCity.cityId })).data; if (isDisposed) return;
                        setSelectedCity(city);
                    }

                    setData((data) => ({ ...data, isCityLoaded: true }));
                }
            );

            var { data: configuration } = await WeatherController.configuration.get(); if (isDisposed) return;
            setData((data) => ({ ...data, configuration, isConfigurationLoaded: true }));
        };

        const dispose = () => {
            isDisposed = true;
            setSelectedCity(undefined);
            setData((data) => ({ ...data, configuration: undefined, isCityLoaded: false, isConfigurationLoaded: false }));
        };

        load();
        return dispose;
    }, [data.isUserLoaded]);

    //Step 2
    //Load required data related to the city
    useEffect(() => {
        if (!selectedCity || !data.configuration) return;

        var isDisposed = false, intervalIds = [];

        const load = async () => {
            const [
                cityObservationResponse,
                cityForecastsResponse,
                cityEmotionCountsResponse,
                cityUserConfigurationResponse,
            ] = await Promise.all([
                WeatherController.city.observation.get({ cityId: selectedCity.cityId }),
                WeatherController.city.forecasts.get({ cityId: selectedCity.cityId }),
                WeatherController.city.emotion.counts.get({ cityId: selectedCity.cityId }),
                !data.user.isGuest && WeatherController.city.userConfiguration.get({ cityId: selectedCity.cityId })
            ]);

            if (isDisposed) return;

            setData((data) => ({
                ...data,
                cityObservation: cityObservationResponse.data,
                cityForecasts: cityForecastsResponse.data,
                cityEmotionCounts: cityEmotionCountsResponse.data,
                cityUserConfiguration: cityUserConfigurationResponse?.data,
                isCityObservationLoaded: true,
                isCityForecastsLoaded: true,
                isCityEmotionCountsLoaded: true,
                isCityUserConfigurationLoaded: true,
            }));

            intervalIds = [
                setInterval(async () => {
                    const cityObservationResponse = await WeatherController.city.observation.get({ cityId: selectedCity.cityId }); if (isDisposed) return;
                    if (!cityObservationResponse.isSuccess) return;
                    setData((data) => ({ ...data, cityObservation: cityObservationResponse.data }));
                }, interval.cityObservationInMilliseconds),
                setInterval(async () => {
                    const cityForecastsResponse = await WeatherController.city.forecasts.get({ cityId: selectedCity.cityId }); if (isDisposed) return;
                    if (!cityForecastsResponse.isSuccess) return;
                    setData((data) => ({ ...data, cityForecasts: cityForecastsResponse.data }));
                }, interval.cityForecastsInMilliseconds),
                setInterval(async () => {
                    const cityEmotionCountsResponse = await WeatherController.city.emotion.counts.get({ cityId: selectedCity.cityId }); if (isDisposed) return;
                    if (!cityEmotionCountsResponse.isSuccess) return;
                    setData((data) => ({ ...data, cityEmotionCounts: cityEmotionCountsResponse.data }));
                }, interval.cityEmotionCountsInMilliseconds)
            ];
        };

        const dispose = () => {
            isDisposed = true;
            intervalIds.forEach(intervalId => clearInterval(intervalId));
            setData((data) => ({
                ...data,
                cityObservation: undefined,
                cityForecasts: undefined,
                cityUserConfiguration: undefined,
                cityEmotionCounts: undefined,
                isCityObservationLoaded: false,
                isCityForecastsLoaded: false,
                isCityUserConfigurationLoaded: false,
                isCityEmotionCountsLoaded: false
            }));
        }

        load();
        return dispose;
    }, [selectedCity, data.configuration, data.user]);

    const userComponent = useMemo(() =>
        <AccountUser
            userTypeId={userTypeEnum.google}
            page={page}
            onAuthenticated={(user) => setData((data) => ({ ...data, user, isUserLoaded: true }))}
        />
        , []);

    const cityPickerComponent = useMemo(() =>
        <LocationCityPicker
            onClick={(city) => setSelectedCity(city)}
        />
        , []);

    const contributionComponent = useMemo(() =>
        <WeatherContribution />
        , []);

    const cityObservationComponent = useMemo(() =>
        data.cityObservation
            ? <WeatherCityObservation
                city={selectedCity}
                cityObservation={data.cityObservation}
            />
            : <p className={cn(style.error, 'fs-4 fw-bold text-center')}>
                Problem getting observation data <Emoji symbol='😐' label='sad' />
            </p>
        , [selectedCity, data.cityObservation]);

    const cityForecastsComponent = useMemo(() =>
        data.cityForecasts
            ? <WeatherCityForecast
                cityForecasts={data.cityForecasts}
            />
            : <p className={cn(style.error, 'fs-4 fw-bold text-center')}>
                Problem getting forecast data <Emoji symbol='😐' label='sad' />
            </p>
        , [data.cityForecasts]);

    const cityEmotionCountComponent = useMemo(() =>
        data.configuration && data.cityEmotionCounts
            ? <EmotionCount
                emotions={data.configuration.emotions}
                emotionCounts={data.cityEmotionCounts}
                user={data.user}
                groupUserConfiguration={data.cityUserConfiguration}
                title={'How is your day today?'}
                group={'City'}
                onClick={async (emotion) => {
                    var { data: userEmotion, isSuccess } = await WeatherController.city.userEmotion.post({ cityId: selectedCity.cityId, emotionId: emotion.emotionId });
                    if (!isSuccess) return;

                    setData((data) => {
                        var cityEmotionCount = data.cityEmotionCounts.find(cityEmotionCount => cityEmotionCount.emotion.emotionId === userEmotion.emotion.emotionId);

                        if (!cityEmotionCount)
                            data.cityEmotionCounts.push(cityEmotionCount = {
                                cityCount: 0,
                                globalCount: 0,
                                emotion: userEmotion.emotion
                            });

                        //Update count
                        cityEmotionCount.cityCount++;
                        cityEmotionCount.globalCount++;

                        //Update city user configuration
                        data.cityUserConfiguration.selectionsToday++;
                        data.cityUserConfiguration.emotion = userEmotion.emotion;

                        return ({ ...data, cityEmotionCounts: [...data.cityEmotionCounts], cityUserConfiguration: { ...data.cityUserConfiguration } });
                    });
                }}
            />
            : <p className={cn(style.error, 'fs-4 fw-bold text-center')}>
                Problem getting emotion data <Emoji symbol='😐' label='sad' />
            </p>
        , [selectedCity, data.configuration, data.cityEmotionCounts, data.user, data.cityUserConfiguration]);

    const isCityPickerReady =
        data.isCityLoaded;

    const isPageReady =
        data.isUserLoaded &&
        data.isCityLoaded &&
        data.isConfigurationLoaded &&
        data.isCityObservationLoaded &&
        data.isCityForecastsLoaded &&
        data.isCityEmotionCountsLoaded &&
        data.isCityUserConfigurationLoaded;

    return (
        <Fragment>
            {userComponent}
            <div className='mb-4'></div>
            {isCityPickerReady && cityPickerComponent}
            {isPageReady
                ? <Fragment>
                    <div className='mb-4'></div>
                    {cityObservationComponent}
                    <div className='mb-4'></div>
                    {cityEmotionCountComponent}
                    <div className='mb-4'></div>
                    {cityForecastsComponent}
                    <div className='mb-5'></div>
                    {contributionComponent}
                    <div className='mb-4'></div>
                </Fragment>
                : data.isConfigurationLoaded && !data.configuration
                    ? <p className={cn(style.error, 'fs-4 fw-bold text-center pt-4')}>
                        Problem loading page configuration
                        <br />
                        Try refreshing in a few seconds <Emoji symbol='😐' label='sad' />
                    </p>
                    : data.isCityLoaded && !selectedCity
                        ? <p className={cn(style.error, 'fs-4 fw-bold text-center pt-4')}>
                            Search for a city across the globe <Emoji symbol='🌎' label='globe' />
                        </p>
                        : <Loader isRelative={true} height={250} />
            }
        </Fragment>
    )
}

/**Data
 * @typedef Data
 * @property {AccountUserContract} user
 * @property {WeatherCityUserConfigurationContract} cityUserConfiguration
 * @property {WeatherCityObservationContract} cityObservation
 * @property {WeatherCityForecastContract[]} cityForecasts
 * @property {WeatherCityEmotionCountContract[]} cityEmotionCounts
 * @property {WeatherConfigurationContract} configuration
 * @property {boolean} isUserLoaded
 * @property {boolean} isCityLoaded
 * @property {boolean} isConfigurationLoaded
 * @property {boolean} isCityUserConfigurationLoaded
 * @property {boolean} isCityObservationLoaded
 * @property {boolean} isCityForecastsLoaded
 * @property {boolean} isCityEmotionCountsLoaded
*/