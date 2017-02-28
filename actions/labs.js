
import {
    RECEIVE_LAB,
    RECEIVE_LABS,
    SET_EDITING_LAB,
    SET_EDITING_LAB_ERROR,
    CLEAR_EDITING_LAB_ERROR,
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

export const setEditingLab = editing => ({
    type: SET_EDITING_LAB,
    editing,
})

export const setEditingLabError = error => ({
    type: SET_EDITING_LAB_ERROR,
    error,
})

export const clearEditingLabError = () => ({
    type: CLEAR_EDITING_LAB_ERROR,
})

export const editLab = (id, lab) =>
    dispatch => {
        dispatch(setEditingLab(true))

        API.patch(`/labs/${id}`, lab)
        .then(json => {
            dispatch(setEditingLab(false))
            dispatch(receiveLab(json))
        })
        .catch(e => {
            dispatch(setEditingLab(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setEditingLabError(json.errors[0]))
                }

                return dispatch(setEditingLabError({
                    msg: 'Unable to update lab.',
                }))
            })
        })
    }
