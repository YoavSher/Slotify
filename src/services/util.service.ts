import { current } from "@reduxjs/toolkit"
import axios from "axios"

export const utilService = {
    millisToMinutesAndSeconds,
    randomInt,
    debounce,
    getPhotos,
    makeId,
    getDetailedTime,
    shuffle,
    getCurrentPartOfTheDay,
    getRandomNumber
}

function makeId(length = 8) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function randomInt(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
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

function getDetailedTime(time: number) {
    const minutesTamplate = 1000 * 60
    const hoursTamplate = 1000 * 60 * 60
    if (Date.now() - time < 1000 * 10) return 'just now'
    if (Date.now() - time < 1000 * 60) return 'a few seconds ago'
    if (Date.now() - time < 1000 * 60 * 60) return `${Math.ceil((Date.now() - time) / minutesTamplate)} minutes ago`
    if (Date.now() - time < 1000 * 60 * 60 * 24) return `${Math.ceil((Date.now() - time) / hoursTamplate)} hours ago`

    const date = new Date(time)
    const month = _getMonthName(date)
    const day = date.getDate()


    return `${month} ${_padNum(day)}`
}

function _padNum(num: number): string {
    return (num > 9) ? num + '' : '0' + num
}

function _getMonthName(date: Date) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]
    return monthNames[date.getMonth()]
}

function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array
}

function getCurrentPartOfTheDay() {
    const currentHour = (new Date()).getHours()
    if (currentHour > 22 || currentHour < 4) return 'night'
    else if (currentHour > 17) return 'evening'
    else if (currentHour > 11) return 'afternoon'
    else if (currentHour >= 4) return 'morning'
}

function getRandomNumber(max: number): number {
    return Math.floor(Math.random() * max)
}