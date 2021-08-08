import { Fragment, useState, useMemo } from 'react';

import { page } from './configuration';

import { userTypeEnum } from '../../../../library/account/account-enum';

import AccountUser from '../../../../library/account/component/user';

import style from './style.module.scss';

export default function Main() {
    const [, setData] = useState({});

    const userComponent = useMemo(() =>
        <AccountUser
            userTypeId={userTypeEnum.fitbit}
            page={page}
            onAuthenticated={(user) => setData((data) => ({ ...data, user, isUserLoaded: true }))}
        />
        , []);

    return (
        <Fragment>
            {userComponent}
            <div className='mb-4'></div>
            <h1 className={style.test}>Test</h1>
        </Fragment>
    )
}