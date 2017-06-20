
import qs from 'qs'
import API from 'API'

import {
  RECEIVE_SITE_MAPS,
  RECEIVE_SITE_MAP,
  SET_CREATING_SITE_MAP,
  SET_CREATING_SITE_MAP_ERROR,
  CLEAR_CREATING_SITE_MAP_ERROR,
  SET_EDITING_SITE_MAP,
  SET_EDITING_SITE_MAP_ERROR,
  CLEAR_EDITING_SITE_MAP_ERROR,
  REMOVE_SITE_MAP,
  RECEIVE_SITE_MAP_WELL,
  RECEIVE_SITE_MAP_WELLS,
  SET_ADDING_SITE_MAP_WELL,
  REMOVE_SITE_MAP_WELL,
} from 'constants/SiteMapActionTypes'

/*****************************************************************************
 * ACTION CREATORS
 *****************************************************************************/

export const receiveSiteMap = siteMap => ({
  type: RECEIVE_SITE_MAP,
  siteMap,
})

export const receiveSiteMaps = siteMaps => ({
  type: RECEIVE_SITE_MAPS,
  siteMaps,
})


export const setEditingSiteMap = editing => ({
    type: SET_EDITING_SITE_MAP,
    editing,
})

export const setEditingSiteMapError = error => ({
    type: SET_EDITING_SITE_MAP_ERROR,
    error,
})

export const clearEditingSiteMapError = () => ({
    type: CLEAR_EDITING_SITE_MAP_ERROR,
})


export const setCreatingSiteMap = creating => ({
    type: SET_CREATING_SITE_MAP,
    creating,
})

export const setCreatingSiteMapError = error => ({
    type: SET_CREATING_SITE_MAP_ERROR,
    error,
})

export const clearCreatingSiteMapError = () => ({
    type: CLEAR_CREATING_SITE_MAP_ERROR,
})

export const removeSiteMap = id => ({
  type: REMOVE_SITE_MAP,
  id,
})

export const receiveSiteMapWells = siteMapWells => ({
  type: RECEIVE_SITE_MAP_WELLS,
  siteMapWells,
})

export const receiveSiteMapWell = siteMapWell => ({
  type: RECEIVE_SITE_MAP_WELL,
  siteMapWell,
})

export const setAddingSiteMapWell = adding => ({
  type: SET_ADDING_SITE_MAP_WELL,
  adding,
});

export const removeSiteMapWell = id => ({
  type: REMOVE_SITE_MAP_WELL,
  id,
})

/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

 export const fetchSiteMap = (id) =>
   dispatch =>
     API.get(`/sitemaps/${id}`)
     .then(siteMap => dispatch(receiveSiteMap(siteMap)))


export const fetchSiteMaps = (filters = {}) =>
  dispatch =>
    API.get(`/sitemaps/?${qs.stringify(filters)}`)
    .then(siteMaps => dispatch(receiveSiteMaps(siteMaps)))


export const createSiteMap = (siteMapParams) =>
  dispatch =>
    API.post('/sitemaps/', siteMapParams)
    .then(json => {
      dispatch(receiveSiteMap(json))
      return Promise.resolve(json.id)
    })
    .catch(e => {
      return Promise.reject()
    })

export const createSite = site =>
  dispatch => {
    dispatch(setCreatingSiteMapMap(true))

    return API.post('/sites/', site)
    .then(json => {
      dispatch(setCreatingSiteMapMap(false))
      dispatch(receiveSiteMap(json))
      return Promise.resolve(json.id)
    })
    .catch(e => {
      dispatch(setCreatingSiteMapMap(false))

      e.response.json().then(json => {
        if (json.errors && json.errors.length) {
          return dispatch(setCreatingSiteMapMapError(json.errors[0]))
        }

        return dispatch(setCreatingSiteMapMapError({
          msg: 'Unable to create site.',
        }))
      })
      return Promise.reject()
    })
  }


export const editSiteMap = (id, siteMapParams) =>
  dispatch => {
    return API.patch(`/sitemaps/${id}`, siteMapParams)
    .then(json => {
      dispatch(receiveSiteMap(json))
      return Promise.resolve(json.id)
    })
    .catch(e => {
      return Promise.reject()
    })
  }

export const deleteSiteMap = (id) =>
  dispatch =>
    API.delete(`/sitemaps/${id}`)
    .then(() => dispatch(removeSiteMap(id)))


export const fetchSiteMapWells = (filters) =>
  dispatch =>
    API.get(`/sitemapwells/?${qs.stringify(filters)}`)
    .then(siteMapWells => dispatch(receiveSiteMapWells(siteMapWells)))


export const createSiteMapWell = (siteMapWellParams) =>
  dispatch =>
    API.post('/sitemapwells/', siteMapWellParams)
    .then(siteMapWell => dispatch(receiveSiteMapWell(siteMapWell)))

export const deleteSiteMapWell = (id) =>
  dispatch =>
    API.delete(`/sitemapwells/${id}`)
    .then(() => dispatch(removeSiteMapWell(id)))
