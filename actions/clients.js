
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
import API from 'API'

/*****************************************************************************
 * ACTION CREATORS
 *****************************************************************************/

export const receiveClient = client => ({
    type: RECEIVE_CLIENT,
    client,
})

export const receiveClients = clients => ({
    type: RECEIVE_CLIENTS,
    clients,
})

export const setEditingClient = editing => ({
    type: SET_EDITING_CLIENT,
    editing,
})

export const setEditingClientError = error => ({
    type: SET_EDITING_CLIENT_ERROR,
    error,
})

export const clearEditingClientError = () => ({
    type: CLEAR_EDITING_CLIENT_ERROR,
})

export const setCreatingClient = creating => ({
    type: SET_CREATING_CLIENT,
    creating,
})

export const setCreatingClientError = error => ({
    type: SET_CREATING_CLIENT_ERROR,
    error,
})

export const clearCreatingClientError = () => ({
    type: CLEAR_CREATING_CLIENT_ERROR,
})

/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

export const fetchClient = id =>
    dispatch =>
        API.get(`/clients/${id}`)
        .then(client => {
            dispatch(receiveClient(client))
        })

export const fetchClients = () =>
    dispatch =>
        API.get('/clients/')
        .then(clients => {
            dispatch(receiveClients(clients))
        })

export const createClient = client =>
    dispatch => {
        dispatch(setCreatingClient(true))

        return API.post('/clients/', client)
        .then(json => {
            dispatch(setCreatingClient(false))
            dispatch(receiveClient(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setCreatingClient(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setCreatingClientError(json.errors[0]))
                }

                return dispatch(setCreatingClientError({
                    msg: 'Unable to create client.',
                }))
            })
            return Promise.reject()
        })
    }

export const editClient = (id, client) =>
    dispatch => {
        dispatch(setEditingClient(true))

        return API.patch(`/clients/${id}`, client)
        .then(json => {
            dispatch(setEditingClient(false))
            dispatch(receiveClient(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setEditingClient(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setEditingClientError(json.errors[0]))
                }

                return dispatch(setEditingClientError({
                    msg: 'Unable to update client.',
                }))
            })
            return Promise.reject()
        })
    }
