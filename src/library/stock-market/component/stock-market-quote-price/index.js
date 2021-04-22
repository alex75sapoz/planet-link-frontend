import { Container, Row, Col } from 'react-bootstrap';
import cn from 'classnames';

import style from './style.module.scss';

/**@param {Props} */
export default function StockMarketQuotePrice({
    quote,
    quotePrice,
    isOpenForTrading
}) {
    return (
        <Container className={cn(style.container, 'pt-3 pb-3')}>
            <Row>
                <Col>
                    <p className={cn(style.quoteId, 'fs-4 fw-bold text-center')}>{quote.symbol}</p>
                    <p className={cn(style.name, 'fw-bold text-center')}>{quote.name}</p>
                </Col>
            </Row>
            <Row className='m-auto'>
                <Col xs={4} className='text-center p-0'>
                    <small className={cn(style.high, { [style.green]: quotePrice.highChange > 0, [style.red]: quotePrice.highChange < 0, [style.neutral]: quotePrice.highChange === 0 }, 'm-2')}>{quotePrice.high}</small>
                    <div className={cn(style.separator, 'm-auto')}></div>
                    <p className={cn(style.current, { [style.green]: quotePrice.currentChange > 0, [style.red]: quotePrice.currentChange < 0, [style.neutral]: quotePrice.currentChange === 0 }, 'fs-5 fw-bold pt-2 pb-2 m-0')}>{quotePrice.current}</p>
                    <div className={cn(style.separator, 'm-auto')}></div>
                    <small className={cn(style.low, { [style.green]: quotePrice.lowChange > 0, [style.red]: quotePrice.lowChange < 0, [style.neutral]: quotePrice.lowChange === 0 }, 'm-2')}>{quotePrice.low}</small>
                </Col>
                <Col xs={4} className='text-center ps-2 pe-2'>
                    <small className={cn(style.highText, 'm-2')}>High</small>
                    <div className={cn(style.separator, 'm-auto')}></div>
                    <p className={cn(style.currentText, 'fs-5 fw-bold pt-2 pb-2')}>{isOpenForTrading ? 'Market' : 'Close'}</p>
                    <div className={cn(style.separator, 'm-auto')}></div>
                    <small className={cn(style.lowText, 'm-2')}>Low</small>
                </Col>
                <Col xs={4} className='text-center p-0'>
                    <small className={cn(style.high, { [style.green]: quotePrice.highChange > 0, [style.red]: quotePrice.highChange < 0, [style.neutral]: quotePrice.highChange === 0 }, 'm-2')}>{quotePrice.highChangePercent.toFixed(2)}%</small>
                    <div className={cn(style.separator, 'm-auto')}></div>
                    <p className={cn(style.current, { [style.green]: quotePrice.currentChange > 0, [style.red]: quotePrice.currentChange < 0, [style.neutral]: quotePrice.currentChange === 0 }, 'fs-5 fw-bold pt-2 pb-2')}>{quotePrice.currentChangePercent.toFixed(2)}%</p>
                    <div className={cn(style.separator, 'm-auto')}></div>
                    <small className={cn(style.low, { [style.green]: quotePrice.lowChange > 0, [style.red]: quotePrice.lowChange < 0, [style.neutral]: quotePrice.lowChange === 0 }, 'm-2')}>{quotePrice.lowChangePercent.toFixed(2)}%</small>
                </Col>
            </Row>
            <Row className='pt-2'>
                <Col className='text-center'>
                    <small className={cn(style.dataAsOf, 'fw-bold')}>Data as of {quotePrice.createdOn.format('hh:mm:ss A')} ET</small>
                </Col>
            </Row>
        </Container>
    )
}

/**Props
 * @typedef Props
 * @property {StockMarketQuoteContract} quote
 * @property {StockMarketQuotePriceContract} quotePrice
 * @property {boolean} isOpenForTrading
*/