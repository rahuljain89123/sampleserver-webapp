
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

export const fetchCurrentUser = () =>
    dispatch =>
        API.get('/user')
        .then(user => {
            dispatch(receiveUser(user))
            dispatch(setCurrentUser(user.id))
            window.localStorage.setItem('currentUser', JSON.stringify(user.id))
        })
        .catch(() => {
            dispatch(setCurrentUser(null))
            window.localStorage.setItem('currentUser', JSON.stringify(null))
        })

export const fetchUser = id =>
    dispatch =>
        API.get(`/users/${id}`)
        .then(user => dispatch(receiveUser(user)))

export const fetchUsers = () =>
    dispatch =>
        API.get('/users')
        .then(users => dispatch(receiveUsers(users)))

export const createUser = user =>
    dispatch => {
        dispatch(setCreatingUser(true))

        API.post('/users/', user)
        .then(json => {
            dispatch(setCreatingUser(false))
            dispatch(receiveUser(json))
        })
        .catch(e => {
            console.log(e)
            dispatch(setCreatingUser(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setCreatingUserError(json.errors[0]))
                }

                return dispatch(setCreatingUserError({
                    msg: 'Unable to create user.',
                }))
            })
        })
    }

export const signin = (username, password) =>
    dispatch => {
        dispatch(setSigninProcessing(true))

        API.post('/auth/signin', {
            username,
            password,
        })
        .then(json => {
            if (json.success) {
                dispatch(setSigninProcessing(false))
                dispatch(fetchCurrentUser())
            } else {
                dispatch(setSigninProcessing(false))
                dispatch(setSigninError())
            }
        })
        .catch(() => {
            dispatch(setSigninProcessing(false))
            dispatch(setSigninError())
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
        })
