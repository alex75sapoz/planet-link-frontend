import { Container, Row, Col } from 'react-bootstrap';
import cn from 'classnames';

import { StockMarketAsset } from '../../../../api/stock-market-controller';

import style from './style.module.scss';

export default function StockMarketContribution() {
    return (
        <Container>
            <Row className='gx-3 gy-3 justify-content-center'>
                <Col xs md={6} className='ps-0 pe-0'>
                    <div className={cn(style.linkContainer, 'm-auto pt-2 pb-2')}>
                        <a className={style.link} href='https://financialmodelingprep.com/' rel='noopener noreferrer' target='_blank'>
                            <div className='text-center'>
                                <p className={cn(style.title, 'fw-bold pb-2')}>Powered By</p>
                                <p className={style.logo}>FMP</p>
                            </div>
                        </a>
                    </div>
                </Col>
                <Col xs md={6} className='ps-0 pe-0'>
                    <div className={cn(style.linkContainer, 'm-auto pt-2 pb-2')}>
                        <a className={style.link} href='https://stocktwits.com/' rel='noopener noreferrer' target='_blank'>
                            <div className='text-center'>
                                <p className={cn(style.title, 'fw-bold pb-2')}>Powered By</p>
                                <img className='mt-2' src={StockMarketAsset.extra.stockTwitsLogo} height={30} alt='' />
                            </div>
                        </a>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}