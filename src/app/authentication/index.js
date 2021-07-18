import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Loader from '../../library/base/component/loader';

export default function Authentication() {
    const Home = lazy(() => import('./home'));

    return (
        <BrowserRouter>
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route key={1} path='/*' element={<Home />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}