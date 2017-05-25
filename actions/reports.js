
import API from 'API'


/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

export const createContour = contourParams =>
  dispatch =>
    API.post('/reports/create-contours', contourParams)
      .then((res) => Promise.resolve(res.src))

export const createAnalyticalBoxmaps = boxmapsParams =>
  dispatch =>
    API.post('/reports/create-analytical-boxmaps', boxmapsParams)
      .then((res) => Promise.resolve(res.src))
