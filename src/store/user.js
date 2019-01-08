import api from './../api'

const state = {
  authUser: {},

  isLoggingIn: false,
  loginSuccess: false,
  loginError: null,

  isUpdating: false,
  updateSuccess: false,
  updateError: null,

  isActivating: false,
  activateSuccess: false,
  activateError: null
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
    state.isUpdating = false
    state.updateSuccess = false
    state.updateError = err
  },

  activateStart (state) {
    state.isActivating = true
  },

  activateSuccessful (state) {
    state.isActivating = false
    state.activateSuccess = true
    state.activateError = false
  },

  activateFailed (state, err) {
    state.isActivating = false
    state.activateSuccess = false
    state.activateError = err
  },

  updateStart (state) {
    state.isUpdating = true
  },

  updateSuccessful (state, data) {
    state.authUser = data
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
  async activate ({ commit }, data) {
    try {
      commit('activateStart')
      // let res = await api.post('/user/activate', data)
      commit('activateSuccessful')
      return Promise.resolve(data)
    } catch (err) {
      commit('activateFailed', err.message || err)
      return Promise.reject(err.message || err)
    }
  },

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
