
import Immutable from 'immutable'

import {
    RECEIVE_SCHEDULE_WELL_TEST,
    RECEIVE_SCHEDULE_WELL_TESTS,
    SET_CREATING_SCHEDULE_WELL_TESTS,
    SET_CREATING_SCHEDULE_WELL_TESTS_ERROR,
    CLEAR_CREATING_SCHEDULE_WELL_TESTS_ERROR,
    SET_EDITING_SCHEDULE_WELL_TESTS,
    SET_EDITING_SCHEDULE_WELL_TESTS_ERROR,
    CLEAR_EDITING_SCHEDULE_WELL_TESTS_ERROR,
    REMOVE_SCHEDULE_WELL_TEST,
} from 'constants/ScheduleWellTestActionTypes'


export const scheduleWellTests = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_SCHEDULE_WELL_TEST:
        return state.set(action.schedulewelltest.id, Immutable.fromJS(action.schedulewelltest))
    case RECEIVE_SCHEDULE_WELL_TESTS:
        let tempState = state
        action.schedulewelltests.forEach(schedulewelltest => {
            tempState = tempState.set(schedulewelltest.id, Immutable.fromJS(schedulewelltest))
        })
        return tempState
    case REMOVE_SCHEDULE_WELL_TEST:
        return state.delete(action.id)
    default:
        return state
    }
}

export const creatingscheduleWellTest = (state = false, action) => {
    switch (action.type) {
    case SET_CREATING_SCHEDULE_WELL_TESTS:
        return action.creating
    default:
        return state
    }
}

export const creatingscheduleWellTestError = (state = null, action) => {
    switch (action.type) {
    case SET_CREATING_SCHEDULE_WELL_TESTS_ERROR:
        return action.error
    case CLEAR_CREATING_SCHEDULE_WELL_TESTS_ERROR:
        return null
    default:
        return state
    }
}

export const editingscheduleWellTest = (state = false, action) => {
    switch (action.type) {
    case SET_EDITING_SCHEDULE_WELL_TESTS:
        return action.editing
    default:
        return state
    }
}

export const editingscheduleWellTestError = (state = null, action) => {
    switch (action.type) {
    case SET_EDITING_SCHEDULE_WELL_TESTS_ERROR:
        return action.error
    case CLEAR_EDITING_SCHEDULE_WELL_TESTS_ERROR:
        return null
    default:
        return state
    }
}
