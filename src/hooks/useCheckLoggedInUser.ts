import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../store/store.hooks"

export const useCheckLoggedInUser = () => {
    const navigate = useNavigate()
    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    useEffect(() => {
        if (!loggedInUser) navigate('/')
    }, [])
}