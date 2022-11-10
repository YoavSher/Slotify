import axios from 'axios'
import { Song } from '../interfaces/song'


export const youtubeService = {
    getDataFromYoutube
}

const STORAGE_KEY = 'songsCache'
const API_KEY = 'AIzaSyB68OvbDNN7gFqkCGOoyxLWC36rnRfVEmQ'
const songsCache = _loadFromStorage(STORAGE_KEY) || {}

async function getDataFromYoutube(term: string) {

    if(songsCache[term]) return Promise.resolve(songsCache[term])
    else{

        try {
            const res = await axios
                .get(
                    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&videoEmbeddable=true&type=video&key=${API_KEY}&q=${term}`)
    
            const str = res.data.items.map((item: { id: { videoId: string } }) => '' + `${item.id.videoId}%2C`).join('').slice(0, -3)
            // const durationData = `https://www.googleapis.com/youtube/v3/videos?id=${str}&part=contentDetails&key=${API_KEY}`
            const durationData = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${str}&part=contentDetails&key=${API_KEY}`)
            const durations = durationData.data.items.map((item: any) => _translateDuration(item.contentDetails.duration))
            const songs = res.data.items.map((s: Song, idx: number) => {
                const song = _makeSong(s)
                song.duration = durations[idx]
                return song
                // maybe we should improve on the matching of the length and the ccorrect video allthough is works god
                // A we can sort both of them by id,B we can do a secondary loop to find the correct id and then take the duration
            })
            console.log('songs:', songs)
            songsCache[term]=songs as Song[]
            _saveToStorage(STORAGE_KEY,songsCache[term])
            return songs as Song[]
        } catch (err) {
            console.log('err:', err)
        }
    }

}


function _makeSong(video: any) {
    // console.log(video);
    return {
        id: video.id.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        image: video.snippet.thumbnails.default.url,
        publishTime: video.snippet.publishTime,
        duration: 0
    } as Song
}



function _translateDuration(duration: string): number {
    let durations = duration.slice(2, duration.length - 1).split('M')
    return +durations.reduce((minute, second) => ((+minute * 60 + +second) * 1000).toString())
}



function _saveToStorage(key: string, val: any) {
    localStorage.setItem(key, JSON.stringify(val))
}

function _loadFromStorage(key: string) {
    var val: any = localStorage.getItem(key)
    return JSON.parse(val)
}