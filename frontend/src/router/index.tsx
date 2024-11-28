import { createHashRouter } from "react-router-dom";
import loadable from '@loadable/component';
const Home = loadable(() => import('@/views/Home'))
const FindMc = loadable(() => import('@/views/FindMc'))
const Setting = loadable(() => import('@/views/Setting'))

const router = createHashRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/find-mc',
        element: <FindMc></FindMc>,
    },
    {
        path: '/setting',
        element: <Setting></Setting>,
    },

])

export default router
