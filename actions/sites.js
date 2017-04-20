
import qs from 'qs'

import {
    RECEIVE_SITE,
    RECEIVE_SITES,
    SET_CREATING_SITE,
    SET_CREATING_SITE_ERROR,
    CLEAR_CREATING_SITE_ERROR,
    SET_EDITING_SITE,
    SET_EDITING_SITE_ERROR,
    CLEAR_EDITING_SITE_ERROR,
} from '../constants/SiteActionTypes'
import API from '../API'


export const receiveSite = site => ({
    type: RECEIVE_SITE,
    site,
})

export const receiveSites = sites => ({
    type: RECEIVE_SITES,
    sites,
})

export const fetchSite = id =>
    dispatch =>
        API.get(`/sites/${id}`)
        .then(site => {
            dispatch(receiveSite(site))
        })

export const fetchSites = (filters = {}) =>
    dispatch =>
        API.get(`/sites/?${qs.stringify(filters)}`)
        .then(sites => {
            dispatch(receiveSites(sites))
        })

export const setCreatingSite = creating => ({
    type: SET_CREATING_SITE,
    creating,
})

export const setCreatingSiteError = error => ({
    type: SET_CREATING_SITE_ERROR,
    error,
})

export const clearCreatingSiteError = () => ({
    type: CLEAR_CREATING_SITE_ERROR,
})

export const createSite = site =>
    dispatch => {
        dispatch(setCreatingSite(true))

        return API.post('/sites/', site)
        .then(json => {
            dispatch(setCreatingSite(false))
            dispatch(receiveSite(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setCreatingSite(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setCreatingSiteError(json.errors[0]))
                }

                return dispatch(setCreatingSiteError({
                    msg: 'Unable to create site.',
                }))
            })
            return Promise.reject()
        })
    }

export const setEditingSite = editing => ({
    type: SET_EDITING_SITE,
    editing,
})

export const setEditingSiteError = error => ({
    type: SET_EDITING_SITE_ERROR,
    error,
})

export const clearEditingSiteError = () => ({
    type: CLEAR_EDITING_SITE_ERROR,
})

export const editSite = (id, site) =>
    dispatch => {
        dispatch(setEditingSite(true))

        return API.patch(`/sites/${id}`, site)
        .then(json => {
            dispatch(setEditingSite(false))
            dispatch(receiveSite(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setEditingSite(false))
            
            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setEditingSiteError(json.errors[0]))
                }

                return dispatch(setEditingSiteError({
                    msg: 'Unable to update site.',
                }))
            })
            return Promise.reject()
        })
    }
