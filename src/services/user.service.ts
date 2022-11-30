import { MiniPlaylist } from "../interfaces/mini-playlist"
import { Playlist } from "../interfaces/playlist"
import { Song } from "../interfaces/song"
import { storageService } from "./async-storage.service"
import { httpService } from "./http.service"

export const userService = {
    login,
    signup,
    logout,
    getLoggedInUser,
    saveUser
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

async function login({ password, username }: Credentials) {
    try {
        const user = await httpService.post('auth/login', { password, username })
        if (user) {
            return saveLocalUser(user)
        }
    } catch (err) {
        console.log('cant login')
        //do something
    }
    //     // const users = await storageService.query(STORAGE_KEY)
    //     // if we promise.all  return [user,likedsongs,recentlyplayedPlaylists]
    //     const user = await httpService.post(userCred)
    //     // const user = users.find((currUser: User) => currUser.username.toLowerCase() === userCred.username.toLowerCase())
    //     // for now it is enough to validate username becuase these things should be in the backend recieving the cred and finding out whether it is okay
    //     
}

async function signup(credentials: NewUser) {
    // const user = await storageService.post(STORAGE_KEY, newUser)
    try {
        const user = await httpService.post('auth/signup', credentials)
        return saveLocalUser(user)
    } catch (err) {
    }
}
async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    // return await storageService.post('auth/logout')
}

async function saveUser(user: User) {
    await storageService.put(STORAGE_KEY, user)
    saveLocalUser(user)
    // not the best written
}


function saveLocalUser(user: User) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedInUser(): User | null {
    const loggedInUser = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)
    if (loggedInUser) return JSON.parse(loggedInUser)
    else return null
}
