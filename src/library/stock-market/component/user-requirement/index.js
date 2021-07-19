import { useEffect, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import cn from 'classnames';
import dayjs from 'dayjs';

import { NumberExtension as Number } from '../../../base/base-extension';

import style from './style.module.scss';

/**@param {Props} */
export default function UserRequirement({
    user,
    quoteUserAlertRequirement,
    onIsUserMeetingRequirements
}) {
    const data = useMemo(() => ({
        requirements: [
            {
                title: 'Followers',
                requiredName: 'Minimum',
                requiredValue: quoteUserAlertRequirement.minimumFollowersCount,
                accountName: 'You Have',
                accountValue: user.stocktwits.followersCount,
                isMeetingRequirement: user.stocktwits.followersCount >= quoteUserAlertRequirement.minimumFollowersCount
            },
            {
                title: 'Followings',
                requiredName: 'Minimum',
                requiredValue: quoteUserAlertRequirement.minimumFollowingsCount,
                accountName: 'You Have',
                accountValue: user.stocktwits.followingsCount,
                isMeetingRequirement: user.stocktwits.followingsCount >= quoteUserAlertRequirement.minimumFollowingsCount
            },
            {
                title: 'Posts',
                requiredName: 'Minimum',
                requiredValue: quoteUserAlertRequirement.minimumPostsCount,
                accountName: 'You Have',
                accountValue: user.stocktwits.postsCount,
                isMeetingRequirement: user.stocktwits.postsCount >= quoteUserAlertRequirement.minimumPostsCount
            },
            {
                title: 'Likes',
                requiredName: 'Minimum',
                requiredValue: quoteUserAlertRequirement.minimumLikesCount,
                accountName: 'You Have',
                accountValue: user.stocktwits.likesCount,
                isMeetingRequirement: user.stocktwits.likesCount >= quoteUserAlertRequirement.minimumLikesCount
            },
            {
                title: 'Watchlists',
                requiredName: 'Quotes',
                requiredValue: quoteUserAlertRequirement.minimumWatchlistQuotesCount,
                accountName: 'You Have',
                accountValue: user.stocktwits.watchlistQuotesCount,
                isMeetingRequirement: user.stocktwits.watchlistQuotesCount >= quoteUserAlertRequirement.minimumWatchlistQuotesCount
            },
            {
                title: 'Age',
                requiredName: 'Months',
                requiredValue: quoteUserAlertRequirement.minimumStocktwitsCreatedOnAgeInMonths,
                accountName: 'You Have',
                accountValue: dayjs().subtract(1, 'month').diff(user.stocktwits.createdOn, 'month'),
                isMeetingRequirement: dayjs().subtract(1, 'month').diff(user.stocktwits.createdOn, 'month') >= quoteUserAlertRequirement.minimumStocktwitsCreatedOnAgeInMonths
            }
        ]
    }), [user, quoteUserAlertRequirement]);

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
 * @property {StockMarketQuoteUserAlertRequirementConfigurationContract} quoteUserAlertRequirement
 * @property {(isMeetingRequirements: boolean) => void} onIsUserMeetingRequirements
*/