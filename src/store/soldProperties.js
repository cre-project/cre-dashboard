import Vue from 'vue'
import api from '../api'

const state = {
  soldProperties: {},

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
    data.forEach(property => {
      Vue.set(state.soldProperties, property.id, property)
    })

    state.isFetching = false
    state.fetchSuccess = true
    state.fetchError = null
  },

  fetchFailed (state, err) {
    state.soldProperties = {}

    state.isFetching = false
    state.fetchSuccess = false
    state.fetchError = err
  },

  createStart (state) {
    state.isCreating = true
  },

  createSuccessful (state, data) {
    Vue.set(state.soldProperties, data.id, data)
    state.isCreating = false
    state.createSuccess = true
    state.createError = null
  },

  createFailed (state, err) {
    state.isCreating = false
    state.createSuccess = false
    state.createError = err
  },

  addImage (state, data) {
    state.soldProperties[data.id].image_url = data.url
  },

  updateStart (state) {
    state.isUpdating = true
  },

  updateSuccessful (state, data) {
    state.soldProperties[data.id] = data
    state.isUpdating = false
    state.updateSuccess = true
    state.updateError = null
  },

  updateFailed (state, err) {
    state.isUpdating = false
    state.updateSuccess = false
    state.updateError = err
  },

  deleteStart (state) {
    state.isUpdating = true
  },

  deleteSuccessful (state, data) {
    Vue.delete(state.soldProperties, data.id)
    state.isDeleting = false
    state.deleteSuccess = true
    state.deleteError = null
  },

  deleteFailed (state, err) {
    state.isDeleting = false
    state.deleteSuccess = false
    state.deleteError = err
  }
}

const actions = {
  async fetchList ({ commit }, packageID) {
    try {
      commit('fetchStart')
      let res = await api.get(`/packages/${packageID}/sold_properties`)
      commit('fetchSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('fetchFailed', err.message)
      return Promise.reject(err.message || err)
    }
  },

  async create ({ commit }, data) {
    try {
      commit('createStart')
      let res = await api.post('sold_properties', { sold_property: data })
      await api.post(`packages/${data.package_id}/package_sold_properties`, { sold_property_id: res.data.id })
      commit('createSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('createFailed', err)
      return Promise.reject(err.message || err)
    }
  },

  async update ({ commit }, data) {
    try {
      commit('updateStart')
      let res = await api.put(`/sold_properties/${data.id}`, { sold_property: data })
      commit('updateSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('updateFailed', err)
      return Promise.reject(err.message || err)
    }
  },

  // update image locally (save goes along with the rest of the comparable)
  updateImage ({ commit }, data) {
    commit('addImage', data)
  },

  async delete ({ commit }, id) {
    try {
      commit('deleteStart')
      let res = await api.delete(`/sold_properties/${id}`)
      commit('deleteSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('deleteFailed', err)
      return Promise.reject(err.message || err)
    }
  }
}

const getters = {
  list: state => {
    return Object.values(state.soldProperties)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
