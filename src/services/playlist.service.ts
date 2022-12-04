import { Playlist } from "../interfaces/playlist";
import { storageService } from "./async-storage.service";
import { httpService } from "./http.service";
import { getPlaylists } from "./playlist.data";


export const playlistService = {
    query,
    getPlaylistById,
    createPlaylist,
    updatePlaylist,
    removePlaylist,
    reIndexPlaylistSongs
}

const STORAGE_KEY = 'playlists'

const gPlaylists = getPlaylists()

async function query() {
    try {
        const playlists = await httpService.get('playlist', null)
        // console.log('playlists:', playlists)
        return playlists

    } catch (err) {
        console.log('err:', err)
    }

}

async function getPlaylistById(playlistId: number) {
    try {
        const playlist = await httpService.get(`playlist/${playlistId}`, null)
        // console.log('playlist:', playlist)
        return playlist
    } catch (err) {
        console.log('err:', err)
    }
}
//adjustments
async function createPlaylist() {

    const newPlaylist = await httpService.post('playlist/', null)
    console.log('playlist: ', newPlaylist)
    return newPlaylist
}

async function updatePlaylist(playlist: Playlist) {
    try {
        const updatedPlaylist = await httpService.put(`playlist/${playlist._id}`, playlist)
        // const updatedPlaylist = await storageService.put(STORAGE_KEY, playlist)
    } catch (err) {
        console.log('err:', err)
    }
}

async function removePlaylist(playlistId: number) {
    try {
        const updatedPlaylist = await httpService.delete(`playlist/${playlistId}`, null)
    } catch (err) {
        console.log('err:', err)
    }
}

interface reIndexInfo {
    playlistId: number,
    videoId: string,
    sourceIdx: number,
    destinationIdx: number
}

async function reIndexPlaylistSongs(reIndexInfo: reIndexInfo) {
    try {
        await httpService.put(`song/playlist/${reIndexInfo.playlistId}`,reIndexInfo)
    } catch (err) {
        console.log('err:', err)
    }
}