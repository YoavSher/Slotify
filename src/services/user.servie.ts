import { storageService } from "./async-storage.service"

export const userService = {
    login,
    signup,
    logout,
    getLoggedInUser
}
export interface User {
    username: string,
    fullName: string,
    password: string,
    email: string,
    _id: string
}
interface Credentials {
    username: string,
    password: string,
}

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const STORAGE_KEY = 'users'
async function login(userCred: Credentials) {
    const users = await storageService.query(STORAGE_KEY)
    const user = users.find((currUser: User) => currUser.username.toLowerCase() === userCred.username.toLowerCase())
    // for now it is enough to validate username becuase these things should be in the backend recieving the cred and finding out whether it is okay
    if (user) {
        return saveLocalUser(user)
    }
}

async function signup(newUser: User) {
    const user = await storageService.post(STORAGE_KEY, newUser)
    try {
        // const user = await httpService.post('auth/signup', userCred)
        // socketService.login(user._id)

        return saveLocalUser(user)
    } catch (err) {
    }
}
async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    // return await storageService.post('auth/logout')
}


function saveLocalUser(user: User) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedInUser() {
    const loggedInUser = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)
    if (loggedInUser) return JSON.parse(loggedInUser)
    else return null
}
