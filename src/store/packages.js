import Vue from 'vue'
import api from './../api'
import axios from 'axios'

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
  updateError: null,

  isFetchingPDF: false,
  fetchPDFSuccess: false,
  fetchPDFError: null
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
    state.packages = {}

    state.isFetching = false
    state.fetchSuccess = false
    state.fetchError = err
  },

  fetchPDFStart (state) {
    state.isFetchingPDF = true
  },

  fetchPDFSuccessful (state) {
    state.isFetchingPDF = false
    state.fetchPDFSuccess = true
    state.fetchPDFError = null
  },

  fetchPDFFailed (state, err) {
    state.isFetchingPDF = false
    state.fetchPDFSuccess = false
    state.fetchPDFError = err
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
      commit('fetchStart')
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
  },

  async fetchPDF ({ commit }, id) {
    try {
      commit('fetchPDFStart')
      const pdfEndpoint = `${process.env.VUE_APP_PDF_APP_URL}/export/pdf/${id}`
      let res = await axios({
        method: 'get',
        url: pdfEndpoint,
        responseType: 'arraybuffer'
      })
      commit('fetchPDFSuccessful')
      return Promise.resolve(res.data)
    } catch (err) {
      commit('fetchPDFFailed', err.message || err)
      return Promise.reject(err)
    }
  }
}

const getters = {
  byID: state => id => {
    return state.packages[id]
  },

  ids: state => {
    return Object.keys(state.packages)
  },

  list: state => {
    let pkgs = Object.values(state.packages)
    return pkgs.sort((a, b) => {
      a = new Date(a.updated_at);
      b = new Date(b.updated_at);
      return a > b ? -1 : a < b ? 1 : 0
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
