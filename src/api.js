import axios from 'axios'
import { router } from './router'
import store from './store'

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL,
  timeout: 5000
})

instance.interceptors.request.use(
  (config) => {
    const savedToken = window.localStorage.getItem('creAuthToken')

    if (savedToken) {
      config.headers['Authorization'] = `Bearer ${savedToken}`
    }

    return config
  },

  (error) => {
    return Promise.reject(error)
  }
)

// redirect to login if auth token expired
instance.interceptors.response.use(null,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch('user/logout')
      router.replace('/login')
      return Promise.reject(new Error('Your session has expired, please log in again'))
    }
    return Promise.reject(error)
  })

export default instance
