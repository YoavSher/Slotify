import { BsFillPlayCircleFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { setPlaylist } from '../store/music-player/music-player.reducer'
import { useAppDispatch } from '../store/store.hooks'

export const PlayListPreview = (props: any) => {

    const dispatch = useAppDispatch()
    const { playlist } = props
    const onSetPlaylist = () => {
        console.log('setting')
        dispatch(setPlaylist(playlist))
    }
    return (
        <section className="playlist-preview">
            <div className="playlist-preview-container flex">
                <div className="img-container">
                    <img src={playlist.imgUrl} alt="" />
                </div>
                <div className='playlist-preview-content flex align-center justify-between'>
                    <div className='playlist-preview-content title'>
                        <h1><Link to={`playlist/${playlist._id}`}>{playlist.name}</Link></h1>
                    </div>
                    <div className='playlist-preview-content icon-container'>
                        <button onClick={onSetPlaylist}><span><BsFillPlayCircleFill /></span></button>
                    </div>
                </div>
            </div>
        </section>
    )
}