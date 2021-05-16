import { Fragment, useMemo, useState } from 'react';
import cn from 'classnames';

import { alertTypeEnum } from '../../stock-market-enum';

import Loader from '../../../base/base-loader';

import style from './style.module.scss';

/**@param {Props} */
export default function StockMarketQuoteUserAlert({
    quoteUserAlert,
    user,
    onManualCompletionClick
}) {
    const [isPendingManualCompletion, setIsPendingManualCompletion] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const data = useMemo(() => ({
        symbol: quoteUserAlert.quote.symbol,
        buy: quoteUserAlert.buy.toFixed(2),
        sell: quoteUserAlert.sell.toFixed(2),
        sellPoints: quoteUserAlert.sellPoints.toFixed(2),
        stopLoss: quoteUserAlert.stopLoss.toFixed(2),
        stopLossPoints: quoteUserAlert.stopLossPoints.toFixed(2),
        completedSell: quoteUserAlert.completedSell?.toFixed(2),
        completedSellPoints: quoteUserAlert.completedSellPoints?.toFixed(2),
        username: quoteUserAlert.user.stocktwits.username,
        createdOnDate: quoteUserAlert.createdOn.format('MM/DD/YYYY'),
        createdOnTime: quoteUserAlert.createdOn.format('hh:mm A'),
        completedOnDate: quoteUserAlert.completedOn?.format('MM/DD/YYYY'),
        completedOnTime: quoteUserAlert.completedOn?.format('hh:mm A'),
        alertType: quoteUserAlert.alertType,
        isManualCompletionAllowedForUser: user && !user.isGuest && quoteUserAlert.user.userId === user.userId && quoteUserAlert.alertType.alertTypeId === alertTypeEnum.inProgress
    }), [quoteUserAlert, user]);

    return (
        <div className={cn(style.alertContainer, 'position-relative h-100 pt-2 pb-2')}>
            <div className='position-relative'>
                {data.isManualCompletionAllowedForUser &&
                    <div className='position-absolute ps-3'>
                        <i
                            onClick={() => setIsPendingManualCompletion(true)}
                            className={cn(style.cross, 'fs-4 fas fa-times')}
                        />
                    </div>
                }
                <p className={cn(style.quoteId, 'text-center pb-2 fs-4 fw-bold')}>{data.symbol}</p>
                <p className={cn(style.value, style.username, 'text-center fw-bold pb-2')}>{data.username}</p>
            </div>
            <div className='d-flex justify-content-center'>
                <div className='p-2'>
                    <p className={cn(style.name, 'text-center fw-bold pb-2')}>Buy</p>
                    <p className={cn(style.value, 'text-center fw-bold')}>{data.buy}</p>
                </div>
                <div className='p-2'>
                    <p className={cn(style.name, 'text-center fw-bold pb-2')}>Sell</p>
                    <p className={cn(style.value, 'text-center fw-bold')}>{data.sell}</p>
                </div>
                <div className='p-2'>
                    <p className={cn(style.name, 'text-center fw-bold pb-2')}>Stop</p>
                    <p className={cn(style.value, 'text-center fw-bold')}>{data.stopLoss}</p>
                </div>
            </div>
            <div className='d-flex justify-content-center'>
                <div className='p-2'>
                    <p className={cn(style.name, 'text-center lh-sm fw-bold pb-2')}>Sell Points</p>
                    <p className={cn(style.value, style.sellPoints, 'text-center fw-bold')}>+{data.sellPoints}</p>
                </div>
                <div className='p-2'>
                    <p className={cn(style.name, 'text-center lh-sm fw-bold pb-2')}>Stop Points</p>
                    <p className={cn(style.value, style.stopPoints, 'text-center fw-bold')}>{data.stopLossPoints}</p>
                </div>
            </div>
            <div className='d-flex justify-content-center'>
                <div className='p-2'>
                    <p className={cn(style.name, style.createdOn, 'text-center fw-bold pb-2')}>Created</p>
                    <p className={cn(style.value, style.createdOn, 'd-md-block d-none text-center fw-bold pb-2')}>{`${data.createdOnDate} ${data.createdOnTime}`}</p>
                    <p className={cn(style.value, style.createdOn, 'd-md-none text-center fw-bold pb-2')}>{data.createdOnDate}</p>
                    <p className={cn(style.value, style.createdOn, 'd-md-none text-center fw-bold')}>{data.createdOnTime}</p>
                </div>
                {data.alertType.alertTypeId !== alertTypeEnum.inProgress &&
                    <div className='p-2'>
                        <p className={cn(style.name, style.completedOn, 'text-center fw-bold pb-2')}>Completed</p>
                        <p className={cn(style.value, style.completedOn, 'd-md-block d-none text-center fw-bold pb-2')}>{`${data.completedOnDate} ${data.completedOnTime}`}</p>
                        <p className={cn(style.value, style.completedOn, 'd-md-none text-center fw-bold pb-2')}>{data.completedOnDate}</p>
                        <p className={cn(style.value, style.completedOn, 'd-md-none text-center fw-bold')}>{data.completedOnTime}</p>
                    </div>
                }
            </div>
            {data.alertType.alertTypeId !== alertTypeEnum.inProgress &&
                <div className='d-flex justify-content-center'>
                    <div className='p-2'>
                        <p className={cn(style.name, 'text-center lh-sm fw-bold pb-2')}>Completed Sell</p>
                        <p className={cn(style.value, 'text-center fw-bold')}>{data.completedSell}</p>
                    </div>
                    <div className='p-2'>
                        <p className={cn(style.name, 'text-center lh-sm fw-bold pb-2')}>Completed Points</p>
                        <p className={cn(style.value, { [style.sellPoints]: data.alertType.alertTypeId === alertTypeEnum.successful, [style.stopPoints]: data.alertType.alertTypeId === alertTypeEnum.unSuccessful }, 'text-center fw-bold')}>{data.completedSellPoints > 0 && '+'}{data.completedSellPoints}</p>
                    </div>
                </div>
            }
            <p className={cn({ [style.inProgress]: data.alertType.alertTypeId === alertTypeEnum.inProgress, [style.successful]: data.alertType.alertTypeId === alertTypeEnum.successful, [style.unsuccessful]: data.alertType.alertTypeId === alertTypeEnum.unSuccessful }, 'text-center fw-bold')}>{data.alertType.name}</p>
            {(isPendingManualCompletion || isCompleting) &&
                <div className={cn(style.overlay, 'position-absolute d-flex flex-column justify-content-center align-items-center p-2')}>
                    {isPendingManualCompletion &&
                        <Fragment>
                            <p className={cn(style.areYouSure, 'text-center fs-4 pb-2 fw-bold')}>Manually Complete This Alert?</p>
                            <div className='p-2 d-flex justify-content-center w-100'>
                                <p onClick={() => setIsPendingManualCompletion(false)} className={cn(style.no, 'text-center fw-bold ps-md-3 ps-2 pe-md-3 pe-2 pt-2 pb-2')}>No</p>
                                <div className='p-2'></div>
                                <p onClick={async () => {
                                    setIsPendingManualCompletion(false);
                                    setIsCompleting(true);
                                    onManualCompletionClick && onManualCompletionClick(quoteUserAlert);
                                }} className={cn(style.yes, 'text-center fw-bold ps-md-3 ps-2 pe-md-3 pe-2 pt-2 pb-2')}>Yes</p>
                            </div>
                        </Fragment>
                    }
                    {isCompleting &&
                        <Loader isRelative={true} height={100} />
                    }
                </div>
            }
        </div>
    )
}

/**Props
 * @typedef Props
 * @property {StockMarketQuoteUserAlertContract} quoteUserAlert
 * @property {UserContract} user
 * @property {(quoteUserAlert: StockMarketQuoteUserAlertContract) => void} onManualCompletionClick
*/