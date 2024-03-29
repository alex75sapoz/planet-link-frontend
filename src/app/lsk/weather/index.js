import { Fragment, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import NavigationBar from '../../../library/base/component/navigation-bar';

export default function Weather() {
    const Main = lazy(() => import('./main'));
    const Archive = lazy(() => import('./archive'));

    return (
        <Fragment>
            <NavigationBar links={[
                {
                    name: 'Home',
                    path: '/'
                },
                {
                    name: 'Weather',
                    path: '/weather'
                },
                {
                    name: 'Archive',
                    path: '/weather/archive'
                }
            ]}
            />
            <Routes>
                <Route key={1} path='/' element={<Main />} />
                <Route key={1} path='archive' element={<Archive />} />
            </Routes>
        </Fragment>
    )
}