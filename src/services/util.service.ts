import axios from "axios"

export const utilService = {
    millisToMinutesAndSeconds,
    debounce, 
    getPhotos
}
function millisToMinutesAndSeconds(millis: number): string {
    const minute = Math.floor(millis / 60000) || 0
    const second = Math.floor((millis % 60000) / 1000) || 0
    const result = `${minute}:${second < 10 ? '0' : ''}${second}`
    if (result) return result
    else return ''
}


function debounce(func: any, wait: number) {
    let timeout: any
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }

        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

async function getPhotos(search: string) {
    const page = 1
    const URL = `https://api.unsplash.com/search/photos/?query=${search}&page=${page}&client_id=IhdI_isC6EIlhNjO6xlgDqlzPxnshsJO8jjnSbb-tJA`
    const images = await axios.get(URL)
    const imagesDisplay = images.data.results.map((i: { urls: { full: any; small: any }; height: any; color: any; user: { links: { html: any }; first_name: any; last_name: any } }) => ({
        urlFull: i.urls.full,
        urlSmall: i.urls.small,
        height: i.height, color: i.color,
        creatorUrl: i.user.links.html,
        creatorName: `${i.user.first_name} ${i.user.last_name}`
    }))
    return imagesDisplay
}