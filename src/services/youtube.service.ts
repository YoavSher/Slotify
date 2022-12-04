import axios from 'axios'
import { Song } from '../interfaces/song'
import { httpService } from './http.service'
import { songService } from './songs.service'
import { utilService } from './util.service'


export const youtubeService = {
    getDataFromYoutube
}

const API_KEY = 'AIzaSyB68OvbDNN7gFqkCGOoyxLWC36rnRfVEmQ'
const combinedCleaner = /\([^\)]*\)|\[[^\]]*\]|HD|(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|[`~!@#$%^*()_|+=?;:",.<>\{\}\[\]\\\/]|&#39|39|&39|&quot|&amp;|vevo|music|-topic| - topic|official/ig



async function getDataFromYoutube(term: string) {
    if (term === '') return null
    try {
        const res = await axios
            .get(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&videoCategoryId=10&videoEmbeddable=true&type=video&maxResults=15&key=${API_KEY}&q=${term}`)

        const str = res.data.items.map((item: { id: { videoId: string } }) => '' + `${item.id.videoId}%2C`).join('').slice(0, -3)
        const durationData = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${str}&part=contentDetails&key=${API_KEY}`)
        const durations = durationData.data.items.map((item: any) => _translateDuration(item.contentDetails.duration) || 0)
        let songs = res.data.items.map((s: Song, idx: number) => {

            const song = _makeSong(s)
            song.duration = durations[idx]
            return song
        })
        songs = songs.filter((song: Song) => song.duration > 0 && song.duration < 900000)
        songs = songs.splice(0, 5)
        console.log(songs)
        //send songs  to backend {post}api/songs
        // songService.addSongs(songs)
        return songs
    } catch (err) {
        console.log('err:', err)
    }

}

function _makeSong(video: any) {
    return {
        title: video.snippet.title.replaceAll(combinedCleaner, '').trim(),
        videoId: video.id.videoId,
        image: video.snippet.thumbnails.high.url,
        duration: 0,
        artist: video.snippet.channelTitle.replaceAll(combinedCleaner, '').trim()
    } as Song
}

function _translateDuration(duration: string): number {
    let durations = duration.slice(2, duration.length - 1).split('M')
    return +durations.reduce((minute, second) => ((+minute * 60 + +second) * 1000).toString())
}
