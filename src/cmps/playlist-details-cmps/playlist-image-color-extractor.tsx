// @ts-ignore
import { ColorExtractor } from 'react-color-extractor'

interface Props {
    imgSrc: string,
    returnColors: (colors: string[]) => void
}
export const PlaylistColorExtractor = ({ imgSrc, returnColors }: Props) => {
    return (
        <ColorExtractor getColors={returnColors}>
            <img
                src={imgSrc}
            />
        </ColorExtractor>
    )
}