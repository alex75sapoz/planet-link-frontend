import { Fragment, useEffect, useMemo, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import cn from 'classnames';
import Emoji from 'a11y-react-emoji';

import StockMarketController from '../../../../api/stock-market-controller';

import { page, interval } from './configuration';

import { userTypeEnum } from '../../../../library/user/user-enum';
import { alertTypeEnum } from '../../../../library/stock-market/stock-market-enum';

import Loader from '../../../../library/base/base-loader';
import StockMarketProfile from '../../../../library/stock-market/component/stock-market-profile';
import StockMarketQuotePicker from '../../../../library/stock-market/component/stock-market-quote-picker';
import StockMarketQuoteUserAlert from '../../../../library/stock-market/component/stock-market-quote-user-alert';
import User from '../../../../library/user/component/user';
import UserStocktwitsPicker from '../../../../library/user/component/user-stocktwits-picker';

import style from './style.module.scss';

export default function StockMarketAlert() {
    const navigate = useNavigate();
    /**@type {[Data, React.Dispatch<React.SetStateAction<Data>>]} */
    const [data, setData] = useState({});
    /**@type {[StockMarketAlertTypeContract, React.Dispatch<React.SetStateAction<StockMarketAlertTypeContract>>]} */
    const [selectedAlertType, setSelectedAlertType] = useState(undefined);
    /**@type {[StockMarketQuoteContract, React.Dispatch<React.SetStateAction<StockMarketQuoteContract>>]} */
    const [selectedQuote, setSelectedQuote] = useState(undefined);
    /**@type {[UserContract, React.Dispatch<React.SetStateAction<UserContract>>]} */
    const [selectedUser, setSelectedUser] = useState(undefined);
    const [isUserAlerts, setIsUserAlerts] = useState(false);

    //Step 1
    //Load configuration
    useEffect(() => {
        if (!data.user) return;

        var isDisposed = false;

        const load = async () => {
            const [
                configurationResponse
            ] = await Promise.all([
                StockMarketController.configuration.get()
            ]);

            if (isDisposed) return;

            setSelectedAlertType(configurationResponse.data?.alertTypes.find(alertType => alertType.alertTypeId === alertTypeEnum.inProgress));
            setSelectedUser(!data.user.isGuest && data.user);
            setData((data) => ({
                ...data,
                configuration: configurationResponse.data,
                isConfigurationLoaded: true
            }));
        };

        const dispose = () => {
            isDisposed = true;
            setSelectedAlertType(undefined);
            setSelectedUser(undefined);
            setData((data) => ({
                ...data,
                configuration: undefined,
                isConfigurationLoaded: false
            }));
        };

        load();
        return dispose;
    }, [data.user]);

    //Step 2
    //Load alerts
    useEffect(() => {
        if (!selectedAlertType || !data.configuration) return;

        var isDisposed = false, intervalIds = [];

        const load = async () => {
            const [
                quoteUserAlertsResponse
            ] = await Promise.all([
                StockMarketController.quote.userAlert.search.get({ alertTypeId: selectedAlertType.alertTypeId, quoteId: selectedQuote?.quoteId, userId: selectedUser?.userId })
            ]);

            if (isDisposed) return;

            setData((data) => ({
                ...data,
                quoteUserAlerts: quoteUserAlertsResponse.data || [],
                isQuoteUserAlertsLoaded: true
            }));

            intervalIds = [
                setInterval(async () => {
                    const quoteUserAlertsResponse = await StockMarketController.quote.userAlert.search.get({ alertTypeId: selectedAlertType.alertTypeId, quoteId: selectedQuote?.quoteId, userId: selectedUser?.userId }); if (isDisposed) return;
                    if (!quoteUserAlertsResponse.isSuccess) return;
                    setData((data) => ({ ...data, quoteUserAlerts: quoteUserAlertsResponse.data }));
                }, interval.quoteUserAlertsInMilliseconds)
            ];
        };

        const dispose = () => {
            isDisposed = true;
            intervalIds.forEach(intervalId => clearInterval(intervalId));
            setData((data) => ({
                ...data,
                quoteUserAlerts: undefined,
                isQuoteUserAlertsLoaded: false
            }));
        };

        load();
        return dispose;
    }, [selectedAlertType, selectedQuote, selectedUser, data.configuration]);

    //Step 2
    //Load profile
    useEffect(() => {
        if (!selectedUser || !data.configuration) return;

        var isDisposed = false, intervalIds = [];

        const load = async () => {
            const [
                profileResponse
            ] = await Promise.all([
                StockMarketController.user.get({ userId: selectedUser.userId }),
            ]);

            if (isDisposed) return;

            setData((data) => ({
                ...data,
                profile: profileResponse.data,
                isProfileLoaded: true
            }));

            intervalIds = [
                setInterval(async () => {
                    const profileResponse = await StockMarketController.user.get({ userId: selectedUser.userId }); if (isDisposed) return;
                    if (!profileResponse.isSuccess) return;
                    setData((data) => ({ ...data, profile: profileResponse.data }));
                }, interval.profileInMilliseconds)
            ];
        };

        const dispose = () => {
            isDisposed = true;
            intervalIds.forEach(intervalId => clearInterval(intervalId));
            setData((data) => ({
                ...data,
                profile: undefined,
                isProfileLoaded: false
            }));
        };

        load();
        return dispose;
    }, [selectedUser, data.configuration]);

    const userComponent = useMemo(() =>
        <User
            userTypeId={userTypeEnum.stocktwits}
            page={page}
            onAuthenticated={(user) => {
                setData((data) => ({ ...data, user }));
                setIsUserAlerts(!user.isGuest);
            }}
        />
        , []);

    const profileComponent = useMemo(() =>
        selectedUser &&
        <StockMarketProfile
            profile={data.profile}
            isLoading={Boolean(selectedUser) && !data.isProfileLoaded}
        />
        , [selectedUser, data.profile, data.isProfileLoaded]);

    const quotePickerComponent = useMemo(() =>
        <StockMarketQuotePicker
            value={selectedQuote?.symbol}
            isResetAllowed={true}
            onClick={(quote) => setSelectedQuote(quote)}
            onReset={() => setSelectedQuote(undefined)}
        />
        , [selectedQuote]);

    const userStocktwitsPickerComponent = useMemo(() =>
        <UserStocktwitsPicker
            value={selectedUser?.username}
            isResetAllowed={true}
            onClick={(user) => setSelectedUser(user)}
            onReset={() => setSelectedUser(undefined)}
        />
        , [selectedUser]);

    const metadata = useMemo(() => ({
        user: {
            isReady: true
        },
        pickers: {
            isReady: Boolean(data.configuration),
            quote: {
                isReady: true
            },
            userStocktwits: {
                isReady: !isUserAlerts
            }
        },
        filters: {
            isReady: Boolean(data.configuration),
            successful: {
                isReady: true
            },
            inProgress: {
                isReady: true
            },
            unSuccessful: {
                isReady: true
            }
        },
        buttons: {
            isReady: Boolean(data.configuration),
            createAlert: {
                isReady: isUserAlerts && selectedAlertType?.alertTypeId === alertTypeEnum.inProgress
            },
            globalAlerts: {
                isReady: isUserAlerts
            },
            userAlerts: {
                isReady: !isUserAlerts && !data.user?.isGuest
            },
            title: {
                isReady: Boolean(data.quoteUserAlerts)
            }
        },
        profile: {
            isReady: Boolean(selectedUser)
        },
        alerts: {
            isReady: Boolean(data.configuration),
            table: {
                isReady: Boolean(data.quoteUserAlerts) && data.isQuoteUserAlertsLoaded,
                isLoading: !data.isQuoteUserAlertsLoaded
            }
        },
        error: {
            isReady: data.isConfigurationLoaded && !Boolean(data.configuration),
        },
        loader: {
            isReady: !data.isConfigurationLoaded
        }
    }), [isUserAlerts, selectedAlertType, selectedUser, data.user, data.configuration, data.isConfigurationLoaded, data.quoteUserAlerts, data.isQuoteUserAlertsLoaded]);

    return (
        <Fragment>
            {/* User */}
            {
                metadata.user.isReady &&
                userComponent
            }

            <div className='mb-4'></div>

            {/* Pickers */}
            {
                metadata.pickers.isReady &&
                <Container className='ps-0 pe-0'>
                    <Row>
                        {metadata.pickers.quote.isReady &&
                            <Col>
                                {quotePickerComponent}
                            </Col>
                        }
                        {metadata.pickers.userStocktwits.isReady &&
                            <Col>
                                {userStocktwitsPickerComponent}
                            </Col>
                        }
                    </Row>
                </Container>
            }

            <div className='mb-4'></div>


            {/* Profile */}
            {
                metadata.profile.isReady &&
                <Fragment>
                    {profileComponent}
                    <div className='mb-4'></div>
                </Fragment>
            }

            {/* Filters */}
            {
                metadata.filters.isReady &&
                <Container className='ps-0 pe-0'>
                    <Row className='gy-3'>
                        {metadata.filters.successful.isReady &&
                            <Col xs={6} md={4} className='order-md-1 order-1'>
                                <p
                                    onClick={() => setSelectedAlertType(data.configuration.alertTypes.find(alertType => alertType.alertTypeId === alertTypeEnum.successful))}
                                    className={cn(style.successful, { [style.active]: selectedAlertType?.alertTypeId === alertTypeEnum.successful }, 'text-center ps-3 pe-3 pt-2 pb-2 fw-bold')}
                                >
                                    Successful
                                </p>
                            </Col>
                        }
                        {metadata.filters.inProgress.isReady &&
                            <Col xs={12} md={4} className='order-md-2 order-3'>
                                <p
                                    onClick={() => setSelectedAlertType(data.configuration.alertTypes.find(alertType => alertType.alertTypeId === alertTypeEnum.inProgress))}
                                    className={cn(style.inProgress, { [style.active]: selectedAlertType?.alertTypeId === alertTypeEnum.inProgress }, 'text-center ps-3 pe-3 pt-2 pb-2 fw-bold')}
                                >
                                    In Progress
                                </p>
                            </Col>
                        }
                        {metadata.filters.unSuccessful.isReady &&
                            <Col xs={6} md={4} className='order-md-3 order-2'>
                                <p
                                    onClick={() => setSelectedAlertType(data.configuration.alertTypes.find(alertType => alertType.alertTypeId === alertTypeEnum.unSuccessful))}
                                    className={cn(style.unsuccessful, { [style.active]: selectedAlertType.alertTypeId === alertTypeEnum.unSuccessful }, 'text-center ps-3 pe-3 pt-2 pb-2 fw-bold')}
                                >
                                    Unsuccessful
                                </p>
                            </Col>
                        }
                    </Row>
                </Container>
            }

            <div className='mb-4'></div>

            {/* Buttons */}
            {
                metadata.buttons.isReady &&
                <Container className={cn(style.buttonsContainer, 'p-3')}>
                    <Row className={cn({
                        'justify-content-end': !metadata.buttons.createAlert.isReady && !metadata.buttons.userAlerts.isReady && metadata.buttons.globalAlerts.isReady,
                        'justify-content-start': metadata.buttons.userAlerts.isReady,
                        'justify-content-center': !metadata.buttons.userAlerts.isReady && !metadata.buttons.globalAlerts.isReady
                    })}>
                        {metadata.buttons.createAlert.isReady &&
                            <Col xs={2} className='align-self-center text-center p-0'>
                                <i onClick={() => navigate('create')} className={cn(style.plus, 'fas fa-plus align-middle')} />
                            </Col>
                        }
                        {metadata.buttons.userAlerts.isReady &&
                            <Col xs={2} className='align-self-center text-center p-0'>
                                <i
                                    onClick={() => {
                                        setSelectedAlertType(data.configuration.alertTypes.find(alertType => alertType.alertTypeId === alertTypeEnum.inProgress));
                                        setSelectedQuote(undefined);
                                        setSelectedUser(
                                            !data.user.isGuest
                                                ? data.user
                                                : undefined
                                        );
                                        setIsUserAlerts(!isUserAlerts);
                                    }}
                                    className={cn(style.arrow, 'fas fa-long-arrow-alt-left align-middle')}
                                />
                            </Col>
                        }
                        {metadata.buttons.title.isReady &&
                            <Col xs={8}>
                                <p className={cn(style.title, 'fw-bold fs-4 align-self-center text-center')}>
                                    {isUserAlerts
                                        ? `You Have ${data.quoteUserAlerts.length} Alerts`
                                        : `${data.quoteUserAlerts.length} Global Alerts`
                                    }
                                </p>
                            </Col>
                        }
                        {!metadata.buttons.title.isReady &&
                            <Col xs={8}>
                                <p className={cn(style.title, 'fw-bold fs-4 align-self-center text-center')}>
                                    Loading...
                                </p>
                            </Col>
                        }
                        {metadata.buttons.globalAlerts.isReady &&
                            <Col xs={2} className='align-self-center text-center p-0'>
                                <i
                                    onClick={() => {
                                        setSelectedAlertType(data.configuration.alertTypes.find(alertType => alertType.alertTypeId === alertTypeEnum.inProgress));
                                        setSelectedQuote(undefined);
                                        setSelectedUser(undefined);
                                        setIsUserAlerts(!isUserAlerts);
                                    }}
                                    className={cn(style.arrow, 'fas fa-long-arrow-alt-right align-middle')}
                                />
                            </Col>
                        }
                    </Row>
                </Container>
            }

            {/* Alerts */}
            {
                metadata.alerts.isReady &&
                <Container className={cn(style.alertsContainer, 'p-3')}>
                    {metadata.alerts.table.isReady &&
                        <Row className='gy-3'>
                            {data.quoteUserAlerts.map((quoteUserAlert, index) =>
                                <Col key={index}>
                                    <StockMarketQuoteUserAlert
                                        quoteUserAlert={quoteUserAlert}
                                        user={data.user}
                                        onManualCompletionClick={async (quoteUserAlert) => {
                                            var { data: completedQuoteUserAlert, isSuccess } = await StockMarketController.quote.userAlert.put({ quoteUserAlertId: quoteUserAlert.quoteUserAlertId });

                                            if (isSuccess) {
                                                setSelectedAlertType(completedQuoteUserAlert.type);
                                                setSelectedQuote(completedQuoteUserAlert.quote);
                                                setSelectedUser(data.user);
                                                setIsUserAlerts(true);
                                            }
                                        }}
                                    />
                                </Col>
                            )}
                        </Row>
                    }
                    {metadata.alerts.table.isLoading &&
                        <Loader isRelative={true} height={150} />
                    }
                </Container>
            }

            <div className='mb-4'></div>

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
        </Fragment >
    )
}

/**Data
 * @typedef Data
 * @property {UserContract} user
 * @property {StockMarketUserContract} profile
 * @property {StockMarketQuoteUserAlertContract[]} quoteUserAlerts
 * @property {StockMarketConfigurationContract} configuration
 * @property {boolean} isProfileLoaded
 * @property {boolean} isQuoteUserAlertsLoaded
 * @property {boolean} isConfigurationLoaded
*/