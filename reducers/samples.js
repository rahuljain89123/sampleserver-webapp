
import Immutable from 'immutable'

import {
    RECEIVE_SAMPLE,
    RECEIVE_SAMPLES,
} from '../constants/SampleActionTypes'

export const samples = (state = Immutable.Map(), action) => {
    switch (action.type) {
    case RECEIVE_SAMPLE:
        return state.set(action.sample.sample_id, action.sample)
    case RECEIVE_SAMPLES:
        return state.merge(action.samples.reduce((acc, val) => {
            acc[val.sample_id] = val  // eslint-disable-line no-param-reassign
            return acc
        }, {}))
    default:
        return state
    }
}
