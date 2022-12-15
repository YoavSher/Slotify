export const uploadService = {
    uploadImg
}

interface Photo{
    url: string,
    name: string,
    height: number,
    width: number
}

async function uploadImg(ev: any) {
    const CLOUD_NAME = "dcwibf9o5"
    const UPLOAD_PRESET = "vt0iqgff"
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    const formData = new FormData()
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('file', ev.target.files[0])

    try {
        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        })

        const resData = await res.json()
        return {
            url: resData.url,
            name: resData.original_filename,
            height: resData.height,
            width: resData.width
        } as Photo
    } catch (err) {
        console.error(err)
    }

}