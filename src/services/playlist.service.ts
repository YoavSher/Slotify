import { Playlist } from "../interfaces/playlist";
import { storageService } from "./async-storage.service";
import { httpService } from "./http.service";
import { getPlaylists } from "./playlist.data";

export const playlistService = {
    query,
    getPlaylistById,
    createPlaylist,
    updatePlaylist,
    removePlaylist
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
        // const playlist = await storageService.get(STORAGE_KEY, playlistId)
        const playlist = await httpService.get(`playlist/${playlistId}`, null)
        // console.log('playlist:', playlist)
        return playlist
    } catch (err) {
        console.log('err:', err)
    }
}
//adjustments
async function createPlaylist() {
    // const newPlaylist = {
    //     name: 'New Playlist',
    //     imgUrl: 'https://thumbs.dreamstime.com/b/music-background-panorama-13786355.jpg',
    //     tags: [],
    //     createdBy: {
    //         _id: "u101",
    //         fullName: "Puki Ben David",
    //         imgUrl: "http://some-photo/"
    //     },
    //     likedByUsers: [],
    //     songs: []
    // } as Playlist
    // await storageService.post(STORAGE_KEY, newPlaylist)
    await httpService.post('playlist/', null)
    // return newPlaylist
}

async function updatePlaylist(playlist: Playlist) {
    try {
        const updatedPlaylist = await storageService.put(STORAGE_KEY, playlist)
    } catch (err) {
        console.log('err:', err)
    }
}

async function removePlaylist(playlistId: string) {
    try {
        const updatedPlaylist = await storageService.remove(STORAGE_KEY, playlistId)
    } catch (err) {
        console.log('err:', err)
    }
}