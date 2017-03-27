
import Immutable from 'immutable'

import {
    createStore,
    applyMiddleware,
} from 'redux'

import {
    combineReducers,
} from 'redux-immutable'

import thunk from 'redux-thunk'

import {
    users,
    currentUser,

    creatingUser,
    creatingUserError,

    editingUser,
    editingUserError,

    signinError,
    signinProcessing,

    acceptingInvite,
    acceptInviteError,
} from './reducers/users'
import {
    labs,
    currentLabUrl,
    creatingLab,
    creatingLabError,
    editingLab,
    editingLabError,
} from './reducers/labs'
import {
    sites,
    creatingSite,
    creatingSiteError,
    editingSite,
    editingSiteError,
} from './reducers/sites'
import {
    projects,
    creatingProject,
    creatingProjectError,
    editingProject,
    editingProjectError,
} from './reducers/projects'
import { roles } from './reducers/roles'
import {
    samples,
    editingSample,
    editingSampleError,
} from './reducers/samples'
import { companies } from './reducers/companies'
import { uploads } from './reducers/uploads'


const initialState = Immutable.Map({
    currentUser: JSON.parse(window.localStorage.getItem('currentUser')),
    currentLabUrl: window.location.hostname.split('.').shift(),
})

const rootReducer = combineReducers({
    users,
    currentUser,

    creatingUser,
    creatingUserError,

    editingUser,
    editingUserError,

    signinError,
    signinProcessing,

    acceptingInvite,
    acceptInviteError,

    labs,
    currentLabUrl,
    creatingLab,
    creatingLabError,
    editingLab,
    editingLabError,

    sites,
    creatingSite,
    creatingSiteError,
    editingSite,
    editingSiteError,

    projects,
    creatingProject,
    creatingProjectError,
    editingProject,
    editingProjectError,

    roles,

    samples,
    editingSample,
    editingSampleError,

    companies,
    uploads,
})

const store = createStore(rootReducer, initialState, applyMiddleware(thunk))

export default store
