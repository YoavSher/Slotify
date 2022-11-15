
export const storageService = {
    query,
    get,
    post,
    put,
    remove,
    postMany,
    makeId
}

function query(entityType: string): Promise<any> {
    if (entityType !== null) {
        let entities = localStorage.getItem(entityType)
        entities = entities ? JSON.parse(entities) : []
        _save(entityType, entities)
        return Promise.resolve(entities)
    } else throw 'non existing entity'
}

async function get(entityType: string, entityId: string) {
    const entities = await query(entityType)
    if (entities) {
        return entities.find((entity: any) => entity._id === entityId)
    }
}

async function post(entityType: string, newEntity: any) {
    if (!newEntity._id) newEntity._id = makeId()
    const entities = await query(entityType)
    entities.push(newEntity)
    _save(entityType, entities)
    return newEntity
}

async function put(entityType: string, updatedEntity: any) {
    const entities = await query(entityType)
    const idx = entities.findIndex((entity: any) => entity._id === updatedEntity._id)
    entities.splice(idx, 1, updatedEntity)
    _save(entityType, entities)
    return updatedEntity
}

async function remove(entityType: string, entityId: string) {
    const entities = await query(entityType)
    const idx = entities.findIndex((entity: any) => entity._id === entityId)
    entities.splice(idx, 1)
    _save(entityType, entities)
    return
}

function _save(entityType: string, entities: any) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}


function postMany(entityType: string, newEntities: any) {
    return query(entityType)
        .then(entities => {
            newEntities = newEntities.map((entity: any) => ({ ...entity, _id: makeId() }))
            entities.push(...newEntities)
            _save(entityType, entities)
            return entities
        })
}

function makeId(length = 8) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}



