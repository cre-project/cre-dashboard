import Vue from 'vue'
import api from './../api'

const state = {
  packages: {},

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
      Vue.set(state.packages[pkg.id], pkg)
    })
    state.isFetching = false
    state.fetchSuccess = true
    state.fetchError = null
  },

  fetchFailed (state, err) {
    state.isFetching = false
    state.fetchSuccess = false
    state.fetchError = err
    Vue.set(state.packages, {})
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
  }
}

const actions = {
  async fetchList ({ commit }) {
    try {
      let res = await api.get('/packages')
      commit('fetchSuccessful', res)
      return Promise.resolve(res)
    } catch (err) {
      commit('fetchFailed', err.message || err)
      return Promise.reject(err)
    }
  },

  async create ({ commit }, data) {
    try {
      let res = await api.post(`/packages`, data)
      console.log('Create successful')
      commit('createSuccessful', res)
      return Promise.resolve(res)
    } catch (err) {
      commit('createFailed', err)
      Promise.reject(err)
    }
  },

  update ({ commit }, data) {
    try {
      commit('updateSuccessful', data)
      console.log('Update successful: ', data)
      return Promise.resolve(data)
    } catch (err) {
      commit('updateFailed', err)
      Promise.reject(err)
    }
  }
}

const getters = {
  byID: state => id => {
    return state.packages[id] || { taxes: {}, mgmtFee: {} }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
