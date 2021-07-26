import { Fragment, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import NavigationBar from '../../../library/base/component/navigation-bar';

export default function Fitness() {
    const Main = lazy(() => import('./main'));

    return (
        <Fragment>
            <NavigationBar links={[
                {
                    name: 'Home',
                    path: '/'
                },
                {
                    name: 'Fitness',
                    path: '/fitness'
                },
                {
                    name: 'Activity',
                    path: '/fitness/activity'
                }
            ]}
            />
            <Routes>
                <Route key={1} path='/' element={<Main />} />
                {/* <Route key={1} path='activity' element={<Activity />} /> */}
            </Routes>
        </Fragment>
    )
}