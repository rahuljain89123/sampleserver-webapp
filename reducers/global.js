
import { SET_PAGE_ERRORS } from '../constants/GlobalActionTypes'

export const pageErrors = (state = null, action) => {
    switch (action.type) {
    case SET_PAGE_ERRORS:
        return action.errors
    default:
        return state
    }
}
