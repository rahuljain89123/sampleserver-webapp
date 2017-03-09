
import {
    RECEIVE_SITE,
    RECEIVE_SITES,
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

export const fetchSites = () =>
    dispatch =>
        API.get('/sites/')
        .then(sites => {
            dispatch(receiveSites(sites))
        })

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
            return Promise.resolve(json.site_id)
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
