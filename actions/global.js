
import {
  SET_PAGE_ERRORS,
  SET_FLASH,
  CLEAR_FLASH,
  SET_HEADER_INFO,
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

/**
 * @param title [Text|React.Element]
 * @param buttons [Array<{text:<String>, onClick:<function>}]
 */
export const setHeaderInfo = (title, buttons=[]) => ({
  type: SET_HEADER_INFO,
  headerInfo: { title, buttons },
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
