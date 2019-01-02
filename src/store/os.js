const state = {
  operatingStatement: {},

  osFields: [{ label: 'Other Income', current: 0, potential: 0, isIncome: true }],

  isFetching: false,
  fetchSuccess: false,
  fetchError: null,

  isCreating: false,
  createSuccess: false,
  createError: null,

  isUpdating: false,
  updateSuccess: false,
  updateError: null,

  isFetchingFields: false,
  fetchFieldsSuccess: false,
  fetchFieldsError: null,

  isAddingField: false,
  addFieldSuccess: false,
  addFieldError: null,

  isUpdatingField: false,
  updateFieldSuccess: false,
  updateFieldError: null,

  isDeletingField: false,
  deleteFieldSuccess: false,
  deleteFieldError: null
}

const mutations = {
  fetchStart (state) {
    state.isFetching = true
  },

  fetchSuccessful (state, data) {
    state.isFetching = false
    state.fetchSuccess = true
    state.fetchError = null
  },

  fetchFailed (state, err) {
    state.properties = {}

    state.isFetching = false
    state.fetchSuccess = false
    state.fetchError = err
  },

  createStart (state) {
    state.isCreating = true
  },

  createSuccessful (state, data) {
    state.isCreating = false
    state.createSuccess = true
    state.createError = null
  },

  createFailed (state, err) {
    state.isCreating = false
    state.createSuccess = false
    state.createError = err
  },

  updateStart (state) {
    state.isUpdating = true
  },

  updateSuccessful (state, data) {
    state.isUpdating = false
    state.updateSuccess = true
    state.updateError = null
  },

  updateFailed (state, err) {
    state.isUpdating = false
    state.updateSuccess = false
    state.updateError = err
  },

  fetchFieldsStart (state) {
    state.isFetchingFields = true
  },

  fetchFieldsSuccessful (state, data) {
    state.isFetchingFields = false
    state.fetchFieldsSuccess = true
    state.fetchFieldsError = null
  },

  fetchFieldsFailed (state, err) {
    state.isFetchingFields = false
    state.fetchFieldsSuccess = false
    state.fetchFieldsError = err
  },

  addFieldStart (state) {
    state.isAddingField = true
  },

  addFieldSuccessful (state, data) {
    state.isAddingField = false
    state.addFieldSuccess = true
    state.addFieldError = null
  },

  addFieldFailed (state, err) {
    state.isAddingField = false
    state.addFieldSuccess = false
    state.addFieldError = err
  },

  updateFieldStart (state) {
    state.isUpdatingField = true
  },

  updateFieldSuccessful (state, data) {
    state.isUpdatingField = false
    state.updateFieldSuccess = true
    state.updateFieldError = null
  },

  updateFieldFailed (state, err) {
    state.isUpdatingField = false
    state.updateFieldSuccess = false
    state.updateFieldError = err
  },

  deleteFieldStart (state) {
    state.isDeletingField = true
  },

  deleteFieldSuccessful (state, data) {
    state.isDeletingField = false
    state.deleteFieldSuccess = true
    state.deleteFieldError = null
  },

  deleteFieldFailed (state, err) {
    state.isDeletingField = false
    state.deleteFieldSuccess = false
    state.deleteFieldError = err
  }
}

const actions = {
  fetch ({ commit }, packageID) {
    try {
      commit('fetchStart')
      // TODO API CALL
      commit('fetchSuccessful', {})
      console.log('Fetch successful')
      return Promise.resolve({})
    } catch (err) {
      commit('fetchFailed', err)
      return Promise.reject(err)
    }
  },

  create ({ commit }, data) {
    try {
      commit('createStart')
      // TODO API CALL
      commit('createSuccessful', data)
      console.log('Create successful')
      return Promise.resolve(data)
    } catch (err) {
      commit('createFailed', err)
      return Promise.reject(err)
    }
  },

  update ({ commit }, data) {
    try {
      commit('updateStart')
      // TODO API CALL
      commit('updateSuccessful', data)
      console.log('Update successful: ', data)
      return Promise.resolve(data)
    } catch (err) {
      commit('updateFailed', err)
      return Promise.reject(err)
    }
  },

  fetchFields ({ commit }, packageID) {
    try {
      commit('fetchFieldsStart')
      // TODO API CALL
      commit('fetchFieldsSuccessful', {})
      console.log('Fetch fields successful')
      return Promise.resolve({})
    } catch (err) {
      commit('fetchFieldsFailed', err)
      return Promise.reject(err)
    }
  },

  createField ({ commit }, data) {
    try {
      commit('createFieldStart')
      // TODO API CALL
      commit('createFieldSuccessful', data)
      console.log('Create field successful')
      return Promise.resolve(data)
    } catch (err) {
      commit('createFieldFailed', err)
      return Promise.reject(err)
    }
  },

  updateField ({ commit }, data) {
    try {
      commit('updateFieldStart')
      // TODO API CALL
      commit('updateFieldSuccessful', data)
      console.log('Update field successful: ', data)
      return Promise.resolve(data)
    } catch (err) {
      commit('updateFieldFailed', err)
      return Promise.reject(err)
    }
  }
}

const getters = {
  expenses: state => {
    return [
      {
        label: 'Real Estate Taxes',
        current: 0,
        potential: 0,
        percent: 1.1212
      },
      {
        label: 'Insurance',
        current: 0,
        potential: 0
      },
      {
        label: 'Utilities',
        current: 0,
        potential: 0
      },
      {
        label: 'Management Fee',
        current: 0,
        percent: 5,
        percentWithButton: true,
        potential: 0
      }
    ]
  },

  incomes: state => {
    return state.osFields.filter(field => field.isIncome)
  },

  /** Calculations for operating statement values */
  calculatedValues: state => {
    let otherIncome = state.osFields.filter(field => field.isIncome)[0]

    let currentRent = state.operatingStatement.grossRentCurrent || 0
    let potentialRent = state.operatingStatement.grossRentPotential || 0
    let vacancy = state.operatingStatement.vacancy || 0

    let currentVacancy = ((currentRent / 100) * vacancy)// .toFixed(0)
    let potentialVacancy = ((potentialRent / 100) * vacancy)// .toFixed(0)

    // actual income coming from rent
    let currentEffectiveRent = (currentRent - currentVacancy)// .toFixed(0)
    let potentialEffectiveRent = (potentialRent - potentialVacancy)// .toFixed(0)

    // effective rental income + other income
    let effectiveGrossIncome = (currentEffectiveRent + otherIncome.current)// .toFixed(0)
    let potentialGrossIncome = (potentialEffectiveRent + otherIncome.potential)// .toFixed(0)

    return {
      currentVacancy: currentVacancy,
      potentialVacancy: potentialVacancy,
      currentEffectiveRent: currentEffectiveRent,
      potentialEffectiveRent: potentialEffectiveRent,
      effectiveGrossIncome: effectiveGrossIncome,
      potentialGrossIncome: potentialGrossIncome
    }
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
