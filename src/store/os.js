import Vue from 'vue'
import api from './../api'

const state = {
  operatingStatement: {},

  osFields: {
    1: {
      id: 1,
      label: 'Real Estate Taxes',
      current: 0,
      potential: 0,
      percent: 1.1212,
      is_income: false
    },
    2: {
      id: 2,
      label: 'Insurance',
      current: 0,
      potential: 0,
      is_income: false
    },
    3: {
      id: 3,
      label: 'Utilities',
      current: 0,
      potential: 0,
      is_income: false
    },
    4: {
      id: 4,
      label: 'Management Fee',
      current: 0,
      percent: 5,
      percentWithButton: true,
      potential: 0,
      isIncome: false
    },
    '1bcde': {
      id: '1bcde',
      label: 'Other Income',
      current: 0,
      potential: 0,
      is_income: true
    }
  },

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
    state[data.id] = data

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

  deleteFieldSuccessful (state, id) {
    Vue.delete(state.osFields, id)

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

  async fetchFields ({ commit }, packageID) {
    try {
      commit('fetchFieldsStart')
      let res = await api.get('/operating_statement_fields', { package_id: packageID })
      commit('fetchFieldsSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('fetchFieldsFailed', err.message)
      return Promise.reject(err)
    }
  },

  async addField ({ commit }, data) {
    try {
      commit('addFieldStart')
      let res = await api.post('/operating_statement_fields', data)
      commit('addFieldSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('addFieldFailed', err)
      return Promise.reject(err)
    }
  },

  async updateField ({ commit }, data) {
    try {
      commit('updateFieldStart')
      let res = await api.put('/operating_statement_fields', data)
      commit('updateFieldSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('updateFieldFailed', err)
      return Promise.reject(err)
    }
  },

  async deleteField ({ commit }, id) {
    try {
      commit('deleteFieldStart')
      await api.delete(`/operating_statement_fields/${id}`)
      commit('deleteFieldSuccessful', id)
      return Promise.resolve(id)
    } catch (err) {
      commit('deleteFieldFailed', err)
      return Promise.reject(err)
    }
  }
}

const getters = {
  expenses: state => {
    return Object.values(state.osFields).filter(field => !field.is_income)
  },

  incomes: state => {
    return Object.values(state.osFields).filter(field => field.is_income)
  },

  /** Calculations for operating statement values */
  calculatedValues: state => {
    let otherIncome = Object.values(state.osFields).filter(field => field.is_income)[0] || 0

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
