import { MiniUser } from "./mini-user"
import { Song } from "./song"

export interface Playlist {
    _id?: string,
    name: string,
    imgUrl:string,
    tags: string[],
    createdBy: MiniUser,
    likedByUsers: MiniUser[],
    songs: Song[]
}





