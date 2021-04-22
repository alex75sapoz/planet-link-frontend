import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Loader from '../../library/base/base-loader';

export default function LSK() {
    const Home = lazy(() => import('./home'));
    const User = lazy(() => import('../authentication'));
    const Weather = lazy(() => import('./weather'));
    const StockMarket = lazy(() => import('./stock-market'))

    return (
        <BrowserRouter>
            <Suspense fallback={<Loader />}>
                <div className='ps-3 pe-3'>
                    <Routes>
                        <Route key={1} path='/*' element={<Home />} />
                        <Route key={2} path='user/*' element={<User />} />
                        <Route key={3} path='weather/*' element={<Weather />} />
                        <Route key={4} path='stock-market/*' element={<StockMarket />} />
                    </Routes>
                </div>
            </Suspense>
        </BrowserRouter>
    )
}