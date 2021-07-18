import { lazy, Suspense } from 'react';

import Loader from '../library/base/component/loader';

export default function App() {
    const Authentication = lazy(() => import('./authentication'));
    const LSK = lazy(() => import('./lsk'));
    const Portfolio = lazy(() => import('./portfolio'));

    const protocol = window.location.protocol;
    const domain = window.location.host.match(/\./g).length === 1
        ? window.location.host
        : window.location.host.replace(`${window.location.host.split('.')[0]}.`, '');
    const subdomain = window.location.host.split('.')[0];

    return (
        <Suspense fallback={<Loader />}>
            <div className='ps-3 pe-3'>
                {
                    {
                        authentication: <Authentication />,
                        lsk: <LSK />,
                        portfolio: <Portfolio />
                    }[subdomain] ||
                    <div>
                        <div className='mb-5'></div>
                        <h2 className='text-center fw-bold' style={{ color: 'white' }}>
                            This subdomain is currently not supported
                            <br />
                            Supported subdomains are
                        </h2>
                        <div className='mb-5'></div>
                        <a className='d-block text-center fw-bold fs-4' style={{ color: 'white' }} href={`${protocol}//lsk.${domain}`}>LSK</a>
                        <div className='mb-2'></div>
                        <a className='d-block text-center fw-bold fs-4' style={{ color: 'white' }} href={`${protocol}//portfolio.${domain}`}>Portfolio</a>
                    </div>
                }
            </div>
        </Suspense>
    )
}