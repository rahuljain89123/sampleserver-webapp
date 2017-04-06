
import Immutable from 'immutable'

import {
    RECEIVE_CONTACT,
    RECEIVE_CONTACTS,
    SET_CREATING_CONTACT,
    SET_CREATING_CONTACT_ERROR,
    CLEAR_CREATING_CONTACT_ERROR,
    SET_EDITING_CONTACT,
    SET_EDITING_CONTACT_ERROR,
    CLEAR_EDITING_CONTACT_ERROR,
    REMOVE_CONTACT,
} from '../constants/ContactActionTypes'

export const contacts = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_CONTACT:
        return state.set(action.contact.id, Immutable.Map(action.contact))
    case RECEIVE_CONTACTS:
        let tempState = state
        action.contacts.forEach(contact => {
            tempState = tempState.set(contact.id, Immutable.Map(contact))
        })
        return tempState
    case REMOVE_CONTACT:
        return state.delete(action.id)
    default:
        return state
    }
}

export const creatingContact = (state = false, action) => {
    switch (action.type) {
    case SET_CREATING_CONTACT:
        return action.creating
    default:
        return state
    }
}

export const creatingContactError = (state = null, action) => {
    switch (action.type) {
    case SET_CREATING_CONTACT_ERROR:
        return action.error
    case CLEAR_CREATING_CONTACT_ERROR:
        return null
    default:
        return state
    }
}

export const editingContact = (state = false, action) => {
    switch (action.type) {
    case SET_EDITING_CONTACT:
        return action.editing
    default:
        return state
    }
}

export const editingContactError = (state = null, action) => {
    switch (action.type) {
    case SET_EDITING_CONTACT_ERROR:
        return action.error
    case CLEAR_EDITING_CONTACT_ERROR:
        return null
    default:
        return state
    }
}
