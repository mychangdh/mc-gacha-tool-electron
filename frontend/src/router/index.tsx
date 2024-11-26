import { createBrowserRouter } from "react-router-dom";
import loadable from '@loadable/component';
const Home = loadable(() => import('@/views/Home'))
const FindMc = loadable(() => import('@/views/FindMc'))

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/find-mc',
        element: <FindMc></FindMc>,
    },

])

export default router
