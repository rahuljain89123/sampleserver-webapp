
import Immutable from 'immutable'

import {
    RECEIVE_COMPANY,
    RECEIVE_COMPANIES,
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
