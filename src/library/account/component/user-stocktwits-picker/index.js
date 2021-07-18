import { Fragment } from 'react';

import AccountController from '../../../../api/account-controller';

import { StringExtension as String } from '../../../base/base-extension';

import Picker from '../../../base/component/picker';

/**@param {Props}*/
export default function UserStocktwitsPicker({
    onClick,
    onReset,
    value,
    isResetAllowed
}) {
    return (
        <Picker
            placeholder='Search Users...'
            initialValue={value}
            isResetAllowed={isResetAllowed}
            onChangeBeforeDelay={(keyword) => String.firstLetterToUpperCase(keyword)}
            onChangeAfterDelay={async (keyword) => {
                var { data: users, isSuccess } = await AccountController.user.stocktwits.search.get({ keyword });

                if (!isSuccess) return [{ content: 'Failed to search users 😐' }];
                if (!users.length) return [{ content: 'No Results...' }];

                return users.map((user) => ({
                    data: user,
                    content: (
                        <Fragment>
                            <p className='fw-bold'>{user.stocktwits.username}</p>
                            <small className='fw-light'>{user.stocktwits.name}</small>
                        </Fragment>
                    )
                }))
            }}
            onClick={(/**@type {UserContract}*/user) => {
                if (!user) return;
                onClick && onClick(user);
                return user.stocktwits.username
            }}
            onReset={() => {
                onReset && onReset()
            }}
        />
    )
}

/**Props
 * @typedef Props
 * @property {(user: AccountUserContract) => void} onClick
 * @property {() => void} onReset
 * @property {string} value
 * @property {boolean} isResetAllowed
*/