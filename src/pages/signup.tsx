import { MouseEvent, ChangeEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, userService } from "../services/user.servie"
import { useAppDispatch } from "../store/store.hooks"
import { setUser } from "../store/user/user.reducer"
export const Signup = () => {
    const [userCred, setUserCred] = useState({ username: 'a', fullName: 'b', password: '', email: '', })
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const onCloseModal = () => {
        navigate(-1)
    }

    const onStopPropagation = (ev: MouseEvent) => {
        ev.stopPropagation()
    }
    const onSignUp = async (ev: React.SyntheticEvent) => {
        ev.preventDefault()
        try {
            const user = await userService.signup(userCred as User)
            if (user) dispatch(setUser(user))

        } catch (err) {
            console.log(err)
        }
    }

    const isCredValid = () => {
        return Object.values(userCred).every(field => field)
    }

    const onChangeUserCred = (ev: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = ev.target
        setUserCred(prev => ({ ...prev, [name]: value }))
    }

    const inputs = [
        { name: 'username', type: 'text', placeholder: 'User name', value: userCred.username },
        { name: 'fullName', type: 'text', placeholder: 'Full name', value: userCred.fullName },
        { name: 'email', type: 'email', placeholder: 'Your email address', value: userCred.email },
        { name: 'password', type: 'password', placeholder: 'password', value: userCred.password },
    ]

    return (
        <section className="login-screen-cover" onClick={onCloseModal}>
            <section className="login-modal" onClick={onStopPropagation}>
                <h2 className="login-page-heading">Sign up for a free Slotify account</h2>
                <form onSubmit={onSignUp}>
                    {inputs.map(input => (
                        <input type={input.type} name={input.name}
                            placeholder={input.placeholder} value={input.value}
                            key={input.name} onChange={onChangeUserCred} />
                    ))}
                    <button disabled={!isCredValid()} className="sign-up-btn">SIGN UP</button>
                </form>

            </section>
        </section>
    )
}