// @ts-ignore
import { ColorExtractor } from 'react-color-extractor'

export const TestColor = () => {


    const getColors = (colors:string[]) =>
        console.log(colors)

    return (
        <div>
            <ColorExtractor getColors={getColors}>
                <img
                    src="https://i.imgur.com/OCyjHNF.jpg"
                    style={{ width: 700, height: 500 }}
                />
            </ColorExtractor>

        </div>
    )

}