import { useState } from "react"
// @ts-ignore
import { ColorExtractor } from 'react-color-extractor'

interface Props {
    genre: string,
    image: string
}

export const SearchDefaultPreview = ({ genre, image }: Props) => {
    const [background, setBackground] = useState<string>('#181818')

    const returnColors = (colors: string[]) => {
        const color = colors[0]
        console.log('colors:', colors)
        setBackground(color)
    }
    return (
        <section className="search-default-preview" style={{ background }}>
                <h1>{genre}</h1>
                <div className="img-container">
            <ColorExtractor getColors={returnColors}>
                    <img src={image} alt="" />
            </ColorExtractor>
                </div>
        </section>
    )
}