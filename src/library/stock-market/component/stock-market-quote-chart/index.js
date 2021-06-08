import { useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { ComposedChart, Line, Bar, XAxis, YAxis, ReferenceLine, ResponsiveContainer, ReferenceDot, Tooltip } from 'recharts';
import Emoji from 'a11y-react-emoji';
import cn from 'classnames';

import { timeframeChartConfig } from './configuration';

import { timeframeEnum, exchangeEnum, alertTypeEnum } from '../../stock-market-enum';

import Loader from '../../../base/base-loader';

import style from './style.module.scss';

/**@param {Props}*/
export default function StockMarketQuoteChart({
    quote,
    quoteCandles,
    timeframe,
    timeframeMultiplier,
    latestPrice,
    isLoaded,
    quoteUserAlert,
    onCandleClick
}) {
    const data = useMemo(() => {
        if (!isLoaded || !quoteCandles || !quoteCandles.length || !timeframe || !timeframeMultiplier) return {};

        var chartConfig = timeframeChartConfig[timeframe.timeframeId];
        var config = chartConfig[timeframeMultiplier] || chartConfig.default;

        var candles = [...quoteCandles.filter(quoteCandle => quoteCandle.timeframeMultiplier <= timeframeMultiplier)];

        if (latestPrice) {
            candles[candles.length - 1].close = latestPrice.current;

            if (timeframe.timeframeId === timeframeEnum.oneDay && timeframeMultiplier === 1)
                candles[0].close = latestPrice.previousClose;
        }

        if (timeframe.timeframeId === timeframeEnum.oneDay && (quote.exchange.exchangeId === exchangeEnum.nyse || quote.exchange.exchangeId === exchangeEnum.nasdaq || quote.exchange.exchangeId === exchangeEnum.amex)) {
            var from = candles[candles.length - 1].createdOn;
            var to = from.startOf('day').add(16, 'hour');

            while (from.isBefore(to)) {
                from = from.add(1, 'minute');
                candles.push({ createdOn: from.clone() });
            }
        }

        candles.forEach((candle, index) => candle.index = index);

        var activeCandles = candles.filter(candle => candle.close === 0 || candle.close);

        var previousClose = quoteUserAlert?.buy || candles[0].close;
        var max = Math.max(...activeCandles.map((candle) => candle.close));
        var min = Math.min(...activeCandles.map((candle) => candle.close));
        var baseline = (100 - ((previousClose - min) / (max - min) * 100)) || 0;

        if (quoteUserAlert) {
            if (quoteUserAlert.completedSell) {
                max = quoteUserAlert.completedSell > max
                    ? Number.parseFloat(quoteUserAlert.completedSell.toPrecision(4))
                    : max;

                min = quoteUserAlert.completedSell < min
                    ? Number.parseFloat(quoteUserAlert.completedSell.toPrecision(4))
                    : min;
            } else {
                max = quoteUserAlert.sell > max
                    ? Number.parseFloat(quoteUserAlert.sell.toPrecision(4))
                    : max;

                min = quoteUserAlert.stopLoss < min
                    ? Number.parseFloat(quoteUserAlert.stopLoss.toPrecision(4))
                    : min;
            }
        }

        return {
            candles: activeCandles,
            candlesWithAlerts: activeCandles.filter(candle => candle.quoteUserAlerts.length),
            max,
            min,
            baseline,
            previousClose,
            quoteUserAlert,
            config: {
                xAxis: {
                    ticks: [...new Set(candles.map((candle) => candle.createdOn.format(config.xAxis.showTickEvery)))]
                        .map((groupKey) => candles.find(candle => candle.createdOn.format(config.xAxis.showTickEvery) === groupKey).index)
                        .filter(index => config.xAxis.isFirstTickShown || index !== 0),
                    domain: [0, candles.length - 1],
                    format: (index) => candles[index] ? candles[index].createdOn.format(config.xAxis.label) : '⏱️',
                },
                tooltip: {
                    format: (index) => candles[index] ? candles[index].createdOn.format(config.tooltip.label) : '⏱️'
                }
            }
        };
    }, [quote, quoteCandles, timeframe, isLoaded, timeframeMultiplier, latestPrice, quoteUserAlert]);

    return (
        <Container className={cn(style.container, 'position-relative pt-2 pb-2')}>
            <div className={cn(style.chartContainer, 'd-flex position-relative justify-content-center align-items-center')}>
                {!isLoaded
                    ? <Loader isRelative={true} />
                    : data.candles && data.candles.length
                        ?
                        <ResponsiveContainer width='100%' height='100%'>
                            <ComposedChart
                                margin={{
                                    left: 0,
                                    top: 15,
                                    bottom: 0,
                                    right: 0
                                }}
                                data={data.candles.map((candle) => ({
                                    index: candle.index,
                                    createdOn: candle.createdOn,
                                    price: candle.close,
                                    volume: candle.volume
                                }))}
                            >

                                <defs>
                                    <linearGradient id='price' x1='0' y1='0%' x2='0' y2='100%'>
                                        <stop offset={`${data.baseline}%`} stopColor='#31dd4b' />
                                        <stop offset={`${data.baseline}%`} stopColor='#dd3731' />
                                    </linearGradient>
                                    <filter id="priceShadow" x="0" y="0" width="100%" height="100%">
                                        <feOffset result="offOut" in="SourceGraphic" dx="0" dy="3" />
                                        <feGaussianBlur result="blurOut" in="offOut" stdDeviation="5" />
                                        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                                    </filter>
                                </defs>

                                <XAxis
                                    stroke='white'
                                    tick={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                                    dy={10}
                                    axisLine={false}
                                    ticks={data.config.xAxis.ticks}
                                    domain={data.config.xAxis.domain}
                                    interval='preserveStart'
                                    type='number'
                                    dataKey='index'
                                    tickFormatter={data.config.xAxis.format}
                                />

                                <YAxis
                                    yAxisId='price'
                                    stroke='white'
                                    tick={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                                    dx={10}
                                    type='number'
                                    dataKey='price'
                                    interval='preserveStartEnd'
                                    axisLine={false}
                                    allowDecimals={true}
                                    orientation='right'
                                    domain={quoteUserAlert
                                        ? [data.min, data.max]
                                        : ['auto', 'auto']
                                    }
                                />

                                <YAxis
                                    yAxisId='volume'
                                    hide={true}
                                    type='number'
                                    dataKey='volume'
                                    domain={['auto', 'auto']}
                                />

                                <ReferenceLine
                                    yAxisId='price'
                                    y={data.previousClose}
                                    stroke='#7d7f85'
                                    strokeDasharray='5'
                                >
                                </ReferenceLine>

                                {data.config.xAxis.ticks.map((tick, index) =>
                                    <ReferenceLine
                                        yAxisId='price'
                                        key={index}
                                        x={tick}
                                        stroke="white"
                                        strokeOpacity={0.05}
                                        strokeWidth={1}
                                    />
                                )}

                                {data.quoteUserAlert &&
                                    <ReferenceLine
                                        yAxisId='price'
                                        y={Number.parseFloat((data.quoteUserAlert.completedSell || data.quoteUserAlert.sell).toPrecision(4))}
                                        className={cn({
                                            [style.alertSell]: data.quoteUserAlert.type.alertTypeId === alertTypeEnum.successful || data.quoteUserAlert.type.alertTypeId === alertTypeEnum.inProgress,
                                            [style.alertStopLoss]: data.quoteUserAlert.type.alertTypeId === alertTypeEnum.unSuccessful
                                        })}
                                    />
                                }

                                {data.quoteUserAlert && !data.quoteUserAlert.completedSell &&
                                    <ReferenceLine
                                        yAxisId='price'
                                        y={data.quoteUserAlert.stopLoss}
                                        className={style.alertStopLoss}
                                    />
                                }

                                <Bar
                                    yAxisId='volume'
                                    isAnimationActive={false}
                                    dataKey='volume'
                                    stroke='none'
                                    fill='#12131a'
                                    opacity={0.75}
                                />

                                <Line
                                    isAnimationActive={false}
                                    yAxisId='price'
                                    strokeWidth={1}
                                    type='linear'
                                    dataKey='price'
                                    stroke='url(#price)'
                                    filter='url(#priceShadow)'
                                    dot={false}
                                />

                                <Tooltip
                                    labelFormatter={data.config.tooltip.format}
                                    offset={100}
                                    isAnimationActive={false}
                                    wrapperClassName={style.tooltip}
                                    labelClassName={style.tooltipLabel}
                                />

                                {data.candlesWithAlerts.map((candle, index) =>
                                    candle.quoteUserAlerts.map((candleQuoteUserAlert) =>
                                        <ReferenceDot
                                            yAxisId='price'
                                            y={candleQuoteUserAlert.buy}
                                            x={candle.index}
                                            className={cn({
                                                [style.inProgress]: candleQuoteUserAlert.type.alertTypeId === alertTypeEnum.inProgress,
                                                [style.successful]: candleQuoteUserAlert.type.alertTypeId === alertTypeEnum.successful,
                                                [style.unSuccessful]: candleQuoteUserAlert.type.alertTypeId === alertTypeEnum.unSuccessful
                                            })}
                                            r={candleQuoteUserAlert.quoteUserAlertId === quoteUserAlert?.quoteUserAlertId
                                                ? 10
                                                : 5
                                            }
                                            style={{
                                                animationDelay: `calc(0.5s + ${index * 150}ms)`
                                            }}
                                            onClick={() => onCandleClick(candle)}
                                        />
                                    )
                                )}
                            </ComposedChart>
                        </ResponsiveContainer>
                        : <p className={cn(style.error, 'fs-4 fw-bold')}>Problem getting history data <Emoji symbol='😐' label='sad' /></p>
                }
            </div>
        </Container>
    )
}

/**Props
 * @typedef Props
 * @property {StockMarketQuoteContract} quote
 * @property {StockMarketQuoteCandleContract[]} quoteCandles
 * @property {StockMarketTimeframeContract} timeframe
 * @property {number} timeframeMultiplier
 * @property {StockMarketQuotePriceContract} latestPrice
 * @property {StockMarketQuoteUserAlertContract} quoteUserAlert
 * @property {boolean} isLoaded
 * @property {(candle: StockMarketQuoteCandleContract) => void} onCandleClick
*/