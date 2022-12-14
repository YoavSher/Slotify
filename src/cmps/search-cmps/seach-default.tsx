import { SearchDefaultPreview } from "./search-default-preview"

export const SearchDefault = () => {
    const genres = [
        {
            genre: 'Rock',
            image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cm9jayUyMG11c2ljfGVufDB8fDB8fA%3D%3D&w=1000&q=80'
        },
        {
            genre: 'Pop',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq5yiqEmtAo_ZsbLp-QB7l8BJDZw1ezR8wow&usqp=CAU'
        },
        {
            genre: 'Hip Hop',
            image: 'https://mi-ballet-school.de/wp-content/uploads/2020/11/hiphop-tanz-tanzschule-kurse-muenchen-02.jpg'
        },
        {
            genre: 'Latin',
            image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bbc.com%2Fculture%2Farticle%2F20191016-the-greatest-hip-hop-songs-from-around-the-world&psig=AOvVaw0W72vtWop4YIOiuZoBPalx&ust=1671029461161000&source=images&cd=vfe&ved=0CA0QjRxqFwoTCKDExIfs9vsCFQAAAAAdAAAAABAJ'
        },
        {
            genre: 'Metal',
            image: 'https://cdn-images.audioaddict.com/5/9/d/7/3/5/59d73538e3c9040ae2216f1a3f0bb4ca.png'
        },
    ]

    return (
        <section className="search-default">
            {genres.map(g => <SearchDefaultPreview key={g.genre} genre={g.genre} image={g.image}/>)}

        </section>
    )
}