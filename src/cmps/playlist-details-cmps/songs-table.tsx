import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { CustomEvent } from "../../interfaces/boundingRect"
import { Song } from "../../interfaces/song"
import { SongPreview } from "../song-preview-cmps/song-preview"

interface Props {
    handleOnDragEnd: (result: any) => Promise<void>,
    toggleModal: (ev: CustomEvent, song: Song) => void,
    songs: Song[],
    screenWidth: number,
    playSongFromPlaylist: (index: number) => void
}



export const SongsTable = ({ handleOnDragEnd, toggleModal, songs, screenWidth, playSongFromPlaylist }: Props) => {
    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="playlist-songs">

                {(provided) => (<div {...provided.droppableProps} ref={provided.innerRef} className="songs-container">
                    {songs?.map((s, idx) => {
                        return <Draggable key={`${s.videoId}${idx}`} draggableId={`${s.videoId}${idx}`} index={idx}>
                            {(provided) => (
                                <article {...provided.draggableProps}{...provided.dragHandleProps} ref={provided.innerRef}>
                                    <SongPreview
                                        playSongFromPlaylist={playSongFromPlaylist}
                                        song={s}
                                        toggleModal={toggleModal}
                                        index={idx}
                                        type={'playlist-details'}
                                        screenWidth={screenWidth} />
                                </article>)}
                        </Draggable>
                    })}
                    {provided.placeholder}
                </div>)}
            </Droppable>
        </DragDropContext>
    )
}