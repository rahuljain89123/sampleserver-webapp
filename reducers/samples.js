
import Immutable from 'immutable'

import {
  RECEIVE_SAMPLE,
  RECEIVE_SAMPLES,
  SET_EDITING_SAMPLE,
  SET_EDITING_SAMPLE_ERROR,
  CLEAR_EDITING_SAMPLE_ERROR,
  RECEIVE_GROUPED_SAMPLE_VALUES,
  RECEIVE_SAMPLE_DATES,
} from 'constants/SampleActionTypes'

export const samples = (state = Immutable.Map(), action) => {
  switch (action.type) {
  case RECEIVE_SAMPLE:
    return state.set(action.sample.id, Immutable.fromJS(action.sample))
  case RECEIVE_SAMPLES:
    let tempState = state
    action.samples.forEach(sample => {
      tempState = tempState.set(sample.id, Immutable.fromJS(sample))
    })
    return tempState
  default:
    return state
  }
}

export const editingSample = (state = false, action) => {
  switch (action.type) {
  case SET_EDITING_SAMPLE:
    return action.editing
  default:
    return state
  }
}

export const editingSampleError = (state = null, action) => {
  switch (action.type) {
  case SET_EDITING_SAMPLE_ERROR:
    return action.error
  case CLEAR_EDITING_SAMPLE_ERROR:
    return null
  default:
    return state
  }
}


export const groupedSampleValues = (state = Immutable.Map(), action) => {
  switch (action.type) {
  case RECEIVE_GROUPED_SAMPLE_VALUES:
    return Immutable.fromJS(action.groupedSampleValues)
  default:
    return state
  }
}

export const sampleDates = (state = Immutable.Map(), action) => {
  switch (action.type) {
  case RECEIVE_SAMPLE_DATES:
    return state.set(action.siteId, Immutable.fromJS(action.sampleDates))
  default:
    return state
  }
}
