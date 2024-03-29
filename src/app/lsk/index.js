import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Loader from '../../library/base/component/loader';

export default function LSK() {
    const Home = lazy(() => import('./home'));
    const Weather = lazy(() => import('./weather'));
    const StockMarket = lazy(() => import('./stock-market'));
    const Fitness = lazy(() => import('./fitness'));

    return (
        <BrowserRouter>
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route key={1} path='/*' element={<Home />} />
                    <Route key={3} path='weather/*' element={<Weather />} />
                    <Route key={4} path='stock-market/*' element={<StockMarket />} />
                    <Route key={5} path='fitness/*' element={<Fitness />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}