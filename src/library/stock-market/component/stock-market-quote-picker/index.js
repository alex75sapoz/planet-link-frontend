import { Fragment } from 'react';

import StockMarketController from '../../../../api/stock-market-controller';

import Picker from '../../../base/base-picker';

/**@param {Props} */
export default function StockMarketQuotePicker({
    onClick,
    onReset,
    value,
    isResetAllowed
}) {
    return (
        <Picker
            placeholder='Search Quotes...'
            initialValue={value}
            isResetAllowed={isResetAllowed}
            onChangeBeforeDelay={(keyword) => keyword.toUpperCase()}
            onChangeAfterDelay={async (keyword) => {
                var { data: quotes, isSuccess } = await StockMarketController.quote.search.get({ keyword });

                if (!isSuccess) return [{ content: 'Failed to search quotes 😐' }];
                if (!quotes.length) return [{ content: 'No Results...' }];

                return quotes.map((quote) => ({
                    data: quote,
                    content: (
                        <Fragment>
                            <p className='fw-bold float-start'>{quote.symbol}</p>
                            <small className='float-end'>{quote.exchange.name}</small>
                            <br></br>
                            <small className='fw-light'>{quote.name}</small>
                        </Fragment>
                    )
                }))
            }}
            onClick={(/**@type {StockMarketQuoteContract}*/quote) => {
                if (!quote) return;
                onClick && onClick(quote);
                return quote.symbol;
            }}
            onReset={() => {
                onReset && onReset();
            }}
        />
    );
}

/**Props
 * @typedef Props
 * @property {(quote: StockMarketQuoteContract) => void} onClick
 * @property {() => void} onReset
 * @property {string} value
 * @property {boolean} isResetAllowed
*/