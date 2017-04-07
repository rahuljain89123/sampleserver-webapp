
import Immutable from 'immutable'

import {
    RECEIVE_SAMPLE_SCHEDULE,
    RECEIVE_SAMPLE_SCHEDULES,
    SET_CREATING_SAMPLE_SCHEDULE,
    SET_CREATING_SAMPLE_SCHEDULE_ERROR,
    CLEAR_CREATING_SAMPLE_SCHEDULE_ERROR,
    SET_EDITING_SAMPLE_SCHEDULE,
    SET_EDITING_SAMPLE_SCHEDULE_ERROR,
    CLEAR_EDITING_SAMPLE_SCHEDULE_ERROR,
} from '../constants/SampleScheduleActionTypes'

export const sampleSchedules = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_SAMPLE_SCHEDULE:
        return state.set(action.sampleSchedule.id, Immutable.Map(action.sampleSchedule))
    case RECEIVE_SAMPLE_SCHEDULES:
        let tempState = state
        action.sampleSchedules.forEach(sampleSchedule => {
            tempState = tempState.set(sampleSchedule.id, Immutable.Map(sampleSchedule))
        })
        return tempState
    default:
        return state
    }
}

export const creatingSampleSchedule = (state = false, action) => {
    switch (action.type) {
    case SET_CREATING_SAMPLE_SCHEDULE:
        return action.creating
    default:
        return state
    }
}

export const creatingSampleScheduleError = (state = null, action) => {
    switch (action.type) {
    case SET_CREATING_SAMPLE_SCHEDULE_ERROR:
        return action.error
    case CLEAR_CREATING_SAMPLE_SCHEDULE_ERROR:
        return null
    default:
        return state
    }
}

export const editingSampleSchedule = (state = false, action) => {
    switch (action.type) {
    case SET_EDITING_SAMPLE_SCHEDULE:
        return action.editing
    default:
        return state
    }
}

export const editingSampleScheduleError = (state = null, action) => {
    switch (action.type) {
    case SET_EDITING_SAMPLE_SCHEDULE_ERROR:
        return action.error
    case CLEAR_EDITING_SAMPLE_SCHEDULE_ERROR:
        return null
    default:
        return state
    }
}
