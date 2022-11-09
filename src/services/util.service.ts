export const utilService = {
    millisToMinutesAndSeconds
}
function millisToMinutesAndSeconds(millis: number): string {
    const minute = Math.floor(millis / 60000)
    const second = Math.floor((millis % 60000) / 1000)
    const result = `${minute}:${second < 10 ? '0' : ''}${second}`
    if (result) return result
    else return ''
}