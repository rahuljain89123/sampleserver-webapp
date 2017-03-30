
import qs from 'qs'

import {
    RECEIVE_COMPANY,
    RECEIVE_COMPANIES,
    SET_CREATING_COMPANY,
    SET_CREATING_COMPANY_ERROR,
    CLEAR_CREATING_COMPANY_ERROR,
    SET_EDITING_COMPANY,
    SET_EDITING_COMPANY_ERROR,
    CLEAR_EDITING_COMPANY_ERROR,
    REMOVE_COMPANY,
} from '../constants/CompanyActionTypes'
import API from '../API'


export const receiveCompany = company => ({
    type: RECEIVE_COMPANY,
    company,
})

export const receiveCompanies = companies => ({
    type: RECEIVE_COMPANIES,
    companies,
})

export const fetchCompany = id =>
    dispatch =>
        API.get(`/companies/${id}`)
        .then(company => {
            dispatch(receiveCompany(company))
        })

export const fetchCompanies = (filters = {}) =>
    dispatch =>
        API.get(`/companies/?${qs.stringify(filters)}`)
        .then(companies => {
            dispatch(receiveCompanies(companies))
        })

export const setCreatingCompany = creating => ({
    type: SET_CREATING_COMPANY,
    creating,
})

export const setCreatingCompanyError = error => ({
    type: SET_CREATING_COMPANY_ERROR,
    error,
})

export const clearCreatingCompanyError = () => ({
    type: CLEAR_CREATING_COMPANY_ERROR,
})

export const createCompany = company =>
    dispatch => {
        dispatch(setCreatingCompany(true))

        return API.post('/companies/', company)
        .then(json => {
            dispatch(setCreatingCompany(false))
            dispatch(receiveCompany(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setCreatingCompany(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setCreatingCompanyError(json.errors[0]))
                }

                return dispatch(setCreatingCompanyError({
                    msg: 'Unable to create company.',
                }))
            })
            return Promise.reject()
        })
    }

export const setEditingCompany = editing => ({
    type: SET_EDITING_COMPANY,
    editing,
})

export const setEditingCompanyError = error => ({
    type: SET_EDITING_COMPANY_ERROR,
    error,
})

export const clearEditingCompanyError = () => ({
    type: CLEAR_EDITING_COMPANY_ERROR,
})

export const editCompany = (id, company) =>
    dispatch => {
        dispatch(setEditingCompany(true))

        return API.patch(`/companies/${id}`, company)
        .then(json => {
            dispatch(setEditingCompany(false))
            dispatch(receiveCompany(json))
            return Promise.resolve(json.id)
        })
        .catch(e => {
            dispatch(setEditingCompany(false))

            e.response.json().then(json => {
                if (json.errors && json.errors.length) {
                    return dispatch(setEditingCompanyError(json.errors[0]))
                }

                return dispatch(setEditingCompanyError({
                    msg: 'Unable to update company.',
                }))
            })
            return Promise.reject()
        })
    }

export const removeCompany = id => ({
    type: REMOVE_COMPANY,
    id,
})

export const deleteCompany = id =>
    dispatch => {
        API.delete(`/company/${id}`)
        .then(() => dispatch(removeCompany(id)))
    }
