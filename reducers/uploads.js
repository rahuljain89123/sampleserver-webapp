
import Immutable from 'immutable'

import {
  RECEIVE_UPLOAD,
  RECEIVE_UPLOADS,
  REMOVE_UPLOAD,
  SET_UPLOADING_ERROR,
  CLEAR_UPLOADING_ERROR,
} from 'constants/UploadActionTypes'

export const uploads = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_UPLOAD:
        return state.set(action.upload.id, Immutable.fromJS(action.upload))
    case RECEIVE_UPLOADS:
        let tempState = state
        action.uploads.forEach(upload => {
            tempState = tempState.set(upload.id, Immutable.fromJS(upload))
        })
        return tempState
    case REMOVE_UPLOAD:
        return state.delete(action.id)
    default:
        return state
    }
}

export const uploadingError = (state = null, action) => {
  switch (action.type) {
    case SET_UPLOADING_ERROR:
      return action.error
    case CLEAR_UPLOADING_ERROR:
      return null
    default:
      return state
  }
}
