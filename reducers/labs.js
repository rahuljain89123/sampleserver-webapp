
import Immutable from 'immutable'

import {
    RECEIVE_LAB,
    RECEIVE_LABS,
} from '../constants/LabActionTypes'

export const labs = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_LAB:
        return state.set(action.lab.laboratory_id, Immutable.Map(action.lab))
    case RECEIVE_LABS:
        let tempState = state
        action.labs.forEach(lab => {
            tempState = tempState.set(lab.laboratory_id, Immutable.Map(lab))
        })
        return tempState
    default:
        return state
    }
}
