
import {
  SET_PAGE_ERRORS,
  SET_FLASH,
  CLEAR_FLASH,
  SET_HEADER_TITLE,
  SET_HEADER_BUTTONS,
} from 'constants/GlobalActionTypes'

/*****************************************************************************
 * ACTION CREATORS
 *****************************************************************************/

export const setPageErrors = errors => ({
    type: SET_PAGE_ERRORS,
    errors,
})

export const setFlash = (flash) => ({
  type: SET_FLASH,
  flash,
})

export const clearFlash = () => ({
  type: CLEAR_FLASH,
})

export const setHeaderTitle = (title) => ({
  type: SET_HEADER_TITLE,
  title,
})

// buttons = [{text: ‘’, onClick: () => { doSomething(); }]
export const setHeaderButtons = (buttons) => ({
  type: SET_HEADER_BUTTONS,
  buttons,
})

/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

export const flashMessage = (type, message) =>
  dispatch => {
    if (type === 'STANDARD_ERROR') {
      type = 'danger'
      message = 'Sorry, there was an error.'
    }
    dispatch(setFlash({
      type,
      message,
    }))

    setTimeout(() => dispatch(clearFlash()), 3000)
  }
