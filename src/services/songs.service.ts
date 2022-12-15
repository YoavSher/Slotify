import { PlaylistSong, Song } from "../interfaces/song";
import { httpService } from "./http.service";

export const songService = {
    addSongsFromSearch,
    getLikedSongs,
    addLikedSong,
    removeLikedSong,
    getPlaylistSongs,
    addSongToPlaylist,
    removeFromPlaylist,
    searchSongs
}


async function addSongsFromSearch(songs: Song[]) {
    try {
        await httpService.post('song/', songs)
    } catch (err) {
        throw err
    }
}
async function getLikedSongs(userId: number) {
    try {
        const likedSongs = await httpService.get(`song/user/${userId}`, null)
        return likedSongs
    } catch (err) {
        throw err
    }
}

async function addLikedSong(videoId: string) {
    try {
        await httpService.post('song/user', { videoId })
    } catch (err) {
        throw err
    }

}
async function removeLikedSong(videoId: string) {
    try {
        await httpService.delete(`song/user/${videoId}`, null)
    } catch (err) {
        throw err
    }
}

async function addSongToPlaylist(song: PlaylistSong) {
    try {
        await httpService.post(`song/playlist`, song)
    } catch (err) {
        throw err
    }
}

interface removedSong {
    videoId: string,
    playlistId: number,
    idx: number
}
async function removeFromPlaylist(removedSong: removedSong) {
    try {
        await httpService.delete(`song/playlist/${removedSong.playlistId}`, removedSong)
    } catch (err) {
        throw err
    }
}

async function getPlaylistSongs(playlistId: number) {
    try {
        const songs = await httpService.get(`song/playlist/${playlistId}`, null)
        return songs as Song[]
    } catch (err) {
        throw err
    }
}

async function searchSongs(searchTerm:string){
    try {
        const songs = await httpService.get(`song/${searchTerm}`, null)
        return songs as Song[] 
    } catch (err) {
        throw err
    }
}