import { utilService } from "./util.service"



var playlist1 = {
    "_id": "5cksxjas89xjsa8xjsa8jxs09",
    "name": "Funky Monks",
    "imgUrl": 'https://upload.wikimedia.org/wikipedia/en/4/4e/Funkymonks.jpg',
    "tags": [
        "Funk",
        "Happy"
    ],
    "createdBy": {
        "_id": "u101",
        "fullName": "Puki Ben David",
        "imgUrl": "http://some-photo/",
    },
    "likedByUsers": [],
    "songs": [
        {
            "id": "mbj1RFaoyLk",
            "VideoId": "mbj1RFaoyLk",
            "title": "The Doors - Light My Fire",
            "image": "https://i.ytimg.com/vi/mbj1RFaoyLk/default.jpg",
            "duration": 563000,
            "artist": "The Doors"
        },
        {
            "id": "91vU3kHtnoU",
            "videoId": "91vU3kHtnoU",
            "title": "The Doors - L.A. Woman",
            "image": "https://i.ytimg.com/vi/91vU3kHtnoU/default.jpg",
            "duration": 2930000,
            "artist": "The Doors"
        },
        {
            "id": "sezc05A4s2g",
            "videoId": "sezc05A4s2g",
            "title": "The Doors - «People Are Strange»",
            "image": "https://i.ytimg.com/vi/sezc05A4s2g/default.jpg",
            "duration": 133000,
            "artist": "The Doors"
        },

    ]
}
var playlist2 = {
    "_id": "5cksxjas89xjsa8xjsa8jxs10",
    "name": "My Playlist",
    "imgUrl": 'https://thumbs.dreamstime.com/b/music-background-panorama-13786355.jpg',
    "tags": [
        "Funk",
        "Happy"
    ],
    "createdBy": {
        "_id": "u101",
        "fullName": "Puki Ben David",
        "imgUrl": "http://some-photo/"
    },
    "likedByUsers": ['{minimal-user}', '{minimal-user}'],
    "songs": [
        {
            "id": "s1001",
            "title": "The Meters - Cissy Strut",
            "url": "youtube/song.mp4",
            "imgUrl": "https://i.ytimg.com/vi/4_iC0MyIykM/mqdefault.jpg",
            "addedBy": '{minimal-user}',
            "addedAt": 162521765262
        },
        {
            "id": "mUkfiLjooxs",
            "title": "The JB's - Pass The Peas",
            "url": "youtube/song.mp4",
            "imgUrl": "https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg",
            "addedBy": {}
        },
    ],

}
var playlist3 = {
    "_id": "5cksxjas89xjsa8xjsa8jxs11",
    "name": "Workout",
    "imgUrl": 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    "tags": [
        "Funk",
        "Happy"
    ],
    "createdBy": {
        "_id": "u101",
        "fullName": "Puki Ben David",
        "imgUrl": "http://some-photo/"
    },
    "likedByUsers": ['{minimal-user}', '{minimal-user}'],
    "songs": [
        {
            "id": "s1001",
            "title": "The Meters - Cissy Strut",
            "url": "youtube/song.mp4",
            "imgUrl": "https://i.ytimg.com/vi/4_iC0MyIykM/mqdefault.jpg",
            "addedBy": '{minimal-user}',
            "addedAt": 162521765262
        },
        {
            "id": "mUkfiLjooxs",
            "title": "The JB's - Pass The Peas",
            "url": "youtube/song.mp4",
            "imgUrl": "https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg",
            "addedBy": {}
        },
    ],

}

const user = {}



export function getPlaylists() {
    return [playlist1, playlist2, playlist3]
}