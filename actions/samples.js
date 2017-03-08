
import {
    RECEIVE_SAMPLE,
    RECEIVE_SAMPLES,
    SET_EDITING_SAMPLE,
    SET_EDITING_SAMPLE_ERROR,
    CLEAR_EDITING_SAMPLE_ERROR,
} from '../constants/SampleActionTypes'
import API from '../API'

export const receiveSample = sample => ({
    type: RECEIVE_SAMPLE,
    sample,
})

export const receiveSamples = samples => ({
    type: RECEIVE_SAMPLES,
    samples,
})

export const fetchSample = id =>
    dispatch =>
        API.get(`/samples/${id}`)
        .then(sample => {
            dispatch(receiveSample(sample))
        })

export const fetchSamples = () =>
    dispatch =>
        API.get('/samples/')
        .then(samples => {
            dispatch(receiveSamples(samples))
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

export const editSample = (id, sample) =>
    dispatch => {
        dispatch(setEditingSample(true))

        API.patch(`/samples/${id}`, sample)
        .then(json => {
            dispatch(setEditingSample(false))
            dispatch(receiveSample(json))
            return Promise.resolve(json.sample_id)
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
