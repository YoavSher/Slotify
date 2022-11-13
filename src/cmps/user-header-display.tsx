import { BsPerson } from "react-icons/bs"

export const UserHeaderDisplay = () => {


    return (
        <div className="header-user flex align-center">
            <button className="signup-btn">Sign up</button>
            <button className="login-btn">Login</button>
            {/* <span><BsPerson /></span><h4>User</h4> */}
        </div>
    )
}