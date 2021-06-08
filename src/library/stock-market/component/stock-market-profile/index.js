import { Fragment, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import cn from 'classnames';

import { alertTypeEnum } from '../../stock-market-enum';

import Loader from '../../../base/base-loader';

import style from './style.module.scss';

/**@param {Props} */
export default function StockMarketProfile({
    profile,
    isLoading
}) {
    const data = useMemo(() => {
        if (isLoading) return;

        var successfulCount = profile.alertTypeCounts.find(alertTypeCount => alertTypeCount.type.alertTypeId === alertTypeEnum.successful) || {
            count: 0,
            points: 0,
            type: {
                alertTypeId: alertTypeEnum.successful,
                name: 'Successful'
            }
        };
        var unSuccessfulCount = profile.alertTypeCounts.find(alertTypeCount => alertTypeCount.type.alertTypeId === alertTypeEnum.unSuccessful) || {
            count: 0,
            points: 0,
            type: {
                alertTypeId: alertTypeEnum.unSuccessful,
                name: 'Unsuccessful'
            }
        };
        var totalCount = {
            count: successfulCount.count + unSuccessfulCount.count,
            points: successfulCount.points + unSuccessfulCount.points,
            type: {
                alertTypeId: 0,
                name: 'Total'
            }
        }

        return {
            counts: [
                successfulCount,
                unSuccessfulCount,
                totalCount
            ]
        }
    }, [profile, isLoading]);

    return (
        <Container className={cn(style.container, 'p-3')}>
            {!isLoading &&
                <Fragment>
                    <Row className='pb-3'>
                        <Col>
                            <p className={cn(style.profile, 'fw-bold fs-4 text-center')}>Profile</p>
                        </Col>
                    </Row>
                    <Row className='gy-3'>
                        {data.counts.map((alertTypeCount, index) =>
                            <Col key={index}>
                                <div className={cn(style.container, 'p-2')}>
                                    <p className={cn(style.alertType, 'fw-bold text-center')}>{alertTypeCount.type.name}</p>
                                    <div className={cn(style.valueContainer, 'ps-2 pe-2 pt-3 pb-3')}>
                                        <p className={cn(style.title, 'fw-bold text-start')}>Count</p>
                                        <p className={cn(style.value, 'fw-bold text-right')}>{alertTypeCount.count}</p>
                                    </div>
                                    <div className={cn(style.valueContainer, 'border-0 ps-2 pe-2 pt-3 pb-3')}>
                                        <p className={cn(style.title, 'fw-bold text-start')}>Points</p>
                                        <p className={cn(style.value, 'fw-bold text-right')}>{alertTypeCount.points.toFixed(2)}</p>
                                    </div>
                                </div>
                            </Col>
                        )}
                    </Row>
                </Fragment>
            }
            {isLoading &&
                <Loader isRelative={true} height={100} />
            }
        </Container>
    )
}

/**Props
 * @typedef Props
 * @property {StockMarketUserContract} profile
 * @property {boolean} isLoading
*/