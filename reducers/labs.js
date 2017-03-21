
import Immutable from 'immutable'

import {
    RECEIVE_LAB,
    RECEIVE_LABS,
    SET_CURRENT_LAB_URL,
    SET_CREATING_LAB,
    SET_CREATING_LAB_ERROR,
    CLEAR_CREATING_LAB_ERROR,
    SET_EDITING_LAB,
    SET_EDITING_LAB_ERROR,
    CLEAR_EDITING_LAB_ERROR,
} from '../constants/LabActionTypes'

export const labs = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_LAB:
        return state.set(action.lab.id, Immutable.Map(action.lab))
    case RECEIVE_LABS:
        let tempState = state
        action.labs.forEach(lab => {
            tempState = tempState.set(lab.id, Immutable.Map(lab))
        })
        return tempState
    default:
        return state
    }
}

export const currentLabUrl = (state = null, action) => {
    switch (action.type) {
    case SET_CURRENT_LAB_URL:
        return action.url
    default:
        return state
    }
}

export const creatingLab = (state = false, action) => {
    switch (action.type) {
    case SET_CREATING_LAB:
        return action.creating
    default:
        return state
    }
}

export const creatingLabError = (state = null, action) => {
    switch (action.type) {
    case SET_CREATING_LAB_ERROR:
        return action.error
    case CLEAR_CREATING_LAB_ERROR:
        return null
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
