
import Immutable from 'immutable'

import { RECEIVE_UPLOAD, RECEIVE_UPLOADS, REMOVE_UPLOAD } from '../constants/UploadActionTypes'

export const uploads = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_UPLOAD:
        return state.set(action.upload.id, Immutable.Map(action.upload))
    case RECEIVE_UPLOADS:
        let tempState = state
        action.uploads.forEach(upload => {
            tempState = tempState.set(upload.id, Immutable.Map(upload))
        })
        return tempState
    case REMOVE_UPLOAD:
        return state.delete(action.id)
    default:
        return state
    }
}
