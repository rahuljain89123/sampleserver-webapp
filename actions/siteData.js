
import qs from 'qs'

import {
    RECEIVE_SITE_DATA,
    RECEIVE_SITE_DATAS,
    SET_CREATING_SITE_DATA,
    SET_CREATING_SITE_DATA_ERROR,
    CLEAR_CREATING_SITE_DATA_ERROR,
    SET_EDITING_SITE_DATA,
    SET_EDITING_SITE_DATA_ERROR,
    CLEAR_EDITING_SITE_DATA_ERROR,
} from '../constants/SiteDataActionTypes'
import API from '../API'
import pickBy from 'lodash/pickBy'

/*****************************************************************************
 * ACTION CREATORS
 *****************************************************************************/

export const receiveSiteData = siteData => ({
    type: RECEIVE_SITE_DATA,
    siteData,
})

export const receiveSiteDatas = siteDatas => ({
    type: RECEIVE_SITE_DATAS,
    siteDatas,
})


export const setCreatingSiteData = creating => ({
    type: SET_CREATING_SITE_DATA,
    creating,
})

export const setCreatingSiteDataError = error => ({
    type: SET_CREATING_SITE_DATA_ERROR,
    error,
})

export const clearCreatingSiteDataError = () => ({
    type: CLEAR_CREATING_SITE_DATA_ERROR,
})

export const setEditingSiteData = editing => ({
    type: SET_EDITING_SITE_DATA,
    editing,
})

export const setEditingSiteDataError = error => ({
    type: SET_EDITING_SITE_DATA_ERROR,
    error,
})

export const clearEditingSiteDataError = () => ({
    type: CLEAR_EDITING_SITE_DATA_ERROR,
})

/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

export const fetchSiteData = id =>
    dispatch =>
        API.get(`/sitedata/${id}`)
        .then(siteData => {
            dispatch(receiveSiteData(siteData))
        })

export const fetchSiteDatas = (filters = {}) =>
    dispatch =>
        API.get(`/sitedata/?${qs.stringify(filters)}`)
        .then(siteDatas => {
            dispatch(receiveSiteDatas(siteDatas))
        })

export const createSiteData = siteData =>
    dispatch => {
        dispatch(setCreatingSiteData(true))
        const cleanSiteData = pickBy(siteData)

        return API.post('/sitedata/', cleanSiteData)
        .then(json => {
            dispatch(setCreatingSiteData(false))
            dispatch(receiveSiteData(json))
            return Promise.resolve(json)
        })
        .catch(e => {
            dispatch(setCreatingSiteData(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setCreatingSiteDataError(json.errors[0]))
                }

                return dispatch(setCreatingSiteDataError({
                    msg: 'Unable to create siteData.',
                }))
            })
            return Promise.reject()
        })
    }

export const editSiteData = (id, siteData) =>
    dispatch => {
        dispatch(setEditingSiteData(true))

        return API.patch(`/sitedata/${id}`, siteData)
        .then(json => {
            dispatch(setEditingSiteData(false))
            dispatch(receiveSiteData(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setEditingSiteData(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setEditingSiteDataError(json.errors[0]))
                }

                return dispatch(setEditingSiteDataError({
                    msg: 'Unable to update siteData.',
                }))
            })
            return Promise.reject()
        })
    }
