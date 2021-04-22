import { useMemo, useState } from 'react';
import { Container, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import Emoji from 'a11y-react-emoji';
import cn from 'classnames';

import { NumberExtension as Number } from '../base-extension';

import style from './style.module.scss';

/**@param {Props}*/
export default function BaseEmotionCount({
    emotions,
    emotionCounts,
    user,
    groupUserConfiguration,
    title,
    group,
    onClick
}) {
    const [isClicked, setIsClicked] = useState(false);
    const data = useMemo(() => ({
        emotions: emotions.map((emotion) => ({
            ...emotion,
            /**@type {number} */
            groupCount: (() => {
                var emotionCount = emotionCounts.find(emotionCount => emotionCount.emotion.emotionId === emotion.emotionId);
                return emotionCount?.cityCount || emotionCount?.quoteCount || 0;
            })(),
            /**@type {number} */
            globalCount: emotionCounts.find(emotionCount => emotionCount.emotion.emotionId === emotion.emotionId)?.globalCount || 0,
            isSelected: emotion.emotionId === groupUserConfiguration?.emotion?.emotionId
        })),
        isDisabled: !user || user.isGuest || !groupUserConfiguration || Boolean(groupUserConfiguration.emotion) || groupUserConfiguration.selectionsToday >= groupUserConfiguration.limitToday,
        isGuest: !user || user.isGuest,
        selectionsToday: groupUserConfiguration?.selectionsToday || 0,
        limitToday: groupUserConfiguration?.limitToday || 0,
        title: title || '',
        group: group || 'Group'
    }), [emotions, emotionCounts, user, groupUserConfiguration, title, group]);

    return (
        <Container className={cn(style.container, 'container-fluid pt-2 pb-2 ps-md-4 ps-2 pe-md-4 pe-2')}>
            <Row>
                <Col>
                    <p className={cn(style.title, 'text-center fs-5 fw-bold pb-2')}>{data.title}</p>
                </Col>
            </Row>
            <Row className='gx-md-3 gx-0'>
                <Col className='d-md-block d-none'>
                    <div className='text-start pt-2 pb-2'>
                        <p className={cn(style.type, 'fw-bold fs-4')}>Emotion</p>
                        <p className={cn(style.group, 'fw-bold pt-2')}>{data.group}</p>
                        <p className={cn(style.global, 'fw-bold pt-2')}>Global</p>
                    </div>
                </Col>
                {data.emotions.map((emotion, index) =>
                    <Col key={index}>
                        <div
                            onClick={async () => {
                                if (data.isDisabled || isClicked) return;

                                setIsClicked(true);

                                onClick && await onClick(emotion);

                                setIsClicked(false);
                            }}
                            className={cn(style.emotionContainer, { [style.active]: emotion.isSelected, [style.disabled]: data.isDisabled }, 'text-center pt-2 pb-2')}
                        >
                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip id='button-tooltip'>
                                        <p className='fw-bold'>{emotion.name}</p>
                                    </Tooltip>
                                }
                            >
                                <div className={style.emotionOverlay}>
                                    <Emoji className='fs-4' symbol={emotion.emoji} />
                                </div>
                            </OverlayTrigger>
                            <p className={cn(style.group, 'fw-bold pt-2')}>{Number.toUniversalString(emotion.groupCount)}</p>
                            <p className={cn(style.global, 'fw-bold pt-2')}>{Number.toUniversalString(emotion.globalCount)}</p>
                        </div>
                    </Col>
                )}
            </Row>
            {!data.isGuest &&
                <Row>
                    <Col>
                        <div>
                            <small className={cn(style.dailyLimit, 'fw-bold text-center pt-2')}>Daily Limit {data.selectionsToday} / {data.limitToday}</small>
                        </div>
                    </Col>
                </Row>
            }
        </Container>
    )
}

/**Props
 * @typedef Props
 * @property {WeatherEmotionContract[] | StockMarketEmotionContract[]} emotions
 * @property {WeatherCityEmotionCountContract[] | StockMarketQuoteEmotionCountContract[]} emotionCounts
 * @property {UserContract} user
 * @property {WeatherCityUserConfigurationContract | StockMarketQuoteUserConfigurationContract} groupUserConfiguration
 * @property {string} title
 * @property {string} group
 * @property {(emotion: WeatherEmotionContract | StockMarketEmotionContract) => Promise<void>} onClick
*/