
import qs from 'qs'
import {
    RECEIVE_SAMPLE,
    RECEIVE_SAMPLES,
    SET_EDITING_SAMPLE,
    SET_EDITING_SAMPLE_ERROR,
    CLEAR_EDITING_SAMPLE_ERROR,
} from '../constants/SampleActionTypes'
import API from '../API'

/*****************************************************************************
 * ACTION CREATORS
 *****************************************************************************/

export const receiveSample = sample => ({
    type: RECEIVE_SAMPLE,
    sample,
})

export const receiveSamples = samples => ({
    type: RECEIVE_SAMPLES,
    samples,
})

export const setEditingSample = editing => ({
    type: SET_EDITING_SAMPLE,
    editing,
})

export const setEditingSampleError = error => ({
    type: SET_EDITING_SAMPLE_ERROR,
    error,
})

export const clearEditingSampleError = () => ({
    type: CLEAR_EDITING_SAMPLE_ERROR,
})

/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

export const fetchSample = id =>
    dispatch =>
        API.get(`/samples/${id}`)
        .then(sample => {
            dispatch(receiveSample(sample))
        })

export const fetchSamples = (filters = {}) =>
    dispatch =>
        API.get(`/samples/?${qs.stringify(filters)}`)
        .then(samples => {
            dispatch(receiveSamples(samples))
        })

export const editSample = (id, sample) =>
    dispatch => {
        dispatch(setEditingSample(true))

        return API.patch(`/samples/${id}`, sample)
        .then(json => {
            dispatch(setEditingSample(false))
            dispatch(receiveSample(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setEditingSample(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setEditingSampleError(json.errors[0]))
                }

                return dispatch(setEditingSampleError({
                    msg: 'Unable to update sample.',
                }))
            })
            return Promise.reject()
        })
    }
