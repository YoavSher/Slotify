import { useState } from "react"
import { BsPerson } from "react-icons/bs"
import { useNavigate } from "react-router-dom"
import { userService } from "../services/user.service"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { setUser } from "../store/user/user.reducer"

export const UserHeaderDisplay = () => {
    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleModal = () => {
        setIsModalOpen(prev => !prev)
    }

    const onLogOut = async () => {
        await userService.logout()
        dispatch(setUser(null))
    }


    return (
        <div className="header-user flex align-center">
            {loggedInUser ?
                <><button className="user-btn" onClick={toggleModal}>
                    <BsPerson />
                </button>
                    {isModalOpen && <section className="user-options-modal">
                        <button onClick={onLogOut}>Logout</button>
                    </section>}
                </>

                :
                <><button className="signup-btn" onClick={() => navigate('/signup')}>Sign up</button>
                    <button className="login-btn" onClick={() => navigate('/login')}>Login</button></>}
        </div>
    )
}