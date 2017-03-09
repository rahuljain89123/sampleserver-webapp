
import {
    RECEIVE_COMPANY,
    RECEIVE_COMPANIES,
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
