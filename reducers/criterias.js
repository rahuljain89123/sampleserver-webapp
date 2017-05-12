import Immutable from 'immutable'

import {
  RECEIVE_CRITERIAS,
} from 'constants/CriteriaActionTypes'

export const criterias = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case RECEIVE_CRITERIAS:
      let tempState = state
      action.criterias.forEach(criteria => {
          tempState = tempState.set(criteria.id, Immutable.Map(criteria))
      })
      return tempState
    default:
      return state
  }
}
