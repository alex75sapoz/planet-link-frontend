import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Loader from '../../library/base/base-loader';

export default function Authenticate() {
    const Main = lazy(() => import('./authentication-main'));

    return (
        <BrowserRouter>
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route key={1} path='/*' element={<Main />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}