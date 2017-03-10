
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
import { roles } from './reducers/roles'
import {
    samples,
    editingSample,
    editingSampleError,
} from './reducers/samples'
import { companies } from './reducers/companies'


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

    roles,

    samples,
    editingSample,
    editingSampleError,

    companies,
})

const store = createStore(rootReducer, initialState, applyMiddleware(thunk))

export default store
