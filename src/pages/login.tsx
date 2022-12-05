import { ChangeEvent, MouseEvent, MouseEventHandler, useState } from "react"
import { Helmet } from "react-helmet"
import { BsSpotify } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom"
import { GoogleLoginBtn } from "../cmps/google-login-btn"
import { PlaylistSong, Song } from "../interfaces/song"
import { songService } from "../services/songs.service"
import { userService } from "../services/user.service"
import { useAppDispatch } from "../store/store.hooks"
import { setLikedSongs, setUser } from "../store/user/user.reducer"

export const Login = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [userCred, setUserCred] = useState({ username: '', password: '' })
    const onCloseModal = () => {
        navigate('/')
    }

    const onStopPropagation = (ev: MouseEvent) => {
        ev.stopPropagation()
    }
    const isCredValid = () => {
        return Object.values(userCred).every(field => field)
    }
    const onChangeUserCred = (ev: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = ev.target
        setUserCred(prev => ({ ...prev, [name]: value }))
    }
    const login = async (loggesinUser = userCred) => {
        try {
            const user = await userService.login(loggesinUser)
            if (user) {
                //TODO: request it's playlists
                dispatch(setUser(user))
                const songs = await songService.getLikedSongs(user._id) as Song[]
                dispatch(setLikedSongs(songs))
            }

            onCloseModal()
        } catch (err) { //needs to return errors to the user.
            console.log(err)
        }

    }
    const onLogin = async (ev: React.SyntheticEvent) => {
        ev.preventDefault()
        login()
    }

    const inputs = [
        { name: 'username', type: 'text', placeholder: 'User name', value: userCred.username },
        { name: 'password', type: 'password', placeholder: 'password', value: userCred.password },
    ]
    
    return (
        <section className="login-screen-cover" onClick={onCloseModal}>
            <Helmet><title>Slotify - Login </title></Helmet>
            <section className="login-modal" onClick={onStopPropagation}>
                <h2><span><BsSpotify /></span> Slotify</h2>
                <h2 className="login-page-heading">Login</h2>
                <form onSubmit={onLogin}>
                    {inputs.map(input => (
                        <input type={input.type} name={input.name}
                            placeholder={input.placeholder} value={input.value}
                            key={input.name} onChange={onChangeUserCred} />
                    ))}
                    <button disabled={!isCredValid()} className="sign-up-btn">LOG IN</button>
                </form>
                <GoogleLoginBtn cbFunc={login} />
                <Link className="back" to="/" >Back</Link>
                <Link to="/signup" >Dont have an account? <span>SIGNUP</span> </Link>
            </section>
        </section>
    )
}