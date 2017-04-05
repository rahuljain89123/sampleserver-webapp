
import Immutable from 'immutable'

import {
    RECEIVE_COMPANY,
    RECEIVE_COMPANIES,
    SET_CREATING_COMPANY,
    SET_CREATING_COMPANY_ERROR,
    CLEAR_CREATING_COMPANY_ERROR,
    SET_EDITING_COMPANY,
    SET_EDITING_COMPANY_ERROR,
    CLEAR_EDITING_COMPANY_ERROR,
    REMOVE_COMPANY,
} from '../constants/CompanyActionTypes'

export const companies = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_COMPANY:
        return state.set(action.company.id, Immutable.Map(action.company))
    case RECEIVE_COMPANIES:
        let tempState = state
        action.companies.forEach(company => {
            tempState = tempState.set(company.id, Immutable.Map(company))
        })
        return tempState
    case REMOVE_COMPANY:
        return state.delete(action.id)
    default:
        return state
    }
}

export const creatingCompany = (state = false, action) => {
    switch (action.type) {
    case SET_CREATING_COMPANY:
        return action.creating
    default:
        return state
    }
}

export const creatingCompanyError = (state = null, action) => {
    switch (action.type) {
    case SET_CREATING_COMPANY_ERROR:
        return action.error
    case CLEAR_CREATING_COMPANY_ERROR:
        return null
    default:
        return state
    }
}

export const editingCompany = (state = false, action) => {
    switch (action.type) {
    case SET_EDITING_COMPANY:
        return action.editing
    default:
        return state
    }
}

export const editingCompanyError = (state = null, action) => {
    switch (action.type) {
    case SET_EDITING_COMPANY_ERROR:
        return action.error
    case CLEAR_EDITING_COMPANY_ERROR:
        return null
    default:
        return state
    }
}
