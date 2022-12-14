import { Playlist } from "../interfaces/playlist";
import { Song } from "../interfaces/song";
import { storageService } from "./async-storage.service";
import { httpService } from "./http.service";
import { getPlaylists } from "./playlist.data";


export const playlistService = {
    query,
    getSearchedPlaylist,
    getPlaylistById,
    createPlaylist,
    updatePlaylist,
    removePlaylist,
    reIndexPlaylistSongs,
    addLikedPlaylist,
    removeLikedPlaylist,
    getUserPlaylists,
    addToRecentlyPlayed,
    getUserRecentPlaylists,
    getGenrePlaylists

}

async function query() {
    try {
        const playlists = await httpService.get('playlist', null)
        return playlists

    } catch (err) {
        throw err
    }

}

async function getPlaylistById(playlistId: number) {
    try {
        const fullPlaylist = await httpService.get(`playlist/${playlistId}`, null)
        return fullPlaylist
    } catch (err) {
        throw err
    }
}

async function createPlaylist(): Promise<Playlist | undefined> {
    try {

        const newPlaylist = await httpService.post('playlist/', null)
        return newPlaylist
    } catch (err) {
        console.error(err)
    }
}

async function updatePlaylist(playlist: Playlist) {
    try {
        await httpService.put(`playlist/${playlist._id}`, playlist)
    } catch (err) {
        throw err
    }
}

async function removePlaylist(playlistId: number) {
    try {
        await httpService.delete(`playlist/${playlistId}`, null)
    } catch (err) {
        throw err
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
        throw err
    }
}

async function addLikedPlaylist(playlistId: number) {
    try {
        await httpService.post('playlist/user', { playlistId })
    } catch (err) {
        throw err
    }

}

async function removeLikedPlaylist(playlistId: number) {
    try {
        await httpService.delete(`playlist/user/${playlistId}`, null)
    } catch (err) {
        throw err
    }
}

async function getUserPlaylists(userId: number) {
    try {
        const likedPlaylists = await httpService.get(`playlist/user/${userId}`, null)
        return likedPlaylists
    } catch (err) {
        throw err
    }
}

async function getUserRecentPlaylists(userId: number) {
    try {
        const recentPlaylists = await httpService.get(`playlist/user/recent/${userId}`, null)
        return recentPlaylists
    } catch (err) {
        throw err
    }
}

async function addToRecentlyPlayed(playlistId: number) {
    try {
        await httpService.post('playlist/user/recent/', { playlistId })
    } catch (err) {
        console.log(err)
    }
}
interface searchedPlaylist {
    searchTerm: string,
    songs: Song[]
}
async function getSearchedPlaylist({ songs, searchTerm }: searchedPlaylist) {
    try {
        const songsIds: string[] = []
        songs.forEach(s => songsIds.push(s.videoId))
        const playlist = await httpService.get(`playlist/search/${searchTerm}/${songsIds}`, null)
        return playlist
    } catch (err) {
        console.log(err)
    }
}

async function getGenrePlaylists(genre: string) {
    try {
        const playlists = await httpService.get(`playlist/genre/${genre}`, null)
        return playlists
    } catch (err) {
        throw err
    }
}