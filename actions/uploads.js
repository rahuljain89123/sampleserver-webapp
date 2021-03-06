import { showLoading, hideLoading } from 'react-redux-loading-bar'
import {
  RECEIVE_UPLOAD,
  RECEIVE_UPLOADS,
  REMOVE_UPLOAD,
  SET_UPLOADING_ERROR,
  CLEAR_UPLOADING_ERROR,
} from 'constants/UploadActionTypes'
import API from 'API'
import { setPageErrors } from './global'

/*****************************************************************************
 * ACTION CREATORS
 *****************************************************************************/

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

export const setUploadingError = error => ({
  type: SET_UPLOADING_ERROR,
  error,
})

export const clearUploadingError = () => ({
  type: CLEAR_UPLOADING_ERROR,
})

/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

export const fetchUploads = () =>
  dispatch =>
    API.get('/uploads/')
    .then(uploads => {
      dispatch(receiveUploads(uploads))
    })

export const createUpload = upload =>
  dispatch => {
    dispatch(showLoading())
    return API.post('/uploads/', upload)
    .then(json => {
      dispatch(hideLoading())
      dispatch(receiveUpload(json))
      return Promise.resolve(json.id)
    })
    .catch(e => {
      dispatch(hideLoading())

      e.response.json().then(error => {
        // console.log(error)
        dispatch(setUploadingError(error.message))
      })
      return Promise.reject(e)
    })
  }

export const patchUpload = (id, upload) =>
  dispatch =>
    API.patch(`/uploads/${id}`, upload)
    .then(json => {
      dispatch(receiveUpload(json))
      return Promise.resolve(json.id)
    })
    .catch(e => Promise.reject())


export const deleteUpload = id =>
  dispatch => {
    API.delete(`/uploads/${id}`)
    .then(() => dispatch(removeUpload(id)))
  }
