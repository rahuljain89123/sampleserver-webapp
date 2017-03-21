
import Immutable from 'immutable'

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

export const sites = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_SITE:
        return state.set(action.site.id, Immutable.Map(action.site))
    case RECEIVE_SITES:
        let tempState = state
        action.sites.forEach(site => {
            tempState = tempState.set(site.id, Immutable.Map(site))
        })
        return tempState
    default:
        return state
    }
}

export const creatingSite = (state = false, action) => {
    switch (action.type) {
    case SET_CREATING_SITE:
        return action.creating
    default:
        return state
    }
}

export const creatingSiteError = (state = null, action) => {
    switch (action.type) {
    case SET_CREATING_SITE_ERROR:
        return action.error
    case CLEAR_CREATING_SITE_ERROR:
        return null
    default:
        return state
    }
}

export const editingSite = (state = false, action) => {
    switch (action.type) {
    case SET_EDITING_SITE:
        return action.editing
    default:
        return state
    }
}

export const editingSiteError = (state = null, action) => {
    switch (action.type) {
    case SET_EDITING_SITE_ERROR:
        return action.error
    case CLEAR_EDITING_SITE_ERROR:
        return null
    default:
        return state
    }
}
