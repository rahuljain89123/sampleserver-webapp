import {
  RECEIVE_GROUPED_SAMPLE_VALUES,
  RECEIVE_SAMPLE_DATES,
} from 'constants/SampleActionTypes'
import API from 'API'

/*****************************************************************************
 * ACTION CREATORS
 *****************************************************************************/

export const receiveGroupedSampleValues = groupedSampleValues => ({
  type: RECEIVE_GROUPED_SAMPLE_VALUES,
  groupedSampleValues,
})

export const receiveSampleDates = (sampleDates) => ({
  type: RECEIVE_SAMPLE_DATES,
  sampleDates,
})

/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

/**
 * params = {
 *  date: YYYY-MM-DD
 *  sitemap_id: integer
 *  substance_ids: array
 *  site_id: integer
 * }
 *
 */
 export const fetchGroupedSampleValues = (params) =>
   dispatch =>
     API.post('/reports/query-well-data', params)
     .then(groupedSampleValues =>
       dispatch(receiveGroupedSampleValues(groupedSampleValues.my_wells))
     )


export const fetchSampleDates = (siteId) =>
  dispatch =>
    API.get(`/reports/get-sample-dates/${siteId}`)
    .then(res =>
      dispatch(receiveSampleDates(res.sample_dates))
    )
