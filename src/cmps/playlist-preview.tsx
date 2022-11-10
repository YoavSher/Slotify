

export const PlayListPreview = (props: any) => {
    const { playlist } = props
    return (
        <section className="playlist-preview">
            {/* <img src={playlist.} alt="" /> */}
            <h1>{playlist.name}</h1>
        </section>
    )
}