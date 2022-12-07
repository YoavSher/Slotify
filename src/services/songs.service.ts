import { PlaylistSong, Song } from "../interfaces/song";
import { httpService } from "./http.service";

export const songService = {
    addSongsFromSearch,
    getLikedSongs,
    addLikedSong,
    removeLikedSong,
    getPlaylistSongs,
    addSongToPlaylist,
    removeFromPlaylist
}


async function addSongsFromSearch(songs: Song[]) {
    try {
        await httpService.post('song/', songs)
    } catch (err) {
        console.log('err:', err)
    }
}
async function getLikedSongs(userId: number) {
    try {
        const likedSongs = await httpService.get(`song/user/${userId}`, null)
        return likedSongs
    } catch (err) {
        console.log('err:', err)
    }
}

async function addLikedSong(videoId: string) {
    try {
        await httpService.post('song/user', { videoId })
    } catch (err) {
        console.log('err:', err)
    }

}
async function removeLikedSong(videoId: string) {
    try {
        await httpService.delete(`song/user/${videoId}`, null)
    } catch (err) {
        console.log('err:', err)
    }
}

async function addSongToPlaylist(song: PlaylistSong) {
    try {
        console.log('new song!', song)
        await httpService.post(`song/playlist/`, song)
        // return songs as Song[]
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
        console.log('de')
        await httpService.delete(`song/playlist/${removedSong.playlistId}`, removedSong)
        // return songs as Song[]
    } catch (err) {
        throw err
    }
}

async function getPlaylistSongs(playlistId: number) {
    try {
        const songs = await httpService.get(`song/playlist/${playlistId}`, null)
        console.log('songs:', songs)
        return songs as Song[]
    } catch (err) {
        console.log('err:', err)
    }
}