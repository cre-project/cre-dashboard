import Vue from 'vue'
import api from './../api'

const defaultFields = [
  { name: 'Insurance', current_value: 0, potential_value: 0 },
  { name: 'Utilities - Electric', current_value: 0, potential_value: 0 },
  { name: 'Utilities - Water & Sewer', current_value: 0, potential_value: 0 },
  { name: 'Garbage', current_value: 0, potential_value: 0 },
  { name: 'Repairs & Maintenance', current_value: 0, potential_value: 0 },
  { name: 'Landscaping', current_value: 0, potential_value: 0 },
  { name: 'Other Expenses', current_value: 0, potential_value: 0 },
  { name: 'Other Incomes', current_value: 0, potential_value: 0, is_income: true }
]

const state = {
  operatingStatements: {},

  osFields: {},

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
    data.forEach(os => {
      Vue.set(state.operatingStatements, os.id, os)
    })
    state.isFetching = false
    state.fetchSuccess = true
    state.fetchError = null
  },

  fetchFailed (state, err) {
    state.operatingStatements = {}

    state.isFetching = false
    state.fetchSuccess = false
    state.fetchError = err
  },

  createStart (state) {
    state.isCreating = true
  },

  createSuccessful (state, data) {
    Vue.set(state.operatingStatements, data.id, data)
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
    Vue.set(state.operatingStatements, data.id, data)
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
    data.forEach(field => {
      Vue.set(state.osFields, field.id, field)
    })
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
    Vue.set(state.osFields, data.id, data)
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
    Vue.set(state.osFields, data.id, data)

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
  async fetchList ({ commit }, packageID) {
    try {
      commit('fetchStart')
      let res = await api.get(`/packages/${packageID}/operating_statements`)
      commit('fetchSuccessful', res.data)
      return res.dat
    } catch (err) {
      commit('fetchFailed', err.message || err)
      return Promise.reject(err.message || err)
    }
  },

  async create ({ commit, dispatch }, packageID) {
    try {
      commit('createStart')
      let res = await api.post(`/packages/${packageID}/operating_statements`)
      defaultFields.forEach(async (field) => {
      // await Promise.all(defaultFields.forEach(field => {
        // dispatch('os/addField', { packageID: packageID, osID: res.data.id, field: field })
        let r = await api.post(`packages/${packageID}/operating_statements/${res.data.id}/operating_statement_fields`, { operating_statement_field: field })
        commit('addFieldSuccessful', r.data)
      })
      commit('createSuccessful', res.data)
      return res.data
    } catch (err) {
      commit('createFailed', err.message || err)
      return Promise.reject(err.message || err)
    }
  },

  async update ({ commit }, data) {
    try {
      commit('updateStart')
      let res = await api.put(`/packages/${data.packageID}/operating_statements/${data.os.id}`, data.os)
      commit('updateSuccessful', res.data)
      return res.data
    } catch (err) {
      commit('updateFailed', err.message || err)
      return Promise.reject(err.message || err)
    }
  },

  async fetchFields ({ commit }, data) {
    try {
      commit('fetchFieldsStart')
      let res = await api.get(`/packages/${data.packageID}/operating_statements/${data.osID}/operating_statement_fields`)
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
      let res = await api.post(`packages/${data.packageID}/operating_statements/${data.osID}/operating_statement_fields`, { operating_statement_field: data.field })
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
      let res = await api.put(`packages/${data.packageID}/operating_statements/${data.osID}/operating_statement_fields/${data.field.id}`, { operating_statement_field: data.field })
      commit('updateFieldSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('updateFieldFailed', err)
      return Promise.reject(err)
    }
  },

  async deleteField ({ commit }, data) {
    try {
      commit('deleteFieldStart')
      let res = await api.delete(`packages/${data.packageID}/operating_statements/${data.osID}/operating_statement_fields/${data.field.id}`, { operating_statement_field: data.field })
      commit('deleteFieldSuccessful', res.data.id)
      return res
    } catch (err) {
      commit('deleteFieldFailed', err)
      return Promise.reject(err)
    }
  }
}

const getters = {

  byPackageID: state => packageID => {
    return Object.values(state.operatingStatements).filter(os => os.package_id === packageID)[0] || {}
  },

  expenses: state => {
    return Object.values(state.osFields).filter(field => !field.is_income)
  },

  incomes: state => {
    return Object.values(state.osFields).filter(field => field.is_income)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
