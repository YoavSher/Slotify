import { Song } from "../interfaces/song";
import { httpService } from "./http.service";

export const songService = {
    addSongs
}


async function addSongs(songs: Song[]) {
    try {
        await httpService.post('song/', songs)
    } catch (err) {
        console.log('err:', err)
    }
}

async function getPlaylistSongs(){
    
}