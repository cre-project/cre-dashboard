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

}

const actions = {
  login ({ commit }, data) {
    console.log('all is good: ', data)
  }
}

export default {
  namespaced: true, state, mutations, actions
}
