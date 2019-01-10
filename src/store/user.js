import api from './../api'

const state = {
  authUser: {},

  isLoggingIn: false,
  loginSuccess: false,
  loginError: null,

  isRequestingReset: false,
  requestResetSuccess: false,
  requestResetError: null,

  isResettingPassword: false,
  resetPasswordSuccess: false,
  resetPasswordError: null,

  isActivating: false,
  activateSuccess: false,
  activateError: null,

  isUpdating: false,
  updateSuccess: false,
  updateError: null

}

const mutations = {

  loginStart (state) {
    state.isupdating = true
  },

  loginSuccessful (state, data) {
    state.authUser = data.user

    window.localStorage.setItem('creAuthToken', data.auth_token)
    window.localStorage.setItem('creUser', JSON.stringify(data.user))

    state.isLoggingIn = false
    state.loginSuccess = true
    state.loginError = null
  },

  loginFailed (state, err) {
    state.authUser = {}
    state.isUpdating = false
    state.updateSuccess = false
    state.updateError = err
  },

  logout (state) {
    state.authUser = {}
    window.localStorage.clear()
  },

  requestResetStart (state) {
    state.isRequestingReset = true
  },

  requestResetSuccessful (state) {
    state.isRequestingReset = false
    state.requestResetSuccess = true
    state.requestResetError = false
  },

  requestResetFailed (state, err) {
    state.isRequestingReset = false
    state.requestResetSuccess = false
    state.requestResetError = err
  },

  resetPasswordStart (state) {
    state.isResettingPassword = true
  },

  resetPasswordSuccessful (state) {
    state.isResettingPassword = false
    state.resetPasswordSuccess = true
    state.resetPasswordError = false
  },

  resetPasswordFailed (state, err) {
    state.isResettingPassword = false
    state.resetPasswordSuccess = false
    state.resetPasswordError = err
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
    window.localStorage.setItem('creUser', JSON.stringify(data))

    state.isUpdating = false
    state.updateSuccess = true
    state.updateError = null
  },

  updateFailed (state, err) {
    state.isUpdating = false
    state.updateSuccess = false
    state.updateError = err
  },

  init (state) {
    const localUser = window.localStorage.getItem('creUser')

    if (!state.authUser.id && localUser) {
      state.authUser = JSON.parse(localUser)
    }
  }

}

const actions = {
  init ({ commit }) {
    commit('init')
  },

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

  async requestPasswordReset ({ commit }, data) {
    try {
      commit('requestResetStart')
      let res = await api.post('/passwords/request_reset', data)
      commit('requestResetSuccessful')
      return Promise.resolve(res)
    } catch (err) {
      commit('requestResetFailed', err.message || err)
      return Promise.reject(err.message || err)
    }
  },

  async resetPassword ({ commit }, data) {
    try {
      commit('resetPasswordStart')
      let res = await api.post('/passwords/reset', data)
      commit('resetPasswordSuccessful')
      return Promise.resolve(res)
    } catch (err) {
      commit('resetPasswordFailed', err.message || err)
      return Promise.reject(err.message || err)
    }
  },

  async login ({ commit }, data) {
    try {
      commit('loginStart')
      let res = await api.post('/authenticate', data)
      commit('loginSuccessful', res.data)
      return Promise.resolve(res.data)
    } catch (err) {
      commit('loginFailed', err.message || err)
      return Promise.reject(err.message || err)
    }
  },

  logout ({ commit }) {
    commit('logout')
  },

  async update ({ commit }, data) {
    try {
      commit('updateStart')
      let res = await api.put(`/users/${data.id}`, data)
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
