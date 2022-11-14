import { Link } from 'react-router-dom'
import { BsFillPlayCircleFill } from 'react-icons/bs'

export const PlayListPreview = (props: any) => {
    const { playlist } = props
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
                        <button><span><BsFillPlayCircleFill /></span></button>
                    </div>
                </div>
            </div>
        </section>
    )
}