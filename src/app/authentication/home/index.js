import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

export default function Home() {
    const Main = lazy(() => import('./main'));

    return (
        <Routes>
            <Route key={1} path='/' element={<Main />} />
        </Routes>
    )
}