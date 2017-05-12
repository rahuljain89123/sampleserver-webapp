
import Immutable from 'immutable'

import {
    RECEIVE_SITE_DATA,
    RECEIVE_SITE_DATAS,
    SET_CREATING_SITE_DATA,
    SET_CREATING_SITE_DATA_ERROR,
    CLEAR_CREATING_SITE_DATA_ERROR,
    SET_EDITING_SITE_DATA,
    SET_EDITING_SITE_DATA_ERROR,
    CLEAR_EDITING_SITE_DATA_ERROR,
} from 'constants/SiteDataActionTypes'

export const siteDatas = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_SITE_DATA:
        return state.set(action.siteData.id, Immutable.fromJS(action.siteData))
    case RECEIVE_SITE_DATAS:
        let tempState = state
        action.siteDatas.forEach(siteData => {
            tempState = tempState.set(siteData.id, Immutable.fromJS(siteData))
        })
        return tempState
    default:
        return state
    }
}

export const creatingSiteData = (state = false, action) => {
    switch (action.type) {
    case SET_CREATING_SITE_DATA:
        return action.creating
    default:
        return state
    }
}

export const creatingSiteDataError = (state = null, action) => {
    switch (action.type) {
    case SET_CREATING_SITE_DATA_ERROR:
        return action.error
    case CLEAR_CREATING_SITE_DATA_ERROR:
        return null
    default:
        return state
    }
}

export const editingSiteData = (state = false, action) => {
    switch (action.type) {
    case SET_EDITING_SITE_DATA:
        return action.editing
    default:
        return state
    }
}

export const editingSiteDataError = (state = null, action) => {
    switch (action.type) {
    case SET_EDITING_SITE_DATA_ERROR:
        return action.error
    case CLEAR_EDITING_SITE_DATA_ERROR:
        return null
    default:
        return state
    }
}
