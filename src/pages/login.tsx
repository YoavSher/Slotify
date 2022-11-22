import { ChangeEvent, MouseEvent, MouseEventHandler, useState } from "react"
import { Helmet } from "react-helmet"
import { BsSpotify } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom"
import { userService } from "../services/user.service"
import { useAppDispatch } from "../store/store.hooks"
import { setUser } from "../store/user/user.reducer"

export const Login = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [userCred, setUserCred] = useState({ username: 'a', password: '' })
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

    const onLogin = async (ev: React.SyntheticEvent) => {
        ev.preventDefault()
        try {
            const user = await userService.login(userCred)
            if (user) dispatch(setUser(user))
            onCloseModal()
        } catch (err) {
            console.log(err)
        }
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
                <Link className="back" to="/" >Back</Link>
                <Link to="/signup" >Dont have an account? <span>SIGNUP</span> </Link>
            </section>
        </section>
    )
}