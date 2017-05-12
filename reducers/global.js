
import Immutable from 'immutable'

import {
  SET_PAGE_ERRORS,
  SET_FLASH,
  CLEAR_FLASH,
} from 'constants/GlobalActionTypes'

export const pageErrors = (state = null, action) => {
    switch (action.type) {
    case SET_PAGE_ERRORS:
        return action.errors
    default:
        return state
    }
}

export const flash = (state = null, action) => {
  switch (action.type) {
  case SET_FLASH:
    return Immutable.Map(action.flash)
  case CLEAR_FLASH:
    return null
  default:
    return state
  }
}
