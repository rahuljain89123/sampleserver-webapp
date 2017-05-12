
import {
  SET_PAGE_ERRORS,
  SET_FLASH,
  CLEAR_FLASH,
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
  type: CLEAR_FLASH
})

/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

export const flashMessage = (type, message) =>
  dispatch => {
    dispatch(setFlash({
      type,
      message,
    }))

    setTimeout(() => dispatch(clearFlash()), 3000)
  }
