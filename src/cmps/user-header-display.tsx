import { BsPerson } from "react-icons/bs"
import { useNavigate } from "react-router-dom"

export const UserHeaderDisplay = () => {
    const navigate = useNavigate()

    return (
        <div className="header-user flex align-center">
            <button className="signup-btn" onClick={() => navigate('/signup')}>Sign up</button>
            <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
            {/* <span><BsPerson /></span><h4>User</h4> */}
        </div>
    )
}