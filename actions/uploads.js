
import { RECEIVE_UPLOAD, RECEIVE_UPLOADS } from '../constants/UploadActionTypes'
import API from '../API'

export const receiveUpload = upload => ({
    type: RECEIVE_UPLOAD,
    upload,
})

export const receiveUploads = uploads => ({
    type: RECEIVE_UPLOADS,
    uploads,
})

export const fetchUploads = () =>
    dispatch =>
        API.get('/uploads/')
        .then(uploads => {
            dispatch(receiveUploads(uploads))
        })

export const createUpload = upload =>
    dispatch =>
        API.post('/uploads/', upload)
        .then(json => {
            dispatch(receiveUpload(json))
            return Promise.resolve(json.id)
        })
        .catch(e => Promise.reject())


export const patchUpload = (id, upload) =>
    dispatch => {
        API.patch(`/uploads/${id}`, upload)
        .then(json => {
            dispatch(receiveUpload(json))
            return Promise.resolve(json.id)
        })
        .catch(e => Promise.reject())
    }
