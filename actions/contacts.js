
import qs from 'qs'

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
import API from '../API'

/*****************************************************************************
 * ACTION CREATORS
 *****************************************************************************/

export const receiveContact = contact => ({
    type: RECEIVE_CONTACT,
    contact,
})

export const receiveContacts = contacts => ({
    type: RECEIVE_CONTACTS,
    contacts,
})

export const setCreatingContact = creating => ({
    type: SET_CREATING_CONTACT,
    creating,
})

export const setCreatingContactError = error => ({
    type: SET_CREATING_CONTACT_ERROR,
    error,
})

export const clearCreatingContactError = () => ({
    type: CLEAR_CREATING_CONTACT_ERROR,
})

export const setEditingContact = editing => ({
    type: SET_EDITING_CONTACT,
    editing,
})

export const setEditingContactError = error => ({
    type: SET_EDITING_CONTACT_ERROR,
    error,
})

export const clearEditingContactError = () => ({
    type: CLEAR_EDITING_CONTACT_ERROR,
})

export const removeContact = id => ({
    type: REMOVE_CONTACT,
    id,
})

/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

export const fetchContact = id =>
    dispatch =>
        API.get(`/contacts/${id}`)
        .then(contact => {
            dispatch(receiveContact(contact))
        })

export const fetchContacts = (filters = {}) =>
    dispatch =>
        API.get(`/contacts/?${qs.stringify(filters)}`)
        .then(contacts => {
            dispatch(receiveContacts(contacts))
        })

export const createContact = contact =>
    dispatch => {
        dispatch(setCreatingContact(true))

        return API.post('/contacts/', contact)
        .then(json => {
            dispatch(setCreatingContact(false))
            dispatch(receiveContact(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setCreatingContact(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setCreatingContactError(json.errors[0]))
                }

                return dispatch(setCreatingContactError({
                    msg: 'Unable to create contact.',
                }))
            })
            return Promise.reject()
        })
    }

export const editContact = (id, contact) =>
    dispatch => {
        dispatch(setEditingContact(true))

        return API.patch(`/contacts/${id}`, contact)
        .then(json => {
            dispatch(setEditingContact(false))
            dispatch(receiveContact(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setEditingContact(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setEditingContactError(json.errors[0]))
                }

                return dispatch(setEditingContactError({
                    msg: 'Unable to update contact.',
                }))
            })
            return Promise.reject()
        })
    }

export const deleteContact = id =>
    dispatch => API.delete(`/contacts/${id}`)
        .then(() => dispatch(removeContact(id)))
