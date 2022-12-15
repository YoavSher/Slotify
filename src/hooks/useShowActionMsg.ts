import { useState } from "react"

export const useShowActionMsg = () => {

    const [msg, setMsg] = useState('')
    const showActionMsg = (txt: string) => {
        setMsg(txt)
        setTimeout(() => {
            setMsg('')
        }, 2000)
    }
    return { msg, showActionMsg }
}