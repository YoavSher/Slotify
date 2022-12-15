import { MiniUser } from "../interfaces/mini-user"
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


async function checkLoginToken() {
    try {
        return await httpService.get('auth/', null)
    } catch (err) {
        throw err
    }
}

async function login({ password, username }: Credentials) {
    try {
        return await httpService.post('auth/login', { password, username }) as MiniUser
    } catch (err) {
        throw err
    }
}

async function signup(credentials: NewUser) {
    try {
        return await httpService.post('auth/signup', credentials) as MiniUser
    } catch (err) {
        throw err
    }
}

async function logout() {
    await httpService.post('auth/logout', null)
}



