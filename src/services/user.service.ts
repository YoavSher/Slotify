import { MiniPlaylist } from "../interfaces/mini-playlist"
import { MiniUser } from "../interfaces/mini-user"
import { Playlist } from "../interfaces/playlist"
import { Song } from "../interfaces/song"
import { storageService } from "./async-storage.service"
import { httpService } from "./http.service"

export const userService = {
    login,
    signup,
    logout,
    checkLoginToken
}
export interface User {
    fullName: string,
    _id: number,
}
export interface NewUser {
    username: string,
    fullName: string,
    password: string,
    email: string,
}

interface Credentials {
    username: string,
    password: string,
}

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const STORAGE_KEY = 'users'

async function checkLoginToken() {
    try {
        console.log('getting to the last point in the front')
        return await httpService.get('auth/', null)
    } catch (err) {

    }
}

async function login({ password, username }: Credentials) {
    try {
        return await httpService.post('auth/login', { password, username }) as MiniUser
    } catch (err) {
        console.log('cant login')
        //do something
    }
}

async function signup(credentials: NewUser) {
    try {
        return await httpService.post('auth/signup', credentials) as MiniUser
    } catch (err) {
        console.log('cant signup')
    }
}

async function logout() {
    await httpService.post('auth/logout', null)
}



