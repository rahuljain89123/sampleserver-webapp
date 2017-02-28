
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
    signinError,
    signinProcessing,
} from './reducers/users'
import {
    labs,
    editingLab,
    editingLabError,
} from './reducers/labs'
import { roles } from './reducers/roles'
import { samples } from './reducers/samples'


const initialState = Immutable.Map({
    currentUser: JSON.parse(window.localStorage.getItem('currentUser')),
})

const rootReducer = combineReducers({
    users,
    currentUser,
    creatingUser,
    creatingUserError,
    signinError,
    signinProcessing,
    labs,
    editingLab,
    editingLabError,
    roles,
    samples,
})

const store = createStore(rootReducer, initialState, applyMiddleware(thunk))

export default store
