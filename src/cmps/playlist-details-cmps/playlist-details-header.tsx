import { useColorScheme } from '@mui/material'
import { useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { ArrowFunction, FunctionBody, FunctionExpression } from 'typescript'

import { Playlist } from "../../interfaces/playlist"
import { useAppSelector } from '../../store/store.hooks'
import { PlaylistColorExtractor } from './playlist-image-color-extractor'


interface Props {
    playlist: Playlist,
    onChangePhoto: any,
    onChangeTitle: any,
    onSaveChanges: any,
    isMobile: boolean,
    songsLength: number,
    isCurrentUserPlaylistOwner: boolean,
    songsDuration: string
}




export const PlaylistDetailsHeader = ({ playlist, onChangePhoto, songsDuration, onChangeTitle, onSaveChanges, isMobile, songsLength, isCurrentUserPlaylistOwner }: Props) => {
    const [background, setBackground] = useState<string>('#181818')
    const returnColors = (colors: string[]) => {
        const color = `linear-gradient(transparent 0,rgba(18,18,18,1) 100%),${colors[0]}`
        setBackground(color)
    }

    return (
        <header className="playlist-details-header flex">
            <div className='color-container' style={{ background }}></div>
            <div className="img-container">
                <PlaylistColorExtractor imgSrc={playlist.image} returnColors={returnColors} />
                {isCurrentUserPlaylistOwner && <div className="change-photo-btn" >
                    <label htmlFor="changePhoto">
                        <div className="photo-label flex column align-center">
                            <span><FiEdit2 /></span>
                            <h3>Choose photo</h3>
                        </div>
                    </label>
                    <input type="file" id="changePhoto" onChange={onChangePhoto} hidden />
                </div>}
            </div>
            <div className="playlist-description flex column">
                {!isMobile && <h3>PLAYLIST</h3>}
                <input disabled={!isCurrentUserPlaylistOwner}
                    type="text" className="playlist-title"
                    onChange={onChangeTitle} onBlur={() => onSaveChanges(undefined)} value={playlist.name} />
                <h5>{playlist?.fullName}
                    {songsLength > 0 && <><span> • {songsLength} songs, </span>
                        <span style={{ 'opacity': 0.7 }}>{songsDuration}</span></>}</h5>
            </div>
        </header>
    )
}