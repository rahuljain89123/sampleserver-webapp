
/**
 * Depends on: fetchCurrentUser
 */
export const currentUser = (store, defaultValue = null) => {
  const userId = store.get('currentUser')
  const users = store.get('users')

  if (userId === null) return defaultValue
  if (!users || !users.size) return defaultValue

  return users.get(userId, defaultValue)
}

/**
 * Depends on: fetchCurrentUser, fetchRoles
 */
export const currentUserRole = (store, defaultValue = null) => {
  const user = currentUser(store)
  const roles = store.get('roles')

  if (user === null) return defaultValue
  if (!roles || !roles.size) return defaultValue

  const roleId = user.get('role_id', defaultValue)

  if (roleId === null) return defaultValue

  return roles.get(roleId, defaultValue)
}

/**
 * Depends on: fetchCurrentLab
 */
export const currentLab = (store, defaultValue = null) => {
  const currentLabUrl = store.get('currentLabUrl')
  const labs = store.get('labs')

  if (!labs || !labs.size) return defaultValue

  const lab = labs
    .filter(fLab => fLab.get('url') === currentLabUrl)
    .first()

  if (!lab) return defaultValue

  return lab
}

/**
 * Depends on: fetchCompanies
 * Limited to: CompanyAdmin and below
 */
export const currentCompany = (store, defaultValue = null) => {
  const userId = store.get('currentUser')
  const companies = store.get('companies')

  if (userId === null) return defaultValue
  if (!companies || !companies.size) return defaultValue

  const company = companies
    .filter(fCompany => fCompany.get('user_ids').indexOf(userId) !== -1)
    .first()

  if (!company) return defaultValue

  return company
}

export const safeGet = (object, key, defaultValue) => {
  if (!object) return defaultValue

  return object.get(key, defaultValue)
}
