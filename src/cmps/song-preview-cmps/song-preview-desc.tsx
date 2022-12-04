
interface Props {
    isThisSongPlaying: boolean,
    artist: string,
    title: string
}

export const SongPreviewDesc = ({ artist, title, isThisSongPlaying }: Props) => {

    return (
        <div className="song-description">
            <div className="song-title">
                <h5 className={`${isThisSongPlaying ? 'playing' : ''}`}>{title}</h5>
            </div>
            <h6>{artist}</h6>
        </div>
    )
}