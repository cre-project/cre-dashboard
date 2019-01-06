import api from './../api'

const state = {
  authUser: {},

  isLoggingIn: false,
  loginSuccess: false,
  loginError: null,

  isUpdating: false,
  updateSuccess: false,
  updateError: null

}

const mutations = {

  loginStart (state) {
    state.isupdating = true
  },

  loginSuccessful (state, data) {
    state.authUser = data
    state.isUpdating = false
    state.updateSuccess = true
    state.updateError = null
  },

  loginFailed (state, err) {
    state.authUser = {}
    state.isupdating = false
    state.updatesuccess = false
    state.updateerror = err
  },

  updateStart (state) {
    state.isupdating = true
  },

  updateSuccessful (state, data) {
    state.authUser = data
    state.isUpdating = false
    state.updateSuccess = true
    state.updateError = null
  },

  updateFailed (state, err) {
    state.isupdating = false
    state.updatesuccess = false
    state.updateerror = err
  }

}

const actions = {
  async login ({ commit }, data) {
    try {
      commit('loginStart')
      let res = await api.post('/auth', data)
      commit('loginSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('loginFailed', err.message || err)
      return Promise.reject(err.message || err)
    }
  },

  async update ({ commit }, data) {
    try {
      commit('updateStart')
      let res = await api.put('/users', data)
      commit('updateSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('updateFailed', err.message || err)
      return Promise.reject(err.message || err)
    }
  }
}

export default {
  namespaced: true, state, mutations, actions
}
