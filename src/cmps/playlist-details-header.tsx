import { FiEdit2 } from 'react-icons/fi'
import { ArrowFunction, FunctionBody, FunctionExpression } from 'typescript'

import { Playlist } from "../interfaces/playlist"


interface Props {
    playlist: Playlist,
    onChangePhoto: any,
    onChangeTitle: any,
    onSaveChanges: any,
    screenWidth: number
}




export const PlaylistDetailsHeader = ({ playlist, onChangePhoto, onChangeTitle, onSaveChanges, screenWidth }: Props) => {
    return (
        <header className="playlist-details-header flex">
            <div className="img-container">
                <img src={playlist.imgUrl} alt="" />
                <div className="change-photo-btn">
                    <label htmlFor="changePhoto">
                        <div className="photo-label flex column align-center">
                            <span><FiEdit2 /></span>
                            <h3>Choose photo</h3>
                        </div>
                    </label>
                    <input type="file" id="changePhoto" onChange={onChangePhoto} hidden />
                </div>
            </div>
            <div className="playlist-description flex column">
                {screenWidth > 770 && <h3>PLAYLIST</h3>}
                {/* <h1>{playlist.name}</h1> */}
                <input type="text" className="playlist-title"
                    onChange={onChangeTitle} onBlur={() => onSaveChanges(undefined)} value={playlist.name} />
                <h5>{playlist?.createdBy?.fullName}
                    {playlist?.songs?.length > 0 && <span> • {playlist?.songs?.length} songs</span>}</h5>
            </div>
        </header>
    )
}