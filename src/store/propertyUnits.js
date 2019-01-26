import Vue from 'vue'
import api from '../api'

const state = {
  property_units: {},

  isFetching: false,
  fetchSuccess: false,
  fetchError: null,

  isCreating: false,
  createSuccess: false,
  createError: null,

  isDeleting: false,
  deleteSuccess: false,
  deleteError: null,

  isUpdating: false,
  updateSuccess: false,
  updateError: null
}

const mutations = {
  fetchStart (state) {
    state.isFetching = true
  },

  fetchSuccessful (state, data) {
    data.forEach(unit => {
      Vue.set(state.property_units, unit.id, unit)
    })

    state.isFetching = false
    state.fetchSuccess = true
    state.fetchError = null
  },

  fetchFailed (state, err) {
    state.property_units = {}

    state.isFetching = false
    state.fetchSuccess = false
    state.fetchError = err
  },

  createStart (state) {
    state.isCreating = true
  },

  createSuccessful (state, data) {
    Vue.set(state.property_units, data.id, data)
    state.isCreating = false
    state.createSuccess = true
    state.createError = null
  },

  createFailed (state, err) {
    state.isCreating = false
    state.createSuccess = false
    state.createError = err
  },

  deleteStart (state) {
    state.isDeleting = true
  },

  deleteSuccessful (state, data) {
    Vue.delete(state.property_units, data.id)
    state.isDeleting = false
    state.deleteSuccess = true
    state.deleteError = null
  },

  deleteFailed (state, err) {
    state.isDeleting = false
    state.deleteSuccess = false
    state.deleteError = err
  },

  updateStart (state) {
    state.isUpdating = true
  },

  updateSuccessful (state, data) {
    state.property_units[data.id] = data
    state.isUpdating = false
    state.updateSuccess = true
    state.updateError = null
  },

  updateFailed (state, err) {
    state.isUpdating = false
    state.updateSuccess = false
    state.updateError = err
  }
}

const actions = {
  async fetchList ({ commit }, propertyID) {
    try {
      commit('fetchStart')
      let res = await api.get(`/properties/${propertyID}/property_units`)
      commit('fetchSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('fetchFailed', err.message)
      return Promise.reject(err.message || err)
    }
  },

  async create ({ commit }, data) {
    let { propertyID, unit } = data
    try {
      commit('createStart')
      let res = await api.post(`/properties/${propertyID}/property_units`, { property_unit: unit })
      commit('createSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('createFailed', err)
      return Promise.reject(err.message || err)
    }
  },

  async delete ({ commit }, data) {
    try {
      commit('deleteStart')
      let res = await api.delete(`/properties/${data.propertyID}/property_units/${data.id}`)
      commit('deleteSuccessful', data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('deleteFailed', err)
      return Promise.reject(err.message || err)
    }
  },

  async update ({ commit }, data) {
    try {
      commit('updateStart')
      console.log('Updating property unit: ', JSON.stringify(data))
      let res = await api.put(`/properties/${data.propertyID}/property_units/${data.unit.id}`, { property_unit: data.unit })
      commit('updateSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('updateFailed', err)
      return Promise.reject(err.message || err)
    }
  }
}

const getters = {
  listByPropertyID: state => propertyID => {
    return Object.values(state.property_units).filter(unit => unit.property_id === propertyID)
  },

  byID: state => id => {
    return state.property_units[id]
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
