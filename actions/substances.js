import qs from 'qs'

import {
  RECEIVE_SUBSTANCES,
  RECEIVE_SUBSTANCE_GROUPS,
} from 'constants/SubstanceActionTypes'
import API from 'API'

/*****************************************************************************
 * ACTION CREATORS
 *****************************************************************************/

export const receiveSubstances = substances => ({
  type: RECEIVE_SUBSTANCES,
  substances,
})

export const receiveSubstanceGroups = substanceGroups => ({
  type: RECEIVE_SUBSTANCE_GROUPS,
  substanceGroups,
})

/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

export const fetchSubstances = (filters = {}) =>
  dispatch =>
    API.get(`/substances/?${qs.stringify(filters)}`)
    .then(substances => {
      dispatch(receiveSubstances(substances))
    })

export const fetchSubstanceGroups = (filters = {}) =>
  dispatch =>
    API.get(`/substancegroups/?${qs.stringify(filters)}`)
    .then(substanceGroups => {
      dispatch(receiveSubstanceGroups(substanceGroups))
    })