
import Immutable from 'immutable'

import {
    RECEIVE_CLIENT,
    RECEIVE_CLIENTS,
    SET_CREATING_CLIENT,
    SET_CREATING_CLIENT_ERROR,
    CLEAR_CREATING_CLIENT_ERROR,
    SET_EDITING_CLIENT,
    SET_EDITING_CLIENT_ERROR,
    CLEAR_EDITING_CLIENT_ERROR,
} from 'constants/ClientActionTypes'

export const clients = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_CLIENT:
        return state.set(action.client.id, Immutable.fromJS(action.client))
    case RECEIVE_CLIENTS:
        let tempState = state
        action.clients.forEach(client => {
            tempState = tempState.set(client.id, Immutable.fromJS(client))
        })
        return tempState
    default:
        return state
    }
}

export const creatingClient = (state = false, action) => {
    switch (action.type) {
    case SET_CREATING_CLIENT:
        return action.creating
    default:
        return state
    }
}

export const creatingClientError = (state = null, action) => {
    switch (action.type) {
    case SET_CREATING_CLIENT_ERROR:
        return action.error
    case CLEAR_CREATING_CLIENT_ERROR:
        return null
    default:
        return state
    }
}

export const editingClient = (state = false, action) => {
    switch (action.type) {
    case SET_EDITING_CLIENT:
        return action.editing
    default:
        return state
    }
}

export const editingClientError = (state = null, action) => {
    switch (action.type) {
    case SET_EDITING_CLIENT_ERROR:
        return action.error
    case CLEAR_EDITING_CLIENT_ERROR:
        return null
    default:
        return state
    }
}
