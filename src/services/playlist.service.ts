import { Playlist } from "../interfaces/playlist";
import { storageService } from "./async-storage.service";
import { httpService } from "./http.service";
import { getPlaylists } from "./playlist.data";


export const playlistService = {
    query,
    getSearchedPlaylist,
    // getPlaylistById,
    createPlaylist,
    updatePlaylist,
    removePlaylist,
    reIndexPlaylistSongs,
    addLikedPlaylist,
    removeLikedPlaylist,
    getUserPlaylists,
    addToRecentlyPlayed,
    getUserRecentPlaylists

}

async function query() {
    try {
        const playlists = await httpService.get('playlist', null)
        return playlists

    } catch (err) {
        console.log('err:', err)
    }

}

// async function getPlaylistById(playlistId: number) {
//     try {
//         const playlist = await httpService.get(`playlist/${playlistId}`, null)
//         return playlist
//     } catch (err) {
//         console.log('err:', err)
//     }
// }
async function createPlaylist() {
    try {

        const newPlaylist = await httpService.post('playlist/', null)
        console.log('playlist: ', newPlaylist)
        return newPlaylist
    } catch (err) {
        console.error(err)
    }
}

async function updatePlaylist(playlist: Playlist) {
    try {
        await httpService.put(`playlist/${playlist._id}`, playlist)
    } catch (err) {
        console.log('err:', err)
    }
}

async function removePlaylist(playlistId: number) {
    try {
        await httpService.delete(`playlist/${playlistId}`, null)
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
        await httpService.put(`song/playlist/${reIndexInfo.playlistId}`, reIndexInfo)
    } catch (err) {
        console.log('err:', err)
    }
}

async function addLikedPlaylist(playlistId: number) {
    try {
        await httpService.post('playlist/user', { playlistId })
    } catch (err) {
        console.log('err:', err)
    }

}

async function removeLikedPlaylist(playlistId: number) {
    try {
        await httpService.delete(`playlist/user/${playlistId}`, null)
    } catch (err) {
        console.log('err:', err)
    }
}

async function getUserPlaylists(userId: number) {
    try {
        const likedPlaylists = await httpService.get(`playlist/user/${userId}`, null)
        console.log('got em', likedPlaylists)
        return likedPlaylists
    } catch (err) {
        console.log('err:', err)
    }
}

async function getUserRecentPlaylists(userId: number) {
    try {
        const recentPlaylists = await httpService.get(`playlist/user/recent/${userId}`, null)
        return recentPlaylists
    } catch (err) {
        console.log('err:', err)
    }
}

async function addToRecentlyPlayed(playlistId: number) {
    try {
        await httpService.post('playlist/user/recent/', { playlistId })
    } catch (err) {
        console.log(err)
    }
}

async function getSearchedPlaylist(searchTerm: string) {
    try {
        const playlist = await httpService.get(`playlist/${searchTerm}`, null)
        return playlist
    } catch (err) {
        console.log(err)
    }
}
