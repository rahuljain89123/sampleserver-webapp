import {
  RECEIVE_CRITERIAS,
} from 'constants/CriteriaActionTypes'

import qs from 'qs'
import API from 'API'

/*****************************************************************************
 * ACTION CREATORS
 *****************************************************************************/

export const receiveCriterias = (criterias) => ({
  type: RECEIVE_CRITERIAS,
  criterias
})

/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

 export const fetchCriterias = (filters = {}) =>
   dispatch =>
     API.get(`/criterias/?${qs.stringify(filters)}`)
     .then(criterias => {
       dispatch(receiveCriterias(criterias))
     })
