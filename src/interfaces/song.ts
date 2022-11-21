import { MiniUser } from "./mini-user";

export interface Song {
    id: string, // perhaps we should change to videoId so we dont get confused because we would wnat to give it our own id maybe to filter/delete etc.
    videoId: string, // perhaps we should change to videoId so we dont get confused because we would wnat to give it our own id maybe to filter/delete etc.
    title: string,
    artist: string,
    image: string,
    duration: number,
    addedAt?: number
    // allso we should seperate the song,name and band to diffrents keys so we could afterwards navigate to a band page for example
}

