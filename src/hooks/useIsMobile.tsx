import { useAppSelector } from "../store/store.hooks"

export const useIsMobile = () => {
    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const isMobile = screenWidth <= 770

    return { isMobile, screenWidth }
}