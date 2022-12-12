import { MiniUser } from "./mini-user"
import { Song } from "./song"

export interface Playlist {
    _id: number,
    name: string,
    image: string,
    creatorId: number,
    fullName?: string,
    title?:string
    // likedByUsers: MiniUser[],
}





