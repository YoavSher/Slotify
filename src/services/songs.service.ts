import { Song } from "../interfaces/song";
import { httpService } from "./http.service";

export const songService = {
    addSongs,
    getLikedSongs,
    addLikedSong,
    removeLikedSong
}


async function addSongs(songs: Song[]) {
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

async function getPlaylistSongs() {

}