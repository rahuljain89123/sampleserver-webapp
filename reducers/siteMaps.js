
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
  REMOVE_SITE_MAP,
  RECEIVE_SITE_MAP_WELL,
  SET_ADDING_SITE_MAP_WELL,
  RECEIVE_SITE_MAP_WELLS,
  REMOVE_SITE_MAP_WELL,
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
  case REMOVE_SITE_MAP:
    return state.delete(action.id)
  default:
    return state
  }
}


export const siteMapWells = (state = Immutable.Map(), action) => {
  switch (action.type) {
  case RECEIVE_SITE_MAP_WELL:
    return state.set(action.siteMapWell.id, Immutable.Map(action.siteMapWell))
  case RECEIVE_SITE_MAP_WELLS:
    let tempState = state
    action.siteMapWells.forEach(siteMapWell => {
      tempState = tempState.set(siteMapWell.id, Immutable.Map(siteMapWell))
    })
    return tempState
  case REMOVE_SITE_MAP_WELL:
    return state.delete(action.id)
  default:
    return state
  }
}

export const addingSiteMapWell = (state = null, action) => {
    switch (action.type) {
    case SET_ADDING_SITE_MAP_WELL:
        return action.adding ? Immutable.Map(action.adding) : null
    default:
        return state
    }
}
