
import { RECEIVE_UPLOAD, RECEIVE_UPLOADS, REMOVE_UPLOAD } from '../constants/UploadActionTypes'
import API from '../API'
import { setPageErrors } from './global'

export const receiveUpload = upload => ({
    type: RECEIVE_UPLOAD,
    upload,
})

export const receiveUploads = uploads => ({
    type: RECEIVE_UPLOADS,
    uploads,
})

export const removeUpload = id => ({
    type: REMOVE_UPLOAD,
    id,
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
        .catch(e => Promise.reject(e))



export const patchUpload = (id, upload) =>
    dispatch => {
        API.patch(`/uploads/${id}`, upload)
        .then(json => {
            dispatch(receiveUpload(json))
            return Promise.resolve(json.id)
        })
        .catch(e => Promise.reject())
    }


export const deleteUpload = id =>
    dispatch => {
        API.delete(`/uploads/${id}`)
        .then(() => dispatch(removeUpload(id)))
    }
