
import API from 'API'


/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

export const createContour = contourParams =>
  dispatch => {
    return API.post('/reports/create-contours', contourParams)
  }
