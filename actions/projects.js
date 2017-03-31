
import {
    RECEIVE_PROJECT,
    RECEIVE_PROJECTS,
    SET_CREATING_PROJECT,
    SET_CREATING_PROJECT_ERROR,
    CLEAR_CREATING_PROJECT_ERROR,
    SET_EDITING_PROJECT,
    SET_EDITING_PROJECT_ERROR,
    CLEAR_EDITING_PROJECT_ERROR,
} from '../constants/ProjectActionTypes'
import API from '../API'


export const receiveProject = project => ({
    type: RECEIVE_PROJECT,
    project,
})

export const receiveProjects = projects => ({
    type: RECEIVE_PROJECTS,
    projects,
})

export const setEditingProject = editing => ({
    type: SET_EDITING_PROJECT,
    editing,
})

export const setEditingProjectError = error => ({
    type: SET_EDITING_PROJECT_ERROR,
    error,
})

export const clearEditingProjectError = () => ({
    type: CLEAR_EDITING_PROJECT_ERROR,
})

export const setCreatingProject = creating => ({
    type: SET_CREATING_PROJECT,
    creating,
})

export const setCreatingProjectError = error => ({
    type: SET_CREATING_PROJECT_ERROR,
    error,
})

export const clearCreatingProjectError = () => ({
    type: CLEAR_CREATING_PROJECT_ERROR,
})

export const fetchProject = id =>
    dispatch =>
        API.get(`/projects/${id}`)
        .then(project => {
            dispatch(receiveProject(project))
        })

export const fetchProjects = () =>
    dispatch =>
        API.get('/projects/')
        .then(projects => {
            dispatch(receiveProjects(projects))
        })

export const createProject = project =>
    dispatch => {
        dispatch(setCreatingProject(true))

        return API.post('/projects/', project)
        .then(json => {
            dispatch(setCreatingProject(false))
            dispatch(receiveProject(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setCreatingProject(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setCreatingProjectError(json.errors[0]))
                }

                return dispatch(setCreatingProjectError({
                    msg: 'Unable to create project.',
                }))
            })
            return Promise.reject()
        })
    }

export const editProject = (id, project) =>
    dispatch => {
        dispatch(setEditingProject(true))

        return API.patch(`/projects/${id}`, project)
        .then(json => {
            dispatch(setEditingProject(false))
            dispatch(receiveProject(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setEditingProject(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setEditingProjectError(json.errors[0]))
                }

                return dispatch(setEditingProjectError({
                    msg: 'Unable to update project.',
                }))
            })
            return Promise.reject()
        })
    }
