import { AiFillCaretLeft } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'


interface Props {
    type: string,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export const NeedToLoginModal = ({ type, setIsModalOpen }: Props) => {
    const navigate = useNavigate()
    const modalTitle = () => {
        switch (type) {
            case 'create playlist':
                return 'Create Playlist'
            case 'liked songs':
                return 'Enjoy your liked songs'
            case 'library':
                return 'Enjoy your liked own library'
        }
    }

    const modalDescription = () => {
        switch (type) {
            case 'create playlist':
                return 'Login to create and share playlists.'
            case 'liked songs':
                return 'Login to listen to all of your liked songs in one playlists.'
            case 'library':
                return 'Login to keep track of all your liked playlists and songs.'
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }
    const calcTop = () => {
        switch (type) {
            case 'create playlist':
                return {
                    top: `248px`
                }
            case 'liked songs':
                return {
                    top: `288px`
                }
            case 'library':
                return {
                    top: `182px`
                }
        }
    }

    const goToLogin=()=>{
        closeModal()
        navigate('/login')   
    }
    return (
        <section className="need-to-login-modal" style={calcTop()}>
            <div className="modal-content">
                <div className="modal-content content">
                    <h2>{modalTitle()}</h2>
                    <p>{modalDescription()}</p>
                    <div className='btns'>
                        <button className='btns not-now' onClick={closeModal}>Not now</button>
                        <button className='btns login' onClick={goToLogin}>Login</button>
                    </div>
                </div>
            </div>
            <div className="side-arrow">
                <span><AiFillCaretLeft /></span>
            </div>
        </section>
    )
}