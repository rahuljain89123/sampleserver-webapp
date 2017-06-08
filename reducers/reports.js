import { SET_SUBMITTING_REPORT } from 'constants/ReportActionTypes'

export const submittingReport = (state = false, action) => {
  switch (action.type) {
  case SET_SUBMITTING_REPORT:
    return action.submitting
  default:
    return state
  }
}
