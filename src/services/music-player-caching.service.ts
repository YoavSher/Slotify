import { Playlist } from "../interfaces/playlist"
import { Song } from "../interfaces/song"
import { PseudoPlaylist } from "../store/music-player/music-player.reducer"

export const cachingService = {
    saveCurrentPlaylist,
    savePlayingIdx,
    savePlayingTime,
    saveCurrentVolume,
    getPlayingIdx,
    getPlayingTime,
    getPlaylist,
    getCurrentVolume
}

const PLAYING_TIME_KEY = 'playing-time'
const PLAYING_INDEX_KEY = 'playing-index'
const CURRENT_PLAYLIST = 'current-playlist'
const CURRENT_VOLUME = 'current-volume'

function savePlayingTime(time: number): void {
    _saveToStorage(PLAYING_TIME_KEY, time)
}

function savePlayingIdx(idx: number): void {
    _saveToStorage(PLAYING_INDEX_KEY, idx)
}

function saveCurrentVolume(number: number): void {
    _saveToStorage(CURRENT_VOLUME, number)
}

function saveCurrentPlaylist(playlistInfo: { songs: Song[], playlistId: number | null }): void {
    _saveToStorage(CURRENT_PLAYLIST, playlistInfo)
}
function getPlayingTime(): number {
    return _loadFromStorage(PLAYING_TIME_KEY)
}
function getCurrentVolume(): number {
    return _loadFromStorage(CURRENT_VOLUME)
}
function getPlayingIdx(): number {
    return _loadFromStorage(PLAYING_INDEX_KEY)
}
function getPlaylist(): { songs: Song[], playlistId: number | null } {
    return _loadFromStorage(CURRENT_PLAYLIST)
}





function _saveToStorage(key: string, val: any) {
    localStorage.setItem(key, JSON.stringify(val))
}

function _loadFromStorage(key: string) {
    const val = localStorage.getItem(key)
    if (val && val !== 'undefined') return JSON.parse(val)
}