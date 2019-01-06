import Vue from 'vue'
import api from './../api'

const initialState = { 'abc': { id: 'abc' } }

const state = {
  packages: Object.assign({}, initialState),

  isFetching: false,
  fetchSuccess: false,
  fetchError: null,

  isCreating: false,
  createSuccess: false,
  createError: null,

  isUpdating: false,
  updateSuccess: false,
  updateError: null
}

const mutations = {
  fetchStart (state) {
    state.isFetching = true
  },

  fetchSuccessful (state, data) {
    data.forEach(pkg => {
      Vue.set(state.packages, pkg.id, pkg)
    })

    state.isFetching = false
    state.fetchSuccess = true
    state.fetchError = null
  },

  fetchFailed (state, err) {
    state.packages = Object.assign({}, initialState)

    state.isFetching = false
    state.fetchSuccess = false
    state.fetchError = err
  },

  createStart (state) {
    state.isCreating = true
  },

  createSuccessful (state, data) {
    Vue.set(state.packages, data.id, data)
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
    Vue.set(state.packages, data.id, data)

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
  async fetchList ({ commit }) {
    try {
      let res = await api.get('/packages')
      commit('fetchSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('fetchFailed', err.message || err)
      return Promise.reject(err)
    }
  },

  async create ({ commit }) {
    try {
      commit('createStart')
      let res = await api.post(`/packages`, { template: 'default' })
      commit('createSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('createFailed', err.message || err)
      return Promise.reject(err)
    }
  },

  async update ({ commit }, data) {
    try {
      commit('updateStart', data)
      let res = await api.put(`/packages`, data)
      commit('updateSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('updateFailed', err.message || err)
      return Promise.reject(err)
    }
  }
}

const getters = {
  byID: state => id => {
    return state.packages[id] || { taxes: {}, mgmtFee: {} }
  },

  ids: state => {
    return Object.keys(state.packages)
  },

  list: state => {
    return Object.values(state.packages)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
