
import qs from 'qs'

import {
    RECEIVE_SCHEDULE,
    RECEIVE_SCHEDULES,
    SET_CREATING_SCHEDULE,
    SET_CREATING_SCHEDULE_ERROR,
    CLEAR_CREATING_SCHEDULE_ERROR,
    SET_EDITING_SCHEDULE,
    SET_EDITING_SCHEDULE_ERROR,
    CLEAR_EDITING_SCHEDULE_ERROR,
} from 'constants/ScheduleActionTypes'
import API from 'API'
import pickBy from 'lodash/pickBy'

/*****************************************************************************
 * ACTION CREATORS
 *****************************************************************************/

export const receiveSchedule = schedule => ({
    type: RECEIVE_SCHEDULE,
    schedule,
})

export const receiveSchedules = schedules => ({
    type: RECEIVE_SCHEDULES,
    schedules,
})

export const fetchSchedule = id =>
    dispatch =>
        API.get(`/schedules/${id}`)
        .then(schedule => {
            dispatch(receiveSchedule(schedule))
        })

export const fetchSchedules = (filters = {}) =>
    dispatch =>
        API.get(`/schedules/?${qs.stringify(filters)}`)
        .then(schedules => {
            dispatch(receiveSchedules(schedules))
        })

export const setCreatingSchedule = creating => ({
    type: SET_CREATING_SCHEDULE,
    creating,
})

export const setCreatingScheduleError = error => ({
    type: SET_CREATING_SCHEDULE_ERROR,
    error,
})

export const clearCreatingScheduleError = () => ({
    type: CLEAR_CREATING_SCHEDULE_ERROR,
})

/*****************************************************************************
 * THUNK ACTION CREATORS
 *****************************************************************************/

export const createSchedule = schedule =>
    dispatch => {
        dispatch(setCreatingSchedule(true))
        const cleanSchedule = pickBy(schedule)

        return API.post('/schedules/', cleanSchedule)
        .then(json => {
            dispatch(setCreatingSchedule(false))
            dispatch(receiveSchedule(json))
            return Promise.resolve(json)
        })
        .catch(e => {
            dispatch(setCreatingSchedule(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setCreatingScheduleError(json.errors[0]))
                }

                return dispatch(setCreatingScheduleError({
                    msg: 'Unable to create schedule.',
                }))
            })
            return Promise.reject()
        })
    }

export const setEditingSchedule = editing => ({
    type: SET_EDITING_SCHEDULE,
    editing,
})

export const setEditingScheduleError = error => ({
    type: SET_EDITING_SCHEDULE_ERROR,
    error,
})

export const clearEditingScheduleError = () => ({
    type: CLEAR_EDITING_SCHEDULE_ERROR,
})

export const editSchedule = (id, scheduleParams) =>
    dispatch => {
        dispatch(setEditingSchedule(true))

        return API.patch(`/schedules/${id}`, scheduleParams)
        .then(json => {
            dispatch(setEditingSchedule(false))
            dispatch(receiveSchedule(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setEditingSchedule(false))
            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    dispatch(setEditingScheduleError(json.errors[0]))
                }

                dispatch(setEditingScheduleError({
                    msg: 'Unable to update schedule.',
                }))
            })
            return Promise.reject()
        })
    }
