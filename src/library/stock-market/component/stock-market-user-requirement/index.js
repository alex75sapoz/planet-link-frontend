import { useEffect, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import cn from 'classnames';
import dayjs from 'dayjs';

import { NumberExtension as Number } from '../../../base/base-extension';

import style from './style.module.scss';

/**@param {Props} */
export default function StockMarketUserRequirement({
    user,
    createQuoteUserAlertRequirement,
    onIsUserMeetingRequirements
}) {
    const data = useMemo(() => ({
        requirements: [
            {
                title: 'Followers',
                requiredName: 'Minimum',
                requiredValue: createQuoteUserAlertRequirement.minimumFollowersCount,
                accountName: 'You Have',
                accountValue: user.followersCount,
                isMeetingRequirement: user.followersCount >= createQuoteUserAlertRequirement.minimumFollowersCount
            },
            {
                title: 'Followings',
                requiredName: 'Minimum',
                requiredValue: createQuoteUserAlertRequirement.minimumFollowingsCount,
                accountName: 'You Have',
                accountValue: user.followingsCount,
                isMeetingRequirement: user.followingsCount >= createQuoteUserAlertRequirement.minimumFollowingsCount
            },
            {
                title: 'Posts',
                requiredName: 'Minimum',
                requiredValue: createQuoteUserAlertRequirement.minimumPostsCount,
                accountName: 'You Have',
                accountValue: user.postsCount,
                isMeetingRequirement: user.postsCount >= createQuoteUserAlertRequirement.minimumPostsCount
            },
            {
                title: 'Likes',
                requiredName: 'Minimum',
                requiredValue: createQuoteUserAlertRequirement.minimumLikesCount,
                accountName: 'You Have',
                accountValue: user.likesCount,
                isMeetingRequirement: user.likesCount >= createQuoteUserAlertRequirement.minimumLikesCount
            },
            {
                title: 'Watchlists',
                requiredName: 'Quotes',
                requiredValue: createQuoteUserAlertRequirement.minimumWatchlistQuotesCount,
                accountName: 'You Have',
                accountValue: user.watchlistQuotesCount,
                isMeetingRequirement: user.watchlistQuotesCount >= createQuoteUserAlertRequirement.minimumWatchlistQuotesCount
            },
            {
                title: 'Age',
                requiredName: 'Months',
                requiredValue: createQuoteUserAlertRequirement.minimumStocktwitsCreatedOnAgeInMonths,
                accountName: 'You Have',
                accountValue: dayjs().subtract(1, 'month').diff(user.stocktwitsCreatedOn, 'month'),
                isMeetingRequirement: dayjs().subtract(1, 'month').diff(user.stocktwitsCreatedOn, 'month') >= createQuoteUserAlertRequirement.minimumStocktwitsCreatedOnAgeInMonths
            }
        ]
    }), [user, createQuoteUserAlertRequirement]);

    useEffect(() => {
        onIsUserMeetingRequirements && onIsUserMeetingRequirements(!data.requirements.some(requirement => !requirement.isMeetingRequirement));
    }, [data, onIsUserMeetingRequirements]);

    return (
        <Container className={cn(style.container, 'p-3 pb-2')}>
            <Row className='pb-3'>
                <Col>
                    <p className={cn(style.heading, 'fw-bold text-center fs-4')}>Account Requirements</p>
                </Col>
            </Row>
            <Row className='gy-3'>
                {data.requirements.map((requirement, index) =>
                    <Col key={index} className='h-100'>
                        <div className={cn({ [style.goodContainer]: requirement.isMeetingRequirement, [style.badContainer]: !requirement.isMeetingRequirement }, 'p-2')}>
                            <p className={cn(style.requirement, { [style.good]: requirement.isMeetingRequirement, [style.bad]: !requirement.isMeetingRequirement }, 'fw-bold text-center')}>{requirement.title}</p>
                            <div className={cn(style.valueContainer, 'ps-2 pe-2 pt-3 pb-3')}>
                                <p className={cn(style.title, 'fw-bold text-start')}>{requirement.requiredName}</p>
                                <p className={cn(style.value, 'fw-bold text-right ps-2')}>{Number.toUniversalString(requirement.requiredValue)}</p>
                            </div>
                            <div className={cn(style.valueContainer, 'border-0 ps-2 pe-2 pt-3 pb-3')}>
                                <p className={cn(style.title, 'fw-bold text-start')}>{requirement.accountName}</p>
                                <p className={cn(style.value, 'fw-bold text-right ps-2')}>{Number.toUniversalString(requirement.accountValue)}</p>
                            </div>
                        </div>
                    </Col>
                )}
            </Row>
            <p className={cn(style.footer, 'd-block text-center pt-2 fw-bold')}>*Account data is updated every hour</p>
        </Container>
    )
}

/**Props
 * @typedef Props
 * @property {UserContract} user
 * @property {StockMarketCreateQuoteUserAlertRequirementConfigurationContract} createQuoteUserAlertRequirement
 * @property {(isMeetingRequirements: boolean) => void} onIsUserMeetingRequirements
*/