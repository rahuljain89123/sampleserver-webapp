
import {
    RECEIVE_TEST,
    RECEIVE_TESTS,
    SET_EDITING_TEST,
    SET_EDITING_TEST_ERROR,
    CLEAR_EDITING_TEST_ERROR,
} from 'constants/TestActionTypes'
import API from 'API'

export const receiveTest = test => ({
    type: RECEIVE_TEST,
    test,
})

export const receiveTests = tests => ({
    type: RECEIVE_TESTS,
    tests,
})


export const setEditingTest = editing => ({
    type: SET_EDITING_TEST,
    editing,
})

export const setEditingTestError = error => ({
    type: SET_EDITING_TEST_ERROR,
    error,
})

export const clearEditingSampleError = () => ({
    type: CLEAR_EDITING_TEST_ERROR,
})

export const fetchTest = id =>
    dispatch =>
        API.get(`/tests/${id}`)
        .then(test => {
            dispatch(receiveTest(test))
        })
        
export const fetchTests = () =>
    dispatch =>
        API.get('/tests/')
        .then(tests => {
            dispatch(receiveTests(tests))
        })

export const editTest = (id, test) =>
    dispatch => {
        dispatch(setEditingTest(true))

        return API.patch(`/tests/${id}`, test)
        .then(json => {
            dispatch(setEditingTest(false))
            dispatch(receiveTest(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setEditingTest(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setEditingTestError(json.errors[0]))
                }

                return dispatch(setEditingTestError({
                    msg: 'Unable to update test.',
                }))
            })
            return Promise.reject()
        })
    }
