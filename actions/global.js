
import {
  SET_PAGE_ERRORS,
  SET_FLASH,
  CLEAR_FLASH,
} from '../constants/GlobalActionTypes'

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

export const flashMessage = (type, message, heading) =>
  dispatch => {
    dispatch(setFlash({
      type,
      message,
      heading
    }))

    setTimeout(() => dispatch(clearFlash()), 3000)
  }
