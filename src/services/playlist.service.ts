import { storageService } from "./async-storage.service";
import { getPlaylists } from "./playlist.data";

export const playlistService = {
    query,

}

const STORAGE_KEY = 'playlists'

const gPlaylists = getPlaylists()

async function query() {
    try {
        let playlists = await storageService.query(STORAGE_KEY)
        if (!playlists || playlists.length === 0) playlists = gPlaylists

        return playlists

    } catch (err) {
        console.log('err:', err)
    }

}