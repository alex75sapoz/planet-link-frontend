import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import cn from 'classnames';

import style from './style.module.scss';

/**@param {Props} */
export default function StockMarketTimeframeSelector({
    timeframes,
    timeframe,
    onClick,
    onMultiplierClick
}) {
    const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
    const [selectedMultiplier, setSelectedMultiplier] = useState(1);

    return (
        <Container>
            <Row>
                {timeframes.map((timeframe, index) =>
                    <Col
                        key={index}
                        className={cn({ [style.active]: timeframe.timeframeId === selectedTimeframe.timeframeId }, style.timeframe)}
                        onClick={async () => {
                            if (timeframe.timeframeId === selectedTimeframe.timeframeId) return;

                            setSelectedTimeframe(timeframe);
                            setSelectedMultiplier(1);
                            onClick && onClick(timeframe);
                            onMultiplierClick && onMultiplierClick(1);
                        }}
                    >
                        {timeframe.multiplier > 1 && timeframe.timeframeId === selectedTimeframe.timeframeId &&
                            <i
                                onClick={() => {
                                    if (selectedMultiplier === 1) return;

                                    setSelectedMultiplier(selectedMultiplier - 1);
                                    onMultiplierClick && onMultiplierClick(selectedMultiplier - 1);
                                }}
                                className={cn(style.minus, { [style.disabled]: selectedMultiplier === 1 }, 'fas fa-minus pe-2')}
                            ></i>
                        }
                        {timeframe.timeframeId === selectedTimeframe.timeframeId
                            ? `${timeframe.prefix * selectedMultiplier}${timeframe.suffix}`
                            : `${timeframe.prefix}${timeframe.suffix}`
                        }
                        {timeframe.multiplier > 1 && timeframe.timeframeId === selectedTimeframe.timeframeId &&
                            <i
                                onClick={() => {
                                    if (selectedMultiplier === timeframe.multiplier) return;

                                    setSelectedMultiplier(selectedMultiplier + 1);
                                    onMultiplierClick && onMultiplierClick(selectedMultiplier + 1);
                                }}
                                className={cn(style.plus, { [style.disabled]: selectedMultiplier === timeframe.multiplier }, 'fas fa-plus ps-2')}
                            ></i>
                        }
                    </Col>
                )}
            </Row>
        </Container>
    )
}

/**Props
 * @typedef Props
 * @property {StockMarketTimeframeContract[]} timeframes
 * @property {StockMarketTimeframeContract} timeframe
 * @property {(timeframe: StockMarketTimeframeContract) => void } onClick
 * @property {(multiplier: number) => void} onMultiplierClick
*/