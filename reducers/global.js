
import Immutable from 'immutable'

import {
  SET_PAGE_ERRORS,
  SET_FLASH,
  CLEAR_FLASH,
  SET_HEADER_TITLE,
  SET_HEADER_BUTTONS,
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

export const headerInfo = (state = Immutable.Map(), action) => {
  switch (action.type) {
  case SET_HEADER_TITLE:
    return state.set('title', action.title)
  case SET_HEADER_BUTTONS:
    return state.set('buttons', action.buttons)
  default:
    return state
  }
}
