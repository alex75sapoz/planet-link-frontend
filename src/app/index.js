import { lazy, Suspense } from 'react';

import Loader from '../library/base/base-loader';

export default function App() {
    const Authentication = lazy(() => import('./authentication'));
    const LSK = lazy(() => import('./lsk'));

    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const subdomain = window.location.host.split('.')[0];

    return (
        <Suspense fallback={<Loader />}>
            <div className='ps-3 pe-3'>
                {
                    {
                        authentication: <Authentication />,
                        lsk: <LSK />
                    }[subdomain] ||
                    <div>
                        <div className='mb-5'></div>
                        <h2 className='text-center fw-bold' style={{ color: 'white' }}>Please choose a valid subdomain</h2>
                        <div className='mb-5'></div>
                        <a className='d-block text-center fw-bold fs-4' style={{ color: 'white' }} href={`${protocol}//lsk.${hostname}`}>LSK</a>
                        <div className='mb-2'></div>
                        <a className='d-block text-center fw-bold fs-4' style={{ color: 'white' }} href={`${protocol}//portfolio.${hostname}`}>Portfolio</a>
                    </div>
                }
            </div>
        </Suspense>
    )
}