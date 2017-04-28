
import Immutable from 'immutable'

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

export const siteMaps = (state = Immutable.Map(), action) => {
  switch (action.type) {
  case RECEIVE_SITE_MAP:
    return state.set(action.siteMap.id, Immutable.Map(action.siteMap))
  case RECEIVE_SITE_MAPS:
    let tempState = state
    action.siteMaps.forEach(siteMap => {
      tempState = tempState.set(siteMap.id, Immutable.Map(siteMap))
    })
    return tempState
  default:
    return state
  }
}
