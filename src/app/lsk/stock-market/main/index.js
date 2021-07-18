import { Fragment, useState, useEffect, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Emoji from 'a11y-react-emoji';
import cn from 'classnames';

import { StorageExtension as Storage } from '../../../../library/base/base-extension';

import StockMarketController from '../../../../api/stock-market-controller';

import { cache, interval, page } from './configuration';
import { exchangeEnum, timeframeEnum } from '../../../../library/stock-market/stock-market-enum';
import { userTypeEnum } from '../../../../library/account/account-enum';

import EmotionCount from '../../../../library/base/component/emotion-count';
import Loader from '../../../../library/base/component/loader';
import StockMarketContribution from '../../../../library/stock-market/component/contribution';
import StockMarketQuotePrice from '../../../../library/stock-market/component/quote-price';
import StockMarketTimeframeSelector from '../../../../library/stock-market/component/timeframe-selector';
import StockMarketQuoteCompany from '../../../../library/stock-market/component/quote-company';
import StockMarketQuotePicker from '../../../../library/stock-market/component/quote-picker';
import StockMarketQuoteChart from '../../../../library/stock-market/component/quote-chart';
import StockMarketQuoteUserAlert from '../../../../library/stock-market/component/quote-user-alert';
import User from '../../../../library/account/component/user';

import style from './style.module.scss';

export default function Main() {
    /**@type {[Data, React.Dispatch<React.SetStateAction<Data>>]} */
    const [data, setData] = useState({});
    const [isOpenForTrading, setIsOpenForTrading] = useState(false);
    /**@type {[StockMarketQuoteContract, React.Dispatch<React.SetStateAction<StockMarketQuoteContract>>]} */
    const [selectedQuote, setSelectedQuote] = useState(undefined);
    /**@type {[StockMarketTimeframeContract, React.Dispatch<React.SetStateAction<StockMarketTimeframeContract>>]} */
    const [selectedTimeframe, setSelectedTimeframe] = useState(undefined);
    const [selectedTimeframeMultiplier, setSelectedTimeframeMultiplier] = useState(1);
    /**@type {[StockMarketQuoteCandleContract, React.Dispatch<React.SetStateAction<StockMarketQuoteCandleContract>>]} */
    const [selectedCandle, setSelectedCandle] = useState(undefined);
    /**@type {[StockMarketQuoteUserAlertContract, React.Dispatch<React.SetStateAction<StockMarketQuoteUserAlertContract>>]} */
    const [selectedQuoteUserAlert, setSelectedQuoteUserAlert] = useState(undefined);

    //Step 1
    //Load quote and configuration
    useEffect(() => {
        if (!data.isUserLoaded) return;

        var isDisposed = false;

        const load = async () => {
            /**@type {StockMarketQuoteContract} */
            var cachedQuote = Storage.get(cache.quoteKey);

            const [
                configurationResponse,
                quoteResponse
            ] = await Promise.all([
                StockMarketController.configuration.get(),
                cachedQuote && cachedQuote.quoteId && StockMarketController.quote.get({ quoteId: cachedQuote.quoteId })
            ]);

            if (isDisposed) return;

            if (!quoteResponse?.data) {
                Storage.remove(cache.quoteKey);
            } else {
                Storage.set(cache.quoteKey, quoteResponse.data);
            }

            setSelectedQuote(quoteResponse?.data);
            setSelectedTimeframe(configurationResponse.data?.timeframes?.find(timeframe => timeframe.timeframeId === timeframeEnum.oneDay));
            setData((data) => ({
                ...data,
                configuration: configurationResponse.data,
                isConfigurationLoaded: true,
                isQuoteLoaded: true
            }));
        };

        const dispose = () => {
            isDisposed = true;
            setSelectedQuote(undefined);
            setSelectedTimeframe(undefined);
            setData((data) => ({ ...data, configuration: undefined, isConfigurationLoaded: false, isQuoteLoaded: false }));
        };

        load();
        return dispose;
    }, [data.isUserLoaded]);

    //Step 2
    //Load required data related to the quote
    useEffect(() => {
        if (!selectedQuote || !data.configuration) return;

        var isDisposed = false, intervalIds = [];

        const load = async () => {
            const [
                globalResponse,
                quotePriceResponse,
                quoteEmotionCountsResponse,
                quoteCompanyResponse,
                quoteUserConfigurationResponse
            ] = await Promise.all([
                StockMarketController.global.get(),
                StockMarketController.quote.price.get({ quoteId: selectedQuote.quoteId }),
                StockMarketController.quote.emotion.counts.get({ quoteId: selectedQuote.quoteId }),
                selectedQuote.exchange.exchangeId !== exchangeEnum.crypto && StockMarketController.quote.company.get({ quoteId: selectedQuote.quoteId }),
                !data.user.isGuest && StockMarketController.quote.userConfiguration.get({ quoteId: selectedQuote.quoteId })
            ]);

            if (isDisposed) return;

            setData((data) => ({
                ...data,
                global: globalResponse.data,
                quotePrice: quotePriceResponse.data,
                quoteEmotionCounts: quoteEmotionCountsResponse.data,
                quoteCompany: quoteCompanyResponse?.data,
                quoteUserConfiguration: quoteUserConfigurationResponse?.data,
                isGlobalLoaded: true,
                isQuotePriceLoaded: true,
                isQuoteEmotionCountsLoaded: true,
                isQuoteCompanyLoaded: true,
                isQuoteUserConfigurationLoaded: true
            }));

            intervalIds = [
                setInterval(async () => {
                    const globalResponse = await StockMarketController.global.get(); if (isDisposed) return;
                    if (!globalResponse.isSuccess) return;
                    setData((data) => ({ ...data, global: globalResponse.data }));
                }, interval.globalInMilliseconds),
                setInterval(async () => {
                    const quoteEmotionCountsResponse = await StockMarketController.quote.emotion.counts.get({ quoteId: selectedQuote.quoteId }); if (isDisposed) return;
                    if (!quoteEmotionCountsResponse.isSuccess) return;
                    setData((data) => ({ ...data, quoteEmotionCounts: quoteEmotionCountsResponse.data }));
                }, interval.quoteEmotionCountsInMilliseconds)
            ];
        };

        const dispose = () => {
            isDisposed = true;
            intervalIds.forEach(intervalId => clearInterval(intervalId));
            setData((data) => ({
                ...data,
                global: undefined,
                quotePrice: undefined,
                quoteEmotionCounts: undefined,
                quoteCompany: undefined,
                quoteUserConfiguration: undefined,
                isGlobalLoaded: false,
                isQuotePriceLoaded: false,
                isQuoteEmotionCountsLoaded: false,
                isQuoteCompanyLoaded: false,
                isQuoteUserConfigurationLoaded: false
            }));
        };

        load();
        return dispose;
    }, [selectedQuote, data.configuration, data.user]);

    //Step 2.1
    //Create interval if exchange is open
    useEffect(() => {
        if (!isOpenForTrading) return;

        var isDisposed = false, intervalIds = [];

        const load = () => {
            intervalIds = [
                setInterval(async () => {
                    const quotePriceResponse = await StockMarketController.quote.price.get({ quoteId: selectedQuote.quoteId }); if (isDisposed) return;
                    if (!quotePriceResponse.isSuccess) return;
                    setData((data) => ({ ...data, quotePrice: quotePriceResponse.data }));
                }, interval.quotePriceInMilliseconds)
            ]
        };

        const dispose = () => {
            isDisposed = true;
            intervalIds.forEach(intervalId => clearInterval(intervalId));
        };

        load();
        return dispose;
    }, [selectedQuote, isOpenForTrading]);

    //Step 2
    //Load chart data related to the quote
    useEffect(() => {
        if (!selectedQuote || !selectedTimeframe || !data.configuration) return;

        var isDisposed = false;

        const load = async () => {
            const quoteCandlesResponse = await StockMarketController.quote.candles.get({ quoteId: selectedQuote.quoteId, timeframeId: selectedTimeframe.timeframeId }); if (isDisposed) return;

            setSelectedCandle(undefined);
            setSelectedQuoteUserAlert(undefined);
            setData((data) => ({
                ...data,
                quoteCandles: quoteCandlesResponse.data,
                isQuoteCandlesLoaded: true
            }));
        };

        const dispose = () => {
            isDisposed = true;
            setSelectedCandle(undefined);
            setSelectedQuoteUserAlert(undefined);
            setData((data) => ({
                ...data,
                quoteCandles: undefined,
                isQuoteCandlesLoaded: false
            }));
        };

        load();
        return dispose;
    }, [selectedQuote, selectedTimeframe, data.configuration]);

    //Step 2.1
    //Create interval if exchange is open
    useEffect(() => {
        if (!isOpenForTrading) return;

        var isDisposed = false, intervalIds = [];

        const load = () => {
            intervalIds = [
                setInterval(async () => {
                    const quoteCandlesResponse = await StockMarketController.quote.candles.get({ quoteId: selectedQuote.quoteId, timeframeId: selectedTimeframe.timeframeId }); if (isDisposed) return;
                    if (!quoteCandlesResponse.isSuccess) return;
                    setData((data) => ({ ...data, quoteCandles: quoteCandlesResponse.data }));
                }, interval.quoteCandlesInMilliseconds)
            ]
        };

        const dispose = () => {
            isDisposed = true;
            intervalIds.forEach(intervalId => clearInterval(intervalId));
        };

        load();
        return dispose;
    }, [selectedQuote, selectedTimeframe, isOpenForTrading]);

    //IsOpenForTrading
    useEffect(() => {
        if (!selectedQuote || !data.global) {
            setIsOpenForTrading(false);
            return;
        }

        var isOpenForTrading = false;

        switch (selectedQuote.exchange.exchangeId) {
            case exchangeEnum.crypto: isOpenForTrading = data.global.isCryptoMarketOpen; break;
            case exchangeEnum.forex: isOpenForTrading = data.global.isForexMarketOpen; break;
            case exchangeEnum.euronext: isOpenForTrading = data.global.isEuronextMarketOpen; break;
            default: isOpenForTrading = data.global.isStockMarketOpen; break;
        }

        setIsOpenForTrading(isOpenForTrading);
    }, [selectedQuote, data.global]);

    const userComponent = useMemo(() =>
        <User
            userTypeId={userTypeEnum.stocktwits}
            page={page}
            onAuthenticated={(user) => setData((data) => ({ ...data, user, isUserLoaded: true }))}
        />
        , []);

    const quotePickerComponent = useMemo(() =>
        <StockMarketQuotePicker
            onClick={(quote) => {
                Storage.set(cache.quoteKey, quote);

                setSelectedQuote(quote);
                data.configuration && setSelectedTimeframe(data.configuration.timeframes.find(timeframe => timeframe.timeframeId === timeframeEnum.oneDay));
                setSelectedTimeframeMultiplier(1);
            }}
        />
        , [data.configuration]);

    const contributionComponent = useMemo(() =>
        <StockMarketContribution />
        , []);

    const quotePriceComponent = useMemo(() =>
        data.quotePrice
            ? <StockMarketQuotePrice
                quote={selectedQuote}
                quotePrice={data.quotePrice}
                isOpenForTrading={isOpenForTrading}
            />
            : <p className={cn(style.error, 'fs-4 fw-bold text-center')}>
                Problem getting price data <Emoji symbol='😐' label='sad' />
            </p>
        , [selectedQuote, data.quotePrice, isOpenForTrading]);

    const quoteEmotionCountComponent = useMemo(() =>
        data.configuration && data.quoteEmotionCounts
            ? <EmotionCount
                emotions={data.configuration.emotions}
                emotionCounts={data.quoteEmotionCounts}
                user={data.user}
                groupUserConfiguration={data.quoteUserConfiguration}
                title={'What is your opinion today?'}
                group={'Quote'}
                onClick={async (emotion) => {
                    var { data: userEmotion, isSuccess } = await StockMarketController.quote.emotion.post({ quoteId: selectedQuote.quoteId, emotionId: emotion.emotionId });
                    if (!isSuccess) return;

                    setData((data) => {
                        var quoteEmotionCount = data.quoteEmotionCounts.find(quoteEmotionCount => quoteEmotionCount.emotion.emotionId === userEmotion.emotion.emotionId);

                        if (!quoteEmotionCount)
                            data.quoteEmotionCounts.push(quoteEmotionCount = {
                                quoteCount: 0,
                                globalCount: 0,
                                emotion: userEmotion.emotion
                            });

                        //Update count
                        quoteEmotionCount.quoteCount++;
                        quoteEmotionCount.globalCount++;

                        //Update quote user configuration
                        data.quoteUserConfiguration.selectionsToday++;
                        data.quoteUserConfiguration.emotion = userEmotion.emotion;

                        return ({ ...data, quoteEmotionCounts: [...data.quoteEmotionCounts], quoteUserConfiguration: { ...data.quoteUserConfiguration } });
                    });
                }}
            />
            : <p className={cn(style.error, 'fs-4 fw-bold text-center')}>
                Problem getting emotion data <Emoji symbol='😐' label='sad' />
            </p>
        , [selectedQuote, data.configuration, data.quoteEmotionCounts, data.user, data.quoteUserConfiguration]);

    const quoteChartComponent = useMemo(() =>
        <StockMarketQuoteChart
            quote={selectedQuote}
            quoteCandles={data.quoteCandles}
            latestPrice={data.quotePrice}
            quoteUserAlert={selectedQuoteUserAlert}
            isLoaded={data.isQuoteCandlesLoaded}
            timeframe={selectedTimeframe}
            timeframeMultiplier={selectedTimeframeMultiplier}
            onCandleClick={(candle) => setSelectedCandle(candle)}
        />
        , [selectedQuote, selectedQuoteUserAlert, selectedTimeframe, selectedTimeframeMultiplier, data.quoteCandles, data.quotePrice, data.isQuoteCandlesLoaded]);

    const timeframeSelectorComponent = useMemo(() =>
        data.configuration &&
        <StockMarketTimeframeSelector
            timeframe={selectedTimeframe}
            timeframes={data.configuration.timeframes}
            onClick={(timeframe) => {
                setSelectedTimeframe(timeframe);
                setData((data) => ({ ...data, isQuoteCandlesLoaded: false }));
            }}
            onMultiplierClick={(timeframeMultiplier) => setSelectedTimeframeMultiplier(timeframeMultiplier)}
        />
        , [selectedTimeframe, data.configuration]);

    const quoteCompanyComponent = useMemo(() =>
        data.quotePrice || data.quoteCompany
            ? <StockMarketQuoteCompany
                quotePrice={data.quotePrice}
                quoteCompany={data.quoteCompany}
            />
            : <p className={cn(style.error, 'fs-4 fw-bold text-center')}>
                Problem getting company data <Emoji symbol='😐' label='sad' />
            </p>
        , [data.quotePrice, data.quoteCompany]);

    const isQuotePickerReady =
        data.isQuoteLoaded &&
        Boolean(data.configuration);

    const isPageReady =
        data.isUserLoaded &&
        data.isQuoteLoaded &&
        data.isConfigurationLoaded &&
        Boolean(data.configuration) &&
        data.isQuotePriceLoaded &&
        data.isQuoteCompanyLoaded &&
        data.isQuoteEmotionCountsLoaded &&
        data.isQuoteUserConfigurationLoaded;

    return (
        <Fragment>
            {userComponent}
            <div className='m-4'></div>
            {isQuotePickerReady && quotePickerComponent}
            {isPageReady
                ? <Fragment>
                    <div className='mb-4'></div>
                    {quotePriceComponent}
                    <div className='mb-4'></div>
                    {quoteEmotionCountComponent}
                    <div className='mb-4'></div>
                    {quoteChartComponent}
                    {timeframeSelectorComponent}
                    {selectedCandle &&
                        <Container className={cn(style.container, 'p-3')}>
                            <Row>
                                {selectedCandle.quoteUserAlerts.map((quoteUserAlert, index) =>
                                    <Col key={index}>
                                        <div
                                            onClick={() => {
                                                if (selectedQuoteUserAlert?.quoteUserAlertId === quoteUserAlert.quoteUserAlertId) {
                                                    setSelectedQuoteUserAlert(undefined);
                                                } else {
                                                    setSelectedQuoteUserAlert(quoteUserAlert);
                                                }
                                            }}
                                            className={cn(style.alertContainer, { [style.active]: quoteUserAlert.quoteUserAlertId === selectedQuoteUserAlert?.quoteUserAlertId }, 'h-100')}
                                        >
                                            <StockMarketQuoteUserAlert
                                                quoteUserAlert={quoteUserAlert}
                                            />
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </Container>
                    }
                    <div className='mb-4'></div>
                    {quoteCompanyComponent}
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
                    : data.isQuoteLoaded && !selectedQuote
                        ? <p className={cn(style.error, 'fs-4 fw-bold text-center pt-4')}>
                            Search for a quote across the markets <Emoji symbol='🏛️' label='market' />
                        </p>
                        : <Loader isRelative={true} height={250} />
            }
        </Fragment>
    )
}

/**Data
 * @typedef Data
 * @property {AccountUserContract} user
 * @property {StockMarketGlobalContract} global
 * @property {StockMarketQuotePriceContract} quotePrice
 * @property {StockMarketQuoteCompanyContract} quoteCompany
 * @property {StockMarketQuoteCandleContract[]} quoteCandles
 * @property {StockMarketQuoteEmotionCountContract[]} quoteEmotionCounts
 * @property {StockMarketQuoteUserConfigurationContract} quoteUserConfiguration
 * @property {StockMarketConfigurationContract} configuration
 * @property {boolean} isUserLoaded
 * @property {boolean} isQuoteLoaded
 * @property {boolean} isGlobalLoaded
 * @property {boolean} isConfigurationLoaded
 * @property {boolean} isQuoteUserConfigurationLoaded
 * @property {boolean} isQuotePriceLoaded
 * @property {boolean} isQuoteCompanyLoaded
 * @property {boolean} isQuoteCandlesLoaded
 * @property {boolean} isQuoteEmotionCountsLoaded
*/
