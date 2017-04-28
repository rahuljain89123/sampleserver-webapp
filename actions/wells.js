
import qs from 'qs'

import {
  RECEIVE_WELL,
  RECEIVE_WELLS,
  SET_CREATING_WELL,
  SET_CREATING_WELL_ERROR,
  CLEAR_CREATING_WELL_ERROR,
  SET_EDITING_WELL,
  SET_EDITING_WELL_ERROR,
  CLEAR_EDITING_WELL_ERROR,
  REMOVE_WELL,
} from 'constants/WellActionTypes'
import API from 'API'

/*****************************************************************************
 * ACTION CREATORS
 *****************************************************************************/

export const receiveWell = well => ({
  type: RECEIVE_WELL,
  well,
})

export const receiveWells = wells => ({
  type: RECEIVE_WELLS,
  wells,
})

export const setCreatingWell = creating => ({
  type: SET_CREATING_WELL,
  creating,
})

export const setCreatingWellError = error => ({
  type: SET_CREATING_WELL_ERROR,
  error,
})

export const clearCreatingWellError = () => ({
  type: CLEAR_CREATING_WELL_ERROR,
})

export const setEditingWell = editing => ({
  type: SET_EDITING_WELL,
  editing,
})

export const setEditingWellError = error => ({
  type: SET_EDITING_WELL_ERROR,
  error,
})

export const clearEditingWellError = () => ({
  type: CLEAR_EDITING_WELL_ERROR,
})

export const removeWell = id => ({
  type: REMOVE_WELL,
  id,
})

/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

export const fetchWell = id =>
  dispatch =>
    API.get(`/wells/${id}`)
    .then(well => {
      dispatch(receiveWell(well))
    })

export const fetchWells = (filters = {}) =>
  dispatch =>
    API.get(`/wells/?${qs.stringify(filters)}`)
    .then(wells => dispatch(receiveWells(wells)))

export const createWell = well =>
  dispatch => {
    dispatch(setCreatingWell(true))

    return API.post('/wells/', well)
    .then(json => {
      dispatch(setCreatingWell(false))
      dispatch(receiveWell(json))
      return Promise.resolve(json.id)
    })
    .catch(e => {
      dispatch(setCreatingWell(false))

      e.response.json().then(json => {
        if (json.errors && json.errors.length) {
          return dispatch(setCreatingWellError(json.errors[0]))
        }

        return dispatch(setCreatingWellError({
          msg: 'Unable to create well.',
        }))
      })
      return Promise.reject()
    })
  }

export const editWell = (id, well) =>
  dispatch => {
    dispatch(setEditingWell(true))

    return API.patch(`/wells/${id}`, well)
    .then(json => {
      dispatch(setEditingWell(false))
      dispatch(receiveWell(json))
      return Promise.resolve(json.id)
    })
    .catch(e => {
      dispatch(setEditingWell(false))

      e.response.json().then(json => {
        if (json.errors && json.errors.length) {
          return dispatch(setEditingWellError(json.errors[0]))
        }

        return dispatch(setEditingWellError({
          msg: 'Unable to update well.',
        }))
      })
      return Promise.reject()
    })
  }

export const deleteWell = id =>
  dispatch => API.delete(`/wells/${id}`)
    .then(() => dispatch(removeWell(id)))
