import Immutable from 'immutable'

import {
  RECEIVE_SUBSTANCES,
  RECEIVE_SUBSTANCE_GROUPS,
} from 'constants/SubstanceActionTypes'

export const substances = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case RECEIVE_SUBSTANCES:
      let tempState = state
      action.substances.forEach(substance => {
        tempState = tempState.set(substance.id, Immutable.Map(substance))
      })
      return tempState
    default:
      return state
  }
}

export const substanceGroups = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case RECEIVE_SUBSTANCE_GROUPS:
      let tempState = state
      action.substanceGroups.forEach(substanceGroup => {
        tempState = tempState.set(substanceGroup.id, Immutable.Map(substanceGroup))
      })
      return tempState
    default:
      return state
  }
}
