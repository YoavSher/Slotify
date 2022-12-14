
interface Props {
    onFilterResults: any,
    showSongs: boolean,
    showPlaylists: boolean,
}

export const SearchFilter = ({ onFilterResults, showSongs, showPlaylists }: Props) => {
    
    const showActive = (type: string) => {
        switch (type) {
            case 'all':
                return showSongs && showPlaylists
            case 'songs':
                return showSongs && !showPlaylists
            case 'playlists':
                return !showSongs && showPlaylists
        }
    }

    return (
        <section className="search-filter">
            <button className={showActive('all') ? 'active' : ''} onClick={() => onFilterResults('all')}>All</button>
            <button className={showActive('songs') ? 'active' : ''} onClick={() => onFilterResults('songs')}>Songs</button>
            <button className={showActive('playlists') ? 'active' : ''} onClick={() => onFilterResults('playlists')}>Playlists</button>
        </section>
    )
}