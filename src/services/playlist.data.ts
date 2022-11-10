import { utilService } from "./util.service"



var playlist1 = {
    "_id": "5cksxjas89xjsa8xjsa8jxs09",
    "name": "Funky Monks",
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
    "msgs": [
        {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?'
        }
    ]
}
var playlist2 = {
    "_id": "5cksxjas89xjsa8xjsa8jxs10",
    "name": "My Playlist",
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
    "msgs": [
        {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?'
        }
    ]
}
var playlist3 = {
    "_id": "5cksxjas89xjsa8xjsa8jxs11",
    "name": "Workout",
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
    "msgs": [
        {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?'
        }
    ]
}

const user = {}



export function getPlaylists() {
return[playlist1,playlist2,playlist3]
}