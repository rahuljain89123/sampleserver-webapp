
import Immutable from 'immutable'

import {
    RECEIVE_USER,
    RECEIVE_USERS,
    SET_CREATING_USER,
    SET_CREATING_USER_ERROR,
    CLEAR_CREATING_USER_ERROR,
    SET_CURRENT_USER,
    SET_SIGNIN_PROCESSING,
    SET_SIGNIN_ERROR,
    CLEAR_SIGNIN_ERROR,
    SET_EDITING_USER,
    SET_EDITING_USER_ERROR,
    CLEAR_EDITING_USER_ERROR,
    SET_ACCEPTING_INVITE,
    SET_ACCEPT_INVITE_ERROR,
    CLEAR_ACCEPT_INVITE_ERROR,
} from '../constants/UserActionTypes'

export const users = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_USER:
        return state.set(action.user.id, Immutable.Map(action.user))
    case RECEIVE_USERS:
        let tempState = state
        action.users.forEach(user => {
            tempState = tempState.set(user.id, Immutable.Map(user))
        })
        return tempState
    default:
        return state
    }
}

export const currentUser = (state = null, action) => {
    switch (action.type) {
    case SET_CURRENT_USER:
        return action.id
    default:
        return state
    }
}

export const signinError = (state = false, action) => {
    switch (action.type) {
    case SET_SIGNIN_ERROR:
        return true
    case CLEAR_SIGNIN_ERROR:
        return false
    default:
        return state
    }
}

export const signinProcessing = (state = false, action) => {
    switch (action.type) {
    case SET_SIGNIN_PROCESSING:
        return action.processing
    default:
        return state
    }
}

export const creatingUser = (state = false, action) => {
    switch (action.type) {
    case SET_CREATING_USER:
        return action.creating
    default:
        return state
    }
}

export const creatingUserError = (state = null, action) => {
    switch (action.type) {
    case SET_CREATING_USER_ERROR:
        return action.error
    case CLEAR_CREATING_USER_ERROR:
        return null
    default:
        return state
    }
}

export const editingUser = (state = false, action) => {
    switch (action.type) {
    case SET_EDITING_USER:
        return action.editing
    default:
        return state
    }
}

export const editingUserError = (state = null, action) => {
    switch (action.type) {
    case SET_EDITING_USER_ERROR:
        return action.error
    case CLEAR_EDITING_USER_ERROR:
        return null
    default:
        return state
    }
}

export const acceptingInvite = (state = false, action) => {
    switch (action.type) {
    case SET_ACCEPTING_INVITE:
        return action.accepting
    default:
        return state
    }
}

export const acceptInviteError = (state = null, action) => {
    switch (action.type) {
    case SET_ACCEPT_INVITE_ERROR:
        return action.error
    case CLEAR_ACCEPT_INVITE_ERROR:
        return null
    default:
        return state
    }
}
