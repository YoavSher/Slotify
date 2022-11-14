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
        "fullname": "Puki Ben David",
        "imgUrl": "http://some-photo/"
    },
    "likedByUsers": [],
    "songs": [
        {
            "id": "mbj1RFaoyLk",
            "title": "The Doors - Light My Fire",
            "image": "https://i.ytimg.com/vi/mbj1RFaoyLk/default.jpg",
            "duration": 563000,
            "description": "Music video by The Doors "
        },
        {
            "id": "91vU3kHtnoU",
            "title": "The Doors - L.A. Woman",
            "image": "https://i.ytimg.com/vi/91vU3kHtnoU/default.jpg",
            "duration": 2930000,
            "description": "The 50th anniversary deluxe"
        },
        {
            "id": "sezc05A4s2g",
            "title": "The Doors - «People Are Strange»",
            "image":"https://i.ytimg.com/vi/sezc05A4s2g/default.jpg",
            "duration": 2930000,
            "description": "The 50th anniversary deluxe"
        },

    ]
}
var playlist2 = {
    "_id": "5cksxjas89xjsa8xjsa8jxs10",
    "name": "My Playlist",
    "imgUrl": 'https://img.freepik.com/free-vector/musical-pentagram-sound-waves-notes-blue-neon-style_1017-36831.jpg?w=1380&t=st=1668328027~exp=1668328627~hmac=5ccc6d490bb5a1f81a797bbc74db21af80d48a6525a0af8b491ef6ddcfd90f4f',
    "tags": [
        "Funk",
        "Happy"
    ],
    "createdBy": {
        "_id": "u101",
        "fullname": "Puki Ben David",
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
        "fullname": "Puki Ben David",
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