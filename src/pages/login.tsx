import { ChangeEvent, MouseEvent, MouseEventHandler, useState } from "react"
import { useNavigate } from "react-router-dom"
import { userService } from "../services/user.servie"
import { useAppDispatch } from "../store/store.hooks"
import { setUser } from "../store/user/user.reducer"

export const Login = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [userCred, setUserCred] = useState({ username: 'a', password: '' })
    const onCloseModal = () => {
        navigate(-1)
    }

    const onStopPropagation = (ev: MouseEvent) => {
        ev.stopPropagation()
    }
    const inputs = [
        { name: 'username', type: 'text', placeholder: 'User name', value: userCred.username },
        { name: 'password', type: 'password', placeholder: 'password', value: userCred.password },
    ]
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

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <section className="login-screen-cover" onClick={onCloseModal}>
            <section className="login-modal" onClick={onStopPropagation}>
                <h2 className="login-page-heading">Login</h2>
                <form onSubmit={onLogin}>
                    {inputs.map(input => (
                        <input type={input.type} name={input.name}
                            placeholder={input.placeholder} value={input.value}
                            key={input.name} onChange={onChangeUserCred} />
                    ))}
                    <button disabled={!isCredValid()} className="sign-up-btn">LOG IN</button>
                </form>
            </section>
        </section>
    )
}