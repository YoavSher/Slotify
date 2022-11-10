import { Home } from "./pages/home";
import { Search } from "./pages/search";




const routes = [
    {
        path: '',
        component:  Home
    },
    {
        path: 'search',
        component:  Search
    },
    {
        path: 'search/:term?',
        component:  Search
    },
]

export default routes