
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
  REMOVE_SITE_MAP
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
//
// export const receiveSiteMapWells = siteMaps => ({
//   type: RECEIVE_SITE_MAP_WELLS,
//   siteM
//   siteMapWells,
// })

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
      debugger
      dispatch(receiveSiteMap(json))
      return Promise.resolve(json.id)
    })
    .catch(e => {
      return Promise.reject()
    })
