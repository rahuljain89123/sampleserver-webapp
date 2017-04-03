
import qs from 'qs'

import {
    RECEIVE_USER,
    RECEIVE_USERS,
    REMOVE_USER,
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
    RESET,
    SET_RESETTING,
    SET_RESET_ERROR,
    CLEAR_RESET_ERROR,
} from '../constants/UserActionTypes'
import API from '../API'

export const receiveUser = user => ({
    type: RECEIVE_USER,
    user,
})

export const receiveUsers = users => ({
    type: RECEIVE_USERS,
    users,
})

export const removeUser = id => ({
    type: REMOVE_USER,
    id,
})

export const setCurrentUser = id => ({
    type: SET_CURRENT_USER,
    id,
})

export const setSigninError = () => ({
    type: SET_SIGNIN_ERROR,
})

export const clearSigninError = () => ({
    type: CLEAR_SIGNIN_ERROR,
})

export const setSigninProcessing = processing => ({
    type: SET_SIGNIN_PROCESSING,
    processing,
})

export const setCreatingUser = creating => ({
    type: SET_CREATING_USER,
    creating,
})

export const setCreatingUserError = error => ({
    type: SET_CREATING_USER_ERROR,
    error,
})

export const clearCreatingUserError = () => ({
    type: CLEAR_CREATING_USER_ERROR,
})

export const setEditingUser = editing => ({
    type: SET_EDITING_USER,
    editing,
})

export const setEditingUserError = error => ({
    type: SET_EDITING_USER_ERROR,
    error,
})

export const clearEditingUserError = () => ({
    type: CLEAR_EDITING_USER_ERROR,
})

export const setAcceptingInvite = accepting => ({
    type: SET_ACCEPTING_INVITE,
    accepting,
})

export const setAcceptInviteError = error => ({
    type: SET_ACCEPT_INVITE_ERROR,
    error,
})

export const clearAcceptInviteError = () => ({
    type: CLEAR_ACCEPT_INVITE_ERROR,
})

export const setResetting = resetting => ({
    type: SET_RESETTING,
    resetting,
})

export const setResetError = () => ({
    type: SET_RESET_ERROR,
})

export const clearResetError = () => ({
    type: CLEAR_RESET_ERROR,
})

export const fetchCurrentUser = () =>
    dispatch =>
        API.get('/user')
        .then(user => {
            dispatch(receiveUser(user))
            dispatch(setCurrentUser(user.id))
            window.localStorage.setItem('currentUser', JSON.stringify(user.id))
            return Promise.resolve(user.id)
        })
        .catch(() => {
            dispatch(setCurrentUser(null))
            window.localStorage.setItem('currentUser', JSON.stringify(null))
            return Promise.reject()
        })

export const fetchUser = id =>
    dispatch =>
        API.get(`/users/${id}`)
        .then(user => dispatch(receiveUser(user)))

export const fetchUsers = (filters = {}) =>
    dispatch =>
        API.get(`/users/?${qs.stringify(filters)}`)
        .then(users => dispatch(receiveUsers(users)))

export const createUser = user =>
    dispatch => {
        dispatch(setCreatingUser(true))

        return API.post('/users/', user)
        .then(json => {
            dispatch(setCreatingUser(false))
            dispatch(receiveUser(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setCreatingUser(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setCreatingUserError(json.errors[0]))
                }

                return dispatch(setCreatingUserError({
                    msg: 'Unable to create user.',
                }))
            })
            return Promise.reject()
        })
    }

export const editUser = (id, user) =>
    dispatch => {
        dispatch(setEditingUser(true))

        return API.patch(`/users/${id}`, user)
        .then(json => {
            dispatch(setEditingUser(false))
            dispatch(receiveUser(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setEditingUser(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setEditingUserError(json.errors[0]))
                }

                return dispatch(setEditingUserError({
                    msg: 'Unable to update user.',
                }))
            })
            return Promise.reject()
        })
    }

export const deleteUser = id =>
    dispatch => {
        return API.delete(`/users/${id}`)
        .then(() => {
            dispatch(removeUser(id))
            return Promise.resolve(id)
        })
    }

export const signin = (email, password) =>
    dispatch => {
        dispatch(setSigninProcessing(true))

        return API.post('/auth/signin', {
            email,
            password,
        })
        .then(json => {
            if (json.success) {
                dispatch(setSigninProcessing(false))
                return dispatch(fetchCurrentUser())
            }
            return Promise.reject()
        })
        .catch(() => {
            dispatch(setSigninProcessing(false))
            dispatch(setSigninError())
            return Promise.reject()
        })
    }

export const signout = () =>
    dispatch =>
        API.post('/auth/signout')
        .then(json => {
            if (json.success) {
                window.localStorage.setItem('currentUser', JSON.stringify(null))
                dispatch(setCurrentUser(null))
            }
            return Promise.resolve()
        })

export const acceptInvite = (id, password) =>
    dispatch => {
        dispatch(setAcceptingInvite(true))

        return API.patch(`/users/${id}`, {
            password,
        })
        .then(json => {
            dispatch(setAcceptingInvite(false))
            return dispatch(receiveUser(json))
        })
        .catch(e => {
            dispatch(setAcceptingInvite(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setAcceptInviteError(json.errors[0]))
                }

                return dispatch(setAcceptInviteError({
                    msg: 'Unable to update user.',
                }))
            })
        })
    }

export const reset = email =>
    dispatch => {
        dispatch(setResetting(true))

        return API.post('/auth/reset', {
            email,
        })
        .then(json => {
            if (json.success) {
                dispatch(setResetting(false))
                return Promise.resolve()
            }
            return Promise.reject()
        })
        .catch(() => {
            dispatch(setResetting(false))
            dispatch(setResetError())
            return Promise.reject()
        })
    }

export const finishReset = (resetCode, password) =>
    dispatch => {
        dispatch(setResetting(true))

        return API.post('/auth/reset', {
            reset_code: resetCode,
            password,
        })
        .then(json => {
            if (json.success) {
                dispatch(setResetting(false))
                return Promise.resolve()
            }
            return Promise.reject()
        })
        .catch(() => {
            dispatch(setResetting(false))
            dispatch(setResetError())
            return Promise.reject()
        })
    }
