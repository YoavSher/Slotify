import { MiniUser } from "./mini-user";

export interface Song {
    id?: string, // perhaps we should change to videoId so we dont get confused because we would wnat to give it our own id maybe to filter/delete etc.
    videoId: string,
    title: string,
    artist: string,
    image: string,
    duration: number,
    addedAt: number
}

// export interface PlaylistSong extends Song {
//     addedAt: number
// }

export interface PlaylistSong {
    videoId: string,
    playlistId: number,
    addedAt: number,
    idx: number
}


