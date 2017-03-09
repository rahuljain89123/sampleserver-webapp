
import {
    RECEIVE_COMPANY,
    RECEIVE_COMPANIES,
    SET_EDITING_COMPANY,
    SET_EDITING_COMPANY_ERROR,
    CLEAR_EDITING_COMPANY_ERROR,
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

export const fetchCompanies = () =>
    dispatch =>
        API.get('/companies/')
        .then(companies => {
            dispatch(receiveCompanies(companies))
        })

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
