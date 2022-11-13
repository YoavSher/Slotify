import { storageService } from "./async-storage.service";
import { getPlaylists } from "./playlist.data";

export const playlistService = {
    query,
    getPlaylistById,
}

const STORAGE_KEY = 'playlists'

const gPlaylists = getPlaylists()

async function query() {
    try {
        let playlists = await storageService.query(STORAGE_KEY)
        if (!playlists || playlists.length === 0) {
            playlists = await storageService.postMany(STORAGE_KEY, gPlaylists)
        }
        // playlists = gPlaylists

        return playlists

    } catch (err) {
        console.log('err:', err)
    }

}

async function getPlaylistById(playlistId: string) {
    try {
        const playlist = await storageService.get(STORAGE_KEY, playlistId)
        // console.log('playlist:', playlist)
        return playlist
    } catch (err) {
        console.log('err:', err)
    }
}