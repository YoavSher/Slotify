import { SearchDefaultPreview } from "./search-default-preview"

export const SearchDefault = () => {
    const genres = [
        {
            genre: 'Rock',
            image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cm9jayUyMG11c2ljfGVufDB8fDB8fA%3D%3D&w=1000&q=80'
        },
        {
            genre: 'Metal',
            image: 'https://cdn-images.audioaddict.com/5/9/d/7/3/5/59d73538e3c9040ae2216f1a3f0bb4ca.png'
        },
        {
            genre: 'Pop',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq5yiqEmtAo_ZsbLp-QB7l8BJDZw1ezR8wow&usqp=CAU'
        },
        {
            genre: 'Latin',
            image: 'https://s1.ticketm.net/dam/a/c49/1623a7a4-d3f2-4806-9ff1-c864ff5c0c49_1488281_TABLET_LANDSCAPE_LARGE_16_9.jpg'
        },
        {
            genre: 'Jazz',
            image: 'https://cdn-images.audioaddict.com/1/b/e/b/e/8/1bebe8759e23ab6a1b92e1d46e2e7f12.png'
        },
        {
            genre: 'Hip Hop',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiL44Av6JBe64UQRYnNQNtuD6suKyTNOLwPA&usqp=CAU'
        },
        {
            genre: 'Dance',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz05_tQ-zP1NHCaifQ6hg8qTqfqATWN4QuRzUhJYKmo3wTiUTkTlfQiynqB2o5IyLYwzM&usqp=CAU'
        },
        {
            genre: 'Blues',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5XYXbvfKeWJC0bJufltITzWMTYoXWrdme0A&usqp=CAU'
        },
        {
            genre: 'Funk',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKX8IrUQY05c3CPIpTXGD0ZlZejGyDCmpawg&usqp=CAU'
        },
        {
            genre: 'Workout',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfHnXiC8eCkbBtAQVN9serIGD1aML7x0X_vQ&usqp=CAU'
        },
        {
            genre: 'Decades',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxLrgAHhpsMBh1MayAKuGl-Ys5VZ1k-4iJow&usqp=CAU'
        },
        {
            genre: 'Chill',
            image: 'https://live.staticflickr.com/65535/49999329836_30ee650441_b.jpg'
        },
    ]

    return (
        <section className="search-default">
            {genres.map(g => <SearchDefaultPreview key={g.genre} genre={g.genre} image={g.image}/>)}

        </section>
    )
}