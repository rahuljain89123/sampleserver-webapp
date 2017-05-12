
import qs from 'qs'

import {
    RECEIVE_SCHEDULE_WELL_TEST,
    RECEIVE_SCHEDULE_WELL_TESTS,
    SET_CREATING_SCHEDULE_WELL_TEST,
    SET_CREATING_SCHEDULE_WELL_TEST_ERROR,
    CLEAR_CREATING_SCHEDULE_WELL_TEST_ERROR,
    SET_EDITING_SCHEDULE_WELL_TEST,
    SET_EDITING_SCHEDULE_WELL_TEST_ERROR,
    CLEAR_EDITING_SCHEDULE_WELL_TEST_ERROR,
    REMOVE_SCHEDULE_WELL_TEST,
} from 'constants/ScheduleWellTestActionTypes'
import API from '../API'
import pickBy from 'lodash/pickBy'


export const receiveScheduleWellTest = schedulewelltest => ({
    type: RECEIVE_SCHEDULE_WELL_TEST,
    schedulewelltest,
})

export const receiveScheduleWellTests = schedulewelltests => ({
    type: RECEIVE_SCHEDULE_WELL_TESTS,
    schedulewelltests,
})

export const fetchScheduleWellTest = id =>
    dispatch =>
        API.get(`/schedulewelltests/${id}`)
        .then(schedulewelltest => {
            dispatch(receiveScheduleWellTest(schedulewelltest))
        })

export const fetchScheduleWellTests = (filters = {}) =>
    dispatch =>
        API.get(`/schedulewelltests/?${qs.stringify(filters)}`)
        .then(schedulewelltests => {
            dispatch(receiveScheduleWellTests(schedulewelltests))
        })

export const setCreatingScheduleWellTest = creating => ({
    type: SET_CREATING_SCHEDULE_WELL_TEST,
    creating,
})

export const setCreatingScheduleWellTestError = error => ({
    type: SET_CREATING_SCHEDULE_WELL_TEST_ERROR,
    error,
})

export const clearCreatingScheduleWellTestError = () => ({
    type: CLEAR_CREATING_SCHEDULE_WELL_TEST_ERROR,
})

export const createScheduleWellTest = schedulewelltest =>
    dispatch => {
        dispatch(setCreatingScheduleWellTest(true))
        const cleanScheduleWellTest = pickBy(schedulewelltest)

        return API.post('/schedulewelltests/', cleanScheduleWellTest)
        .then(json => {
            dispatch(setCreatingScheduleWellTest(false))
            dispatch(receiveScheduleWellTest(json))
            return Promise.resolve(json)
        })
        .catch(e => {
            dispatch(setCreatingScheduleWellTest(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setCreatingScheduleWellTestError(json.errors[0]))
                }

                return dispatch(setCreatingScheduleWellTestError({
                    msg: 'Unable to create schedulewelltest.',
                }))
            })
            return Promise.reject(json)
        })
    }

export const setEditingScheduleWellTest = editing => ({
    type: SET_EDITING_SCHEDULE_WELL_TEST,
    editing,
})

export const setEditingScheduleWellTestError = error => ({
    type: SET_EDITING_SCHEDULE_WELL_TEST_ERROR,
    error,
})

export const clearEditingScheduleWellTestError = () => ({
    type: CLEAR_EDITING_SCHEDULE_WELL_TEST_ERROR,
})

export const editScheduleWellTest = (id, schedulewelltest) =>
    dispatch => {
        dispatch(setEditingScheduleWellTest(true))

        return API.patch(`/schedulewelltests/${id}`, schedulewelltest)
        .then(json => {
            dispatch(setEditingScheduleWellTest(false))
            dispatch(receiveScheduleWellTest(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setEditingScheduleWellTest(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setEditingScheduleWellTestError(json.errors[0]))
                }

                return dispatch(setEditingScheduleWellTestError({
                    msg: 'Unable to update schedulewelltest.',
                }))
            })
            return Promise.reject()
        })
    }

export const removeScheduleWellTest = id => ({
    type: REMOVE_SCHEDULE_WELL_TEST,
    id,
})

export const deleteScheduleWellTest = id =>
    dispatch => API.delete(`/schedulewelltests/${id}`)
        .then(() => dispatch(removeScheduleWellTest(id)))
