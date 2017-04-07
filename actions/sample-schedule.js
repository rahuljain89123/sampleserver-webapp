
import qs from 'qs'

import {
    RECEIVE_SAMPLE_SCHEDULE,
    RECEIVE_SAMPLE_SCHEDULES,
    SET_CREATING_SAMPLE_SCHEDULE,
    SET_CREATING_SAMPLE_SCHEDULE_ERROR,
    CLEAR_CREATING_SAMPLE_SCHEDULE_ERROR,
    SET_EDITING_SAMPLE_SCHEDULE,
    SET_EDITING_SAMPLE_SCHEDULE_ERROR,
    CLEAR_EDITING_SAMPLE_SCHEDULE_ERROR,
} from '../constants/SampleScheduleActionTypes'
import API from '../API'


export const receiveSampleSchedule = sampleSchedule => ({
    type: RECEIVE_SAMPLE_SCHEDULE,
    sampleSchedule,
})

export const receiveSampleSchedules = sampleSchedules => ({
    type: RECEIVE_SAMPLE_SCHEDULES,
    sampleSchedules,
})

export const fetchSampleSchedule = id =>
    dispatch =>
        API.get(`/sampleSchedules/${id}`)
        .then(sampleSchedule => {
            dispatch(receiveSampleSchedule(sampleSchedule))
        })

export const fetchSampleSchedules = (filters = {}) =>
    dispatch =>
        API.get(`/sampleSchedules/?${qs.stringify(filters)}`)
        .then(sampleSchedules => {
            dispatch(receiveSampleSchedules(sampleSchedules))
        })

export const setCreatingSampleSchedule = creating => ({
    type: SET_CREATING_SAMPLE_SCHEDULE,
    creating,
})

export const setCreatingSampleScheduleError = error => ({
    type: SET_CREATING_SAMPLE_SCHEDULE_ERROR,
    error,
})

export const clearCreatingSampleScheduleError = () => ({
    type: CLEAR_CREATING_SAMPLE_SCHEDULE_ERROR,
})

export const createSampleSchedule = sampleSchedule =>
    dispatch => {
        dispatch(setCreatingSampleSchedule(true))

        return API.post('/sampleSchedules/', sampleSchedule)
        .then(json => {
            dispatch(setCreatingSampleSchedule(false))
            dispatch(receiveSampleSchedule(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setCreatingSampleSchedule(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setCreatingSampleScheduleError(json.errors[0]))
                }

                return dispatch(setCreatingSampleScheduleError({
                    msg: 'Unable to create sampleSchedule.',
                }))
            })
            return Promise.reject()
        })
    }

export const setEditingSampleSchedule = editing => ({
    type: SET_EDITING_SAMPLE_SCHEDULE,
    editing,
})

export const setEditingSampleScheduleError = error => ({
    type: SET_EDITING_SAMPLE_SCHEDULE_ERROR,
    error,
})

export const clearEditingSampleScheduleError = () => ({
    type: CLEAR_EDITING_SAMPLE_SCHEDULE_ERROR,
})

export const editSampleSchedule = (id, sampleSchedule) =>
    dispatch => {
        dispatch(setEditingSampleSchedule(true))

        return API.patch(`/sampleSchedules/${id}`, sampleSchedule)
        .then(json => {
            dispatch(setEditingSampleSchedule(false))
            dispatch(receiveSampleSchedule(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setEditingSampleSchedule(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setEditingSampleScheduleError(json.errors[0]))
                }

                return dispatch(setEditingSampleScheduleError({
                    msg: 'Unable to update sampleSchedule.',
                }))
            })
            return Promise.reject()
        })
    }
