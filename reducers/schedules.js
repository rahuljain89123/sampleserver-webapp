
import Immutable from 'immutable'

import {
  RECEIVE_SCHEDULE,
  RECEIVE_SCHEDULES,
  SET_CREATING_SCHEDULE,
  SET_CREATING_SCHEDULE_ERROR,
  CLEAR_CREATING_SCHEDULE_ERROR,
  SET_EDITING_SCHEDULE,
  SET_EDITING_SCHEDULE_ERROR,
  CLEAR_EDITING_SCHEDULE_ERROR,
  REMOVE_SCHEDULE,
} from 'constants/ScheduleActionTypes'

export const schedules = (state = Immutable.Map(), action) => {
  switch (action.type) {
  case RECEIVE_SCHEDULE:
    return state.set(action.schedule.id, Immutable.fromJS(action.schedule))
  case RECEIVE_SCHEDULES:
    let tempState = state
    action.schedules.forEach(schedule => {
      tempState = tempState.set(schedule.id, Immutable.fromJS(schedule))
    })
    return tempState
  case REMOVE_SCHEDULE:
    return state.delete(action.id)
  default:
    return state
  }
}

export const creatingSchedule = (state = false, action) => {
  switch (action.type) {
  case SET_CREATING_SCHEDULE:
    return action.creating
  default:
    return state
  }
}

export const creatingScheduleError = (state = null, action) => {
  switch (action.type) {
  case SET_CREATING_SCHEDULE_ERROR:
    return action.error
  case CLEAR_CREATING_SCHEDULE_ERROR:
    return null
  default:
    return state
  }
}

export const editingSchedule = (state = false, action) => {
  switch (action.type) {
  case SET_EDITING_SCHEDULE:
    return action.editing
  default:
    return state
  }
}

export const editingScheduleError = (state = null, action) => {
  switch (action.type) {
  case SET_EDITING_SCHEDULE_ERROR:
    return action.error
  case CLEAR_EDITING_SCHEDULE_ERROR:
    return null
  default:
    return state
  }
}
