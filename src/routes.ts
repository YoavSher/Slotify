import { Home } from "./pages/home";
import { LikedSongs } from "./pages/liked-songs";
import { Login } from "./pages/login";
import { PlaylistDetails } from "./pages/playlist-details";
import { Queue } from "./pages/queue";
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
        component: SearchResults
    },
    // {
    //     path: 'search/:searchTerm',
    //     component:  SearchResults
    // }, to use the search form the params
    {
        path: 'playlist/:playlistId',
        component: PlaylistDetails
    },
    {
        path: 'queue',
        component: Queue
    },
    {
        path: 'liked-songs',
        component: LikedSongs
    },

]

export default routes