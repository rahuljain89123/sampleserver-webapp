
import {
    RECEIVE_ROLE,
    RECEIVE_ROLES,
} from '../constants/RoleActionTypes'
import API from '../API'


export const receiveRole = role => ({
    type: RECEIVE_ROLE,
    role,
})

export const receiveRoles = roles => ({
    type: RECEIVE_ROLES,
    roles,
})

export const fetchRole = id =>
    dispatch =>
        API.get(`/roles/${id}`)
        .then(role => {
            dispatch(receiveRole(role))
        })

export const fetchRoles = () =>
    dispatch =>
        API.get('/roles/')
        .then(roles => {
            dispatch(receiveRoles(roles))
        })
