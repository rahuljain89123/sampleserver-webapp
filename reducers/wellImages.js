import Immutable from 'immutable'

import {
  RECEIVE_WELL_IMAGES,
  REMOVE_WELL_IMAGE,
} from '../constants/WellImageActionTypes'

export const wellImages = (state = Immutable.Map(), action) => {
  switch (action.type) {
  case RECEIVE_WELL_IMAGES:
    return state.set(action.wellId, Immutable.fromJS(action.wellImages))
  case REMOVE_WELL_IMAGE:
    const st = state.get(action.wellId)
    const index = st.findIndex((image) =>
      (image.get('id') === action.wellImageId)
    )
    const newWellImageMap = st.delete(index)
    return state.set(action.wellId, newWellImageMap)
  default:
    return state
  }
}
