
import { SET_PAGE_ERRORS } from '../constants/GlobalActionTypes'
import API from '../API'

export const setPageErrors = errors => ({
    type: SET_PAGE_ERRORS,
    errors,
})
