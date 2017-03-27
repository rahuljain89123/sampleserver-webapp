
import Immutable from 'immutable'

import {
    RECEIVE_PROJECT,
    RECEIVE_PROJECTS,
    SET_CREATING_PROJECT,
    SET_CREATING_PROJECT_ERROR,
    CLEAR_CREATING_PROJECT_ERROR,
    SET_EDITING_PROJECT,
    SET_EDITING_PROJECT_ERROR,
    CLEAR_EDITING_PROJECT_ERROR,
} from '../constants/ProjectActionTypes'

export const projects = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_PROJECT:
        return state.set(action.project.id, Immutable.Map(action.project))
    case RECEIVE_PROJECTS:
        let tempState = state
        action.projects.forEach(project => {
            tempState = tempState.set(project.id, Immutable.Map(project))
        })
        return tempState
    default:
        return state
    }
}

export const creatingProject = (state = false, action) => {
    switch (action.type) {
    case SET_CREATING_PROJECT:
        return action.creating
    default:
        return state
    }
}

export const creatingProjectError = (state = null, action) => {
    switch (action.type) {
    case SET_CREATING_PROJECT_ERROR:
        return action.error
    case CLEAR_CREATING_PROJECT_ERROR:
        return null
    default:
        return state
    }
}

export const editingProject = (state = false, action) => {
    switch (action.type) {
    case SET_EDITING_PROJECT:
        return action.editing
    default:
        return state
    }
}

export const editingProjectError = (state = null, action) => {
    switch (action.type) {
    case SET_EDITING_PROJECT_ERROR:
        return action.error
    case CLEAR_EDITING_PROJECT_ERROR:
        return null
    default:
        return state
    }
}
