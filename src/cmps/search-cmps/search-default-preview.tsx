import { useState } from "react"
// @ts-ignore
import { ColorExtractor } from 'react-color-extractor'
import { useNavigate } from "react-router-dom"

interface Props {
    genre: string,
    image: string
}

export const SearchDefaultPreview = ({ genre, image }: Props) => {
    const navigate = useNavigate()
    const [background, setBackground] = useState<string>('#181818')

    const returnColors = (colors: string[]) => {
        const color = colors[0]
        setBackground(color)
    }

    const onGoToPage = () => {
        navigate(`/genre/${genre}`)
    }

    return (
        <section className="search-default-preview"
         style={{ background }} onClick={() => navigate(`/genre/${genre}`)}>
            <h1>{genre}</h1>
            <div className="img-container">
                <ColorExtractor getColors={returnColors}>
                    <img src={image} alt="" />
                </ColorExtractor>
            </div>
        </section>
    )
}