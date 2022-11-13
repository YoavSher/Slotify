import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Search } from "./pages/search";




const routes = [
    {
        path: '',
        component: Home,
        children: [
            {
                path: 'login',
                component: Login
            },
        ]
    },
    {
        path: 'search',
        component: Search
    },
    {
        path: 'search/:term?',
        component: Search
    },

]

export default routes