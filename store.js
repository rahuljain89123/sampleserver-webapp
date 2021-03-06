
import Immutable from 'immutable'

import {
    createStore,
    applyMiddleware,
} from 'redux'

import {
    combineReducers,
} from 'redux-immutable'

import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar'

import { reducer as form } from 'redux-form/immutable'

import thunk from 'redux-thunk'

import { RESET } from 'constants/UserActionTypes'
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
    acceptedInvite,
    acceptInviteError,

    resetError,
    resetting,
} from 'reducers/users'

import {
    submittingReport
} from 'reducers/reports'

import {
    labs,
    currentLabUrl,
    creatingLab,
    creatingLabError,
    editingLab,
    editingLabError,
} from 'reducers/labs'
import {
    sites,
    creatingSite,
    creatingSiteError,
    editingSite,
    editingSiteError,
} from 'reducers/sites'
import {
  siteMaps,
  creatingSiteMap,
  creatingSiteMapError,
  editingSiteMap,
  editingSiteMapError,
  siteMapWells,
  addingSiteMapWell,
} from 'reducers/siteMaps'
import {
    schedules,
    creatingSchedule,
    creatingScheduleError,
    editingSchedule,
    editingScheduleError,
} from 'reducers/schedules'
import {
    siteDatas,
    creatingSiteData,
    creatingSiteDataError,
    editingSiteData,
    editingSiteDataError,
} from 'reducers/siteDatas'
import {
    substances,
    substanceGroups,
} from 'reducers/substances'
import {
    scheduleWellTests,
    creatingscheduleWellTest,
    creatingscheduleWellTestError,
    editingscheduleWellTest,
    editingscheduleWellTestError,
} from 'reducers/scheduleWellTests'
import {
    clients,
    creatingClient,
    creatingClientError,
    editingClient,
    editingClientError,
} from 'reducers/clients'
import {
    companies,
    creatingCompany,
    creatingCompanyError,
    editingCompany,
    editingCompanyError,
} from 'reducers/companies'
import {
    contacts,
    creatingContact,
    creatingContactError,
    editingContact,
    editingContactError,
} from 'reducers/contacts'
import {
    wells,
    creatingWell,
    creatingWellError,
    editingWell,
    editingWellError,
} from 'reducers/wells'
import { wellImages } from 'reducers/wellImages'
import { criterias } from 'reducers/criterias'

import { roles } from 'reducers/roles'
import {
    samples,
    editingSample,
    editingSampleError,
    groupedSampleValues,
    sampleDates,
} from 'reducers/samples'
import { uploads, uploadingError } from 'reducers/uploads'
import {
    tests,
    editingTest,
    editingTestError,
} from 'reducers/tests'
import {
  pageErrors,
  flash,
  headerInfo,
} from 'reducers/global'


const initialState = Immutable.Map({
    currentUser: JSON.parse(window.localStorage.getItem('currentUser')),
    currentLabUrl: window.location.hostname.split('.').shift(),
})

const resetState = Immutable.fromJS({
    users: {},
    labs: {},
    sites: {},
    clients: {},
    samples: {},
    companies: {},
    uploads: {},
    siteMaps: {},
    schedules: {},
    wells: {},
})

const appReducer = combineReducers({
    form,
    users,
    currentUser,

    creatingUser,
    creatingUserError,

    editingUser,
    editingUserError,

    signinError,
    signinProcessing,

    acceptingInvite,
    acceptedInvite,
    acceptInviteError,

    resetError,
    resetting,

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

    siteMaps,
    creatingSiteMap,
    creatingSiteMapError,
    editingSiteMap,
    editingSiteMapError,
    siteMapWells,
    addingSiteMapWell,

    siteDatas,
    creatingSiteData,
    creatingSiteDataError,
    editingSiteData,
    editingSiteDataError,

    substances,
    substanceGroups,

    schedules,
    creatingSchedule,
    creatingScheduleError,
    editingSchedule,
    editingScheduleError,

    scheduleWellTests,
    creatingscheduleWellTest,
    creatingscheduleWellTestError,
    editingscheduleWellTest,
    editingscheduleWellTestError,

    clients,
    creatingClient,
    creatingClientError,
    editingClient,
    editingClientError,

    companies,
    creatingCompany,
    creatingCompanyError,
    editingCompany,
    editingCompanyError,

    contacts,
    creatingContact,
    creatingContactError,
    editingContact,
    editingContactError,

    wells,
    creatingWell,
    creatingWellError,
    editingWell,
    editingWellError,
    wellImages,

    criterias,

    roles,

    samples,
    editingSample,
    editingSampleError,
    groupedSampleValues,
    sampleDates,

    tests,
    editingTest,
    editingTestError,

    uploads,
    uploadingError,

    submittingReport,

    pageErrors,
    flash,
    headerInfo,
    loadingBar,
})

const rootReducer = (state, action) => {
    if (action.type === RESET) {
        return state.merge(resetState)
    }

    return appReducer(state, action)
}

const store = createStore(rootReducer, initialState, applyMiddleware(thunk))

export default store
