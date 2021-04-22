import { Fragment, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import parsePhoneNumber from 'libphonenumber-js';
import cn from 'classnames';

import { NumberExtension as Number } from '../../../base/base-extension'

import style from './style.module.scss';

/**@param {Props} */
export default function StockMarketQuoteCompany({
    quoteCompany,
    quotePrice
}) {
    const data = useMemo(() => ({
        statistics: [
            {
                left: {
                    name: 'Previous Close',
                    value: quotePrice?.previousClose
                },
                right: {
                    name: 'Market Capitalization',
                    value: quotePrice?.marketCapitalization && Number.toUniversalString(quotePrice.marketCapitalization)
                }
            },
            {
                left: {
                    name: 'Open',
                    value: quotePrice?.open
                },
                right: {
                    name: 'Beta',
                    value: quoteCompany?.beta
                }
            },
            {
                left: {
                    name: 'One Day Range',
                    value: quotePrice?.low && quotePrice?.high && `${quotePrice?.low} - ${quotePrice?.high}`
                },
                right: {
                    name: 'Price To Earnings Ratio',
                    value: quotePrice?.priceToEarningsRatio
                }
            },
            {
                left: {
                    name: 'One Year Range',
                    value: quotePrice?.oneYearLow && quotePrice?.oneYearHigh && `${quotePrice?.oneYearLow} - ${quotePrice?.oneYearHigh}`
                },
                right: {
                    name: 'Earnings Per Share',
                    value: quotePrice?.earningsPerShare
                }
            },
            {
                left: {
                    name: 'Volume',
                    value: quotePrice?.volume && Number.toUniversalString(quotePrice.volume)
                },
                right: {
                    name: 'Earnings Announced On',
                    value: quotePrice?.earningsPerShareAnnouncedOn && quotePrice.earningsPerShareAnnouncedOn.format('MM-DD-YYYY')
                }
            },
            {
                left: {
                    name: 'Average Volume',
                    value: quotePrice?.averageVolume && Number.toUniversalString(quotePrice.averageVolume)
                },
                right: {
                    name: 'Shares Outstanding',
                    value: quotePrice?.sharesOutstanding && Number.toUniversalString(quotePrice.sharesOutstanding)
                }
            }
        ],
        extras: [
            {
                left: {
                    name: 'Chief Executive Officer',
                    value: quoteCompany?.chiefExecutiveOfficer
                },
                right: {
                    name: 'Website',
                    value: <a className={style.link} href={quoteCompany?.websiteUrl || ''} rel='noopener noreferrer' target='_blank'>{quoteCompany?.websiteUrl && 'Homepage 📰'}</a>
                }
            },
            {
                left: {
                    name: 'Employees',
                    value: quoteCompany?.employees
                },
                right: {
                    name: 'Address',
                    value: quoteCompany?.address && `${quoteCompany?.address}, ${quoteCompany?.city && `${quoteCompany.city}, `}${quoteCompany?.country}`
                }
            },
            {
                left: {
                    name: 'Industry',
                    value: quoteCompany?.industry
                },
                right: {
                    name: 'Phone Number',
                    value: quoteCompany?.phone && quoteCompany?.country.length === 2 && parsePhoneNumber(quoteCompany.phone, quoteCompany.country).formatInternational()
                }
            },
            {
                left: {
                    name: 'Exchange',
                    value: quoteCompany?.exchange
                },
                right: {
                    name: 'Initial Public Offering On',
                    value: quoteCompany?.initialPublicOfferingOn && quoteCompany.initialPublicOfferingOn.format('MM-DD-YYYY')
                }
            }
        ]
    }), [quoteCompany, quotePrice]);

    return (
        <Fragment>
            <Container className={cn(style.container, 'pb-3')}>
                <Row>
                    <Col xs={12} md={6}>
                        {data.statistics.map((statistic, index) =>
                            <Row key={index}>
                                <Col>
                                    <div className={cn(style.valueContainer, { [style.noBorderOnMobile]: index === data.statistics.length - 1, 'pb-md-0': index === data.statistics.length - 1 }, 'ps-2 pe-2 pt-3 pb-3')}>
                                        <p className={cn(style.title, 'fw-bold text-start')}>{statistic.left.name}</p>
                                        <p className={cn(style.value, 'fw-bold text-end')}>{statistic.left.value}</p>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </Col>
                    <Col xs={12} md={6}>
                        {data.statistics.map((statistic, index) =>
                            <Row key={index}>
                                <Col>
                                    <div className={cn(style.valueContainer, { 'border-0': index === data.statistics.length - 1, 'pb-3': index !== data.statistics.length - 1 }, 'ps-2 pe-2 pt-3')}>
                                        <p className={cn(style.title, 'fw-bold text-start')}>{statistic.right.name}</p>
                                        <p className={cn(style.value, 'fw-bold text-right')}>{statistic.right.value}</p>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Row>
            </Container>
            {quoteCompany &&
                <Fragment>
                    <div className='m-4'></div>
                    <Container className={cn(style.container, 'pb-3')}>
                        <Row>
                            <Col xs={12} md={6}>
                                {data.extras.map((extra, index) =>
                                    <Row key={index}>
                                        <Col>
                                            <div className={cn(style.valueContainer, { [style.noBorderOnMobile]: index === data.extras.length - 1, 'pb-md-0': index === data.extras.length - 1 }, 'ps-2 pe-2 pt-3 pb-3')}>
                                                <p className={cn(style.title, 'fw-bold text-start')}>{extra.left.name}</p>
                                                <p className={cn(style.value, 'fw-bold text-end')}>{extra.left.value}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                )}
                            </Col>
                            <Col xs={12} md={6}>
                                {data.extras.map((extra, index) =>
                                    <Row key={index}>
                                        <Col>
                                            <div className={cn(style.valueContainer, { 'border-0': index === data.extras.length - 1, 'pb-3': index !== data.extras.length - 1 }, 'ps-2 pe-2 pt-3')}>
                                                <p className={cn(style.title, 'fw-bold text-start')}>{extra.right.name}</p>
                                                <p className={cn(style.value, 'fw-bold text-end')}>{extra.right.value}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </Fragment>
            }
        </Fragment>
    )
}

/**Props
 * @typedef Props
 * @property {StockMarketQuoteCompanyContract} quoteCompany
 * @property {StockMarketQuotePriceContract} quotePrice
*/