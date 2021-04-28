import { Fragment, useEffect, useMemo, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import cn from 'classnames';
import Emoji from 'a11y-react-emoji';
import Slider from 'rc-slider';

import StockMarketController from '../../../../api/stock-market-controller';

import { interval } from './configuration';
import { page as alertPage } from '../stock-market-alert/configuration'

import { userTypeEnum } from '../../../../library/user/user-enum';
import { alertTypeEnum, exchangeEnum } from '../../../../library/stock-market/stock-market-enum';

import Loader from '../../../../library/base/base-loader';
import StockMarketQuotePicker from '../../../../library/stock-market/component/stock-market-quote-picker';
import StockMarketUserRequirement from '../../../../library/stock-market/component/stock-market-user-requirement';
import User from '../../../../library/user/component/user';

import 'rc-slider/assets/index.css';
import style from './style.module.scss';

export default function StockMarketAlertCreate() {
    const navigate = useNavigate();

    /**@type {[Data, React.Dispatch<React.SetStateAction<Data>>]} */
    const [data, setData] = useState({});
    /**@type {[StockMarketQuoteContract, React.Dispatch<React.SetStateAction<StockMarketQuoteContract>>]} */
    const [selectedQuote, setSelectedQuote] = useState(undefined);
    const [isOpenForTrading, setIsOpenForTrading] = useState(false);
    /**@type {[NewQuoteUserAlert, React.Dispatch<React.SetStateAction<NewQuoteUserAlert>>]} */
    const [quoteUserAlert, setQuoteUserAlert] = useState(undefined);
    const [selectedSellPoints, setSelectedSellPoints] = useState(1);
    const [selectedStopLossPoints, setSelectedStopLossPoints] = useState(1);

    //Step 1
    //Load configuration and all user's alerts in progress
    useEffect(() => {
        if (!data.user) return;

        if (data.user.isGuest) {
            navigate(`/${alertPage}`);
            return;
        }

        var isDisposed = false;

        const load = async () => {
            const [
                configurationResponse,
                allQuoteUserAlertsInProgressResponse
            ] = await Promise.all([
                StockMarketController.configuration.get(),
                StockMarketController.quote.userAlert.search.get({ userId: data.user.userId, alertTypeId: alertTypeEnum.inProgress })
            ]);

            if (isDisposed) return;

            setData((data) => ({
                ...data,
                configuration: configurationResponse.data,
                allQuoteUserAlertsInProgress: allQuoteUserAlertsInProgressResponse.data,
                isConfigurationLoaded: true,
                isAllQuoteUserAlertsInProgressLoaded: true
            }));
        };

        const dispose = () => {
            isDisposed = true;
            setData((data) => ({
                ...data,
                configuration: undefined,
                allQuoteUserAlertsInProgress: undefined,
                isConfigurationLoaded: false,
                isAllQuoteUserAlertsInProgressLoaded: false
            }));
        };

        load();
        return dispose;
    }, [data.user, navigate]);

    //Step 2
    //Load quote price and users alerts in progress
    useEffect(() => {
        if (!selectedQuote) return;

        var isDisposed = false, intervalIds = [];

        const load = async () => {
            const [
                globalResponse,
                quotePriceResponse,
                quoteUserAlertsInProgressResponse
            ] = await Promise.all([
                StockMarketController.global.get(),
                StockMarketController.quote.price.get({ quoteId: selectedQuote.quoteId }),
                StockMarketController.quote.userAlert.search.get({ quoteId: selectedQuote.quoteId, userId: data.user.userId, alertTypeId: alertTypeEnum.inProgress })
            ]);

            if (isDisposed) return;

            setData((data) => ({
                ...data,
                global: globalResponse.data,
                quotePrice: quotePriceResponse.data,
                quoteUserAlertsInProgress: quoteUserAlertsInProgressResponse.data,
                isGlobalLoaded: true,
                isQuotePriceLoaded: true,
                isQuoteUserAlertsInProgressLoaded: true
            }));

            intervalIds = [
                setInterval(async () => {
                    const globalResponse = await StockMarketController.global.get(); if (isDisposed) return;
                    if (!globalResponse.isSuccess) return;
                    setData((data) => ({ ...data, global: globalResponse.data }));
                }, interval.globalInMilliseconds),
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
            setData((data) => ({
                ...data,
                global: undefined,
                quotePrice: undefined,
                quoteUserAlertsInProgress: undefined,
                isGlobalLoaded: false,
                isQuotePriceLoaded: false,
                isQuoteUserAlertsInProgressLoaded: false
            }));
        };

        load();
        return dispose;
    }, [selectedQuote, data.user]);

    //Step 3
    //Modify quote user alert
    useEffect(() => {
        if (!data.quotePrice) {
            setQuoteUserAlert(undefined);
            return;
        }
        const buy = data.quotePrice.current;

        const minSell = buy + (buy * 0.01);
        const minSellPoints = 1;
        const maxSell = buy + (buy * 10);
        const maxSellPoints = 300;

        var sell = selectedSellPoints
            ? buy + (buy * (selectedSellPoints / 100))
            : minSell;

        if (sell < minSell)
            sell = minSell;

        if (sell > maxSell)
            sell = maxSell;

        const minStopLoss = buy - (buy * 0.01);
        const minStopLossPoints = -50;
        const maxStopLoss = buy - (buy * 0.5);
        const maxStopLossPoints = -1;

        var stopLoss = selectedStopLossPoints
            ? buy - (buy * (selectedStopLossPoints / 100))
            : minStopLoss;

        if (stopLoss > minStopLoss)
            stopLoss = minStopLoss;

        if (stopLoss < maxStopLoss)
            stopLoss = maxStopLoss;

        setQuoteUserAlert((quoteUserAlert) => ({
            ...quoteUserAlert,
            buy,
            sell,
            stopLoss,
            minSell,
            minSellPoints,
            maxSell,
            maxSellPoints,
            minStopLoss,
            minStopLossPoints,
            maxStopLoss,
            maxStopLossPoints
        }));
    }, [data.quotePrice, selectedSellPoints, selectedStopLossPoints]);

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
            onAuthenticated={(user) => setData((data) => ({ ...data, user }))}
        />
        , []);

    const userRequirementComponent = useMemo(() =>
        data.configuration &&
        <StockMarketUserRequirement
            user={data.user}
            quoteUserAlertRequirement={data.configuration.quoteUserAlertRequirement}
            onIsUserMeetingRequirements={(isMeetingRequirements) => setData((data) => ({ ...data, isMeetingRequirements }))}
        />
        , [data.user, data.configuration]);

    const quotePickerComponent = useMemo(() =>
        <StockMarketQuotePicker
            value={selectedQuote?.symbol}
            isResetAllowed={true}
            onClick={(quote) => setSelectedQuote(quote)}
            onReset={() => setSelectedQuote(undefined)}
        />
        , [selectedQuote]);

    const metadata = useMemo(() => ({
        user: {
            isReady: true
        },
        userRequirement: {
            isReady: Boolean(data.configuration)
        },
        requirementError: {
            isReady: Boolean(data.configuration) && !data.isMeetingRequirements
        },
        maximumAlertsInProgressError: {
            isReady: Boolean(data.configuration) && Boolean(data.allQuoteUserAlertsInProgress) &&
                data.configuration.quoteUserAlertRequirement.maximumAlertsInProgressCount <
                data.allQuoteUserAlertsInProgress.length
        },
        newAlertContainer: {
            isReady: Boolean(data.configuration) && Boolean(data.allQuoteUserAlertsInProgress) && data.isMeetingRequirements &&
                data.configuration.quoteUserAlertRequirement.maximumAlertsInProgressCount >
                data.allQuoteUserAlertsInProgress.length,
            quotePicker: {
                isReady: true
            },
            alertDetails: {
                isReady: Boolean(selectedQuote),
                table: {
                    isReady: data.isQuotePriceLoaded && data.isGlobalLoaded && isOpenForTrading && data.isQuoteUserAlertsInProgressLoaded && Boolean(data.quotePrice) && Boolean(data.quoteUserAlertsInProgress) && data.quoteUserAlertsInProgress.length === 0 && Boolean(quoteUserAlert),
                    isLoading: !data.isQuotePriceLoaded || !data.isQuoteUserAlertsInProgressLoaded,
                    isError: (data.isQuotePriceLoaded && !Boolean(data.quotePrice)) || (data.isQuoteUserAlertsInProgressLoaded && !Boolean(data.quoteUserAlertsInProgress)),
                    isExchangeNotOpenError: data.isGlobalLoaded && !isOpenForTrading,
                    isAlreadyCreatedError: data.isQuoteUserAlertsInProgressLoaded && data.quoteUserAlertsInProgress.length > 0
                }
            }
        },
        loader: {
            isReady: !data.isConfigurationLoaded
        },
        error: {
            isReady: data.isConfigurationLoaded && !Boolean(data.configuration)
        }
    }), [selectedQuote, quoteUserAlert, data.configuration, data.isConfigurationLoaded, data.isGlobalLoaded, isOpenForTrading, data.isMeetingRequirements, data.quoteUserAlertsInProgress, data.isQuoteUserAlertsInProgressLoaded, data.allQuoteUserAlertsInProgress, data.quotePrice, data.isQuotePriceLoaded]);

    return (
        <Fragment>
            {/* User */}
            {
                metadata.user.isReady &&
                userComponent
            }

            <div className='mb-4'></div>

            {/* User Requirement */}
            {
                metadata.userRequirement.isReady &&
                userRequirementComponent
            }

            <div className='mb-3'></div>

            {/* Requirement Error */}
            {
                metadata.requirementError.isReady &&
                <p className={cn(style.error, 'fs-4 fw-bold text-center pt-4')}>
                    Looks like your account is not
                    <br />
                    meeting all of the requirements <Emoji symbol='🙄' label='rolling eyes' />
                    <br />
                    <br />
                    Here are some words of courage
                    <br />
                    You can do it! <Emoji symbol='💪' label='strength' />
                </p>
            }

            {/* Maximum Alerts In Progress Error */}
            {
                metadata.maximumAlertsInProgressError.isReady &&
                <p className={cn(style.error, 'fs-4 fw-bold text-center pt-4')}>
                    Alerts In Progress Requirement
                    <br />
                    <br />
                    Maximum Allowed is {data.configuration.quoteUserAlertRequirement.maximumAlertsInProgressCount}
                    <br />
                    You have {data.quoteUserAlerts.length}
                    <br />
                    <br />
                    Wait for an alert to complete on its own
                    <br />
                    Or
                    <br />
                    Manually complete an alert
                </p>
            }

            {/* New Alert */}
            {
                metadata.newAlertContainer.isReady &&
                <Fragment>
                    {
                        metadata.newAlertContainer.quotePicker.isReady &&
                        <Fragment>
                            <p className={cn(style.error, 'fs-4 fw-bold text-center pb-2')}>
                                Step 1 - Select A Quote
                            </p>
                            {quotePickerComponent}
                        </Fragment>
                    }
                    {
                        metadata.newAlertContainer.alertDetails.isReady &&
                        <Fragment>
                            <p className={cn(style.error, 'fs-4 fw-bold text-center pt-3 pb-2')}>
                                Step 2 - Provide Alert Details
                            </p>
                            <Container className={cn(style.container, 'p-3')}>
                                {
                                    metadata.newAlertContainer.alertDetails.table.isReady &&
                                    <Fragment>
                                        <Row>
                                            <Col>
                                                <div>
                                                    <p className={cn(style.sliderText, 'fw-bold fs-4 text-center')}>Current</p>
                                                    <p className={cn(style.current, 'fw-bold fs-4 text-center')}>{quoteUserAlert.buy.toPrecision(5)}</p>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className='pt-2'>
                                            <Col>
                                                <div>
                                                    <p className={cn(style.sliderText, 'fw-bold fs-4 text-center')}>Sell Points</p>
                                                    <div className='d-flex justify-content-center'>
                                                        <p className={cn(style.sellValue, 'fw-bold fs-4 text-center pe-3')}>{quoteUserAlert.sell.toPrecision(6)}</p>
                                                        <p className={cn(style.sellPoints, 'fw-bold fs-4 text-center ps-3')}>+{selectedSellPoints.toPrecision(6)}</p>
                                                    </div>
                                                    <Slider
                                                        className={cn(style.sliderSell, 'm-auto')}
                                                        value={selectedSellPoints}
                                                        step={0.001}
                                                        min={quoteUserAlert.minSellPoints}
                                                        max={quoteUserAlert.maxSellPoints}
                                                        onChange={(sellPoints) => setSelectedSellPoints(sellPoints)}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className='pt-3'>
                                            <Col>
                                                <div>
                                                    <p className={cn(style.sliderText, 'fw-bold fs-4 text-center')}>Stop Loss Points</p>
                                                    <div className='d-flex justify-content-center'>
                                                        <p className={cn(style.stopLossValue, 'fw-bold fs-4 text-center pe-3')}>{quoteUserAlert.stopLoss.toPrecision(6)}</p>
                                                        <p className={cn(style.stopLossPoints, 'fw-bold fs-4 text-center ps-3')}>{selectedStopLossPoints.toPrecision(6)}</p>
                                                    </div>
                                                    <Slider
                                                        className={cn(style.sliderStopLoss, 'm-auto')}
                                                        value={selectedStopLossPoints}
                                                        step={0.001}
                                                        min={quoteUserAlert.maxStopLossPoints * -1}
                                                        max={quoteUserAlert.minStopLossPoints * -1}
                                                        onChange={(stopLossPoints) => setSelectedStopLossPoints(stopLossPoints)}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className='pt-4'>
                                            <Col>
                                                <p
                                                    className={cn(style.submit, 'fw-bold fs-4 m-auto text-center')}
                                                    onClick={async () => {
                                                        const { isSuccess } = await StockMarketController.quote.userAlert.post({
                                                            quoteId: selectedQuote.quoteId,
                                                            sell: quoteUserAlert.sell,
                                                            stopLoss: quoteUserAlert.stopLoss
                                                        });

                                                        if (!isSuccess) return;

                                                        navigate('/stock-market/alert');
                                                    }}
                                                >
                                                    Submit
                                                </p>
                                            </Col>
                                        </Row>
                                    </Fragment>
                                }
                                {
                                    metadata.newAlertContainer.alertDetails.table.isLoading &&
                                    <Loader isRelative={true} height={150} />
                                }
                                {
                                    metadata.newAlertContainer.alertDetails.table.isError &&
                                    <p className={cn(style.error, 'fs-4 fw-bold text-center pt-4')}>
                                        Problem getting price data <Emoji symbol='😐' label='sad' />
                                    </p>
                                }
                                {
                                    metadata.newAlertContainer.alertDetails.table.isExchangeNotOpenError &&
                                    <p className={cn(style.error, 'fs-4 fw-bold text-center pt-4')}>
                                        Exchange is not open for trading <Emoji symbol='😐' label='sad' />
                                    </p>
                                }
                                {
                                    metadata.newAlertContainer.alertDetails.table.isAlreadyCreatedError &&
                                    <p className={cn(style.error, 'fs-4 fw-bold text-center pt-4')}>
                                        You already created an alert for this quote
                                    </p>
                                }
                            </Container>
                        </Fragment>
                    }
                </Fragment>
            }

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

            <div className='mb-4'></div>
        </Fragment>
    )
}

/**Data
 * @typedef Data
 * @property {UserContract} user
 * @property {StockMarketGlobalContract} global
 * @property {StockMarketQuotePriceContract} quotePrice
 * @property {StockMarketQuoteUserAlertContract[]} allQuoteUserAlertsInProgress
 * @property {StockMarketQuoteUserAlertContract[]} quoteUserAlertsInProgress
 * @property {StockMarketConfigurationContract} configuration
 * @property {boolean} isMeetingRequirements
 * @property {boolean} isAllQuoteUserAlertsInProgressLoaded
 * @property {boolean} isQuoteUserAlertsInProgressLoaded
 * @property {boolean} isGlobalLoaded
 * @property {boolean} isQuotePriceLoaded
 * @property {boolean} isConfigurationLoaded
*/

/**NewQuoteUserAlert
 * @typedef NewQuoteUserAlert
 * @property {number} buy
 * @property {number} sell
 * @property {number} sellPoints
 * @property {number} stopLoss
 * @property {number} stopLossPoints
 * @property {number} minSell
 * @property {number} minSellPoints
 * @property {number} maxSell
 * @property {number} maxSellPoints
 * @property {number} minStopLoss
 * @property {number} minStopLossPoints
 * @property {number} maxStopLoss
 * @property {number} maxStopLossPoints
*/