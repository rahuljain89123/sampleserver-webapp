
import API from 'API'

import { SET_SUBMITTING_REPORT } from 'constants/ReportActionTypes'
import { showLoading, hideLoading } from 'react-redux-loading-bar'

/*****************************************************************************
 * ACTION CREATORS
 *****************************************************************************/

export const setSubmittingReport = submitting => ({
  type: SET_SUBMITTING_REPORT,
  submitting,
})

/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

export const createContour = contourParams =>
  dispatch => {
    dispatch(setSubmittingReport(true))
    dispatch(showLoading())

    return API.post('/reports/create-contours', contourParams)
      .then((res) => {
        dispatch(setSubmittingReport(false))
        dispatch(hideLoading())
        return Promise.resolve(res.src)
      })
      .catch(() => {
        dispatch(setSubmittingReport(false))
        dispatch(hideLoading())
        return Promise.reject()
      })
  }
export const createAnalyticalBoxmap = boxmapsParams =>
  dispatch => {
    dispatch(setSubmittingReport(true))
    dispatch(showLoading())

    return API.post('/reports/preview-analytical-boxmap', boxmapsParams)
      .then(res => {
        dispatch(setSubmittingReport(false))
        dispatch(hideLoading())
        return Promise.resolve(res)
      })
      .catch(() => {
        dispatch(setSubmittingReport(false))
        dispatch(hideLoading())
        return Promise.reject()
      })
  }
