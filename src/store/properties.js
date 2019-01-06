import Vue from 'vue'
import api from './../api'

const state = {
  properties: {},

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
    data.forEach(prop => {
      Vue.set(state.properties, prop.id, prop)
    })

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
  }
}

const actions = {
  async fetchList ({ commit }) {
    try {
      commit('fetchStart')
      let res = await api.get('/properties')
      commit('fetchSuccessful', res.data)
      console.log('Fetch successful')
      return Promise.resolve(res.data)
    } catch (err) {
      commit('fetchFailed', err.message)
      return Promise.reject(err)
    }
  },

  create ({ commit }, data) {
    try {
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
      commit('updateSuccessful', data)
      console.log('Update successful: ', data)
      return Promise.resolve(data)
    } catch (err) {
      commit('updateFailed', err)
      return Promise.reject(err)
    }
  }
}

const getters = {
  byID: state => id => {
    return state.properties[id] || {}
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
