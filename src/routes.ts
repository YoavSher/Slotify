import { Home } from "./pages/home";
import { PlaylistDetails } from "./pages/playlist-details";
import { SearchResults } from "./pages/search-results";




const routes = [
    {
        path: '',
        component:  Home
    },
    {
        path: 'search',
        component:  SearchResults
    },
    {
        path: 'playlist/:playlistId',
        component:  PlaylistDetails
    },
]

export default routes