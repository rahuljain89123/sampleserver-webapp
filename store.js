
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
import { labs } from './reducers/labs'
import { samples } from './reducers/samples'


const initialState = Immutable.Map({
    currentUser: JSON.parse(window.localStorage.getItem('currentUser')),
})

const rootReducer = combineReducers({
    users,
    labs,
    samples,
    currentUser,
    creatingUser,
    creatingUserError,
    signinError,
    signinProcessing,
})

const store = createStore(rootReducer, initialState, applyMiddleware(thunk))

export default store
