
import Immutable from 'immutable'

import {
    RECEIVE_ROLE,
    RECEIVE_ROLES,
} from '../constants/RoleActionTypes'

export const roles = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_ROLE:
        return state.set(action.role.id, Immutable.Map(action.role))
    case RECEIVE_ROLES:
        let tempState = state
        action.roles.forEach(role => {
            tempState = tempState.set(role.id, Immutable.Map(role))
        })
        return tempState
    default:
        return state
    }
}
