import { MiniUser } from "./mini-user"
import { Song } from "./song"

export interface Playlist {
    _id?: number,
    name: string,
    image:string,
    tags: string[],
    createdBy: MiniUser,
    likedByUsers: MiniUser[],
    songs: Song[]
}





