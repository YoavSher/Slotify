import axios from 'axios'

interface Song {
    id: string,
    title: string,
    description: string,
    image: string,
    publishTime: string,
    duration: number
}

export const youtubeService = {
    getDataFromYoutube
}

const STORAGE_KEY = 'videoCache'
const API_KEY = 'AIzaSyB68OvbDNN7gFqkCGOoyxLWC36rnRfVEmQ'
const videoCache = _loadFromStorage(STORAGE_KEY) || {}

async function getDataFromYoutube(term: string) {

    try {
        const res = await axios
            .get(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&videoEmbeddable=true&type=video&key=${API_KEY}&q=${term}`)

        const str = res.data.items.map((item: { id: { videoId: string } }) => '' + `${item.id.videoId}%2C`).join('').slice(0, -3)
        // const durationData = `https://www.googleapis.com/youtube/v3/videos?id=${str}&part=contentDetails&key=${API_KEY}`
        const durationData = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${str}&part=contentDetails&key=${API_KEY}`)
        const durations = durationData.data.items.map((item: any) => _translateDuration(item.contentDetails.duration))
        const songs = res.data.items.map((song: Song, idx: number) => {
            const currSong = _getVideoProps(song)
            currSong.duration = durations[idx]
            return currSong
        })
        console.log('songs:', songs)
        return songs
    } catch (err) {
        console.log('err:', err)
    }

}


function _getVideoProps(video: any) {
    // console.log(video);
    return {
        id: video.id.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        image: video.snippet.thumbnails.default.url,
        publishTime: video.snippet.publishTime,
        duration: 0
    }
}



function _translateDuration(duration: string): number {
    let durations = duration.slice(2, duration.length - 1).split('M')
    return +durations.reduce((minute, second) => ((+minute * 60 + +second) * 1000).toString())
}



function _saveToStorage(key: string, val: object) {
    localStorage.setItem(key, JSON.stringify(val))
}

function _loadFromStorage(key: string) {
    var val: any = localStorage.getItem(key)
    return JSON.parse(val)
}