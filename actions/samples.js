
import {
    RECEIVE_SAMPLE,
    RECEIVE_SAMPLES,
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
        API.get(`/sample/${id}`)
        .then(sample => {
            dispatch(receiveSample(sample))
        })

export const fetchSamples = () =>
    dispatch =>
        API.get('/samples/')
        .then(samples => {
            dispatch(receiveSamples(samples))
        })
