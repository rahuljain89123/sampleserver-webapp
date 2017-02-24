
import {
    RECEIVE_LAB,
    RECEIVE_LABS,
} from '../constants/LabActionTypes'
import API from '../API'


export const receiveLab = lab => ({
    type: RECEIVE_LAB,
    lab,
})

export const receiveLabs = labs => ({
    type: RECEIVE_LABS,
    labs,
})

export const fetchLab = id =>
    dispatch =>
        API.get(`/labs/${id}`)
        .then(lab => {
            dispatch(receiveLab(lab))
        })

export const fetchLabs = () =>
    dispatch =>
        API.get('/labs')
        .then(labs => {
            dispatch(receiveLabs(labs))
        })
