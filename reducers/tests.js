
import Immutable from 'immutable'

import {
    RECEIVE_TEST,
    RECEIVE_TESTS,
    SET_EDITING_TEST,
    SET_EDITING_TEST_ERROR,
    CLEAR_EDITING_TEST_ERROR,
} from '../constants/TestActionTypes'

export const tests = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_TEST:
        return state.set(action.test.id, Immutable.Map(action.test))
    case RECEIVE_TESTS:
        let tempState = state
        action.tests.forEach(test => {
            tempState = tempState.set(test.id, Immutable.Map(test))
        })
        return tempState
    default:
        return state
    }
}

export const editingTest = (state = false, action) => {
    switch (action.type) {
    case SET_EDITING_TEST:
        return action.editing
    default:
        return state
    }
}

export const editingTestError = (state = null, action) => {
    switch (action.type) {
    case SET_EDITING_TEST_ERROR:
        return action.error
    case CLEAR_EDITING_TEST_ERROR:
        return null
    default:
        return state
    }
}
