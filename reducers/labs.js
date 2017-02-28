
import Immutable from 'immutable'

import {
    RECEIVE_LAB,
    RECEIVE_LABS,
    SET_EDITING_LAB,
    SET_EDITING_LAB_ERROR,
    CLEAR_EDITING_LAB_ERROR,
} from '../constants/LabActionTypes'

export const labs = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_LAB:
        return state.set(action.lab.laboratory_id, Immutable.Map(action.lab))
    case RECEIVE_LABS:
        let tempState = state
        action.labs.forEach(lab => {
            tempState = tempState.set(lab.laboratory_id, Immutable.Map(lab))
        })
        return tempState
    default:
        return state
    }
}

export const editingLab = (state = false, action) => {
    switch (action.type) {
    case SET_EDITING_LAB:
        return action.editing
    default:
        return state
    }
}

export const editingLabError = (state = null, action) => {
    switch (action.type) {
    case SET_EDITING_LAB_ERROR:
        return action.error
    case CLEAR_EDITING_LAB_ERROR:
        return null
    default:
        return state
    }
}
