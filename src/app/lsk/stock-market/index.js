import { Fragment, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import NavigationBar from '../../../library/base/component/navigation-bar';

export default function Weather() {
    const Main = lazy(() => import('./main'));
    const Alert = lazy(() => import('./alert'));
    const AlertCreate = lazy(() => import('./alert-create'));

    return (
        <Fragment>
            <NavigationBar links={[
                {
                    name: 'Home',
                    path: '/'
                },
                {
                    name: 'Quote',
                    path: '/stock-market'
                },
                {
                    name: 'Alerts',
                    path: '/stock-market/alert'
                }
            ]}
            />
            <Routes>
                <Route key={1} path='/' element={<Main />} />
                <Route key={2} path='alert' element={<Alert />} />
                <Route key={3} path='alert/create' element={<AlertCreate />} />
            </Routes>
        </Fragment>
    )
}