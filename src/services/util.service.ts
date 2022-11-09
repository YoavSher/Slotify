export const utilService = {
    millisToMinutesAndSeconds
}
function millisToMinutesAndSeconds(millis: number): string {
    const minute = Math.floor(millis / 60000)
    const second = Math.floor((millis % 60000) / 1000)
    return `${minute}:${second < 10 ? '0' : ''}${second}`
}