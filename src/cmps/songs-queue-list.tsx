import { Song } from "../interfaces/song"
import { SongPreview } from "./song-preview"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useAppDispatch } from "../store/store.hooks"
import { reorderSongsList } from "../store/music-player/music-player.reducer"

interface Props {
    songs: Song[]
    songIdx: number,
    toggleModal: any
}

export const SongsQueueList = ({ toggleModal, songs, songIdx }: Props) => {
    const dispatch = useAppDispatch()
    const handleOnDragEnd = (result: any) => {
        songs = [...songs]
        const [reorderedItem] = songs.splice(result.source.index, 1)
        songs.splice(result.destination.index, 0, reorderedItem)
        dispatch(reorderSongsList(songs))
    }
    return (
        <>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="songs">

                    {(provided) => (<section {...provided.droppableProps} ref={provided.innerRef} className="queue-song-list">
                        {songs.map((song, index) => {
                            if (index <= songIdx) return
                            else return <Draggable key={song.id} draggableId={`${song.id}${index}`} index={index ? index : 0}>
                                {(provided) => (
                                    <article  {...provided.draggableProps}{...provided.dragHandleProps} ref={provided.innerRef}>
                                        <SongPreview toggleModal={toggleModal} index={index} type={'queue'} song={song} />
                                    </article>
                                )}</Draggable>
                        })}
                        {provided.placeholder}
                    </section>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    )
}