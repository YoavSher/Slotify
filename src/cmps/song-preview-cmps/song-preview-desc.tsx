
interface Props {
    isCurrSong: boolean,
    artist: string,
    title: string
}

export const SongPreviewDesc = ({ artist, title, isCurrSong }: Props) => {

    return (
        <div className="song-description">
            <div className="song-title">
                <h5 className={`${isCurrSong ? 'playing' : ''}`}>{title}</h5>
            </div>
            <h6>{artist}</h6>
        </div>
    )
}