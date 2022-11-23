import { Playlist } from "../interfaces/playlist"
import { Song } from "../interfaces/song"
import { PseudoPlaylist } from "../store/music-player/music-player.reducer"

export const cachingService = {
    saveCurrentPlaylist,
    savePlayingIdx,
    savePlayingTime,
    getPlayingIdx,
    getPlayingTime,
    getPlaylist
}

const PLAYING_TIME_KEY = 'playing-time'
const PLAYING_INDEX_KEY = 'playing-index'
const CURRENT_PLAYLIST = 'current-playlist'

function savePlayingTime(time: number): void {
    _saveToStorage(PLAYING_TIME_KEY, time)
}

function savePlayingIdx(idx: number): void {
    _saveToStorage(PLAYING_INDEX_KEY, idx)
}

function saveCurrentPlaylist(playlist: Playlist | PseudoPlaylist): void {
    _saveToStorage(CURRENT_PLAYLIST, playlist)
}
function getPlayingTime(): number {
    return _loadFromStorage(PLAYING_TIME_KEY)
}
function getPlayingIdx(): number {
    return _loadFromStorage(PLAYING_INDEX_KEY)
}
function getPlaylist(): Playlist | PseudoPlaylist {
    return _loadFromStorage(CURRENT_PLAYLIST)
}





function _saveToStorage(key: string, val: any) {
    localStorage.setItem(key, JSON.stringify(val))
}

function _loadFromStorage(key: string) {
    const val = localStorage.getItem(key)
    if (val && val !== 'undefined') return JSON.parse(val)
}