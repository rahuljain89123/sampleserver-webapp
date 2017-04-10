
import Immutable from 'immutable'

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
} from '../constants/WellActionTypes'

export const wells = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_WELL:
        return state.set(action.well.id, Immutable.Map(action.well))
    case RECEIVE_WELLS:
        let tempState = state
        action.wells.forEach(well => {
            tempState = tempState.set(well.id, Immutable.Map(well))
        })
        return tempState
    case REMOVE_WELL:
        return state.delete(action.id)
    default:
        return state
    }
}

export const creatingWell = (state = false, action) => {
    switch (action.type) {
    case SET_CREATING_WELL:
        return action.creating
    default:
        return state
    }
}

export const creatingWellError = (state = null, action) => {
    switch (action.type) {
    case SET_CREATING_WELL_ERROR:
        return action.error
    case CLEAR_CREATING_WELL_ERROR:
        return null
    default:
        return state
    }
}

export const editingWell = (state = false, action) => {
    switch (action.type) {
    case SET_EDITING_WELL:
        return action.editing
    default:
        return state
    }
}

export const editingWellError = (state = null, action) => {
    switch (action.type) {
    case SET_EDITING_WELL_ERROR:
        return action.error
    case CLEAR_EDITING_WELL_ERROR:
        return null
    default:
        return state
    }
}
