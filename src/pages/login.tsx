import { MouseEvent, MouseEventHandler } from "react"
import { useNavigate } from "react-router-dom"

export const Login = () => {
    //render dynamically two compoenents inside the main modal.
    //either signup or login
    const navigate = useNavigate()
    const onCloseModal = () => {
        navigate(-1)
    }

    const onStopPropagation = (ev: MouseEvent) => {
        ev.stopPropagation()
    }

    return (
        <section className="login-screen-cover" onClick={onCloseModal}>
            <section className="login-modal" onClick={onStopPropagation}>
                <h3>Login/Signup</h3>

            </section>
        </section>
    )
}