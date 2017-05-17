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

export const receiveSampleDates = (sampleDates, siteId) => ({
  type: RECEIVE_SAMPLE_DATES,
  sampleDates,
  siteId,
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
     API.post('/reports/query-well-data/', params)
     .then(groupedSampleValues =>
       dispatch(receiveGroupedSampleValues(groupedSampleValues))
     )


export const fetchSampleDates = (siteId) =>
  dispatch =>
    API.get(`/reports/get-sample-dates/${siteId}`)
    .then(sampleDates => 
      dispatch(receiveSampleDates(sampleDates, siteId))
    )
