import { useEffect } from 'react'
import loading from '../assets/img/Spotify-Loading-Animation-4.gif'
import { setIsLoading } from '../store/helper/helper.reducer'
import { useAppDispatch } from '../store/store.hooks'

export const Loader = () => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(setIsLoading(true))
        return () => {
            dispatch(setIsLoading(false))
        }
    }, [])
    return <div className="loading-anim"><img src={loading} alt="" /></div>
}