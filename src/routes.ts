import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { PlaylistDetails } from "./pages/playlist-details";
import { SearchResults } from "./pages/search-results";
import { Signup } from "./pages/signup";




const routes = [
    {
        path: '',
        component: Home,
        children: [
            {
                path: 'login',
                component: Login
            },
            {
                path: 'signup',
                component: Signup
            },
        ]
    },
    {
        path: 'search',
        component:  SearchResults
    },
    // {
    //     path: 'search/:searchTerm',
    //     component:  SearchResults
    // }, to use the search form the params
    {
        path: 'playlist/:playlistId',
        component:  PlaylistDetails
    },

]

export default routes